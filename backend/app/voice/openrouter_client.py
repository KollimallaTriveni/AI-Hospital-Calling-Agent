"""OpenRouter LLM Client with OpenAI-compatible tool calling.

Handles chat completions, system instructions, and tool dispatching
for the AI Hospital Receptionist voice agent.
"""

import json
import logging
from typing import Dict, Any, List, Optional
import httpx

from app.config import settings

from datetime import datetime

logger = logging.getLogger("voice.openrouter")


def get_receptionist_system_instruction() -> str:
    """Generate dynamic system instruction with current date and time context."""
    now = datetime.now()
    current_date_str = now.strftime("%A, %B %d, %Y")
    current_year = now.year

    return f"""You are an intelligent, empathetic AI Hospital Receptionist.
Your primary role is to answer patient phone calls, understand their healthcare needs, check doctor schedules, and coordinate appointments.

CURRENT DATE & TIME CONTEXT:
Today's Date: {current_date_str}
Current Year: {current_year}

DATE & SCHEDULING RULES:
1. ALWAYS resolve relative or spoken dates (e.g. "October 7th", "tomorrow", "next Monday") using the current year ({current_year}).
   - If today is in {current_year} and the caller asks for "October 7th", use date `{current_year}-10-07`.
   - NEVER default to past years like 2024 or hardcoded demo dates.
   - If the requested month/day has already passed in {current_year}, assume the next upcoming occurrence or ask the caller to clarify the year.
2. PREVENT REPEATED QUERIES:
   - If you check a doctor's availability for a requested date using `check_doctor_availability` and the tool returns no available slots, DO NOT query `check_doctor_availability` again for the same doctor and date during this call.
   - Inform the caller concisely that the doctor has no availability on that date, and ask if they would like an alternative date or another doctor/specialty.
3. NO HALLUCINATION: Never invent doctors, dates, or time slots. Always query the authoritative hospital tools.
4. EXPLICIT CONFIRMATION: Never book an appointment without the caller's explicit confirmation ("Yes", "Confirm", "Please book it").
5. CONCISE SPOKEN RESPONSES: Keep your spoken answers brief, warm, and natural for telephone conversation (1-3 sentences maximum per reply).

CRITICAL CLINICAL & OPERATIONAL RULES:
1. YOU ARE NOT A DOCTOR. Never diagnose medical conditions or recommend medications.
2. MEDICAL SAFETY FIRST: When a patient describes symptoms, ALWAYS call `route_medical_symptoms`.
   If the response indicates an emergency (`CALL_911_OR_EMERGENCY` or `escalation_required=true`):
   - STOP normal appointment booking immediately.
   - Advise the caller to seek emergency medical attention or call 108/911.
   - Call `request_human_escalation` to transfer the call immediately.
"""


RECEPTIONIST_SYSTEM_INSTRUCTION = get_receptionist_system_instruction()

