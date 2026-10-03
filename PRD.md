# Product Requirements Document (PRD)

## Project Name

**Healthcare Resource & Supply Chain Resilience Platform**

### One-Line Product Definition

An AI-powered healthcare platform that helps patients find the right hospital resources while helping hospitals predict medicine shortages and identify potential resource redistribution opportunities.

---

# 1. Product Goal

Build a simple, hackathon-ready healthcare network connecting **patients and hospitals** through one platform.

The product solves two focused problems:

### Patient Problem

Patients often do not know which nearby hospital currently has the healthcare resource they need.

### Hospital Problem

Hospitals may face medicine shortages while another connected hospital may have excess inventory.

### Core Solution

The platform connects hospital resource data and uses AI to:

1. Understand a patient's healthcare requirement.
2. Match the requirement with available hospital resources.
3. Analyze hospital medicine inventory.
4. Predict potential stockouts.
5. Identify potential redistribution opportunities between connected hospitals.

---

# 2. Core USP

## "Find the right healthcare resource. Predict shortages before they happen."

The product has **two core experiences**:

### Patient Side

**Requirement → AI Understanding → Hospital Resource Matching**

### Hospital Side

**Inventory → AI Analysis → Stockout Prediction → Redistribution Opportunity**

These two workflows are the heart of the MVP.

---

# 3. Target Users

Only two primary user types are required for the MVP.

## 3.1 Patient

A person looking for a healthcare service or resource.

Example:

> "I need an orthopedic consultation today."

The system should help identify hospitals with the relevant department/resource and reported availability.

---

## 3.2 Hospital Admin

A hospital representative who manages the hospital's resource and medicine information.

The hospital admin can update:

- Departments
- Doctors
- Doctor availability
- Medicine inventory
- Medicine consumption data

The admin can view AI-generated supply-chain insights.

---

# 4. MVP Features

The MVP MUST contain only the following six major features.

## Feature 1 — Smart Healthcare Search

Patient enters a natural-language requirement.

Examples:

- "I need an orthopedic doctor."
- "I need a cardiologist today."
- "I need an X-ray."
- "I need a blood test."
- "I need emergency care."

The system sends the requirement to Gemini.

Gemini converts the natural-language request into structured information such as:

```text
department: Orthopedics
service: Doctor Consultation
urgency: Normal
```

The AI should NOT diagnose the patient.

---

# 5. Feature 2 — Hospital Resource Matching

After understanding the requirement, the system searches the hospital database.

Matching should consider:

- Relevant department
- Doctor availability
- Service availability
- Reported resource availability
- Distance when location data is available

Example:

### Patient Requirement

> Orthopedic consultation

### Matching Results

**City Care Hospital**

- Orthopedics: Available
- Doctor: Available
- Consultation: Available
- Distance: 3.2 km

**Metro Hospital**

- Orthopedics: Available
- Doctor: Not currently available
- Distance: 5.8 km

The system must clearly show why a hospital matched.

---

# 6. Feature 3 — Doctor & Department Availability

Each hospital should have basic resource information.

### Department

Example:

```text
Orthopedics
Cardiology
General Medicine
Neurology
Radiology
```

### Doctor

Each doctor should have:

- Name
- Department
- Specialization
- Availability status

Example:

```text
Dr. Rahul Sharma
Orthopedics
Available Today
```

For the hackathon, this information can be **synthetic/demo data**.

The application must clearly indicate that demo data is simulated if real hospital data is not connected.

---

# 7. Feature 4 — Medicine Inventory Dashboard

Hospital admins should have a simple inventory dashboard.

Each medicine record should contain:

- Medicine name
- Current stock
- Daily average consumption
- Minimum safe stock
- Status
- Last updated

Example:

| Medicine    | Stock | Daily Usage | Status   |
| ----------- | ----: | ----------: | -------- |
| Paracetamol |  1200 |         100 | Healthy  |
| Amoxicillin |   120 |          40 | Low      |
| Insulin     |    18 |           6 | Critical |

Status should be calculated using deterministic application logic.

The UI should make critical medicines immediately visible.

---

# 8. Feature 5 — AI Stockout Prediction

This is one of the main AI features of the project.

The system should analyze:

- Current stock
- Historical/daily consumption
- Minimum safe stock
- Recent demand trend

