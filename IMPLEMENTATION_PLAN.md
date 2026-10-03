# IMPLEMENTATION PLAN

## Healthcare Resource & Supply Chain Resilience Platform

**Created:** 2026-10-03
**Status:** Awaiting Approval

---

# 1. Project Understanding

## What the Product Does

A healthcare platform that connects patients with hospitals and helps hospitals manage medicine supply chains using AI.

## Two Core Workflows

1. **Patient → Hospital Matching:** A patient describes their healthcare need in natural language → Gemini interprets the requirement → the system queries Supabase for matching hospitals → results are displayed with availability information.

2. **Hospital → Supply Chain Intelligence:** A hospital admin views medicine inventory → deterministic code calculates stock risk status → Gemini provides human-readable explanations → the system identifies cross-hospital redistribution opportunities.

## Who Uses It

| Role | Purpose |
|------|---------|
| **Patient** | Search for healthcare resources across connected hospitals |
| **Hospital Admin** | Manage inventory, view AI stockout predictions, review redistribution opportunities |

## USP

> Patients find the right healthcare resource through a connected hospital network. Hospitals use AI to predict medicine shortages and identify redistribution opportunities.

## What the MVP Contains (6 Features)

1. Smart Healthcare Search (Gemini-powered natural language understanding)
2. Hospital Resource Matching (department, doctor, service availability)
3. Doctor & Department Availability display
4. Medicine Inventory Dashboard (for hospital admins)
5. AI Stockout Prediction (deterministic calculation + Gemini explanation)
6. Excess-to-Shortage Redistribution Opportunity detection

## Additional MVP Requirements

- English + Hindi language support with visible switcher
- Indian context (cities, names, formatting)
- Demo/simulated data clearly labelled
- Responsive design (desktop primary, mobile for patient experience)
- Emergency care entry point (minimal)

---

# 2. Final Technology Stack

### Frontend
| Technology | Purpose | Required |
|-----------|---------|----------|
| **Next.js** | Full-stack React framework, routing, API routes, SSR | Yes |
| **React** | UI components | Yes (included with Next.js) |
| **TypeScript** | Type safety | Yes |
| **Tailwind CSS** | Utility-first styling | Yes |

### UI
| Technology | Purpose | Required |
|-----------|---------|----------|
| **Google Stitch** | Primary UI design tool — generate screen designs | Yes |
| **shadcn/ui** | Pre-built accessible components (Button, Input, Card, Table, Badge, Dialog) | Yes (selective use) |
| **Lucide Icons** | Consistent icon library (specified in DESIGN.md) | Yes |

### Backend
| Technology | Purpose | Required |
|-----------|---------|----------|
| **Supabase** | Backend-as-a-service | Yes |
| **PostgreSQL** | Database (via Supabase) | Yes |
| **Supabase Auth** | Authentication & RLS | Yes |
| **Supabase Edge Functions** | Server-side Gemini API calls | Yes |

### AI
| Technology | Purpose | Required |
|-----------|---------|----------|
| **Gemini API** | Requirement understanding, insight explanation, trend summarization | Yes |

### Maps
| Technology | Purpose | Required |
|-----------|---------|----------|
| **Google Maps JavaScript API** | Hospital location display, distance calculation | P1 — Not required for first working version |

**Maps Decision:** The PRD mentions distance (e.g., "3.2 km away") but for the hackathon MVP we can use pre-computed demo distances stored in the database. Google Maps can be added as a P1 enhancement. This avoids an additional API dependency and billing setup for the first working demo.

### Deployment
| Technology | Purpose | Required |
|-----------|---------|----------|
| **Vercel** | Hosting & deployment | Yes |
| **GitHub** | Version control | Yes |

### What We Are NOT Adding

| Technology | Reason for Exclusion |
|-----------|---------------------|
| State management library (Redux, Zustand) | React state + context is sufficient for this MVP |
| Separate backend server (Express, Fastify) | Supabase + Next.js API routes + Edge Functions covers everything |
| LangChain / LangGraph | Direct Gemini API calls are simpler and sufficient |
| Additional CSS framework | Tailwind CSS is sufficient |
| Chart library beyond basic | Only if needed; a simple trend chart can use a lightweight library like recharts |

---

# 3. Architecture

## High-Level Architecture

```text
                       BROWSER
  
   Patient UI              Hospital Admin UI
   - Home/Landing          - Dashboard
   - Healthcare Search     - Inventory
   - Hospital Results      - AI Insights
   - Hospital Details
  
   Next.js (React + TypeScript + Tailwind CSS)

          |                         |
          v                         v
  Supabase                 Next.js API Route
  (PostgreSQL)             or Edge Function
                          
  - hospitals              Gemini API
  - departments            
  - doctors                Server-side only
  - medicines              API key protected
  - inventory
  - profiles
                          
  Auth + RLS
```

## What Runs Where

### Browser (Client-Side)
- All React UI components
- User interactions (search input, navigation, form submission)
- Supabase client calls (reading hospital data, auth state)
- Language switching (English/Hindi)
- Deterministic display calculations (formatting dates, status colors)

### Next.js Server (API Routes / Server Components)
- Gemini API calls (API key never exposed to browser)
- Complex data aggregation if needed
- Server-side rendering where beneficial

### Supabase
- PostgreSQL database (source of truth for all hospital/resource data)
- Authentication (Supabase Auth)
- Row Level Security (RLS)
- Real-time subscriptions (not needed for MVP)

### Supabase Edge Functions
- Gemini API integration (alternative to Next.js API routes)
- Keeps API key on server-side

### Where Gemini Is Called
1. **Patient search** — Gemini converts natural language to structured intent
2. **Stockout explanation** — Gemini explains deterministic calculation results in human-readable language
3. **Redistribution insight** — Gemini generates natural-language recommendation

### Where Deterministic Calculations Happen
1. **Stock status** — Application code: `if stock <= minimum_stock then Critical; if stock <= minimum_stock * 2 then Low; else Healthy`
2. **Days until critical** — Application code: `(current_stock - minimum_stock) / daily_consumption`
3. **Redistribution detection** — Application code: compare inventory across hospitals

### Critical Rule

| Layer | Responsibility |
|-------|---------------|
| **Supabase** | Source of truth for factual hospital/resource data |
| **Application Code** | Deterministic calculations (stock status, days-to-critical, matching) |
| **Gemini** | Interpretation, explanation, natural-language understanding |

**Gemini must NEVER invent availability, inventory, or hospital information.**

---

# 4. Folder Structure Plan