OPENROUTER_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "route_medical_symptoms",
            "description": "Assess patient symptoms, detect potential emergencies, and determine the appropriate medical specialty.",
            "parameters": {
                "type": "object",
                "properties": {
                    "symptoms": {"type": "string", "description": "The symptoms described by the patient."}
                },
                "required": ["symptoms"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "find_doctors_by_specialty",
            "description": "Find active doctors in the hospital database for a given medical specialty.",
            "parameters": {
                "type": "object",
                "properties": {
                    "specialty": {"type": "string", "description": "Medical specialty name, e.g. Cardiology, Dermatology."}
                },
                "required": ["specialty"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_doctor_availability",
            "description": "Check open appointment slots for a specific doctor from the hospital database schedule on a given date (YYYY-MM-DD). Do not repeatedly query the same doctor and date if no availability was returned.",
            "parameters": {
                "type": "object",
                "properties": {
                    "doctor_id": {"type": "integer", "description": "The doctor's unique ID."},
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format (use current year context)."}
                },
                "required": ["doctor_id", "date"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "book_appointment",
            "description": "Book a confirmed appointment slot for a registered patient.",
            "parameters": {
                "type": "object",
                "properties": {
                    "patient_id": {"type": "integer", "description": "Registered patient ID."},
                    "doctor_id": {"type": "integer", "description": "Doctor ID."},
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format."},
                    "start_time": {"type": "string", "description": "Start time in HH:MM format."},
                    "reason": {"type": "string", "description": "Reason for visit or symptoms."}
                },
                "required": ["patient_id", "doctor_id", "date", "start_time"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "cancel_appointment",
            "description": "Cancel an existing appointment.",
            "parameters": {
                "type": "object",
                "properties": {
                    "appointment_id": {"type": "integer", "description": "Appointment ID to cancel."},
                    "reason": {"type": "string", "description": "Reason for cancellation."}
                },
                "required": ["appointment_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "reschedule_appointment",
            "description": "Reschedule an existing appointment to a new date and time.",
            "parameters": {
                "type": "object",
                "properties": {
                    "appointment_id": {"type": "integer", "description": "Existing appointment ID."},
                    "new_date": {"type": "string", "description": "Target date in YYYY-MM-DD format."},
                    "new_start_time": {"type": "string", "description": "Target start time in HH:MM format."}
                },
                "required": ["appointment_id", "new_date", "new_start_time"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "find_patient_by_phone",
            "description": "Look up an existing patient record by telephone number.",
            "parameters": {
                "type": "object",
                "properties": {
                    "phone": {"type": "string", "description": "Phone number with or without country code."}
                },
                "required": ["phone"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "request_human_escalation",
            "description": "Transfer the phone call to a human receptionist or medical operator.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "description": "Reason for escalating to human operator."}
                },
                "required": ["reason"]
            }
        }
    }
]


class OpenRouterClient:
    """Async client for OpenRouter API with function calling."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
    ) -> None:
        self.api_key = api_key or settings.OPENROUTER_API_KEY
        self.model = model or settings.OPENROUTER_MODEL or "google/gemini-2.5-flash"
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    async def chat_completion(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Send chat messages to OpenRouter and return structured model response.
        
        Returns dict with keys:
        - "role": "assistant"
        - "content": text output or None
        - "tool_calls": list of tool call dicts or None
        - "raw_message": full message dict for history
        """
        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY is not configured.")
            return {
                "role": "assistant",
                "content": "I apologize, but our system is currently experiencing connection issues. Please try again shortly.",
                "tool_calls": None,
                "raw_message": {"role": "assistant", "content": "Configuration missing"}
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": settings.PUBLIC_BASE_URL,
            "X-Title": "AI Hospital Receptionist Voice Agent",
            "Content-Type": "application/json",
        }

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 2048,
            "temperature": 0.3,
        }

        effective_tools = tools if tools is not None else OPENROUTER_TOOLS
        if effective_tools:
            payload["tools"] = effective_tools

        logger.info("OpenRouter LLM Request -> Model: %s, Messages Count: %d", self.model, len(messages))

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.base_url, headers=headers, json=payload)

                if not response.is_success:
                    logger.error("OpenRouter API Error HTTP %d: %s", response.status_code, response.text)
                    return {
                        "role": "assistant",
                        "content": "I apologize, I am having trouble processing your request right now.",
                        "tool_calls": None,
                        "raw_message": {"role": "assistant", "content": response.text}
                    }

                data = response.json()
                choices = data.get("choices", [])
                if not choices:
                    logger.error("OpenRouter returned empty choices in response: %s", data)
                    return {
                        "role": "assistant",
                        "content": "Could you please repeat that?",
                        "tool_calls": None,
                        "raw_message": {"role": "assistant", "content": ""}
                    }

                message = choices[0].get("message", {})
                content = message.get("content")
                tool_calls_raw = message.get("tool_calls")

                tool_calls = None
                if tool_calls_raw:
                    tool_calls = []
                    for tc in tool_calls_raw:
                        func = tc.get("function", {})
                        func_name = func.get("name", "")
                        args_str = func.get("arguments", "{}")
                        try:
                            args = json.loads(args_str) if isinstance(args_str, str) else args_str
                        except Exception as exc:
                            logger.error("Failed to parse tool call arguments for %s: %s", func_name, exc)
                            args = {}
                        tool_calls.append({
                            "id": tc.get("id", f"call_{func_name}"),
                            "name": func_name,
                            "args": args
                        })
                    logger.info("OpenRouter LLM Response Tool Calls: %s", [tc["name"] for tc in tool_calls])
                elif content:
                    logger.info("OpenRouter LLM Response Text: %s", content[:100] + ("..." if len(content) > 100 else ""))

                return {
                    "role": "assistant",
                    "content": content,
                    "tool_calls": tool_calls,
                    "raw_message": message
                }

        except Exception as exc:
            logger.error("Exception during OpenRouter chat completion: %s", exc)
            return {
                "role": "assistant",
                "content": "I am sorry, I am having difficulty connecting. Let me try again.",
                "tool_calls": None,
                "raw_message": {"role": "assistant", "content": str(exc)}
            }
