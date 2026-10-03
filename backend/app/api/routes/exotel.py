"""Exotel AgentStream WebSocket & Telephony API Endpoints."""

import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import (
    APIRouter,
    Request,
    Response,
    WebSocket,
    HTTPException,
    status,
    Depends
)
from pydantic import BaseModel, Field

from app.config import settings
from app.db.session import SessionLocal
from app.models.call import Call
from app.voice.session import voice_session_store
from app.voice.providers.exotel import exotel_provider
from app.voice.websocket import handle_voice_stream

logger = logging.getLogger("api.exotel")

router = APIRouter(prefix="/exotel", tags=["Exotel AgentStream & Telephony"])


class CallStatusPayload(BaseModel):
    """Payload sent by Exotel call status callbacks."""
    CallSid: str = Field(..., description="Exotel Call SID")
    Status: str = Field(..., description="Call status e.g. ringing, in-progress, completed")
    RecordingUrl: Optional[str] = Field(None, description="Recording URL if available")
    Duration: Optional[int] = Field(None, description="Call duration in seconds")


@router.get("/health", summary="Health check endpoint for Exotel integration")
def exotel_health() -> Dict[str, Any]:
    """Exotel AgentStream integration health check endpoint."""
    return {
        "status": "ok",
        "service": "Exotel AgentStream Integration",
        "provider": "Exotel",
        "account_sid_configured": bool(settings.EXOTEL_ACCOUNT_SID),
        "api_key_configured": bool(settings.EXOTEL_API_KEY),
        "websocket_endpoint": "/api/v1/exotel/agentstream",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.post("/incoming", summary="Handle incoming telephony webhook from Exotel")
async def handle_incoming_call(request: Request) -> Response:
    """Receive incoming call webhook from Exotel and respond with stream XML/JSON instructions."""
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        data = await request.json()
    else:
        form = await request.form()
        data = dict(form)

    call_sid = data.get("CallSid") or data.get("call_sid") or f"exotel_{int(datetime.now().timestamp())}"
    caller_phone = data.get("From") or data.get("from") or "UNKNOWN"

    logger.info("Exotel incoming call received: CallSid=%s, From=%s", call_sid, caller_phone)

    # Register or get voice session
    session = voice_session_store.get(call_sid)
    if not session:
        session = voice_session_store.create(call_id=call_sid, phone_number=caller_phone)

    # Construct public WebSocket stream URL for Exotel AgentStream
    base_url = settings.PUBLIC_BASE_URL.replace("http://", "ws://").replace("https://", "wss://").rstrip("/")
    stream_url = f"{base_url}/api/v1/exotel/agentstream/{call_sid}"

    accept = request.headers.get("accept", "")
    if "application/xml" in accept or "text/xml" in accept:
        xml_content = exotel_provider.build_inbound_xml(stream_url)
        return Response(content=xml_content, media_type="application/xml")

    json_response = exotel_provider.build_inbound_response(call_sid=call_sid, stream_url=stream_url)
    return Response(content=json_response, media_type="application/json")


@router.websocket("/agentstream")
@router.websocket("/agentstream/{call_id}")
async def exotel_agentstream_ws(websocket: WebSocket, call_id: Optional[str] = None) -> None:
    """Clean WebSocket endpoint for Exotel AgentStream bidirectional audio streaming."""
    actual_call_id = call_id or websocket.query_params.get("CallSid") or f"exotel_{int(datetime.now().timestamp())}"
    logger.info("Exotel AgentStream WebSocket connection request for call_id=%s", actual_call_id)
    await handle_voice_stream(websocket, actual_call_id)


@router.post("/status", summary="Exotel call status lifecycle callback")
async def handle_call_status(payload: CallStatusPayload) -> Dict[str, Any]:
    """Track call status updates from Exotel (ringing, answered, completed, failed)."""
    call_sid = payload.CallSid
    exotel_status = payload.Status.lower()
    logger.info("Exotel call status callback: CallSid=%s, Status=%s", call_sid, exotel_status)

    session = voice_session_store.get(call_sid)
    if session:
        if exotel_status in ("completed", "terminal"):
            session.mark_completed()
        elif exotel_status in ("failed", "busy", "no-answer"):
            session.mark_failed(f"Telephony status: {exotel_status}")

    # Update database record
    with SessionLocal() as db:
        call_record = db.query(Call).filter(
            (Call.provider_call_id == call_sid) | (Call.session_id == f"voice_{call_sid}")
        ).first()
        if call_record:
            call_record.call_status = exotel_status
            if payload.RecordingUrl:
                call_record.recording_url = payload.RecordingUrl
            if payload.Duration:
                call_record.duration_seconds = payload.Duration
            if exotel_status in ("completed", "terminal") and not call_record.ended_at:
                call_record.ended_at = datetime.now(timezone.utc)
            db.commit()

    return {"status": "ok", "call_sid": call_sid, "updated_status": exotel_status}
