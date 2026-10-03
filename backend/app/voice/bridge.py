"""The Voice Bridge: Real-time coordination between Exotel AgentStream and OpenRouter LLM pipeline.

Connects telephony audio streaming to Speech-To-Text (OpenRouter STT), OpenRouter LLM reasoning,
Text-To-Speech (EdgeTTS), authoritative hospital tools, and sub-millisecond barge-in interruptions.
"""

import asyncio
import logging
import time
import json
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from fastapi import WebSocket, WebSocketDisconnect

from app.db.session import SessionLocal
from app.models.call import Call
from app.models.enums import CallOutcome
from app.voice.session import VoiceSession, CallStatus, voice_session_store
from app.voice.lifecycle import CallLifecycleManager
from app.voice.audio import AudioProcessor
from app.voice.providers.exotel import exotel_provider, ExotelProvider
from app.voice.openrouter_client import OpenRouterClient, get_receptionist_system_instruction, RECEPTIONIST_SYSTEM_INSTRUCTION
from app.voice.openrouter_stt import openrouter_stt
from app.voice.stt_tts import edge_tts_service
from app.voice.transfer import transfer_coordinator

# Import authoritative Phase 5 tools
from app.agent.tools.medical_tools import route_medical_symptoms
from app.agent.tools.doctor_tools import find_doctors_by_specialty
from app.agent.tools.availability_tools import check_doctor_availability, find_alternative_slots
from app.agent.tools.appointment_tools import (
    book_appointment_tool,
    cancel_appointment_tool,
    reschedule_appointment_tool,
)
from app.agent.tools.patient_tools import find_patient_by_phone, create_patient

logger = logging.getLogger("voice.bridge")


