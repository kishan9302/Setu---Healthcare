from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.db.database import get_db
from app.models.models import HospitalInventory, Hospital, Medicine, User
from app.schemas.schemas import InventoryItemResponse, InventoryUpdateRequest, MedicineResponse
from app.services.stockout_service import calculate_days_remaining, determine_stock_status
from app.api.deps import get_current_admin

router = APIRouter(prefix="/inventory", tags=["Medicine Inventory"])

@router.get("", response_model=List[InventoryItemResponse])
def list_inventory(
    hospital_id: Optional[str] = Query(None, description="Filter by hospital ID"),
    status_filter: Optional[str] = Query(None, description="Filter by Healthy, Low, or Critical"),
    category_filter: Optional[str] = Query(None, description="Filter by medicine category"),
    search: Optional[str] = Query(None, description="Search medicine name"),
    db: Session = Depends(get_db)
):
    query = db.query(HospitalInventory).options(
        joinedload(HospitalInventory.medicine),
        joinedload(HospitalInventory.hospital)
    )

    if hospital_id:
        query = query.filter(HospitalInventory.hospital_id == hospital_id)
    if search:
        query = query.join(Medicine).filter(Medicine.name.ilike(f"%{search}%"))

    items = query.all()
    results = []

    for item in items:
        if category_filter and category_filter.lower() not in item.medicine.category.lower():
            continue

        days = calculate_days_remaining(item.current_stock, item.daily_consumption)
        st_status, risk = determine_stock_status(item.current_stock, item.daily_consumption, item.minimum_threshold)

        if status_filter and status_filter.lower() != "all" and status_filter.lower() != st_status.lower():
            continue

        results.append(InventoryItemResponse(
            id=item.id,
            hospital_id=item.hospital_id,
            medicine_id=item.medicine_id,
            medicine=MedicineResponse.from_orm(item.medicine),
            current_stock=item.current_stock,
            daily_consumption=item.daily_consumption,
            minimum_threshold=item.minimum_threshold,
            reorder_quantity=item.reorder_quantity,
            batch_number=item.batch_number,
            expiry_date=item.expiry_date,
            last_updated=item.last_updated,
            days_remaining=days,
            stock_status=st_status,
            predicted_risk=risk
        ))

    # Sort critical items first, then low, then healthy
    severity_order = {"Critical": 0, "Low": 1, "Healthy": 2}
    results.sort(key=lambda x: (severity_order.get(x.stock_status, 3), x.days_remaining))
    return results

@router.patch("/{inventory_id}", response_model=InventoryItemResponse)
def update_inventory_item(
    inventory_id: str,
    payload: InventoryUpdateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(HospitalInventory).filter(HospitalInventory.id == inventory_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory record not found")

    # Verify admin belongs to this hospital or is super-admin
    if current_admin.hospital_id and current_admin.hospital_id != item.hospital_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit inventory for another hospital")

    if payload.current_stock is not None:
        item.current_stock = max(0, payload.current_stock)
    if payload.daily_consumption is not None:
        item.daily_consumption = max(0.1, payload.daily_consumption)
    if payload.minimum_threshold is not None:
        item.minimum_threshold = max(0, payload.minimum_threshold)

    db.commit()
    db.refresh(item)

    days = calculate_days_remaining(item.current_stock, item.daily_consumption)
    st_status, risk = determine_stock_status(item.current_stock, item.daily_consumption, item.minimum_threshold)

    return InventoryItemResponse(
        id=item.id,
        hospital_id=item.hospital_id,
        medicine_id=item.medicine_id,
        medicine=MedicineResponse.from_orm(item.medicine),
        current_stock=item.current_stock,
        daily_consumption=item.daily_consumption,
        minimum_threshold=item.minimum_threshold,
        reorder_quantity=item.reorder_quantity,
        batch_number=item.batch_number,
        expiry_date=item.expiry_date,
        last_updated=item.last_updated,
        days_remaining=days,
        stock_status=st_status,
        predicted_risk=risk
    )
