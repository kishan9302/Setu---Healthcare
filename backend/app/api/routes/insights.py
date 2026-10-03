from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from app.db.database import get_db
from app.models.models import HospitalInventory, Hospital, Medicine
from app.schemas.schemas import DashboardOverviewMetrics, StockoutRiskInsight
from app.services.stockout_service import calculate_days_remaining, determine_stock_status
from app.services.redistribution_service import find_redistribution_opportunities
from app.services.groq_service import explain_stockout

router = APIRouter(prefix="/insights", tags=["AI Supply Chain Insights"])

@router.get("/metrics", response_model=DashboardOverviewMetrics)
def get_dashboard_metrics(
    hospital_id: Optional[str] = Query("hosp-bhopal-city"),
    db: Session = Depends(get_db)
):
    inventories = (
        db.query(HospitalInventory)
        .filter(HospitalInventory.hospital_id == hospital_id)
        .all()
    )

    total = len(inventories)
    healthy = 0
    low = 0
    critical = 0

    for inv in inventories:
        status, _ = determine_stock_status(inv.current_stock, inv.daily_consumption, inv.minimum_threshold)
        if status == "Healthy":
            healthy += 1
        elif status == "Low":
            low += 1
        elif status == "Critical":
            critical += 1

    redist_ops = find_redistribution_opportunities(db, target_hospital_id=hospital_id)

    return DashboardOverviewMetrics(
        total_medicines=total,
        healthy_count=healthy,
        low_count=low,
        critical_count=critical,
        predicted_shortages_count=critical + low,
        redistribution_opportunities_count=len(redist_ops),
        last_updated=datetime.now(timezone.utc)
    )

@router.get("/stockout-alerts", response_model=List[StockoutRiskInsight])
async def get_stockout_risk_alerts(
    hospital_id: Optional[str] = Query("hosp-bhopal-city"),
    db: Session = Depends(get_db)
):
    items = (
        db.query(HospitalInventory)
        .options(joinedload(HospitalInventory.medicine))
        .filter(HospitalInventory.hospital_id == hospital_id)
        .all()
    )

    alerts = []
    for item in items:
        days = calculate_days_remaining(item.current_stock, item.daily_consumption)
        status, risk = determine_stock_status(item.current_stock, item.daily_consumption, item.minimum_threshold)

        if status in ("Critical", "Low"):
            # Call Groq to convert deterministic numbers into human explanation
            explanation = await explain_stockout(
                medicine_name=item.medicine.name,
                current_stock=item.current_stock,
                daily_consumption=item.daily_consumption,
                days_remaining=days,
                minimum_threshold=item.minimum_threshold
            )

            alerts.append(StockoutRiskInsight(
                medicine_id=item.medicine_id,
                medicine_name=item.medicine.name,
                generic_name=item.medicine.generic_name,
                current_stock=item.current_stock,
                daily_consumption=item.daily_consumption,
                minimum_threshold=item.minimum_threshold,
                days_remaining=days,
                status=status,
                severity="Critical" if status == "Critical" else "Warning",
                ai_explanation=explanation
            ))

    alerts.sort(key=lambda x: x.days_remaining)
    return alerts