It should estimate when the medicine may reach a critical level.

Example:

```text
Current Stock: 18
Average Daily Consumption: 6

Estimated critical point:
~3 days
```

The dashboard should show:

> ⚠️ Insulin may reach critical stock in approximately 3 days.

The system should also explain the reason using the available data.

### Important

Do NOT make fake AI predictions simply for visual effect.

Use actual inventory values and consumption data from Supabase.

For basic mathematical calculations, use application code.

Gemini can be used for:

- Explaining the insight
- Summarizing trends
- Generating a human-readable recommendation

---

# 9. Feature 6 — Excess-to-Shortage Redistribution Opportunity

This is the second major supply-chain USP.

The system should compare medicine inventory between connected hospitals.

Example:

### Hospital A

```text
Insulin
Stock: 18
Predicted shortage: 3 days
```

### Hospital B

```text
Insulin
Stock: 500
Consumption: Low
```

The platform should identify:

> **Potential redistribution opportunity**

Example:

```text
Hospital A → Shortage Risk
Hospital B → Excess Inventory

Potential action:
Consider transferring part of available stock
from Hospital B to Hospital A.
```

The system should NOT automatically transfer medicines.

It should only provide a **recommendation for human review**.

---

# 10. Patient Application Flow

The patient flow should be extremely simple.

```text
Open Platform
      ↓
Enter Healthcare Requirement
      ↓
AI Understands Requirement
      ↓
Search Connected Hospitals
      ↓
Show Matching Hospitals
      ↓
Compare Availability
      ↓
Select Hospital
```

The user should not need to navigate through multiple complicated screens.

---

# 11. Hospital Admin Flow

```text
Hospital Admin Login
        ↓
Dashboard
        ↓
View Hospital Resources
        ↓
Update Medicine Inventory
        ↓
View AI Insights
        ↓
Stockout Alerts
        ↓
Redistribution Opportunities
```

---

# 12. Dashboard Requirements

## Patient Dashboard

Show:

- Healthcare search box
- Search examples
- Matching hospitals
- Department availability
- Doctor availability
- Distance
- Last updated time

Keep it simple.

---

## Hospital Dashboard

Show:

### Overview

- Total medicines
- Low-stock medicines
- Critical medicines
- Predicted stockouts

### Inventory

Medicine table with:

- Medicine
- Stock
- Daily usage
- Status
- Predicted shortage

### AI Insights

Cards such as:

```text
⚠️ Stockout Risk

Insulin may reach critical stock
within approximately 3 days.
```

```text
🔄 Redistribution Opportunity

Hospital B has excess inventory
of Insulin while your hospital
has a shortage risk.
```

---

# 13. AI Responsibilities

Gemini should be used only where AI genuinely adds value.

## Gemini SHOULD handle

### 1. Requirement Understanding

Convert:

> "Mujhe aaj orthopedic doctor chahiye"

into structured requirements.

### 2. Matching Explanation

Explain why certain hospitals match the requirement.

### 3. Supply-chain Insight Explanation

Explain inventory trends and recommendations.

### 4. Natural-language Summary

Convert structured analytical results into understandable language.

---

# 14. AI MUST NOT

Gemini must NOT:

- Diagnose diseases.
- Invent doctors.
- Invent hospital availability.
- Invent medicine stock.
- Invent beds/resources.
- Claim real-time information without database evidence.
- Automatically make medical decisions.
- Automatically transfer medicine.
- Generate fake hospital data during normal operation.

### Source of Truth Rule

**Supabase = factual healthcare data**

**Application logic = calculations**

**Gemini = interpretation, explanation and AI analysis**

---

# 15. Data Model

The MVP should use a simple relational PostgreSQL database in Supabase.

Required core tables:

### hospitals

```text
id
name
type
city
state
latitude
longitude
created_at
```

### departments

```text
id
hospital_id
name
available
```

### doctors

```text
id
hospital_id
department_id
name
specialization
available
```

### medicines

```text
id
name
unit
```

### hospital_inventory

```text
id
hospital_id
medicine_id
current_stock
daily_consumption
minimum_stock
last_updated
```

### users

Use Supabase Auth.

Store the user's role:

```text
patient
hospital_admin
```

Do not create unnecessary tables unless required by the implementation.

---

# 16. Authentication

