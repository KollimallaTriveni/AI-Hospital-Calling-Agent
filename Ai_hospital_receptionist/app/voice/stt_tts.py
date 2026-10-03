"""STT (Google Gemini Audio) and TTS (Edge-TTS) integration services.

Provides speech-to-text transcription via Google Gemini audio API and
text-to-speech synthesis using Microsoft Edge Neural TTS.
"""

import io
import wave
import asyncio
import logging
import os
from typing import Optional, Dict, Any
import edge_tts
import miniaudio

from app.config import settings
from app.voice.audio import AudioProcessor

logger = logging.getLogger("voice.stt_tts")


class GeminiSTT:
    """Speech-to-Text service using Google Gemini Audio Transcription (via google-genai)."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self._custom_api_key = api_key
        self._client = None

    @property
    def api_key(self) -> str:
        """Dynamically resolve GEMINI_API_KEY from settings or environment."""
        key = self._custom_api_key or settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        return key.strip()

    @property
    def is_configured(self) -> bool:
        """Check if a valid GEMINI_API_KEY is configured."""
        key = self.api_key
        return bool(key and not key.startswith("your_"))

    def pcm_to_wav_bytes(self, pcm_bytes: bytes, sample_rate: int = 16000) -> bytes:
        """Wrap raw PCM bytes into WAV file format for audio transcription."""
        wav_io = io.BytesIO()
        with wave.open(wav_io, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(pcm_bytes)
        return wav_io.getvalue()

    async def transcribe(self, pcm_bytes: bytes, sample_rate: int = 16000) -> str:
        """Transcribe raw PCM 16-bit audio bytes into text via Gemini Flash audio model."""
        if not pcm_bytes or len(pcm_bytes) < 320:  # Ignore tiny empty frames (<10ms)
            return ""

        if not self.is_configured:
            logger.warning("[STT] GEMINI_API_KEY not configured for STT.")
            return ""

        wav_bytes = self.pcm_to_wav_bytes(pcm_bytes, sample_rate=sample_rate)

        try:
            from google import genai
            from google.genai import types

            if not self._client or getattr(self._client, "_api_key", None) != self.api_key:
                self._client = genai.Client(api_key=self.api_key)
                setattr(self._client, "_api_key", self.api_key)

            # Perform audio transcription using Gemini Flash in async thread
            response = await asyncio.to_thread(
                self._client.models.generate_content,
                model="gemini-2.5-flash",
                contents=[
                    types.Part.from_bytes(data=wav_bytes, mime_type="audio/wav"),
                    "Transcribe the audio exactly as spoken into plain text. Do not add explanations, titles, or commentary. Only return the exact spoken text."
                ]
            )

            text = response.text.strip() if response and response.text else ""
            if text:
                logger.info("[STT] Received Text: '%s'", text)
            return text

        except Exception as exc:
            logger.error("[STT] Exception during Gemini STT transcription: %s", exc)
            return ""


class EdgeTTS:
    """Text-to-Speech service using Microsoft Edge Neural TTS."""

    def __init__(self, voice: str = "en-IN-NeerjaNeural") -> None:
        self.voice = voice

    async def synthesize(self, text: str) -> bytes:
        """Synthesize text into raw 24kHz PCM 16-bit linear audio bytes."""
        if not text or not text.strip():
            return b""

        clean_text = text.strip()
        logger.info("[TTS] Synthesizing speech for text: '%s'", clean_text[:80] + ("..." if len(clean_text) > 80 else ""))

        try:
            communicate = edge_tts.Communicate(clean_text, self.voice)
            mp3_buffer = bytearray()

            async for chunk in communicate.stream():
                if chunk.get("type") == "audio":
                    mp3_buffer.extend(chunk.get("data", b""))

            if not mp3_buffer:
                logger.warning("[TTS] EdgeTTS produced empty audio output.")
                return b""

            # Decode MP3 to raw PCM using miniaudio DecodedSoundFile
            decoded = miniaudio.decode(bytes(mp3_buffer))
            raw_pcm = decoded.samples.tobytes()
            src_rate = decoded.sample_rate
            nchannels = decoded.nchannels

            # Convert stereo to mono if needed
            try:
                import audioop
                if nchannels == 2:
                    raw_pcm = audioop.tomono(raw_pcm, 2, 1, 1)

                # Resample to 24kHz PCM if needed
                if src_rate != 24000:
                    raw_pcm, _ = audioop.ratecv(raw_pcm, 2, 1, src_rate, 24000, None)
            except Exception as exc:
                logger.warning("[TTS] Audioop conversion notice: %s", exc)

            logger.info("[TTS] Successfully generated %d bytes of PCM audio", len(raw_pcm))
            return raw_pcm

        except Exception as exc:
            logger.error("[TTS] Exception during EdgeTTS synthesis: %s", exc)
            return b""


gemini_stt = GeminiSTT()
edge_tts_service = EdgeTTS()

# Safe startup diagnostic logging
logger.info("Gemini STT configured: %s", gemini_stt.is_configured)
