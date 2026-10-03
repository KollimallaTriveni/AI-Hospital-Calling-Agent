"""Gemini provider wrapper for voice integration (GeminiSTT)."""

from typing import Optional
from app.config import settings
from app.voice.stt_tts import GeminiSTT, gemini_stt


class GeminiProvider:
    """Factory for managing Gemini STT sessions."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.GEMINI_API_KEY

    def get_stt(self) -> GeminiSTT:
        """Get GeminiSTT instance."""
        return GeminiSTT(api_key=self.api_key)


gemini_provider = GeminiProvider()