```text
Devfest at Sheriyans/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── page.tsx                  # Patient home/landing
│   ├── search/
│   │   └── page.tsx              # Healthcare search + results
│   ├── hospital/
│   │   └── [id]/
│   │       └── page.tsx          # Hospital detail page
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Hospital admin login
│   │   └── dashboard/
│   │       └── page.tsx          # Hospital dashboard (inventory, insights)
│   ├── api/
│   │   ├── ai/
│   │   │   ├── understand/
│   │   │   │   └── route.ts      # Gemini: parse patient requirement
│   │   │   └── insights/
│   │   │       └── route.ts      # Gemini: stockout explanation
│   │   └── hospitals/
│   │       └── match/
│   │           └── route.ts      # Hospital matching logic
│   └── globals.css               # Global styles + Tailwind
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── patient/                  # Patient-specific components
│   │   ├── SearchBox.tsx
│   │   ├── AIUnderstandingCard.tsx
│   │   ├── HospitalCard.tsx
│   │   └── DoctorCard.tsx
│   ├── admin/                    # Admin-specific components
│   │   ├── MetricCard.tsx
│   │   ├── InventoryTable.tsx
│   │   ├── StockoutInsightCard.tsx
│   │   └── RedistributionCard.tsx
│   ├── shared/                   # Shared components
│   │   ├── LanguageSwitcher.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Navigation.tsx
│   │   └── DemoBanner.tsx
│   └── layout/                   # Layout components
│       ├── PatientLayout.tsx
│       └── AdminLayout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   ├── server.ts             # Supabase server client
│   │   └── queries.ts            # Database query functions
│   ├── gemini.ts                 # Gemini API helper (server-only)
│   ├── calculations.ts           # Deterministic stock calculations
│   ├── matching.ts               # Hospital matching logic
│   └── i18n.ts                   # English/Hindi translations
├── types/
│   └── index.ts                  # TypeScript type definitions
├── public/
│   └── (static assets)
├── supabase/
│   ├── migrations/               # SQL migration files
│   └── seed.sql                  # Demo data seed
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Example env file (committed)
├── PRD.md
├── DESIGN.md
├── IMPLEMENTATION_PLAN.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Folder Purpose

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js App Router — pages, API routes, layouts |
| `components/` | All React UI components, organized by domain |
| `components/ui/` | shadcn/ui base components |
| `components/patient/` | Patient-facing components |
| `components/admin/` | Hospital admin components |
| `components/shared/` | Components used across both experiences |
| `lib/` | Utility functions, API helpers, calculations |
| `lib/supabase/` | Supabase client setup and query functions |
| `types/` | Shared TypeScript type definitions |
| `public/` | Static files |
| `supabase/` | Database migrations and seed data |

---

# 5. Database Plan

## Entity Relationship Diagram

```text
Hospital
   │
   ├──< Departments
   │       │
   │       └──< Doctors
   │
   └──< Hospital_Inventory >── Medicines

Profiles >── Hospital (for hospital_admin role)
```

## Table: `hospitals`

| Column | Data Type | Constraints | Purpose |
|--------|-----------|-------------|---------|
| `id` | `uuid` | PK, default gen_random_uuid() | Unique hospital identifier |
| `name` | `text` | NOT NULL | Hospital name |
| `type` | `text` | NOT NULL | e.g., "Multi-Specialty", "General", "Clinic" |
| `city` | `text` | NOT NULL | City name |
| `state` | `text` | NOT NULL | State name |
| `address` | `text` | | Full address |
| `phone` | `text` | | Contact phone |
| `latitude` | `decimal(10,7)` | | GPS latitude |
| `longitude` | `decimal(10,7)` | | GPS longitude |
| `has_emergency` | `boolean` | default false | Supports emergency care |
| `created_at` | `timestamptz` | default now() | Record creation time |
| `updated_at` | `timestamptz` | default now() | Last update time |

**Indexes:** `idx_hospitals_city` on `city`

---

## Table: `departments`

| Column | Data Type | Constraints | Purpose |
|--------|-----------|-------------|---------|
| `id` | `uuid` | PK | Unique department ID |
| `hospital_id` | `uuid` | FK → hospitals(id), NOT NULL | Parent hospital |
| `name` | `text` | NOT NULL | Department name (e.g., "Orthopedics") |
| `available` | `boolean` | default true | Is department currently available |
| `created_at` | `timestamptz` | default now() | |

**Indexes:** `idx_departments_hospital` on `hospital_id`

---

## Table: `doctors`

| Column | Data Type | Constraints | Purpose |
|--------|-----------|-------------|---------|
| `id` | `uuid` | PK | Unique doctor ID |
| `hospital_id` | `uuid` | FK → hospitals(id), NOT NULL | Parent hospital |
| `department_id` | `uuid` | FK → departments(id), NOT NULL | Parent department |
| `name` | `text` | NOT NULL | Doctor name |
| `specialization` | `text` | NOT NULL | e.g., "Orthopedic Surgeon" |
| `available` | `boolean` | default true | Currently available |
| `available_today` | `boolean` | default true | Available today specifically |
| `created_at` | `timestamptz` | default now() | |

**Indexes:** `idx_doctors_hospital` on `hospital_id`, `idx_doctors_department` on `department_id`

---

## Table: `medicines`

| Column | Data Type | Constraints | Purpose |
|--------|-----------|-------------|---------|
| `id` | `uuid` | PK | Unique medicine ID |
| `name` | `text` | NOT NULL, UNIQUE | Medicine name |
| `unit` | `text` | NOT NULL | Unit of measurement (e.g., "tablets", "vials", "ml") |
| `created_at` | `timestamptz` | default now() | |

---

## Table: `hospital_inventory`

| Column | Data Type | Constraints | Purpose |
|--------|-----------|-------------|---------|
| `id` | `uuid` | PK | Unique record ID |
| `hospital_id` | `uuid` | FK → hospitals(id), NOT NULL | Parent hospital |
| `medicine_id` | `uuid` | FK → medicines(id), NOT NULL | Medicine reference |
| `current_stock` | `integer` | NOT NULL, default 0 | Current available stock |
| `daily_consumption` | `integer` | NOT NULL, default 0 | Average daily usage |
| `minimum_stock` | `integer` | NOT NULL, default 0 | Minimum safe stock level |
| `last_updated` | `timestamptz` | default now() | Last inventory update |

**Unique:** `(hospital_id, medicine_id)` — one inventory record per medicine per hospital

**Indexes:** `idx_inventory_hospital` on `hospital_id`, `idx_inventory_medicine` on `medicine_id`

---

## Table: `profiles`

| Column | Data Type | Constraints | Purpose |
|--------|-----------|-------------|---------|
| `id` | `uuid` | PK, FK → auth.users(id) | Matches Supabase Auth user ID |
| `role` | `text` | NOT NULL, CHECK (role IN ('patient', 'hospital_admin')) | User role |
| `hospital_id` | `uuid` | FK → hospitals(id), NULLABLE | Associated hospital (only for hospital_admin) |
| `full_name` | `text` | | User display name |
| `created_at` | `timestamptz` | default now() | |

**Note:** `hospital_id` is NULL for patients, populated for hospital admins.

---

## Relationships Summary

```text
hospitals (1) ──< (many) departments
hospitals (1) ──< (many) doctors
departments (1) ──< (many) doctors
hospitals (1) ──< (many) hospital_inventory
medicines (1) ──< (many) hospital_inventory
auth.users (1) ── (1) profiles
hospitals (1) ──< (many) profiles (hospital_admin)
```

---

# 6. Authentication & Authorization Plan

## Authentication Flow

### Patient
- Patients do **NOT** need to log in to search for hospitals.
- Patient search is a public feature.
- Optional: Patients can sign up to save searches (P2 — future).

### Hospital Admin
1. Admin navigates to `/admin/login`
2. Enters email + password
3. Supabase Auth authenticates the user
4. On success, check `profiles` table for `role = 'hospital_admin'` and associated `hospital_id`
5. Redirect to `/admin/dashboard`
6. Dashboard loads data only for the admin's associated hospital

### User Profile / Role Storage

On user signup (done during seeding for MVP), a trigger or manual insert creates a row in `profiles`:

```text
profiles.id = auth.users.id
profiles.role = 'hospital_admin'
profiles.hospital_id = <assigned hospital UUID>
```

### RLS Strategy

#### `hospitals` table
- **SELECT:** Public (anyone can read)
- **INSERT/UPDATE/DELETE:** None via client (admin manages via dashboard, updates go through hospital_inventory)

#### `departments` table
- **SELECT:** Public
- **UPDATE:** Only hospital_admin where profiles.hospital_id = departments.hospital_id

#### `doctors` table
- **SELECT:** Public
- **UPDATE:** Only hospital_admin where profiles.hospital_id = doctors.hospital_id

#### `medicines` table
- **SELECT:** Public
- **INSERT/UPDATE:** Service role only (seeded data)

#### `hospital_inventory` table
- **SELECT:** Public (needed for redistribution logic across hospitals)
- **UPDATE:** Only hospital_admin where profiles.hospital_id = hospital_inventory.hospital_id
- **INSERT:** Only hospital_admin for their own hospital

#### `profiles` table
- **SELECT:** Users can read their own profile
- **UPDATE:** Users can update their own profile

### Key Rule

> A hospital admin can ONLY modify inventory/resources belonging to their own hospital. RLS policies enforce this at the database level.

---

# 7. Patient Flow Implementation

## Flow Diagram

```text
Patient enters natural-language requirement
        |
