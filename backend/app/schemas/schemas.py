from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    hospital_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    hospital_id: Optional[str] = None

    class Config:
        from_attributes = True

# Doctor & Department
class DoctorResponse(BaseModel):
    id: str
    name: str
    qualification: str
    specialty: str
    is_available_today: bool
    shift_timings: str
    consultation_fee: int

    class Config:
        from_attributes = True

class DepartmentResponse(BaseModel):
    id: str
    name: str
    hindi_name: Optional[str] = None
    is_operational: bool
    wait_time_minutes: int
    description: Optional[str] = None
    doctors: List[DoctorResponse] = []

    class Config:
        from_attributes = True

# Hospital
class HospitalResponse(BaseModel):
    id: str
    name: str
    hindi_name: Optional[str] = None
    hospital_type: str
    city: str
    address: str
    phone: str
    emergency_contact: str
    latitude: float
    longitude: float
    is_connected: bool
    total_beds: int
    beds_available: int
    icu_available: int
    oxygen_available: bool
    blood_bank_available: bool
    distance_km: Optional[float] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

class HospitalDetailResponse(HospitalResponse):
    departments: List[DepartmentResponse] = []
    doctors: List[DoctorResponse] = []

# Search
class ExtractedIntent(BaseModel):
    department: Optional[str] = None
    service: Optional[str] = None
    urgency: Optional[str] = "Normal"
    city: Optional[str] = "Bhopal"
    symptoms: Optional[List[str]] = []
    confidence: Optional[float] = 1.0

class SearchRequest(BaseModel):
    query: str
    user_latitude: Optional[float] = 23.259933  # Default Bhopal center
    user_longitude: Optional[float] = 77.412615

class HospitalMatchCard(BaseModel):
    hospital: HospitalResponse
    matching_department: Optional[str] = None
    matching_doctors: List[DoctorResponse] = []
    department_operational: bool = True
    doctor_available_today: bool = True
    distance_km: float = 0.0
    last_updated_minutes_ago: int = 10

class SearchResponse(BaseModel):
    query: str
    intent: ExtractedIntent
    hospitals: List[HospitalMatchCard]
    total_matches: int
    ai_interpretation_summary: str

# Medicine & Inventory
class MedicineResponse(BaseModel):
    id: str
    name: str
    generic_name: str
    category: str
    dosage_form: str
    unit: str

    class Config:
        from_attributes = True

class InventoryItemResponse(BaseModel):
    id: str
    hospital_id: str
    medicine_id: str
    medicine: MedicineResponse
    current_stock: int
    daily_consumption: float
    minimum_threshold: int
    reorder_quantity: int
    batch_number: str
    expiry_date: str
    last_updated: datetime
    # Calculated deterministic fields
    days_remaining: float
    stock_status: str  # "Healthy", "Low", "Critical"
    predicted_risk: str  # e.g., "3 days", "5 days", "Normal (>20 days)"

    class Config:
        from_attributes = True

class InventoryUpdateRequest(BaseModel):
    current_stock: Optional[int] = None
    daily_consumption: Optional[float] = None
    minimum_threshold: Optional[int] = None

# Insights
class StockoutRiskInsight(BaseModel):
    medicine_id: str
    medicine_name: str
    generic_name: str
    current_stock: int
    daily_consumption: float
    minimum_threshold: int
    days_remaining: float
    status: str
    severity: str  # "Critical", "Warning", "Stable"
    ai_explanation: str

class RedistributionMatch(BaseModel):
    id: str
    medicine_name: str
    generic_name: str
    shortage_hospital_id: str
    shortage_hospital_name: str
    shortage_hospital_city: str
    shortage_stock: int
    shortage_consumption: float
    shortage_days_remaining: float

    surplus_hospital_id: str
    surplus_hospital_name: str
    surplus_hospital_city: str
    surplus_stock: int
    surplus_consumption: float
    surplus_days_remaining: float

    suggested_transfer_quantity: int
    distance_km: float
    estimated_transit_hours: float
    urgency: str  # "High", "Medium"
    ai_explanation: str

class DashboardOverviewMetrics(BaseModel):
    total_medicines: int
    healthy_count: int
    low_count: int
    critical_count: int
    predicted_shortages_count: int
    redistribution_opportunities_count: int
    last_updated: datetime
