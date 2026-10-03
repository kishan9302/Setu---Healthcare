from typing import Tuple

def calculate_days_remaining(current_stock: int, daily_consumption: float) -> float:
    """
    Deterministically calculate days of medicine remaining.
    Safely handles edge cases like 0 or negative consumption.
    """
    if current_stock <= 0:
        return 0.0
    if daily_consumption <= 0:
        return 999.0
    return round(float(current_stock) / float(daily_consumption), 1)

def determine_stock_status(current_stock: int, daily_consumption: float, minimum_threshold: int) -> Tuple[str, str]:
    """
    Deterministically determines:
    1. stock_status: 'Healthy' | 'Low' | 'Critical'
    2. predicted_risk: formatted string such as '~3 days', '~5 days', 'Normal (>20 days)'
    """
    days = calculate_days_remaining(current_stock, daily_consumption)
    
    # Critical: stock is at or below minimum threshold OR days remaining <= 3
    if current_stock <= minimum_threshold or days <= 3.0:
        status = "Critical"
        risk = f"~{int(days) if days >= 1 else 0} days (Critical)"
    # Low: days remaining <= 7 OR stock is below 2x minimum threshold
    elif days <= 7.0 or current_stock <= (minimum_threshold * 2):
        status = "Low"
        risk = f"~{int(days)} days (Low)"
    else:
        status = "Healthy"
        risk = f"Normal (>{min(int(days), 30)} days)"
        
    return status, risk