Next.js API route: /api/ai/understand
        |
Gemini converts to structured intent
        |
Return structured intent to client
        |
Client sends structured intent to Supabase query
        |
Database returns matching hospitals
        |
Application code ranks results
        |
Display hospital cards with match reasons
        |
Patient clicks -> Hospital detail page
```

## Step-by-Step

### 1. Input Format

Patient types free-text in a search box:

```text
"I need an orthopedic doctor today"
"Mujhe cardiologist chahiye"
"X-ray near me"
"Blood test"
"Emergency care"
```

### 2. Gemini Processing

**API Route:** `POST /api/ai/understand`

**Request to Gemini:**

```text
System: You are a healthcare requirement parser. Given a patient's
natural language request, extract structured information.
Return ONLY valid JSON.

User: "I need an orthopedic doctor today"
```

**Expected Gemini Output (JSON):**

```json
{
  "department": "Orthopedics",
  "service_type": "consultation",
  "urgency": "today",
  "keywords": ["orthopedic", "doctor"],
  "is_emergency": false
}
```

### 3. Database Query

Using the structured intent, query Supabase:

```sql
SELECT h.*, d.name as dept_name, d.available as dept_available,
       doc.name as doctor_name, doc.available as doctor_available
FROM hospitals h
JOIN departments d ON d.hospital_id = h.id
LEFT JOIN doctors doc ON doc.department_id = d.id
WHERE LOWER(d.name) = LOWER(:department)
  AND d.available = true
ORDER BY doctor_available DESC, h.name;
```

### 4. Matching Logic (Deterministic — Application Code)

For each hospital, compute a match score:

```text
score = 0
if department exists and available -> score += 3
if doctor available -> score += 2
if doctor available today -> score += 1
if has_emergency and is_emergency -> score += 3
```

Sort results by score descending.

### 5. Result Ranking

Results displayed as hospital cards, ordered by:
1. Match score (highest first)
2. Doctor availability
3. Hospital name (alphabetical tiebreaker)

### 6. Fallback if Gemini Fails

If Gemini API is unavailable:
- Fall back to keyword-based matching against department names
- Display a notice: "AI-powered search is temporarily unavailable. Showing keyword results."

---

# 8. Hospital Inventory Flow

## Flow

```text
Hospital Admin logs in
        |
Dashboard loads inventory from Supabase
        |
For each medicine:
  Application code calculates status
        |
Display inventory table with color-coded status
        |
Admin can update stock values
        |
Recalculate status on update
```

## Stock Status Calculation (Deterministic — NO Gemini)

```typescript
function calculateStatus(
  currentStock: number,
  dailyConsumption: number,
  minimumStock: number
): 'healthy' | 'low' | 'critical' {

  if (currentStock <= minimumStock) {
    return 'critical';
  }

  // Days of supply remaining
  const daysRemaining = dailyConsumption > 0
    ? currentStock / dailyConsumption
    : Infinity;

  if (daysRemaining <= 7 || currentStock <= minimumStock * 2) {
    return 'low';
  }

  return 'healthy';
}
```

## Days Until Critical Calculation

```typescript
function daysUntilCritical(
  currentStock: number,
  dailyConsumption: number,
  minimumStock: number
): number | null {

  if (dailyConsumption <= 0) return null;

  const daysRemaining = (currentStock - minimumStock) / dailyConsumption;

  return Math.max(0, Math.floor(daysRemaining));
}
```

## Status Thresholds

| Condition | Status | Color |
|-----------|--------|-------|
| `current_stock <= minimum_stock` | **Critical** | Red |
| `days_remaining <= 7` OR `current_stock <= minimum_stock * 2` | **Low** | Amber |
| Everything else | **Healthy** | Green |

## Admin Update Flow

1. Admin clicks "Update" on a medicine row
2. Modal/inline form shows current values
3. Admin updates `current_stock` and/or `daily_consumption`
4. `PUT` to Supabase `hospital_inventory` table
5. `last_updated` automatically set to now()
6. UI recalculates status

---

# 9. AI Stockout Prediction Plan

## What Application Code Calculates First

Before calling Gemini, the application computes:

```typescript
const stockAnalysis = {
  medicine_name: "Insulin",
  current_stock: 18,
  daily_consumption: 6,
  minimum_stock: 10,
  calculated_status: "critical",         // deterministic
  days_until_critical: 1,                // (18 - 10) / 6 = 1.3 -> 1 day
  days_until_stockout: 3,                // 18 / 6 = 3 days
  consumption_vs_stock_ratio: 0.33,      // 6 / 18
};
```

## What Gemini Receives

Only pre-calculated data — Gemini does NOT do arithmetic:

```json
{
  "medicine": "Insulin",
  "current_stock": 18,
  "unit": "vials",
  "daily_consumption": 6,
  "minimum_stock": 10,
  "status": "critical",
  "days_until_critical": 1,
  "days_until_stockout": 3
}
```

## What Gemini Does

**Prompt:**

```text
System: You are a healthcare supply chain analyst.
Given the following medicine inventory data, generate a brief,
clear insight for a hospital administrator.
Do NOT invent data. Use only the provided numbers.
Keep the response under 3 sentences.