Use:

**Supabase Auth**

Two roles:

### Patient

Can:

- Search
- View hospitals
- View availability

### Hospital Admin

Can:

- View own hospital dashboard
- Update own hospital inventory
- View AI insights

Use Supabase Row Level Security.

Hospital admins must NOT be able to modify another hospital's inventory.

---

# 17. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## UI

- Google Stitch
- shadcn/ui where useful

## Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Edge Functions

## AI

- Gemini API

## Maps

Only if required for hospital distance/location:

- Google Maps
- Google Routes API

## Deployment

- Vercel

## Version Control

- GitHub

---

# 18. Application Architecture

```text
                    PATIENT
                       │
                       ▼
                ┌─────────────┐
                │  Next.js UI │
                └──────┬──────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        ┌──────────┐       ┌──────────┐
        │ Supabase │       │  Gemini  │
        │ Database │       │   API    │
        └────┬─────┘       └──────────┘
             │
             ▼
      Hospital Data
      Doctor Data
      Medicine Data
      Inventory Data
```

Gemini API calls should be made through a secure server-side/Edge Function layer.

Never expose the Gemini API key in browser-side code.

---

# 19. UI Language

The platform should initially support:

**English + Hindi**

Provide a visible language switch:

```text
English | हिंदी
```

The UI should use simple language suitable for Indian users.

Do not translate technical backend/database terms.

---

# 20. Indian Context

The UI should feel designed for India.

Use:

- Indian names in demo data
- Indian cities
- Indian hospitals
- Indian phone number format
- Indian date conventions
- English/Hindi language switch

Example demo hospitals:

```text
Bhopal City Hospital
Indore Care Hospital
Bhopal Medical Centre
Ujjain Health Network
```

These are demo/synthetic entities unless real hospital data is explicitly integrated.

Do NOT imply that these demo hospitals are providing live availability.

---

# 21. Demo Data

Because this is a hackathon MVP, synthetic hospital data is acceptable.

Create a small realistic dataset.

Example:

### 5 hospitals

### 5–7 departments

### 10–15 doctors

### 10–15 medicines

### Inventory records for every hospital

The demo should contain enough variation to demonstrate:

- Healthy stock
- Low stock
- Critical stock
- Predicted shortage
- Excess inventory
- Redistribution opportunity

---

# 22. Last Updated Information

Every availability/resource result should show:

```text
Last updated: 10 min ago
```

or:

```text
Last updated: 02 Oct 2026, 10:30 AM
```

Do NOT display information as "live" unless it is actually coming from a live integration.

For hackathon demo data, clearly indicate:

> Demo data

or

> Simulated hospital network

---

# 23. Emergency Mode

A lightweight emergency option may be included only as a **simple entry point**.

Example:

```text
🚨 Emergency Care
```

It can show hospitals marked as supporting emergency care.

It should NOT attempt to:

- Diagnose the patient
- Replace emergency services
- Automatically dispatch ambulances
- Provide medical treatment instructions

Keep emergency functionality minimal in the MVP.

---

# 24. What NOT to Build

This is extremely important.

Do NOT build these features in the MVP:

- ❌ Telemedicine
- ❌ Video consultation
- ❌ Medical diagnosis
- ❌ Electronic health records
- ❌ Insurance system
- ❌ Payment gateway
- ❌ Pharmacy delivery
- ❌ Ambulance tracking
- ❌ Blood-bank network
- ❌ Vaccine cold-chain IoT
- ❌ Supplier marketplace
- ❌ Government API integrations
- ❌ Patient medical-history system
- ❌ Chatbot
- ❌ Voice assistant
- ❌ RAG
- ❌ Vector database
- ❌ LangChain
- ❌ LangGraph
- ❌ Multi-agent architecture
- ❌ Microservices
- ❌ Separate backend server unless technically necessary
- ❌ Multiple AI providers
- ❌ Complex ML training pipeline

These can be considered future extensions.

---

# 25. Code Simplicity Rules

The project must remain easy to understand, modify and deploy.

### Rules

