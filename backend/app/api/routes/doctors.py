from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Doctor
from app.schemas.schemas import DoctorResponse

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("", response_model=List[DoctorResponse])
def list_doctors(
    hospital_id: Optional[str] = None,
    specialty: Optional[str] = None,
    available_today: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)
    if hospital_id:
        query = query.filter(Doctor.hospital_id == hospital_id)
    if specialty:
        query = query.filter(Doctor.specialty.ilike(f"%{specialty}%"))
    if available_today is not None:
        query = query.filter(Doctor.is_available_today == available_today)

    return query.all()
