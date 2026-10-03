import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="patient")  # "hospital_admin", "patient"
    full_name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    hospital_id = Column(String(36), ForeignKey("hospitals.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    hospital = relationship("Hospital", back_populates="admins")

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    hindi_name = Column(String(255), nullable=True)
    hospital_type = Column(String(100), default="Multi-Specialty")  # "Government", "Private", "Multi-Specialty"
    city = Column(String(100), nullable=False, index=True)  # "Bhopal", "Indore", "Ujjain", "Jabalpur"
    address = Column(Text, nullable=False)
    phone = Column(String(50), nullable=False)
    emergency_contact = Column(String(50), default="108")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_connected = Column(Boolean, default=True)
    total_beds = Column(Integer, default=200)
    beds_available = Column(Integer, default=24)
    icu_available = Column(Integer, default=4)
    oxygen_available = Column(Boolean, default=True)
    blood_bank_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    admins = relationship("User", back_populates="hospital")
    departments = relationship("Department", back_populates="hospital", cascade="all, delete-orphan")
    doctors = relationship("Doctor", back_populates="hospital", cascade="all, delete-orphan")
    inventory_items = relationship("HospitalInventory", back_populates="hospital", cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = "departments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hospital_id = Column(String(36), ForeignKey("hospitals.id"), nullable=False)
    name = Column(String(100), nullable=False, index=True)  # "Orthopedics", "Cardiology", "General Medicine", etc.
    hindi_name = Column(String(100), nullable=True)
    is_operational = Column(Boolean, default=True)
    wait_time_minutes = Column(Integer, default=15)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    hospital = relationship("Hospital", back_populates="departments")
    doctors = relationship("Doctor", back_populates="department")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hospital_id = Column(String(36), ForeignKey("hospitals.id"), nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=False)
    name = Column(String(255), nullable=False)
    qualification = Column(String(100), nullable=False)  # "MS Orthopedics", "MD Cardiology"
    specialty = Column(String(100), nullable=False)
    is_available_today = Column(Boolean, default=True)
    shift_timings = Column(String(100), default="09:00 AM - 05:00 PM")
    consultation_fee = Column(Integer, default=500)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    hospital = relationship("Hospital", back_populates="doctors")
    department = relationship("Department", back_populates="doctors")

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)  # "Human Insulin Regular 100 IU/ml"
    generic_name = Column(String(255), nullable=False)  # "Insulin"
    category = Column(String(100), nullable=False)  # "Endocrine / Diabetes", "Antibiotics", etc.
    dosage_form = Column(String(100), default="Vial / Injection")  # "Tablet", "Vial", "Infusion"
    unit = Column(String(50), default="vials")  # "vials", "tablets", "bottles"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    inventory_entries = relationship("HospitalInventory", back_populates="medicine")

class HospitalInventory(Base):
    __tablename__ = "hospital_inventory"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hospital_id = Column(String(36), ForeignKey("hospitals.id"), nullable=False)
    medicine_id = Column(String(36), ForeignKey("medicines.id"), nullable=False)
    current_stock = Column(Integer, nullable=False, default=0)
    daily_consumption = Column(Float, nullable=False, default=1.0)
    minimum_threshold = Column(Integer, nullable=False, default=20)
    reorder_quantity = Column(Integer, nullable=False, default=100)
    batch_number = Column(String(100), default="BATCH-2025-A")
    expiry_date = Column(String(50), default="2026-12-31")
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    hospital = relationship("Hospital", back_populates="inventory_items")
    medicine = relationship("Medicine", back_populates="inventory_entries")
