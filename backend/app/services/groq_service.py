import json
import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
# Using active Groq production model
GROQ_MODEL = "qwen/qwen3.8-27b"

async def call_groq_api(messages: list, temperature: float = 0.1, json_mode: bool = False) -> Optional[str]:
    """
    Direct asynchronous HTTP call to Groq API using standard httpx.
    Avoids heavy external agent wrappers.
    """
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY.startswith("gsk_placeholder"):
        logger.warning("GROQ_API_KEY not set or is placeholder. Using deterministic fallback.")
        return None

    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 512
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"].strip()
            else:
                logger.error(f"Groq API error {response.status_code}: {response.text}")
                return None
    except Exception as e:
        logger.error(f"Exception calling Groq API: {str(e)}")
        return None

# 1. Patient Natural Language Understanding
async def extract_search_intent(query: str) -> Dict[str, Any]:
    """
    Extracts structured intent from patient query (supporting English, Hindi, Hinglish).
    Groq only extracts intent; it NEVER queries or invents database availability.
    """
    system_prompt = (
        "You are an Indian Healthcare Intent Extractor. "
        "The user will describe their medical need in English, Hindi, or Hinglish (e.g. 'Mujhe aaj orthopedic doctor chahiye', 'Pet me dard ho raha hai emergency'). "
        "Extract the intent strictly into valid JSON matching this schema: "
        "{\n"
        '  "department": "Orthopedics" | "Cardiology" | "General Medicine" | "Pediatrics" | "Emergency & Trauma" | "Radiology & Diagnostics" | "Gynecology",\n'
        '  "service": "Doctor Consultation" | "Emergency Care" | "Diagnostic Test" | "ICU Admission" | "General Checkup",\n'
        '  "urgency": "Today" | "Urgent" | "Normal",\n'
        '  "city": "Bhopal" | "Indore" | "Ujjain" | "Jabalpur",\n'
        '  "symptoms": ["knee pain", "fracture"],\n'
        '  "interpretation_summary": "Short 1-sentence description in English of what was understood"\n'
        "}\n"
        "Return ONLY the JSON object. Do not include markdown codeblocks or explanation."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"User Query: {query}"}
    ]

    groq_result = await call_groq_api(messages, temperature=0.0, json_mode=True)
    if groq_result:
        try:
            parsed = json.loads(groq_result)
            return parsed
        except Exception:
            pass

    # Deterministic Rule-based fallback if Groq API key is not present or API unavailable
    return fallback_intent_extraction(query)

def fallback_intent_extraction(query: str) -> Dict[str, Any]:
    q = query.lower()
    
    dept = "General Medicine"
    service = "Doctor Consultation"
    urgency = "Normal"
    city = "Bhopal"
    symptoms = []
    
    if any(k in q for k in ["ortho", "bone", "haddi", "knee", "joint", "fracture", "ligament", "guthna"]):
        dept = "Orthopedics"
        symptoms.append("Orthopedic concern / Joint / Bone")
    elif any(k in q for k in ["cardio", "heart", "dil", "chest pain", "cardiac"]):
        dept = "Cardiology"
        symptoms.append("Cardiovascular / Heart")
    elif any(k in q for k in ["pedia", "child", "bacha", "bacche", "infant", "kid"]):
        dept = "Pediatrics"
        symptoms.append("Child healthcare")
    elif any(k in q for k in ["x-ray", "xray", "mri", "ct scan", "ultrasound", "blood test", "test", "jaanch"]):
        dept = "Radiology & Diagnostics"
        service = "Diagnostic Test"
    elif any(k in q for k in ["emergency", "accident", "trauma", "severe", "serious", "critical", "108"]):
        dept = "Emergency & Trauma"
        service = "Emergency Care"
        urgency = "Urgent"
    elif any(k in q for k in ["gynae", "women", "pregnancy", "mahila"]):
        dept = "Gynecology"
        symptoms.append("Women health")

    if any(k in q for k in ["aaj", "today", "now", "abhi", "urgent", "immediate"]):
        urgency = "Today"
        
    for c in ["indore", "ujjain", "jabalpur", "bhopal"]:
        if c in q:
            city = c.capitalize()
            break

    return {
        "department": dept,
        "service": service,
        "urgency": urgency,
        "city": city,
        "symptoms": symptoms,
        "interpretation_summary": f"Request understood for {dept} ({service}) in {city} with {urgency} priority."
    }

# 2. Stockout Human-Readable Explanation
async def explain_stockout(medicine_name: str, current_stock: int, daily_consumption: float, days_remaining: float, minimum_threshold: int) -> str:
    """
    Groq converts deterministic calculated stock values into a clear, concise clinical summary.
    Never invents numbers or facts.
    """
    system_prompt = (
        "You are an AI Clinical Supply Chain Assistant. "
        "Given deterministic stock numbers, produce a concise 1-2 sentence human-readable explanation for a hospital administrator. "
        "Keep it clinical, urgent if needed, and strictly truthful to the given numbers. Do not invent any outside facts."
    )
    user_prompt = (
        f"Medicine: {medicine_name}\n"
        f"Current Stock: {current_stock} units\n"
        f"Daily Consumption: {daily_consumption} units/day\n"
        f"Days Remaining: {days_remaining} days\n"
        f"Minimum Threshold: {minimum_threshold} units\n"
        "Provide a 1-2 sentence explanation of the stockout risk."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    result = await call_groq_api(messages, temperature=0.1)
    if result:
        return result

    # Deterministic fallback
    if days_remaining <= 3:
        return f"{medicine_name} is projected to reach critical shortage in approximately {days_remaining:.1f} days at current daily usage of {daily_consumption} units/day."
    elif days_remaining <= 7:
        return f"{medicine_name} inventory is low with approximately {days_remaining:.1f} days of stock remaining before falling below the safety threshold of {minimum_threshold} units."
    else:
        return f"{medicine_name} inventory is within healthy parameters with {days_remaining:.1f} days of operational coverage."

# 3. Redistribution Opportunity Explanation
async def explain_redistribution(medicine_name: str, shortage_hospital: str, shortage_stock: int, shortage_days: float,
                                surplus_hospital: str, surplus_stock: int, surplus_days: float,
                                transfer_qty: int, distance_km: float) -> str:
    """
    Groq explains a deterministically identified inter-hospital transfer opportunity.
    """
    system_prompt = (
        "You are an AI Hospital Logistics Advisor. "
        "Explain a suggested inter-hospital redistribution opportunity in 2 sentences. "
        "Focus on how transferring stock from the surplus hospital to the shortage hospital resolves risk without compromising the donor hospital."
    )
    user_prompt = (
        f"Medicine: {medicine_name}\n"
        f"Shortage Hospital: {shortage_hospital} (Stock: {shortage_stock}, Days: {shortage_days:.1f})\n"
        f"Surplus Hospital: {surplus_hospital} (Stock: {surplus_stock}, Days: {surplus_days:.1f})\n"
        f"Suggested Transfer: {transfer_qty} units\n"
        f"Distance: {distance_km} km\n"
        "Explain this redistribution opportunity clearly."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    result = await call_groq_api(messages, temperature=0.1)
    if result:
        return result

    # Deterministic fallback
    return (
        f"{surplus_hospital} holds an excess reserve of {surplus_stock} units ({surplus_days:.0f} days supply) of {medicine_name}. "
        f"Transferring {transfer_qty} units across {distance_km} km will stabilize {shortage_hospital}'s critical inventory (~{shortage_days:.1f} days) without endangering {surplus_hospital}'s emergency reserve."
    )
