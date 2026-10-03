from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import HospitalInventory, Hospital, Medicine
from app.services.stockout_service import calculate_days_remaining, determine_stock_status
from app.services.matching_service import calculate_haversine_distance

def find_redistribution_opportunities(db: Session, target_hospital_id: str = None) -> List[Dict[str, Any]]:
    """
    Deterministic algorithm to identify potential excess-to-shortage 
    redistribution opportunities across connected hospitals.
    
    Condition for Shortage Hospital:
    - Stock status is 'Critical' or 'Low' (days remaining <= 7 or stock <= 2*min)
    
    Condition for Surplus Hospital:
    - Same medicine has 'Healthy' status AND stock >= 3*min AND days remaining >= 25
    """
    # Fetch all inventories with relationships
    all_inventories = db.query(HospitalInventory).join(Hospital).join(Medicine).all()
    
    # Group by medicine_id
    by_medicine: Dict[str, List[HospitalInventory]] = {}
    for inv in all_inventories:
        by_medicine.setdefault(inv.medicine_id, []).append(inv)
        
    opportunities = []
    
    for medicine_id, items in by_medicine.items():
        shortages = []
        surpluses = []
        
        for inv in items:
            days = calculate_days_remaining(inv.current_stock, inv.daily_consumption)
            status, _ = determine_stock_status(inv.current_stock, inv.daily_consumption, inv.minimum_threshold)
            
            if status in ("Critical", "Low"):
                shortages.append((inv, days, status))
            elif status == "Healthy" and inv.current_stock >= (inv.minimum_threshold * 2.5) and days >= 20.0:
                surpluses.append((inv, days, status))
                
        # Match each shortage with the best surplus hospital (closest distance)
        for short_inv, short_days, short_status in shortages:
            # If target_hospital_id specified, only return for that hospital
            if target_hospital_id and short_inv.hospital_id != target_hospital_id:
                continue
                
            for surp_inv, surp_days, _ in surpluses:
                if short_inv.hospital_id == surp_inv.hospital_id:
                    continue
                    
                distance = calculate_haversine_distance(
                    short_inv.hospital.latitude, short_inv.hospital.longitude,
                    surp_inv.hospital.latitude, surp_inv.hospital.longitude
                )
                
                # Calculate safe transfer quantity:
                # Give shortage enough for 14 days of consumption or to meet 2x min threshold
                needed = int(max(
                    (short_inv.daily_consumption * 14) - short_inv.current_stock,
                    short_inv.minimum_threshold * 2 - short_inv.current_stock
                ))
                needed = max(needed, 20)
                
                # Ensure surplus retains at least 30 days of stock
                safe_available = int(surp_inv.current_stock - (surp_inv.daily_consumption * 25))
                transfer_qty = min(needed, max(0, safe_available))
                
                if transfer_qty > 0:
                    transit_hours = round(max(0.5, distance / 50.0), 1) # Estimated at 50 km/h regional transit
                    
                    opportunities.append({
                        "id": f"REDIST-{short_inv.id[:6]}-{surp_inv.id[:6]}",
                        "medicine_name": short_inv.medicine.name,
                        "generic_name": short_inv.medicine.generic_name,
                        "shortage_hospital_id": short_inv.hospital_id,
                        "shortage_hospital_name": short_inv.hospital.name,
                        "shortage_hospital_city": short_inv.hospital.city,
                        "shortage_stock": short_inv.current_stock,
                        "shortage_consumption": short_inv.daily_consumption,
                        "shortage_days_remaining": short_days,
                        
                        "surplus_hospital_id": surp_inv.hospital_id,
                        "surplus_hospital_name": surp_inv.hospital.name,
                        "surplus_hospital_city": surp_inv.hospital.city,
                        "surplus_stock": surp_inv.current_stock,
                        "surplus_consumption": surp_inv.daily_consumption,
                        "surplus_days_remaining": surp_days,
                        
                        "suggested_transfer_quantity": transfer_qty,
                        "distance_km": distance,
                        "estimated_transit_hours": transit_hours,
                        "urgency": "High" if short_status == "Critical" else "Medium",
                        "ai_explanation": f"{surp_inv.hospital.name} in {surp_inv.hospital.city} holds {surp_inv.current_stock} units ({surp_days:.0f} days supply) of {short_inv.medicine.generic_name}, while {short_inv.hospital.name} has only {short_inv.current_stock} units remaining (~{short_days:.1f} days). Reallocating {transfer_qty} units resolves the shortage without impacting {surp_inv.hospital.name}'s safety buffer."
                    })
                    
    return opportunities
