from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Hospital, Department, Doctor
from app.schemas.schemas import SearchRequest, SearchResponse, ExtractedIntent, HospitalMatchCard, HospitalResponse, DoctorResponse
from app.services.groq_service import extract_search_intent
from app.services.matching_service import calculate_haversine_distance

router = APIRouter(prefix="/search", tags=["Smart Healthcare Search"])

@router.post("", response_model=SearchResponse)
async def search_healthcare_resources(request: SearchRequest, db: Session = Depends(get_db)):
    query_text = request.query.strip()
    
    # 1. AI Intent Extraction via Groq (only extracts intent, never invents hospital data)
    extracted = await extract_search_intent(query_text)
    
    target_dept_name = extracted.get("department") or "General Medicine"
    target_urgency = extracted.get("urgency") or "Normal"
    target_city = extracted.get("city") or "Bhopal"
    
    # 2. Query factual data from Database
    # Query departments matching the target department
    dept_matches = (
        db.query(Department)
        .join(Hospital)
        .filter(Department.name.ilike(f"%{target_dept_name}%"))
        .all()
    )
    
    # Fallback to general medicine if no matching department
    if not dept_matches:
        dept_matches = (
            db.query(Department)
            .join(Hospital)
            .filter(Department.name.ilike("%General Medicine%"))
            .all()
        )
        
    hospital_cards: List[HospitalMatchCard] = []
    
    for dept in dept_matches:
        h = dept.hospital
        
        # Calculate Haversine distance
        dist = calculate_haversine_distance(
            request.user_latitude or 23.2599, request.user_longitude or 77.4126,
            h.latitude, h.longitude
        )
        
        # Get doctors for this department
        docs_query = db.query(Doctor).filter(Doctor.department_id == dept.id)
        if target_urgency in ("Today", "Urgent"):
            docs_query = docs_query.filter(Doctor.is_available_today == True)
        matching_doctors = docs_query.all()
        
        h_resp = HospitalResponse.from_orm(h)
        h_resp.distance_km = dist
        h_resp.last_updated = h.updated_at
        
        hospital_cards.append(HospitalMatchCard(
            hospital=h_resp,
            matching_department=dept.name,
            matching_doctors=[DoctorResponse.from_orm(doc) for doc in matching_doctors],
            department_operational=dept.is_operational,
            doctor_available_today=len(matching_doctors) > 0,
            distance_km=dist,
            last_updated_minutes_ago=8
        ))
        
    # Sort: First hospitals with doctors available today, then by distance
    hospital_cards.sort(key=lambda card: (not card.doctor_available_today, card.distance_km))
    
    return SearchResponse(
        query=query_text,
        intent=ExtractedIntent(**extracted),
        hospitals=hospital_cards,
        total_matches=len(hospital_cards),
        ai_interpretation_summary=extracted.get("interpretation_summary") or f"Searched {target_dept_name} in connected hospitals."
    )