class VoiceBridge:
    """Orchestrates bidirectional audio streaming, OpenRouter STT, OpenRouter LLM, EdgeTTS, and tool execution."""

    def __init__(self, websocket: WebSocket, call_id: str) -> None:
        self.websocket = websocket
        self.call_id = call_id
        self.stream_id: Optional[str] = None
        self.session: Optional[VoiceSession] = None
        self.openrouter_client: OpenRouterClient = OpenRouterClient()
        self.media_encoding: str = "audio/x-pcm"
        self.target_sample_rate: int = 8000
        self._is_speaking = False
        self._running = False
        self._db_call_id: Optional[int] = None

        # Turn audio collection state
        self._audio_buffer = bytearray()
        self._last_audio_time: float = 0.0
        self._turn_task: Optional[asyncio.Task] = None
        self._processing_turn = False

        # Conversation history for OpenRouter LLM with dynamic date & context
        self._messages: List[Dict[str, Any]] = [
            {"role": "system", "content": get_receptionist_system_instruction()}
        ]

    async def run(self) -> None:
        """Start the bidirectional voice streaming bridge."""
        self._running = True
        # Retrieve or initialize voice session
        self.session = voice_session_store.get(self.call_id)
        if not self.session:
            self.session = voice_session_store.create(
                call_id=self.call_id,
                phone_number="UNKNOWN"
            )

        # Start silence detector / turn processing loop
        self._turn_task = asyncio.create_task(self._turn_detector_loop())

        try:
            # Process Exotel WebSocket events
            while self._running:
                raw_text = await self.websocket.receive_text()
                event_data = ExotelProvider.parse_event(raw_text)
                await self._handle_exotel_event(event_data)
                if not self._running:
                    break
        except WebSocketDisconnect:
            logger.info("Exotel WebSocket disconnected for call %s", self.call_id)
        except Exception as exc:
            logger.error("Error in VoiceBridge for call %s: %s", self.call_id, exc)
        finally:
            self._running = False
            if self._turn_task:
                self._turn_task.cancel()
            await self._cleanup()
            try:
                await self.websocket.close()
            except Exception:
                pass

    # -------------------------------------------------------------
    # Exotel Event Handling (Caller -> Server)
    # -------------------------------------------------------------
    async def _handle_exotel_event(self, event: Dict[str, Any]) -> None:
        event_name = event.get("event")
        if event_name != "media":
            logger.info("Call %s: Received Exotel event '%s'", self.call_id, event_name)

        if event_name == "connected":
            logger.info("Call %s: Exotel connected", self.call_id)
            if self.session and self.session.status == CallStatus.INCOMING:
                CallLifecycleManager.transition(self.session, CallStatus.CONNECTING)

        elif event_name == "start":
            start_data = event.get("start", {})
            self.stream_id = (
                start_data.get("streamSid")
                or start_data.get("stream_sid")
                or event.get("streamSid")
                or event.get("stream_sid")
                or self.stream_id
            )
            caller_phone = (
                start_data.get("from")
                or start_data.get("From")
                or event.get("from")
                or "UNKNOWN"
            )
            incoming_sid = (
                start_data.get("callSid")
                or start_data.get("call_sid")
                or start_data.get("CallSid")
                or event.get("callSid")
                or event.get("call_sid")
            )
            media_format = start_data.get("mediaFormat") or event.get("mediaFormat") or {}
            if media_format:
                if "encoding" in media_format:
                    self.media_encoding = media_format.get("encoding", "audio/x-pcm")
                if "sampleRate" in media_format:
                    self.target_sample_rate = int(media_format.get("sampleRate", 8000))
            logger.info(
                "Call %s: Stream started for caller %s (stream %s, encoding %s, rate %s)",
                self.call_id, caller_phone, self.stream_id, self.media_encoding, self.target_sample_rate
            )

            if incoming_sid:
                self.call_id = incoming_sid
                self.session = voice_session_store.get(incoming_sid) or voice_session_store.create(
                    call_id=incoming_sid, phone_number=caller_phone
                )

            if self.session:
                self.session.stream_id = self.stream_id
                self.session.phone_number = caller_phone
                CallLifecycleManager.transition(self.session, CallStatus.ACTIVE)

            # Persist call start in PostgreSQL calls table
            self._init_db_call_record(caller_phone)

            # Trigger initial warm receptionist greeting
            asyncio.create_task(self._trigger_greeting())

        elif event_name == "media":
            # Incoming audio payload from caller
            if not self.stream_id:
                self.stream_id = event.get("streamSid") or event.get("stream_sid")
            media_data = event.get("media", {})
            payload = media_data.get("payload", "")

            if payload:
                raw_bytes = AudioProcessor.decode_base64_payload(payload)
                if raw_bytes:
                    # Convert to standard 16kHz PCM for Whisper STT
                    if "mulaw" in self.media_encoding.lower() or "ulaw" in self.media_encoding.lower():
                        pcm_bytes = AudioProcessor.mulaw_to_pcm16k(raw_bytes)
                    elif self.target_sample_rate == 8000:
                        try:
                            import audioop
                            pcm_bytes, _ = audioop.ratecv(raw_bytes, 2, 1, 8000, 16000, None)
                        except Exception:
                            pcm_bytes = raw_bytes
                    else:
                        pcm_bytes = raw_bytes

                    # Interruption check: If AI is speaking and caller is talking, barge in!
                    if self._is_speaking and len(pcm_bytes) > 640:
                        logger.info("Caller interrupted AI playback. Flushing audio.")
                        await self._interrupt_playback()

                    # Collect audio bytes for turn processing
                    self._audio_buffer.extend(pcm_bytes)
                    self._last_audio_time = time.time()

        elif event_name == "stop":
            logger.info("Call %s: Received stop event from Exotel", self.call_id)
            if self.session and self.session.status not in (CallStatus.COMPLETED, CallStatus.FAILED, CallStatus.HUMAN_TRANSFER):
                CallLifecycleManager.transition(self.session, CallStatus.COMPLETED)
            try:
                with SessionLocal() as db:
                    call_rec = db.query(Call).filter(
                        (Call.provider_call_id == self.call_id) | (Call.session_id == f"voice_{self.call_id}")
                    ).first()
                    if call_rec:
                        now = datetime.now(timezone.utc)
                        call_rec.ended_at = now
                        if call_rec.started_at:
                            call_rec.duration_seconds = int((now - call_rec.started_at).total_seconds())
                        call_rec.call_status = CallStatus.COMPLETED.value
                        db.commit()
            except Exception as exc:
                logger.error("Failed to update call record on stop: %s", exc)
            self._running = False

    async def _trigger_greeting(self) -> None:
        """Trigger initial receptionist greeting."""
        greeting_text = "Hello, you have reached MedPulse Hospital appointment desk. How can I help you today?"
        logger.info("Call %s: Triggering initial greeting: '%s'", self.call_id, greeting_text)
        self._messages.append({"role": "assistant", "content": greeting_text})

        # Send initial media frame for WebSocket handshake
        if self.stream_id:
            greeting_pcm = AudioProcessor.generate_silence(duration_ms=200, sample_rate=16000)
            if "mulaw" in self.media_encoding.lower() or "ulaw" in self.media_encoding.lower():
                greeting_audio = AudioProcessor.pcm24k_to_mulaw(greeting_pcm)
            else:
                greeting_audio = greeting_pcm

            media_frame = ExotelProvider.create_media_frame(
                stream_sid=self.stream_id,
                pcm_bytes=greeting_audio
            )
            await self.websocket.send_text(media_frame)

        # Synthesize & stream natural spoken speech in background
        asyncio.create_task(self._speak_text(greeting_text))

    # -------------------------------------------------------------
    # Silence Detection & STT -> OpenRouter -> TTS Turn Pipeline
    # -------------------------------------------------------------
    async def _turn_detector_loop(self) -> None:
        """Background loop watching for speech pauses to trigger STT and OpenRouter response."""
        while self._running:
            await asyncio.sleep(0.1)
            if self._processing_turn or not self._audio_buffer:
                continue

            elapsed_since_audio = time.time() - self._last_audio_time
            # Process turn if silence >= 0.8s or buffer contains >= 3 seconds of audio
            if (elapsed_since_audio >= 0.8 and len(self._audio_buffer) >= 3200) or len(self._audio_buffer) >= 96000:
                pcm_turn = bytes(self._audio_buffer)
                self._audio_buffer.clear()
                asyncio.create_task(self._process_caller_turn(pcm_turn))

    async def _process_caller_turn(self, pcm_bytes: bytes) -> None:
        """Process collected caller audio: STT -> OpenRouter LLM (with tools) -> EdgeTTS -> Exotel."""
        if self._processing_turn:
            return

        self._processing_turn = True
        try:
            # 1. Speech-to-Text via OpenRouter STT
            user_text = await openrouter_stt.transcribe(pcm_bytes, sample_rate=16000)
            if not user_text or len(user_text.strip()) < 2:
                return

            logger.info("Caller Speech [STT]: '%s'", user_text)
            self._messages.append({"role": "user", "content": user_text})

            # 2. OpenRouter LLM Call Loop (with Tool Execution)
            await self._run_llm_and_tools_loop()

        except Exception as exc:
            logger.error("Error processing caller turn for call %s: %s", self.call_id, exc)
        finally:
            self._processing_turn = False

    async def _run_llm_and_tools_loop(self) -> None:
        """Execute OpenRouter LLM reasoning loop, handling tool calls recursively."""
        max_tool_depth = 5
        depth = 0

        while depth < max_tool_depth and self._running:
            depth += 1
            response = await self.openrouter_client.chat_completion(self._messages)
            content = response.get("content")
            tool_calls = response.get("tool_calls")
            raw_msg = response.get("raw_message", {})

            if tool_calls:
                # Add assistant message containing tool calls to history
                self._messages.append(raw_msg)

                # Process each tool call
                for tc in tool_calls:
                    call_id = tc["id"]
                    func_name = tc["name"]
                    func_args = tc["args"]

                    logger.info("[Tool Call] Executing '%s' with arguments: %s", func_name, func_args)
                    tool_result = await self._dispatch_tool_call(func_name, func_args)
                    logger.info("[Tool Result] '%s' returned: %s", func_name, str(tool_result)[:150])

                    # Append tool result to conversation history
                    self._messages.append({
                        "role": "tool",
                        "tool_call_id": call_id,
                        "name": func_name,
                        "content": json.dumps(tool_result)
                    })
                # Re-query LLM with tool output
                continue

            if content:
                self._messages.append({"role": "assistant", "content": content})
                logger.info("AI Receptionist [LLM]: '%s'", content)
                await self._speak_text(content)
                break
            else:
                break

    async def _speak_text(self, text: str) -> None:
        """Synthesize text to speech using EdgeTTS and stream PCM audio to Exotel."""
        if not text or not self._running:
            return

        # Wait for stream_id from Exotel if not yet received
        for _ in range(40):
            if self.stream_id or not self._running:
                break
            await asyncio.sleep(0.05)

        if not self.stream_id:
            return

        self._is_speaking = True
        try:
            # 1. Synthesize 24kHz PCM audio via EdgeTTS
            pcm24k_bytes = await edge_tts_service.synthesize(text)
            if not pcm24k_bytes:
                return

            # 2. Format conversion for Exotel telephony
            if "mulaw" in self.media_encoding.lower() or "ulaw" in self.media_encoding.lower():
                out_audio = AudioProcessor.pcm24k_to_mulaw(pcm24k_bytes)
            elif self.target_sample_rate == 8000:
                out_audio = AudioProcessor.pcm24k_to_pcm8k(pcm24k_bytes)
            else:
                out_audio = AudioProcessor.pcm24k_to_pcm16k(pcm24k_bytes)

            # 3. Stream audio in discrete 20ms chunks over WebSocket
            chunk_generator = AudioProcessor.chunk_pcm_audio(
                out_audio,
                chunk_duration_ms=20,
                sample_rate=8000 if "mulaw" in self.media_encoding.lower() or self.target_sample_rate == 8000 else 16000
            )

            for chunk in chunk_generator:
                if not self._running or not self._is_speaking:
                    break
                media_frame = ExotelProvider.create_media_frame(
                    stream_sid=self.stream_id,
                    pcm_bytes=chunk
                )
                await self.websocket.send_text(media_frame)
                await asyncio.sleep(0.018)  # ~20ms frame timing pacing

            logger.info("Finished streaming TTS audio frames to Exotel stream %s", self.stream_id)

        except Exception as exc:
            logger.error("Error during TTS speech playback for call %s: %s", self.call_id, exc)
        finally:
            self._is_speaking = False

    # -------------------------------------------------------------
    # Barge-In / Interruption Handler
    # -------------------------------------------------------------
    async def _interrupt_playback(self) -> None:
        """Send Exotel 'clear' frame to instantly flush caller playback buffer."""
        if not self.stream_id:
            return
        self._is_speaking = False
        try:
            clear_frame = ExotelProvider.create_clear_frame(self.stream_id)
            await self.websocket.send_text(clear_frame)
            logger.debug("Sent barge-in clear frame to Exotel stream %s", self.stream_id)
        except Exception as exc:
            logger.warning("Failed to send clear frame: %s", exc)

    # -------------------------------------------------------------
    # Authoritative Tool Dispatching (Phases 5, 4, 2, 1)
    # -------------------------------------------------------------
    async def _dispatch_tool_call(self, function_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatch function call to authoritative deterministic hospital systems."""
        with SessionLocal() as db:
            try:
                # 1. Medical Symptom Routing & Clinical Safety
                if function_name == "route_medical_symptoms":
                    symptoms = args.get("symptoms", "")
                    routing_res = route_medical_symptoms(symptoms)

                    # Update call record with detected specialty
                    if self._db_call_id and routing_res.specialty:
                        call_rec = db.query(Call).filter(Call.id == self._db_call_id).first()
                        if call_rec:
                            call_rec.specialty_detected = routing_res.specialty
                            db.commit()

                    # Critical Emergency Protocol: Halt booking and escalate immediately!
                    if routing_res.emergency_detected or routing_res.escalation_required:
                        logger.warning("EMERGENCY DETECTED during voice call %s: %s", self.call_id, routing_res.reasoning)
                        if self.session:
                            self.session.mark_transferred("Emergency medical condition detected")
                        await transfer_coordinator.transfer_to_human(
                            self.call_id,
                            reason=f"Emergency: {routing_res.reasoning}"
                        )

                    return routing_res.model_dump()

                # 2. Doctor Discovery
                elif function_name == "find_doctors_by_specialty":
                    spec = args.get("specialty", "")
                    doc_res = find_doctors_by_specialty(db=db, specialty=spec)
                    return doc_res.model_dump()

                # 3. Availability Check
                elif function_name == "check_doctor_availability":
                    doc_id_raw = args.get("doctor_id")
                    date_val = args.get("date", "")
                    if doc_id_raw is None or not date_val:
                        return {"success": False, "error": "Both doctor_id and date are required for availability check."}
                    doc_id = int(doc_id_raw)
                    avail_res = check_doctor_availability(db=db, doctor_id=doc_id, date_val=date_val)
                    return avail_res.model_dump()

                # 4. Book Appointment
                elif function_name == "book_appointment":
                    pat_id_raw = args.get("patient_id")
                    doc_id_raw = args.get("doctor_id")
                    date_val = args.get("date", "")
                    start_time = args.get("start_time", "")
                    if pat_id_raw is None or doc_id_raw is None or not date_val or not start_time:
                        return {
                            "success": False,
                            "error": "patient_id, doctor_id, date, and start_time are required to book an appointment."
                        }
                    pat_id = int(pat_id_raw)
                    doc_id = int(doc_id_raw)
                    reason = args.get("reason", "Voice appointment")
                    booking_res = book_appointment_tool(
                        db=db,
                        patient_id=pat_id,
                        doctor_id=doc_id,
                        appointment_date=date_val,
                        start_time=start_time,
                        reason=reason
                    )
                    return booking_res.model_dump()

                # 5. Cancel Appointment
                elif function_name == "cancel_appointment":
                    appt_id_raw = args.get("appointment_id")
                    if appt_id_raw is None:
                        return {"success": False, "error": "appointment_id is required."}
                    appt_id = int(appt_id_raw)
                    reason = args.get("reason", "Cancelled via phone call")
                    cancel_res = cancel_appointment_tool(db=db, appointment_id=appt_id, reason=reason)
                    return cancel_res.model_dump()

                # 6. Reschedule Appointment
                elif function_name == "reschedule_appointment":
                    appt_id_raw = args.get("appointment_id")
                    new_date = args.get("new_date", "")
                    new_time = args.get("new_start_time", "")
                    if appt_id_raw is None or not new_date or not new_time:
                        return {"success": False, "error": "appointment_id, new_date, and new_start_time are required."}
                    appt_id = int(appt_id_raw)
                    reschedule_res = reschedule_appointment_tool(
                        db=db,
                        appointment_id=appt_id,
                        new_date=new_date,
                        new_start_time=new_time
                    )
                    return reschedule_res.model_dump()

                # 7. Patient Lookup
                elif function_name == "find_patient_by_phone":
                    phone = args.get("phone", "")
                    pat_res = find_patient_by_phone(db=db, phone=phone)
                    return pat_res.model_dump()

                # 8. Human Escalation (Real Telephone Transfer)
                elif function_name == "request_human_escalation":
                    reason = args.get("reason", "Caller requested operator")
                    await transfer_coordinator.transfer_to_human(self.call_id, reason=reason)
                    return {"success": True, "transferred": True, "message": "Call transfer initiated."}

                else:
                    return {"success": False, "error": f"Unknown tool: {function_name}"}

            except Exception as exc:
                logger.error("Error executing tool %s: %s", function_name, exc)
                return {"success": False, "error": str(exc)}

    # -------------------------------------------------------------
    # Database Record Lifecycle
    # -------------------------------------------------------------
    def _init_db_call_record(self, caller_phone: str) -> None:
        """Create call entry in PostgreSQL database."""
        try:
            with SessionLocal() as db:
                call_record = Call(
                    phone_number=caller_phone,
                    provider="exotel",
                    provider_call_id=self.call_id,
                    stream_id=self.stream_id,
                    session_id=f"voice_{self.call_id}",
                    call_status=CallStatus.ACTIVE.value,
                    started_at=datetime.now(timezone.utc),
                    answered_at=datetime.now(timezone.utc),
                    intent="VOICE_CALL",
                    outcome=CallOutcome.APPOINTMENT_BOOKED
                )
                db.add(call_record)
                db.commit()
                db.refresh(call_record)
                self._db_call_id = call_record.id
        except Exception as exc:
            logger.error("Failed to insert call record into database: %s", exc)

    async def _cleanup(self) -> None:
        """Clean up streaming session and persist final call metrics."""
        now = datetime.now(timezone.utc)
        if self.session:
            if self.session.status not in (CallStatus.COMPLETED, CallStatus.FAILED, CallStatus.HUMAN_TRANSFER):
                try:
                    CallLifecycleManager.transition(self.session, CallStatus.COMPLETED)
                except Exception:
                    self.session.mark_completed()

        # Update database with final metrics
        if self._db_call_id:
            try:
                with SessionLocal() as db:
                    call_rec = db.query(Call).filter(Call.id == self._db_call_id).first()
                    if call_rec:
                        call_rec.ended_at = now
                        if call_rec.started_at:
                            call_rec.duration_seconds = int((now - call_rec.started_at).total_seconds())
                        if self.session:
                            call_rec.call_status = self.session.status.value
                        db.commit()
            except Exception as exc:
                logger.error("Failed to update final call record in DB: %s", exc)
