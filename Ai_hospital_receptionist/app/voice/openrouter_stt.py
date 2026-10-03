"""OpenRouter Speech-to-Text (STT) integration service using OpenRouter API."""

import io
import wave
import base64
import asyncio
import logging
import os
from typing import Optional
import httpx

from app.config import settings

logger = logging.getLogger("voice.openrouter_stt")


class OpenRouterSTT:
    """Speech-to-Text service using OpenRouter API and multimodal audio data URIs."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self._custom_api_key = api_key
        self.model = model or settings.OPENROUTER_MODEL or "google/gemini-2.5-flash"
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    @property
    def api_key(self) -> str:
        """Dynamically resolve OPENROUTER_API_KEY from settings or environment."""
        key = self._custom_api_key or settings.OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "")
        return key.strip()

    @property
    def is_configured(self) -> bool:
        """Check if a valid OPENROUTER_API_KEY is configured."""
        key = self.api_key
        return bool(key and not key.startswith("your_"))

    def pcm_to_wav_bytes(self, pcm_bytes: bytes, sample_rate: int = 16000) -> bytes:
        """Wrap raw 16-bit linear PCM bytes into a WAV container format."""
        wav_io = io.BytesIO()
        with wave.open(wav_io, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(pcm_bytes)
        return wav_io.getvalue()

    async def transcribe(self, pcm_bytes: bytes, sample_rate: int = 16000) -> str:
        """Transcribe raw PCM 16-bit audio bytes into text via OpenRouter API."""
        if not pcm_bytes or len(pcm_bytes) < 320:  # Ignore tiny empty frames (<10ms)
            return ""

        if not self.is_configured:
            logger.warning("[OpenRouter STT] OPENROUTER_API_KEY is not configured.")
            return ""

        wav_bytes = self.pcm_to_wav_bytes(pcm_bytes, sample_rate=sample_rate)
        base64_wav = base64.b64encode(wav_bytes).decode("utf-8")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": settings.PUBLIC_BASE_URL,
            "X-Title": "AI Hospital Receptionist Voice Agent",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "max_tokens": 256,
            "temperature": 0.0,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Transcribe the exact spoken words in the audio. Return ONLY plain text without commentary or quotes."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:audio/wav;base64,{base64_wav}"
                            }
                        }
                    ]
                }
            ]
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(self.base_url, headers=headers, json=payload)

                if not response.is_success:
                    logger.error("[OpenRouter STT] HTTP %d Error: %s", response.status_code, response.text)
                    return ""

                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    transcript = choices[0].get("message", {}).get("content", "").strip()
                    if transcript and transcript != ".":
                        logger.info("[OpenRouter STT] Received Text: '%s'", transcript)
                        return transcript

                return ""

        except Exception as exc:
            logger.error("[OpenRouter STT] Exception during transcription: %s", exc)
            return ""


openrouter_stt = OpenRouterSTT()

# Safe startup diagnostic logging
logger.info("OpenRouter STT configured: %s", openrouter_stt.is_configured)
