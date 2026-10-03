# SETU (सेतु)
### Sahi hospital, sahi jagah, sahi waqt par.

> **Healthcare Resource & Supply Chain Resilience Platform**: Patients find verified healthcare resources through a connected hospital network, while hospitals use AI to predict medicine stockouts and identify inter-hospital redistribution opportunities.

---

## 🌟 Core Architecture

```text
Google Stitch (MCP)
        ↓ UI Design System (Fidelity tokens, layouts, clinical aesthetic)
Next.js (App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons)
        ↓ HTTP REST APIs
FastAPI (Python, Pydantic, SQLAlchemy ORM)
        ├── PostgreSQL (direct relational source of truth / SQLite fallback for instant zero-config run)
        └── Groq API (Strictly for Natural Language Understanding & Clinical Explanations)
```

### Critical Architecture Boundaries
- **Factual Data**: Always queried deterministically from the database (PostgreSQL / SQLite).
- **Deterministic Stockout & Redistribution**: Calculated authoritatively by the FastAPI backend (`days = stock / consumption`, threshold checks, Haversine distance).
- **Groq AI**: Used strictly for:
  1. Patient Natural Language intent extraction (e.g., *"Mujhe aaj orthopedic doctor chahiye"* $\rightarrow$ `{department: "Orthopedics", service: "Doctor Consultation", urgency: "Today"}`).
  2. Stockout explanation in plain clinical language.
  3. Inter-hospital redistribution opportunity rationale.
- **Zero Hallucination Guarantee**: AI never invents hospital names, doctors, bed counts, medicine numbers, or medical diagnoses.

---

## 🚀 6 Core MVP Features

1. **Smart Healthcare Search**: Natural language search box accepting English, Hindi, and Hinglish queries.
2. **Hospital Resource Matching**: Factual matching based on on-duty doctors, operational departments, and distance.
3. **Doctor & Department Availability**: Real-time doctor shift timings and department statuses with live sync timestamps.
4. **Medicine Inventory Dashboard**: Hospital admin view showing monitored SKUs, current stock, daily burn rate, and status.
5. **AI Stockout Prediction**: Deterministic calculation of days remaining with Groq AI clinical explanation.
6. **Excess-to-Shortage Redistribution**: Automated detection matching hospitals facing shortages (e.g. Bhopal City Hospital with 18 units of Insulin) with nearby hospitals holding surplus reserves (e.g. Indore Memorial with 500 units) via a visual corridor connector.

---

## 🏃 Quick Start Guide

### 1. Backend (FastAPI)

```bash
cd backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure Environment (Optional - works out of the box with SQLite demo database)
# Copy .env.example to .env and insert your GROQ_API_KEY and DATABASE_URL when ready
cp .env.example .env

# 3. Seed demo network database (5 hospitals, 7 departments, 12 doctors, 12 medicines)
python -c "from app.db.seed_data import seed_database; seed_database()"

# 4. Start FastAPI server (runs on port 8000)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API docs available at: `http://127.0.0.1:8000/docs`

---

### 2. Frontend (Next.js)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Hackathon Demo Flow for Judges (30-Second Walkthrough)

### Demo Flow A — Patient Experience
1. Open `http://localhost:3000`.
2. Notice the **English | हिंदी** language switcher in the header — toggle it to see the entire UI adapt seamlessly.
3. Observe the persistent **"Demo Network • Simulated Hospital Data"** safety badge.
4. Enter a natural language request in the search box:
   > *"Mujhe aaj orthopedic doctor chahiye"*
5. Click **Find Healthcare**.
6. View the **AI Clinical Understanding Card**:
   - Department: `Orthopedics`
   - Service: `Doctor Consultation`
   - Urgency: `Today`
   - City: `Bhopal`
7. View the **Verified Hospital Cards**:
   - `Bhopal City Hospital` (3.2 km away) shows **Orthopedics Available** with on-duty surgeon **Dr. Rahul Sharma**.
   - Click **View Hospital** to see bed capacity, ICU availability, and shift timings.

---

### Demo Flow B — Hospital Administrator Experience
1. Navigate to **Hospital Login** (`/login`) or click the top-right button.
2. Use the one-click quick-fill credentials:
   - **Bhopal City Hospital Admin**: `admin@bhopalcity.org` / `admin123`
3. Enter the **Hospital Admin Console** (`/admin/dashboard`):
   - **Top 4 KPI Metrics**: Monitored Medicines (10), Healthy Stock (5), Low Stock (2), Critical Alert (2).
   - **AI Stockout Alert Card**: Displays **Human Insulin Regular 100 IU/ml** (Stock: 18, Daily Burn: 6 vials/day, Critical in ~3 days) with Groq clinical analysis.
   - **Inter-Hospital Redistribution Card**: Visual connector showing:
     `Bhopal City Hospital (18 units, Shortage) ─── 8.1 km ───> Indore Memorial Care (500 units, Surplus)`
   - Click **Review Opportunity**: Inspect the visual corridor modal and click **Confirm & Request Stock Rebalance** (Human-in-the-loop simulated request).
   - **Live Stock Update**: Click **Update** on any row in the Medicine Inventory table to modify stock or daily consumption — notice how the status and days remaining recalculate deterministically in real time!
