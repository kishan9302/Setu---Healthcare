from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import RedistributionMatch
from app.services.redistribution_service import find_redistribution_opportunities
from app.services.groq_service import explain_redistribution

router = APIRouter(prefix="/redistribution", tags=["Inter-Hospital Redistribution"])

@router.get("", response_model=List[RedistributionMatch])
async def get_redistribution_opportunities(
    hospital_id: Optional[str] = Query("hosp-bhopal-city", description="Filter for specific hospital"),
    db: Session = Depends(get_db)
):
    # 1. Deterministic calculation
    raw_ops = find_redistribution_opportunities(db, target_hospital_id=hospital_id)

    matches = []
    for op in raw_ops:
        # Call Groq to get explanation (or fallback)
        groq_expl = await explain_redistribution(
            medicine_name=op["medicine_name"],
            shortage_hospital=op["shortage_hospital_name"],
            shortage_stock=op["shortage_stock"],
            shortage_days=op["shortage_days_remaining"],
            surplus_hospital=op["surplus_hospital_name"],
            surplus_stock=op["surplus_stock"],
            surplus_days=op["surplus_days_remaining"],
            transfer_qty=op["suggested_transfer_quantity"],
            distance_km=op["distance_km"]
        )

        matches.append(RedistributionMatch(
            id=op["id"],
            medicine_name=op["medicine_name"],
            generic_name=op["generic_name"],
            shortage_hospital_id=op["shortage_hospital_id"],
            shortage_hospital_name=op["shortage_hospital_name"],
            shortage_hospital_city=op["shortage_hospital_city"],
            shortage_stock=op["shortage_stock"],
            shortage_consumption=op["shortage_consumption"],
            shortage_days_remaining=op["shortage_days_remaining"],
            surplus_hospital_id=op["surplus_hospital_id"],
            surplus_hospital_name=op["surplus_hospital_name"],
            surplus_hospital_city=op["surplus_hospital_city"],
            surplus_stock=op["surplus_stock"],
            surplus_consumption=op["surplus_consumption"],
            surplus_days_remaining=op["surplus_days_remaining"],
            suggested_transfer_quantity=op["suggested_transfer_quantity"],
            distance_km=op["distance_km"],
            estimated_transit_hours=op["estimated_transit_hours"],
            urgency=op["urgency"],
            ai_explanation=groq_expl
        ))

    return matches