1. Prefer simple components.
2. Avoid unnecessary abstractions.
3. Avoid unnecessary dependencies.
4. Avoid duplicate libraries.
5. Do not create files that are not required.
6. Reuse components where appropriate.
7. Keep database queries simple.
8. Keep API routes minimal.
9. Use environment variables for secrets.
10. Do not hardcode API keys.
11. Do not create a complex backend architecture.
12. Keep the application deployable on Vercel.
13. Keep Supabase as the main backend.
14. Use deterministic code for simple calculations.
15. Use Gemini only when AI adds meaningful value.

### Golden Rule

> **Build the smallest system that convincingly demonstrates the USP.**

---

# 26. Hackathon Demo Scenario

The final demo should tell one clear story.

## Step 1 — Patient

Enter:

> "I need an orthopedic consultation today."

## Step 2 — AI

AI identifies:

```text
Department: Orthopedics
Service: Consultation
Urgency: Normal
```

## Step 3 — Matching

Platform displays hospitals with matching resources.

Example:

```text
Bhopal City Hospital
✓ Orthopedics
✓ Doctor Available
✓ Consultation Available
3.2 km
```

## Step 4 — Hospital Dashboard

Switch to hospital admin.

Show:

```text
Medicine Inventory
```

## Step 5 — AI Stockout

Show:

```text
⚠️ Insulin

Current stock: 18
Daily consumption: 6

Potential critical stock:
~3 days
```

## Step 6 — Network Insight

Show another hospital:

```text
Hospital B

Insulin stock: 500
Consumption: Low
```

Then:

```text
🔄 Potential Redistribution Opportunity

Hospital B has excess inventory
while Hospital A has a predicted
shortage.
```

This demonstrates the complete USP.

---

# 27. Success Criteria

The MVP is considered complete when the following works:

### Patient

- [ ] Patient can search healthcare requirement.
- [ ] AI converts requirement into structured intent.
- [ ] Hospitals are retrieved from Supabase.
- [ ] Matching resources are displayed.
- [ ] Doctor/department availability is visible.
- [ ] Last updated timestamp is shown.

### Hospital

- [ ] Hospital admin can log in.
- [ ] Admin can view inventory.
- [ ] Admin can update inventory.
- [ ] Stock status is calculated.
- [ ] Stockout risk is calculated.
- [ ] AI explains the risk.
- [ ] Cross-hospital excess/shortage opportunity is displayed.

### Technical

- [ ] Supabase connected.
- [ ] Gemini securely connected.
- [ ] No API keys exposed in frontend.
- [ ] RLS configured.
- [ ] Application builds successfully.
- [ ] Application deploys successfully to Vercel.

---

# 28. Final Product Principle

The project should NOT try to become a complete healthcare super-app.

The hackathon MVP should demonstrate one powerful idea:

> **Patients can find healthcare resources through a connected hospital network, while hospitals can use AI to anticipate medicine shortages and identify opportunities to better utilize existing inventory across the network.**

Everything that does not directly strengthen this idea should be postponed.

---

# 29. Future Scope — NOT MVP

After the hackathon, the platform can eventually expand into:

- Real hospital integrations
- Real-time hospital APIs
- Blood-bank coordination
- Ambulance coordination
- Cold-chain monitoring
- Supplier reliability analysis
- Government/public-health integrations
- Advanced demand forecasting
- Route optimization
- District-level healthcare resource planning

These features should NOT be implemented during the initial MVP unless there is significant extra time.

---

# 30. Build Priority

Implementation order must be:

```text
1. UI / UX
       ↓
2. Supabase Database
       ↓
3. Authentication
       ↓
4. Hospital + Resource Data
       ↓
5. Patient Search
       ↓
6. Hospital Matching
       ↓
7. Inventory Dashboard
       ↓
8. Stockout Calculation
       ↓
9. Cross-Hospital Redistribution Logic
       ↓
10. Gemini Integration
       ↓
11. Final Polish
       ↓
12. Testing
       ↓
13. Vercel Deployment
```

Do not start advanced AI features before the core database and workflows work.

---

# FINAL MVP DEFINITION

### Patient Side

**Search → Understand → Match → Discover**

### Hospital Side

**Inventory → Analyze → Predict → Redistribute**

### Technology

**Next.js + Supabase + Gemini + Google Maps + Vercel**

### Core USP

> **AI-powered healthcare resource matching combined with predictive hospital supply-chain intelligence.**

### MVP Rule

> **Fewer features. Better execution. Clear USP. Working demo. Easy deployment.**
