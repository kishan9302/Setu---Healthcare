from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.models import User, Hospital, Department, Doctor, Medicine, HospitalInventory
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Hospital).count() > 0:
            print("Database already contains records. Skipping seed.")
            return

        print("Seeding database with realistic Indian healthcare network data...")

        # 1. Hospitals
        h1 = Hospital(
            id="hosp-bhopal-city",
            name="Bhopal City Hospital",
            hindi_name="भोपाल सिटी मल्टी-स्पेशलिटी अस्पताल",
            hospital_type="Multi-Specialty",
            city="Bhopal",
            address="Plot 14, Arera Hills, Near MP Nagar Zone 1, Bhopal, MP 462011",
            phone="+91 755 245 8890",
            emergency_contact="108 / +91 755 245 8899",
            latitude=23.2332,
            longitude=77.4343,
            is_connected=True,
            total_beds=250,
            beds_available=32,
            icu_available=6,
            oxygen_available=True,
            blood_bank_available=True
        )

        h2 = Hospital(
            id="hosp-aiims-bhopal",
            name="AIIMS Bhopal Regional Node",
            hindi_name="एम्स भोपाल क्षेत्रीय केंद्र",
            hospital_type="Government Apex Institute",
            city="Bhopal",
            address="Saket Nagar, AIIMS Campus, Habibganj, Bhopal, MP 462020",
            phone="+91 755 267 2355",
            emergency_contact="108 / +91 755 267 2999",
            latitude=23.2081,
            longitude=77.4589,
            is_connected=True,
            total_beds=600,
            beds_available=85,
            icu_available=14,
            oxygen_available=True,
            blood_bank_available=True
        )

        h3 = Hospital(
            id="hosp-indore-memorial",
            name="Indore Memorial Care & Trauma Institute",
            hindi_name="इंदौर मेमोरियल केयर एवं ट्रॉमा संस्थान",
            hospital_type="Multi-Specialty & Trauma",
            city="Indore",
            address="AB Road, Near Vijay Nagar Square, Indore, MP 452010",
            phone="+91 731 405 6000",
            emergency_contact="108 / +91 731 405 6108",
            latitude=22.7533,
            longitude=75.8937,
            is_connected=True,
            total_beds=400,
            beds_available=48,
            icu_available=10,
            oxygen_available=True,
            blood_bank_available=True
        )

        h4 = Hospital(
            id="hosp-ujjain-civil",
            name="Ujjain District Civil Hospital",
            hindi_name="उज्जैन जिला सिविल अस्पताल",
            hospital_type="District Government Hospital",
            city="Ujjain",
            address="Kothi Road, Madhav Nagar, Ujjain, MP 456010",
            phone="+91 734 251 1234",
            emergency_contact="108",
            latitude=23.1765,
            longitude=75.7885,
            is_connected=True,
            total_beds=180,
            beds_available=18,
            icu_available=3,
            oxygen_available=True,
            blood_bank_available=False
        )

        h5 = Hospital(
            id="hosp-jabalpur-medical",
            name="Jabalpur Civil Medical Center",
            hindi_name="जबलपुर सिविल मेडिकल सेंटर",
            hospital_type="Public Multi-Specialty",
            city="Jabalpur",
            address="Nagpur Road, Wright Town, Jabalpur, MP 482002",
            phone="+91 761 240 7711",
            emergency_contact="108",
            latitude=23.1815,
            longitude=79.9864,
            is_connected=True,
            total_beds=220,
            beds_available=25,
            icu_available=5,
            oxygen_available=True,
            blood_bank_available=True
        )

        hospitals = [h1, h2, h3, h4, h5]
        db.add_all(hospitals)
        db.flush()

        # 2. Departments
        dept_data = [
            ("dept-ortho-bhopal", h1.id, "Orthopedics", "अस्थि रोग विभाग (ऑर्थोपेडिक्स)", True, 15, "Joint replacement, fracture trauma, and spine care"),
            ("dept-cardio-bhopal", h1.id, "Cardiology", "हृदय रोग विभाग (कार्डियोलॉजी)", True, 20, "24x7 Cath lab, ECG, Echocardiography"),
            ("dept-gen-bhopal", h1.id, "General Medicine", "सामान्य चिकित्सा (जनरल मेडिसिन)", True, 10, "Acute fever, infection, chronic diabetes management"),
            ("dept-pedia-bhopal", h1.id, "Pediatrics", "बाल रोग विभाग (पीडियाट्रिक्स)", True, 15, "Neonatal ICU, child healthcare"),
            ("dept-er-bhopal", h1.id, "Emergency & Trauma", "आपातकालीन एवं ट्रॉमा केयर", True, 0, "Level 1 Trauma desk, 24x7 emergency resuscitation"),
            ("dept-radio-bhopal", h1.id, "Radiology & Diagnostics", "रेडियोलॉजी एवं जांच विभाग", True, 10, "Digital X-Ray, 128-slice CT scan, MRI"),

            ("dept-ortho-aiims", h2.id, "Orthopedics", "अस्थि रोग विभाग", True, 25, "Complex trauma, joint surgery"),
            ("dept-cardio-aiims", h2.id, "Cardiology", "कार्डियोलॉजी विभाग", True, 30, "Advanced interventional cardiology"),
            ("dept-er-aiims", h2.id, "Emergency & Trauma", "एम्स ट्रॉमा सेंटर", True, 0, "24x7 Apex regional emergency center"),

            ("dept-ortho-indore", h3.id, "Orthopedics", "ऑर्थोपेडिक्स विभाग", True, 20, "Sports injury, arthroscopy, replacement"),
            ("dept-er-indore", h3.id, "Emergency & Trauma", "ट्रॉमा एवं आपातकालीन विभाग", True, 0, "Critical highway trauma desk"),
            ("dept-gen-indore", h3.id, "General Medicine", "जनरल मेडिसिन", True, 15, "Inpatient medical management")
        ]

        departments = [
            Department(
                id=d[0], hospital_id=d[1], name=d[2], hindi_name=d[3],
                is_operational=d[4], wait_time_minutes=d[5], description=d[6]
            )
            for d in dept_data
        ]
        db.add_all(departments)
        db.flush()

        # 3. Doctors
        doc_data = [
            # Bhopal City Hospital
            ("doc-rahul-sharma", h1.id, "dept-ortho-bhopal", "Dr. Rahul Sharma", "MS (Ortho), Fellowship Joint Replacement", "Senior Orthopedic Surgeon", True, "09:00 AM - 02:00 PM / 05:00 PM - 08:00 PM", 600),
            ("doc-priya-verma", h1.id, "dept-cardio-bhopal", "Dr. Priya Verma", "MD, DM (Cardiology), FACC", "Consultant Cardiologist", True, "10:00 AM - 04:00 PM", 800),
            ("doc-amit-patel", h1.id, "dept-gen-bhopal", "Dr. Amit Patel", "MD (Internal Medicine)", "Chief Medical Physician", True, "08:30 AM - 03:00 PM", 400),
            ("doc-sneha-kulkarni", h1.id, "dept-pedia-bhopal", "Dr. Sneha Kulkarni", "MD (Pediatrics), DCH", "Pediatric Specialist", True, "11:00 AM - 05:00 PM", 500),
            ("doc-vikram-singh", h1.id, "dept-er-bhopal", "Dr. Vikram Singh", "MD (Emergency Medicine)", "Head of Trauma & Emergency", True, "24x7 On Duty Shift", 500),

            # AIIMS Bhopal
            ("doc-sunil-joshi", h2.id, "dept-ortho-aiims", "Dr. Sunil Joshi", "MS Orthopedics, MCh", "Additional Professor Orthopedics", True, "09:00 AM - 03:00 PM", 250),
            ("doc-ananya-roy", h2.id, "dept-cardio-aiims", "Dr. Ananya Roy", "MD, DM (Cardiology)", "Associate Professor Cardiology", True, "09:30 AM - 02:30 PM", 250),
            ("doc-manish-tiwari", h2.id, "dept-er-aiims", "Dr. Manish Tiwari", "MD (Emergency Medicine)", "Trauma Center In-charge", True, "24x7 On Duty Shift", 200),

            # Indore Memorial
            ("doc-rajesh-mehta", h3.id, "dept-ortho-indore", "Dr. Rajesh Mehta", "MS Ortho, DNB", "Chief Orthopedic Consultant", True, "10:00 AM - 06:00 PM", 700),
            ("doc-deepa-nair", h3.id, "dept-er-indore", "Dr. Deepa Nair", "MD (Emergency Medicine)", "Director of Emergency Services", True, "24x7 On Duty Shift", 600),
            ("doc-sanjay-shrivastava", h3.id, "dept-gen-indore", "Dr. Sanjay Shrivastava", "MD (Medicine)", "Senior Consultant Physician", True, "09:00 AM - 04:00 PM", 500)
        ]

        doctors = [
            Doctor(
                id=d[0], hospital_id=d[1], department_id=d[2], name=d[3],
                qualification=d[4], specialty=d[5], is_available_today=d[6],
                shift_timings=d[7], consultation_fee=d[8]
            )
            for d in doc_data
        ]
        db.add_all(doctors)
        db.flush()

        # 4. Medicines (12 Essential Medicines)
        med_data = [
            ("med-insulin", "Human Insulin Regular 100 IU/ml", "Insulin Regular", "Endocrine / Diabetic Care", "10ml Injection Vial", "vials"),
            ("med-amoxicillin", "Amoxicillin 500mg Capsules", "Amoxicillin", "Broad-Spectrum Antibiotic", "Blister Pack (10 Caps)", "tablets"),
            ("med-paracetamol", "Paracetamol IV Infusion 100ml", "Paracetamol IV", "Analgesic / Antipyretic", "100ml Glass Bottle", "bottles"),
            ("med-ceftriaxone", "Ceftriaxone 1g Injection", "Ceftriaxone", "Cephalosporin Antibiotic", "Vial with Sterile Water", "vials"),
            ("med-saline", "Normal Saline (0.9% NaCl) 500ml", "Normal Saline 0.9%", "IV Fluids & Resuscitation", "500ml IV Bottle", "bottles"),
            ("med-metformin", "Metformin 500mg Tablets", "Metformin", "Anti-diabetic", "Strip of 15 Tabs", "tablets"),
            ("med-atropine", "Atropine Sulphate 0.6mg/ml", "Atropine", "Emergency / Cardiac Resuscitation", "1ml Ampoule", "ampoules"),
            ("med-tetanus", "Tetanus Toxoid Vaccine (TT)", "Tetanus Toxoid", "Immunization / Trauma", "0.5ml Ampoule", "ampoules"),
            ("med-azithromycin", "Azithromycin 500mg Tablets", "Azithromycin", "Macrolide Antibiotic", "Strip of 3 Tabs", "tablets"),
            ("med-pantoprazole", "Pantoprazole 40mg IV", "Pantoprazole", "Gastrointestinal", "Vial for Injection", "vials"),
            ("med-o-negative", "O-Negative Tested Blood Packed Red Cells", "O-Negative Blood Units", "Blood Bank / Critical Emergency", "Unit Bag (350ml)", "units"),
            ("med-remdesivir", "Remdesivir 100mg Lyophilized Powder", "Remdesivir", "Antiviral", "100mg Single-Dose Vial", "vials")
        ]

        medicines = [
            Medicine(id=m[0], name=m[1], generic_name=m[2], category=m[3], dosage_form=m[4], unit=m[5])
            for m in med_data
        ]
        db.add_all(medicines)
        db.flush()

        # 5. Inventories configured for the exact PRD demo scenario:
        # Bhopal City Hospital (h1):
        # - Insulin: Stock 18, Daily 6, Min 25 -> Critical shortage (~3 days remaining)
        # - Amoxicillin: Stock 120, Daily 30, Min 60 -> Low (~4 days remaining)
        # - Paracetamol IV: Stock 1200, Daily 100, Min 200 -> Healthy (~12 days)
        # - Ceftriaxone: Stock 45, Daily 12, Min 30 -> Low (~3.7 days)
        # - O-Negative Blood: Stock 2, Daily 1, Min 5 -> Critical (~2 days)
        # - Normal Saline: Stock 850, Daily 45, Min 100 -> Healthy (>18 days)
        #
        # Indore Memorial (h3):
        # - Insulin: Stock 500, Daily 10, Min 50 -> Massive surplus (50 days) -> Perfect redistribution match!
        inv_data = [
            # Bhopal City Hospital
            (h1.id, "med-insulin", 18, 6.0, 25, 100, "BATCH-INS-891", "2026-08-31"),
            (h1.id, "med-amoxicillin", 120, 30.0, 60, 300, "BATCH-AMX-442", "2026-11-30"),
            (h1.id, "med-paracetamol", 1200, 100.0, 200, 800, "BATCH-PCM-991", "2027-03-31"),
            (h1.id, "med-ceftriaxone", 45, 12.0, 30, 150, "BATCH-CEF-212", "2026-09-30"),
            (h1.id, "med-saline", 850, 45.0, 100, 500, "BATCH-NS-102", "2027-01-31"),
            (h1.id, "med-metformin", 650, 25.0, 100, 400, "BATCH-MET-883", "2027-05-31"),
            (h1.id, "med-atropine", 40, 2.0, 15, 60, "BATCH-ATR-004", "2026-10-31"),
            (h1.id, "med-tetanus", 80, 5.0, 25, 100, "BATCH-TT-771", "2026-12-31"),
            (h1.id, "med-o-negative", 2, 1.0, 5, 10, "BATCH-BLD-019", "2025-11-15"),
            (h1.id, "med-pantoprazole", 220, 18.0, 50, 200, "BATCH-PAN-331", "2027-02-28"),

            # Indore Memorial Care (Surplus Provider)
            (h3.id, "med-insulin", 500, 10.0, 50, 300, "BATCH-IND-INS-1", "2026-10-31"),
            (h3.id, "med-amoxicillin", 600, 25.0, 80, 400, "BATCH-IND-AMX-2", "2026-12-31"),
            (h3.id, "med-paracetamol", 2000, 120.0, 300, 1000, "BATCH-IND-PCM-3", "2027-04-30"),
            (h3.id, "med-ceftriaxone", 350, 20.0, 60, 200, "BATCH-IND-CEF-4", "2026-11-30"),
            (h3.id, "med-saline", 1500, 80.0, 200, 800, "BATCH-IND-NS-5", "2027-06-30"),
            (h3.id, "med-o-negative", 8, 1.0, 4, 10, "BATCH-IND-BLD-6", "2025-11-20"),

            # AIIMS Bhopal
            (h2.id, "med-insulin", 350, 15.0, 60, 250, "BATCH-AIM-INS-1", "2026-12-31"),
            (h2.id, "med-paracetamol", 3000, 180.0, 400, 1500, "BATCH-AIM-PCM-2", "2027-05-31"),
            (h2.id, "med-saline", 2200, 110.0, 300, 1200, "BATCH-AIM-NS-3", "2027-08-31"),
            (h2.id, "med-amoxicillin", 800, 35.0, 100, 500, "BATCH-AIM-AMX-4", "2026-10-31"),
            (h2.id, "med-o-negative", 12, 2.0, 6, 20, "BATCH-AIM-BLD-5", "2025-11-25")
        ]

        inventories = [
            HospitalInventory(
                hospital_id=i[0], medicine_id=i[1], current_stock=i[2],
                daily_consumption=i[3], minimum_threshold=i[4], reorder_quantity=i[5],
                batch_number=i[6], expiry_date=i[7]
            )
            for i in inv_data
        ]
        db.add_all(inventories)
        db.flush()

        # 6. Users (Admin and Patient)
        users = [
            User(
                id="user-admin-bhopal",
                email="admin@bhopalcity.org",
                hashed_password=get_password_hash("admin123"),
                role="hospital_admin",
                full_name="Dr. Ramesh Gupta",
                phone="+91 98260 11223",
                hospital_id=h1.id
            ),
            User(
                id="user-admin-indore",
                email="admin@indorememorial.org",
                hashed_password=get_password_hash("admin123"),
                role="hospital_admin",
                full_name="Dr. Rajesh Mehta",
                phone="+91 98261 44556",
                hospital_id=h3.id
            ),
            User(
                id="user-patient-demo",
                email="patient@aarogya.in",
                hashed_password=get_password_hash("patient123"),
                role="patient",
                full_name="Aakash Sharma",
                phone="+91 98270 99887",
                hospital_id=None
            )
        ]
        db.add_all(users)
        db.commit()
        print("Database successfully seeded with demo network data!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
