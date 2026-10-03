from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.db.database import get_db
from app.models.models import Hospital, Department, Doctor
from app.schemas.schemas import HospitalResponse, HospitalDetailResponse
from app.services.matching_service import calculate_haversine_distance

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

@router.get("", response_model=List[HospitalResponse])
def list_hospitals(
    city: Optional[str] = None,
    user_lat: Optional[float] = Query(None, description="User latitude for distance calculation"),
    user_lon: Optional[float] = Query(None, description="User longitude for distance calculation"),
    db: Session = Depends(get_db)
):
    query = db.query(Hospital)
    if city:
        query = query.filter(Hospital.city.ilike(f"%{city}%"))
    hospitals = query.all()

    results = []
    for h in hospitals:
        resp = HospitalResponse.from_orm(h)
        if user_lat is not None and user_lon is not None:
            resp.distance_km = calculate_haversine_distance(user_lat, user_lon, h.latitude, h.longitude)
        else:
            resp.distance_km = 3.5  # default demo distance
        resp.last_updated = h.updated_at
        results.append(resp)

    # Sort by distance if available
    results.sort(key=lambda x: (x.distance_km or 999))
    return results

@router.get("/{hospital_id}", response_model=HospitalDetailResponse)
def get_hospital_details(hospital_id: str, db: Session = Depends(get_db)):
    hospital = (
        db.query(Hospital)
        .options(
            joinedload(Hospital.departments).joinedload(Department.doctors),
            joinedload(Hospital.doctors)
        )
        .filter(Hospital.id == hospital_id)
        .first()
    )
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    resp = HospitalDetailResponse.from_orm(hospital)
    resp.last_updated = hospital.updated_at
    return resp