Data: {stockAnalysis JSON}
```

**Expected Gemini Output:**

> Insulin is at critical stock levels with only 18 vials remaining. At the current consumption rate of 6 vials per day, the inventory may be completely depleted in approximately 3 days. Immediate restocking is recommended.

## Result Displayed

```text
Warning: Stockout Risk — Insulin

Current stock: 18 vials
Daily consumption: 6 vials/day
Estimated stockout: ~3 days

AI Insight:
Insulin is at critical stock levels. At the current consumption rate,
inventory may be depleted in approximately 3 days.
```

---

# 10. Redistribution Logic

## Detection Algorithm (Deterministic — Application Code)

```typescript
interface RedistributionOpportunity {
  medicine: string;
  shortage_hospital: Hospital;
  shortage_stock: number;
  shortage_days_remaining: number;
  excess_hospital: Hospital;
  excess_stock: number;
  excess_daily_consumption: number;
}

function findRedistributions(
  allInventory: HospitalInventory[]
): RedistributionOpportunity[] {
  const opportunities = [];

  // Group inventory by medicine
  const byMedicine = groupBy(allInventory, 'medicine_id');

  for (const [medicineId, inventories] of byMedicine) {
    const shortageHospitals = inventories.filter(
      i => calculateStatus(i) === 'critical' || calculateStatus(i) === 'low'
    );

    const excessHospitals = inventories.filter(
      i => calculateStatus(i) === 'healthy'
        && i.current_stock > i.minimum_stock * 3  // substantial excess
    );

    // Match shortage to excess
    for (const shortage of shortageHospitals) {
      for (const excess of excessHospitals) {
        opportunities.push({
          medicine: shortage.medicine_name,
          shortage_hospital: shortage.hospital,
          shortage_stock: shortage.current_stock,
          shortage_days_remaining: daysUntilCritical(shortage),
          excess_hospital: excess.hospital,
          excess_stock: excess.current_stock,
          excess_daily_consumption: excess.daily_consumption,
        });
      }
    }
  }

  return opportunities;
}
```

## Logic Summary

| Condition | Classification |
|-----------|---------------|
| `status = critical` OR `status = low` | **Shortage risk** |
| `status = healthy` AND `stock > minimum_stock * 3` | **Excess inventory** |

## What the System Displays

```text
Redistribution Opportunity

Insulin
- Bhopal City Hospital -> 18 vials (Critical, ~3 days)
- Indore Care Hospital -> 500 vials (Healthy, excess)

Recommendation:
Consider transferring part of available stock
from Indore Care Hospital to Bhopal City Hospital.

[Review Opportunity]
```

## Critical Rules

- System **recommends only** — no automatic transfer
- Action button says "Review Opportunity", NOT "Transfer Now"
- Gemini can optionally generate a natural-language explanation
- All data comes from Supabase

---

# 11. Stitch to Next.js Implementation Plan

## Workflow

```text
DESIGN.md (requirements + Stitch Master Prompt)
   |
Google Stitch (generate UI designs)
   |
Review and approve designs
   |
Implement in Next.js using React + TypeScript + Tailwind CSS
   |
Connect to Supabase for real data
   |
Integrate Gemini via API routes
```

## Screens to Implement

### Patient Screens

| # | Screen | Route | Key Components |
|---|--------|-------|----------------|
| 1 | Patient Home / Landing | `/` | Hero, SearchBox, example queries, emergency CTA |
| 2 | Healthcare Search | `/search` | SearchBox, AIUnderstandingCard, HospitalCard list |
| 3 | Hospital Results | `/search` (same page, results section) | HospitalCard list with match reasons |
| 4 | Hospital Details | `/hospital/[id]` | Hospital header, departments, doctor cards |
| 5 | Mobile Patient Search | Responsive version of #2 | Same components, mobile layout |

### Hospital Admin Screens

| # | Screen | Route | Key Components |
|---|--------|-------|----------------|
| 6 | Hospital Login | `/admin/login` | Email/password form |
| 7 | Hospital Dashboard | `/admin/dashboard` | MetricCards, overview stats |
| 8 | Medicine Inventory | `/admin/dashboard` (tab/section) | InventoryTable, StatusBadge |
| 9 | AI Supply Chain Insights | `/admin/dashboard` (tab/section) | StockoutInsightCard, AI explanation |
| 10 | Redistribution Opportunity | `/admin/dashboard` (tab/section) | RedistributionCard |

### Implementation Approach

The admin dashboard will use tabs or sections within a single page rather than separate pages, keeping navigation simple:

```text
/admin/dashboard
  ├── Overview tab (MetricCards)
  ├── Inventory tab (InventoryTable)
  └── AI Insights tab (StockoutInsightCard + RedistributionCard)
```

### Design Fidelity

- Stitch designs will be implemented faithfully — no unnecessary redesign
- Design tokens from DESIGN.md will be used in `tailwind.config.ts`
- Component structure will match Stitch output

---

# 12. API Plan

## API 1: Gemini API

| Property | Value |
|----------|-------|
| **Why needed** | Natural-language understanding, AI explanations, trend summarization |
| **Where called** | Next.js API routes (`/api/ai/understand`, `/api/ai/insights`) — server-side ONLY |
| **API key stored** | `GEMINI_API_KEY` in `.env.local` — NEVER in browser code |
| **Required for first version** | Yes (core USP depends on AI understanding) |

### Gemini API Endpoints Used

| Use Case | Gemini Role |
|----------|-------------|
| Patient search -> structured intent | Convert natural language to JSON |
| Stockout prediction explanation | Summarize pre-calculated data |
| Redistribution explanation | Generate human-readable recommendation |

---

## API 2: Google Maps JavaScript API

| Property | Value |
|----------|-------|
| **Why needed** | Display hospital locations, calculate distances |
| **Where called** | Client-side map component (if implemented) |
| **API key stored** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` (restricted by HTTP referrer) |
| **Required for first version** | No — P1 enhancement |

### MVP Alternative

For the first working version, hospital distance will be pre-computed in demo data or calculated using the Haversine formula from stored lat/lng coordinates. This avoids Maps API billing and setup complexity.

---

## API 3: Supabase

| Property | Value |
|----------|-------|
| **Why needed** | Database, authentication, RLS |
| **Where called** | Client-side (reads) and server-side (writes, auth) |
| **API key stored** | `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` |
| **Required for first version** | Yes |

---

# 13. Environment Variables

```text
# --- Supabase (Safe for browser — protected by RLS) ---
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# --- Supabase Service Role (SERVER-SIDE ONLY — never expose) ---
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# --- Gemini (SERVER-SIDE ONLY — never expose) ---
GEMINI_API_KEY=AIza...

# --- Google Maps (P1 — Optional for MVP) ---
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

### Security Classification

| Variable | Safe for Browser | Reason |
|----------|:---:|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public project URL, protected by RLS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Limited permissions, RLS enforced |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Bypasses RLS — server-only |
| `GEMINI_API_KEY` | No | Billing exposure risk — server-only |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Restricted by HTTP referrer (if used) |

---

# 14. Demo Data Plan

## Hospitals (5)

| Name | City | Type | Emergency |
|------|------|------|:---------:|
| Bhopal City Hospital | Bhopal | Multi-Specialty | Yes |
| Indore Care Hospital | Indore | Multi-Specialty | Yes |
| Bhopal Medical Centre | Bhopal | General Hospital | No |
| Ujjain Health Network | Ujjain | General Hospital | No |
| Jabalpur Specialty Clinic | Jabalpur | Specialty Clinic | No |

## Departments (7)

| Department |
|-----------|
| Orthopedics |
| Cardiology |
| General Medicine |
| Neurology |
| Radiology |
| Pediatrics |
| Emergency Medicine |

Each hospital gets 4-6 departments (not all hospitals have all departments).

## Doctors (12)

| Name | Department | Hospital |
|------|-----------|----------|
| Dr. Rahul Sharma | Orthopedics | Bhopal City Hospital |
| Dr. Priya Verma | Cardiology | Bhopal City Hospital |
| Dr. Amit Patel | General Medicine | Bhopal City Hospital |
| Dr. Sneha Gupta | Neurology | Indore Care Hospital |
| Dr. Vikram Singh | Orthopedics | Indore Care Hospital |
| Dr. Anjali Tiwari | Cardiology | Indore Care Hospital |
| Dr. Rajesh Kumar | General Medicine | Bhopal Medical Centre |
| Dr. Meera Joshi | Pediatrics | Bhopal Medical Centre |
| Dr. Suresh Yadav | Radiology | Ujjain Health Network |
| Dr. Kavita Sharma | General Medicine | Ujjain Health Network |
| Dr. Deepak Verma | Orthopedics | Jabalpur Specialty Clinic |
| Dr. Nisha Agrawal | Neurology | Jabalpur Specialty Clinic |

## Medicines (12)

| Medicine | Unit |
|----------|------|
| Paracetamol | tablets |
| Amoxicillin | capsules |
| Insulin | vials |
| Metformin | tablets |
| Omeprazole | capsules |
| Ibuprofen | tablets |
| Cetirizine | tablets |
| Azithromycin | tablets |
| Diclofenac | tablets |
| Amlodipine | tablets |
| Ceftriaxone | vials |
| Atorvastatin | tablets |

## Inventory Distribution (demonstrating all scenarios)

### Bhopal City Hospital — SHORTAGE SCENARIOS

| Medicine | Stock | Daily | Min | Status | Scenario |
|----------|------:|------:|----:|--------|----------|
| Insulin | 18 | 6 | 10 | **Critical** | Predicted stockout ~3 days |
| Amoxicillin | 120 | 40 | 100 | **Low** | Low stock warning |
| Paracetamol | 1200 | 100 | 200 | Healthy | Normal |
| Ceftriaxone | 5 | 3 | 10 | **Critical** | Below minimum |

### Indore Care Hospital — EXCESS SCENARIOS

| Medicine | Stock | Daily | Min | Status | Scenario |
|----------|------:|------:|----:|--------|----------|
| Insulin | 500 | 4 | 20 | Healthy | **Excess** — redistribution source |
| Amoxicillin | 800 | 30 | 50 | Healthy | Excess |
| Paracetamol | 2000 | 150 | 200 | Healthy | Normal |
| Ceftriaxone | 300 | 5 | 15 | Healthy | **Excess** — redistribution source |

### Other Hospitals — MIXED SCENARIOS

Ujjain, Bhopal Medical Centre, and Jabalpur will have a mix of healthy, low, and some critical stock to create variety.

## Key Demo Scenarios Demonstrated

| Scenario | Example |
|----------|---------|
| Healthy stock | Paracetamol at most hospitals |
| Low stock | Amoxicillin at Bhopal City |
| Critical stock | Insulin at Bhopal City (18 vials) |
| Predicted shortage | Insulin ~3 days, Ceftriaxone ~1 day |
| Excess inventory | Insulin at Indore (500 vials) |
| Redistribution opportunity | Insulin: Bhopal City <-> Indore Care |

## Demo Label

All screens will display:

> **Demo Network — Simulated Hospital Data**

---

# 15. Implementation Phases

## Phase 1 — Project Setup

**Goal:** Initialize Next.js project with core dependencies

**Tasks:**
- Initialize Next.js with TypeScript + Tailwind CSS + App Router
- Install shadcn/ui
- Install Supabase client library (`@supabase/supabase-js`)
- Install Lucide icons (`lucide-react`)
- Create `.env.local` and `.env.example`
- Set up `tailwind.config.ts` with design tokens from DESIGN.md
- Set up folder structure

**Files:** `package.json`, `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`, `.env.example`, `app/layout.tsx`, `app/globals.css`

**Dependencies:** None

**Completion:** Project runs with `npm run dev`, shows blank page

---

## Phase 2 — Stitch UI Implementation

**Goal:** Generate and implement UI designs using Google Stitch

**Tasks:**
- Use Stitch Master Prompt from DESIGN.md to generate all 10 screens
- Review generated designs
- Implement static UI components in Next.js (no data connection yet)
- Set up design tokens (colors, typography)
- Implement language switcher (English/Hindi translations)
- Create all shared components (Navigation, StatusBadge, DemoBanner)
- Create all patient components (SearchBox, HospitalCard, DoctorCard, AIUnderstandingCard)
- Create all admin components (MetricCard, InventoryTable, StockoutInsightCard, RedistributionCard)

**Files:** All files in `components/`, `lib/i18n.ts`, `app/globals.css`, layout files

**Dependencies:** Phase 1

**Completion:** All screens render with hardcoded/placeholder data, correct visual design

---

## Phase 3 — Supabase Setup

**Goal:** Create Supabase project and connect

**Tasks:**
- Create Supabase project
- Get project URL and keys
- Configure `.env.local`
- Create Supabase client helpers (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- Verify connection

**Files:** `lib/supabase/client.ts`, `lib/supabase/server.ts`, `.env.local`

**Dependencies:** Phase 1

**Completion:** Supabase client connects, basic query works

---

## Phase 4 — Database + Seed Data

**Goal:** Create schema and populate demo data

**Tasks:**
- Write SQL migration for all tables
- Write RLS policies
- Create `seed.sql` with all demo data (5 hospitals, 7 departments, 12 doctors, 12 medicines, inventory records)
- Run migration in Supabase
- Verify data

**Files:** `supabase/migrations/001_initial_schema.sql`, `supabase/seed.sql`

**Dependencies:** Phase 3

**Completion:** All tables exist, demo data queryable, RLS active

---

## Phase 5 — Authentication

**Goal:** Implement hospital admin login/logout

**Tasks:**
- Create demo admin users in Supabase Auth
- Create `profiles` records linking admins to hospitals
- Implement login page (`/admin/login`)
- Implement auth middleware/guard for admin routes
- Implement logout
- Test RLS with authenticated user

**Files:** `app/admin/login/page.tsx`, auth middleware, `lib/supabase/server.ts` updates

**Dependencies:** Phase 4

**Completion:** Admin can log in, sees own hospital name, cannot access other hospitals

---

## Phase 6 — Patient Search + Matching

**Goal:** Implement the patient search to hospital matching flow

**Tasks:**
- Create Gemini API route (`/api/ai/understand`)
- Implement prompt for natural-language parsing
- Create hospital matching query (`lib/matching.ts`)
- Create matching API route (`/api/hospitals/match`)
- Connect SearchBox to API
- Display AIUnderstandingCard with parsed intent
- Display HospitalCard list with match results
- Implement keyword fallback if Gemini fails

**Files:** `app/api/ai/understand/route.ts`, `app/api/hospitals/match/route.ts`, `lib/gemini.ts`, `lib/matching.ts`, `lib/supabase/queries.ts`, `app/search/page.tsx`

**Dependencies:** Phase 4

**Completion:** Patient types requirement -> AI parses -> matching hospitals displayed

---

## Phase 7 — Hospital Inventory

**Goal:** Implement the inventory dashboard for hospital admins

**Tasks:**
- Create query functions for hospital inventory
- Connect InventoryTable to Supabase data
- Implement deterministic status calculation (`lib/calculations.ts`)
- Display color-coded status badges
- Implement inventory update (admin can edit stock values)
- Display MetricCards (total medicines, low stock count, critical count)

**Files:** `app/admin/dashboard/page.tsx`, `lib/calculations.ts`, `lib/supabase/queries.ts`, component updates

**Dependencies:** Phase 5

**Completion:** Admin sees real inventory data, status calculated, can update stock

---

## Phase 8 — Stockout Prediction

**Goal:** Implement AI-powered stockout predictions

**Tasks:**
- Calculate `days_until_critical` and `days_until_stockout` in application code
- Create Gemini insight API route (`/api/ai/insights`)
- Implement prompt for stockout explanation
- Display StockoutInsightCard with calculated data + AI explanation

**Files:** `app/api/ai/insights/route.ts`, `lib/calculations.ts` updates, `lib/gemini.ts` updates

**Dependencies:** Phase 7

**Completion:** Dashboard shows stockout predictions with AI explanations

---

## Phase 9 — Redistribution Logic

**Goal:** Implement cross-hospital redistribution detection

**Tasks:**
- Implement redistribution detection algorithm (`lib/calculations.ts`)
- Query all hospital inventories for comparison
- Identify shortage to excess pairs
- Display RedistributionCard with opportunity details
- Optionally use Gemini for explanation text

**Files:** `lib/calculations.ts`, `lib/supabase/queries.ts`, RedistributionCard component

**Dependencies:** Phase 8

**Completion:** Dashboard shows redistribution opportunities with correct data

---

## Phase 10 — Gemini Integration Polish

**Goal:** Finalize all Gemini integrations

**Tasks:**
- Refine prompts for better output quality
- Add error handling for Gemini failures
- Implement fallback messages
- Test with various patient queries (English, Hindi, mixed)
- Verify Gemini never invents data
- Rate limit Gemini calls if needed

**Files:** `lib/gemini.ts`, API route handlers

**Dependencies:** Phase 6, 8, 9

**Completion:** All AI features work reliably with proper error handling

---

## Phase 11 — Final UI Polish

**Goal:** Match final UI to Stitch designs, responsive polish

**Tasks:**
- Review every screen against Stitch designs
- Fix responsive issues (mobile patient search, mobile inventory cards)
- Add loading states (skeleton loaders)
- Add empty states
- Add error states (human-readable messages)
- Verify Hindi translations
- Add Demo Network banner
- Add Last Updated timestamps
- Subtle animations (card hover, page transitions)

**Files:** Various component files

**Dependencies:** Phase 10

**Completion:** UI matches Stitch designs, responsive on all breakpoints

---

## Phase 12 — Testing

**Goal:** Verify all features work end-to-end

**Tasks:**
- Test patient search flow (multiple queries)
- Test hospital admin login/logout
- Test inventory view and update
- Test stockout predictions
- Test redistribution opportunities
- Test language switching
- Test mobile responsiveness
- Test error states (disable Gemini, test fallback)
- Test RLS (admin cannot access other hospital data)
- Run through hackathon demo script

**Files:** No new files

**Dependencies:** Phase 11

**Completion:** All success criteria from PRD section 27 pass

---

## Phase 13 — Vercel Deployment

**Goal:** Deploy to production

**Tasks:**
- Push to GitHub
- Connect GitHub repo to Vercel
- Configure environment variables in Vercel
- Deploy
- Verify production build
- Test all features on production URL
- Final demo run-through

**Files:** `vercel.json` (if needed)

**Dependencies:** Phase 12

**Completion:** Application live on Vercel, all features working

---

# 16. MVP Priority

## P0 — MUST HAVE (Required for hackathon demo)

| Feature | PRD Reference |
|---------|---------------|
| Patient natural-language healthcare search | Feature 1 |
| AI-powered requirement understanding (Gemini) | Feature 1 |
| Hospital resource matching | Feature 2 |
| Doctor & department availability display | Feature 3 |
| Medicine inventory dashboard | Feature 4 |
| Deterministic stock status calculation | Feature 4 |
| AI stockout prediction | Feature 5 |
| Cross-hospital redistribution opportunity | Feature 6 |
| Hospital admin login (Supabase Auth) | Section 16 |
| RLS (admin can only modify own hospital) | Section 16 |
| Demo data (5 hospitals, realistic inventory) | Section 21 |
| Demo Network label | Section 22 |
| Responsive design (desktop + mobile) | DESIGN Section 9 |
| English + Hindi language support | PRD Section 19, DESIGN Section 7 |

## P1 — SHOULD HAVE (Add if time permits)

| Feature | Notes |
|---------|-------|
| Google Maps hospital location display | Pre-computed distances work for demo |
| Emergency care filter | Simple filter on `has_emergency` flag |
| Consumption trend charts | Simple line chart (recharts) |
| Inventory update by admin | Read-only dashboard still demonstrates USP |
| Patient registration | Search works without login |

## P2 — FUTURE (Do not implement)

| Feature |
|---------|
| Real hospital API integrations |
| Real-time data updates |
| Blood bank coordination |
| Ambulance coordination |
| Cold-chain monitoring |
| Advanced demand forecasting |
| Route optimization |
| District-level planning |
| Social login / OTP |
| Multi-step onboarding |

---

# 17. What We Will NOT Build

Confirmed exclusions for this MVP:

| Category | Exclusion |
|----------|-----------|
| **Clinical** | Telemedicine, Video consultation, Medical diagnosis, EHR, Patient medical history |
| **Financial** | Insurance system, Payment gateway |
| **Logistics** | Pharmacy delivery, Ambulance tracking, Blood bank network, Vaccine cold-chain IoT, Supplier marketplace |
| **Government** | Government API integrations, Government branding |
| **AI Over-engineering** | Chatbot, Voice assistant, RAG, Vector database, LangChain, LangGraph, Multi-agent system, Multiple AI providers, Complex ML training pipeline |
| **Architecture** | Microservices, Separate backend server, Complex analytics |

---

# 18. Code Simplicity Strategy

## Guiding Principle

> **Build the smallest system that convincingly demonstrates the USP.**

## Rules

| Rule | How We Enforce It |
|------|-------------------|
| Minimum dependencies | Only: Next.js, Supabase client, Tailwind, shadcn/ui, Lucide icons, @google/generative-ai |
| Minimum API routes | Only 3 API routes: `/api/ai/understand`, `/api/ai/insights`, `/api/hospitals/match` |
| Simple components | Each component does one thing, props-driven |
| Simple database queries | Direct Supabase client queries, no ORM overhead |
| Reusable UI components | StatusBadge, Card, MetricCard used across screens |
| No unnecessary abstractions | No custom hooks library, no context providers beyond auth |
| No state management library | React useState + useEffect + props. Context only for auth and i18n |
| No unnecessary backend | Supabase handles DB + auth; Next.js API routes handle Gemini |
| No unnecessary AI framework | Direct @google/generative-ai SDK — no LangChain |
| No duplicate functionality | One SearchBox, one InventoryTable, one status calculation function |

## File Count Target

Aim for approximately:
- ~6 page files
- ~15 component files
- ~6 lib utility files
- ~2 API route files
- ~1 type definition file
- ~2 SQL files

Total: ~32 files (excluding config). If we are significantly above this, we are over-engineering.

---

# 19. Security Plan

## Supabase RLS

- Every table has RLS enabled
- `hospitals`, `departments`, `doctors`, `medicines`: public SELECT
- `hospital_inventory`: public SELECT, admin UPDATE restricted to own hospital
- `profiles`: user can only read/update own profile

## Authentication

- Supabase Auth handles session management
- JWT tokens validated by Supabase on every request
- Admin routes protected by auth check in layout/middleware

## API Key Protection

| Key | Protection |
|-----|-----------|
| `GEMINI_API_KEY` | Server-side only (Next.js API routes). Never in NEXT_PUBLIC_ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only. Used only for seeding/admin operations |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Safe for client (RLS protects data) |

## Server-Side Gemini Calls

- All Gemini calls go through Next.js API routes (`/api/ai/*`)
- Client never directly contacts Gemini
- API routes validate input before sending to Gemini

## Input Validation

- Sanitize patient search input before sending to Gemini
- Validate inventory update values (positive integers only)
- Validate auth tokens on admin routes

## Avoiding Sensitive Patient Data

- We do NOT store patient medical history
- We do NOT store patient diagnosis
- Search queries are not persisted
- No PII beyond email in auth

## What We Are NOT Building (Security)

- No HIPAA compliance infrastructure
- No data encryption at rest (beyond Supabase defaults)
- No audit logging
- No IP whitelisting
- No 2FA

This is a hackathon MVP — adequate security, not enterprise security.

---

# 20. Deployment Plan

## Architecture

```text
GitHub Repository
       |
Vercel (auto-deploy on push)
       |
Next.js Application
       |
Supabase (hosted PostgreSQL + Auth)
```

## Steps

### 1. GitHub Setup
- Initialize git repo
- Add `.gitignore` (exclude `.env.local`, `node_modules/`)
- Push code to GitHub

### 2. Supabase Configuration
- Create Supabase project (already done in Phase 3)
- Run migrations
- Seed demo data
- Create demo admin users
- Enable RLS
- Note: Supabase is hosted — no server needed

### 3. Vercel Configuration
- Connect GitHub repo to Vercel
- Set environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GEMINI_API_KEY`
- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: auto-detected

### 4. Production Build Verification
- `npm run build` locally — verify no errors
- Check all pages render
- Check API routes respond
- Check Gemini integration works with production key

### 5. Final Testing on Production URL
- Run through full demo script
- Test on mobile device
- Test language switching
- Verify Demo Network banner visible

## No Complex Server Required

- Vercel handles serverless functions (API routes)
- Supabase handles database + auth
- No Docker, no Kubernetes, no custom server

---

# 21. Hackathon Demo Plan

## Demo Duration: 3-5 minutes

### Part 1 — Introduction (30 seconds)

**Show:** Landing page

**Say:**
> "Healthcare Resource & Supply Chain Resilience Platform. Patients find the right hospital. Hospitals predict shortages before they happen."

**Point out:**
- Clean Indian healthcare design
- "Demo Network" badge
- Language switcher (English | Hindi)

---

### Part 2 — Patient Search (45 seconds)

**Action:** Type in search box:

> "I need an orthopedic consultation today"

**Show:** AI Understanding Card appears:

```text
We understood:
Department: Orthopedics
Service: Doctor Consultation
Urgency: Today
```

**Say:**
> "Gemini understands the patient's natural language requirement — even in Hindi."

---

### Part 3 — Hospital Matching (45 seconds)

**Show:** Hospital result cards:

```text
Bhopal City Hospital
- Orthopedics Available
- Doctor Available — Dr. Rahul Sharma
3.2 km away
Updated 10 min ago
```

**Say:**
> "The platform searches the connected hospital network and shows matching hospitals with real availability data."

**Action:** Click "View Hospital" to see Hospital detail page with doctors.

---

### Part 4 — Switch to Hospital Admin (30 seconds)

**Action:** Click "Hospital Login" then Log in as Bhopal City Hospital admin

**Show:** Dashboard with metric cards:

```text
Total Medicines: 12 | Low Stock: 3 | Critical: 2 | Predicted Shortages: 2
```

---

### Part 5 — Medicine Inventory (30 seconds)

**Show:** Inventory table:

| Medicine | Stock | Daily Usage | Status | Risk |
|----------|------:|----------:|--------|------|
| Paracetamol | 1200 | 100 | Healthy | — |
| Amoxicillin | 120 | 40 | Low | 2 days |
| Insulin | 18 | 6 | Critical | 3 days |

**Say:**
> "Hospital admins see their complete medicine inventory with calculated risk status."

---

### Part 6 — AI Stockout Prediction (45 seconds)

**Show:** AI Insight card:

```text
Stockout Risk — Insulin

Insulin is at critical stock with 18 vials remaining.
At current consumption of 6 vials/day, complete stockout
in approximately 3 days.

AI Insight: Immediate restocking recommended.
```

**Say:**
> "AI predicts when a medicine will run out — using real inventory data, not made-up numbers. The prediction is calculated by code, then Gemini explains it in plain language."

---

### Part 7 — Redistribution Opportunity (45 seconds)

**Show:** Redistribution card:

```text
Redistribution Opportunity — Insulin

Bhopal City Hospital -> 18 vials (Critical)
Indore Care Hospital -> 500 vials (Excess)

Consider transferring stock from Indore to Bhopal.

[Review Opportunity]
```

**Say:**
> "This is our key innovation. The platform detects that another hospital in the network has excess stock. Instead of waiting for a stockout, hospitals can proactively redistribute resources."

---

### Part 8 — Closing (15 seconds)

**Say:**
> "Healthcare Resource & Supply Chain Resilience. Find the right care. Predict shortages. Redistribute intelligently. Built with Next.js, Supabase, and Gemini AI."

---

# 22. Risks & Solutions

| # | Risk | Impact | Likelihood | Fallback |
|---|------|--------|:----------:|----------|
| 1 | **Gemini API failure** | Patient search degrades, AI insights unavailable | Medium | Keyword-based search fallback. Show pre-calculated data without AI explanation. Display: "AI insights temporarily unavailable." |
| 2 | **Gemini API rate limit / quota** | Throttled responses | Medium | Cache common query results. Limit API calls per session. Show fallback message. |
| 3 | **Supabase connection failure** | Entire app non-functional | Low | Show cached demo data as static JSON fallback. Display error banner. |
| 4 | **Google Maps API issues** | No map displayed | Low | Maps is P1 — not critical. Use text-based distances from demo data. |
| 5 | **Gemini returns invalid JSON** | Patient search breaks | Medium | Wrap Gemini response parsing in try/catch. Fall back to keyword search. Validate JSON schema before using. |
| 6 | **Gemini invents data** | Incorrect hospital information shown | Low | Strict system prompt: "Use ONLY provided data." Validate Gemini output against database values before display. |
| 7 | **Authentication issues** | Admin cannot log in | Low | Pre-test demo admin credentials. Have backup credentials ready. |
| 8 | **Deployment issues** | App does not deploy | Low | Test `npm run build` locally. Verify env vars in Vercel. Have local demo as backup. |
| 9 | **Slow Gemini response** | Poor demo experience | Medium | Show skeleton loader. Implement 10-second timeout. Show partial results while waiting. |
| 10 | **Hindi translation gaps** | Incomplete Hindi UI | Low | English is primary. Hindi is enhancement. Missing translations fall back to English. |

### Demo Resilience Strategy

The demo should work even if Gemini fails:
- Inventory dashboard works purely from Supabase data
- Stock calculations are deterministic (no AI needed)
- Redistribution detection is deterministic
- Only patient search understanding and AI explanations require Gemini

---

# 23. Final Implementation Checklist

```text
[ ] PRD understood
[ ] DESIGN understood
[ ] Architecture approved
[ ] Database schema approved
[ ] Stitch UI approved
[ ] Project setup
[ ] Stitch UI designs generated
[ ] UI components implemented
[ ] Supabase connected
[ ] Database tables created
[ ] Demo data seeded
[ ] Authentication (admin login/logout)
[ ] RLS configured
[ ] Patient search (natural language input)
[ ] AI requirement understanding (Gemini)
[ ] Hospital matching logic
[ ] Hospital results display
[ ] Hospital detail page
[ ] Inventory dashboard
[ ] Stock status calculation (deterministic)
[ ] Stockout prediction (calculated + AI explanation)
[ ] Redistribution opportunity detection
[ ] Redistribution card display
[ ] Language switcher (English/Hindi)
[ ] Demo Network banner
[ ] Last Updated timestamps
[ ] Loading states
[ ] Empty states
[ ] Error states
[ ] Responsive UI (desktop + mobile)
[ ] Security (API keys server-side, RLS)
[ ] Gemini failure fallback
[ ] End-to-end testing
[ ] Hackathon demo run-through
[ ] GitHub push
[ ] Vercel deployment
[ ] Production verification
```

---

## Ambiguities & Notes Identified During Analysis

| # | Issue | Resolution |
|---|-------|------------|
| 1 | PRD mentions "Supabase Edge Functions" for Gemini, but Next.js API routes can also serve this purpose | **Decision:** Use Next.js API routes for Gemini calls (simpler). Supabase Edge Functions are optional. |
| 2 | PRD says "Google Maps / Routes API only if required" | **Decision:** Defer to P1. Use pre-computed demo distances for MVP. |
| 3 | DESIGN.md mentions charts (consumption trend, stock level trend) | **Decision:** P1. If time permits, add one simple trend chart using recharts. |
| 4 | Patient login is unclear — PRD says patients can "Search, View hospitals, View availability" without specifying login | **Decision:** Patient features are public. No patient login required. |
| 5 | DESIGN.md specifies "shadcn/ui where useful" — scope is ambiguous | **Decision:** Use shadcn/ui for: Button, Input, Card, Table, Badge, Dialog, Tabs. Build custom for: HospitalCard, DoctorCard, SearchBox, MetricCard, InsightCard. |
| 6 | Emergency mode scope is unclear | **Decision:** Minimal — a button that filters hospitals with has_emergency = true. No separate emergency workflow. |

---

*This plan is complete and ready for review.*
