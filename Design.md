# DESIGN.md

# Healthcare Resource & Supply Chain Resilience Platform

## 1. Design Objective

Design a **modern Indian healthcare platform** that connects patients with available hospital resources and helps hospital administrators understand medicine inventory risks.

The design must feel:

- Trustworthy
- Clean
- Modern
- Professional
- Indian
- Accessible
- Simple
- Hackathon-demo friendly

The interface should look like a **modern healthcare technology product**, not like a government portal and not like a generic AI dashboard.

---

# 2. PRIMARY DESIGN PRINCIPLE

The product has only two important experiences:

### Patient

**Search → Understand → Find the right hospital**

### Hospital Admin

**Inventory → Predict → Prevent shortage**

The UI must make these two workflows immediately understandable.

Do NOT overload the interface with unnecessary features.

---

# 3. IMPORTANT — USE GOOGLE STITCH

## Stitch is the PRIMARY UI DESIGN TOOL.

Use **Google Stitch** to create the visual UI and screen designs.

Stitch should be used for:

- Layout
- Visual hierarchy
- Components
- Cards
- Navigation
- Forms
- Dashboard design
- Responsive layouts
- Patient interface
- Hospital admin interface
- Empty states
- Loading states
- Error states
- Language switcher
- Mobile layouts

The generated design should then be implemented in the Next.js application.

### Stitch MUST NOT

Stitch must NOT create:

- Backend logic
- Database architecture
- Supabase schema
- Authentication logic
- Gemini API logic
- API keys
- Business logic
- Stockout calculations
- AI prediction logic
- Fake API integrations

Stitch is responsible for **UI/UX only**.

---

# 4. VISUAL DIRECTION

## Overall Style

Use a:

**Modern Healthcare SaaS + Indian Accessibility**

visual language.

The interface should feel similar in quality to a polished startup product.

Avoid:

- Overly futuristic AI interfaces
- Excessive gradients
- Neon colors
- Excessive glassmorphism
- Huge animations
- Complex 3D graphics
- Excessive shadows
- Crowded dashboards

---

# 5. COLOR SYSTEM

Use a calm healthcare-inspired palette.

### Primary

Deep healthcare blue / teal.

Use for:

- Primary buttons
- Navigation
- Important actions
- Active states

### Secondary

Soft green.

Use for:

- Available
- Healthy stock
- Success
- Positive indicators

### Warning

Warm amber/orange.

Use for:

- Low stock
- Attention required

### Critical

Red.

Use ONLY for:

- Critical stock
- Urgent warnings
- Emergency indicators

### Background

Use:

- White
- Very light neutral gray
- Soft blue-gray sections

The overall interface should remain bright and clean.

Do not use dark mode for the primary MVP.

---

# 6. TYPOGRAPHY

Use a modern readable sans-serif font.

Recommended:

**Inter**

For Hindi support, use a font with strong Devanagari support such as:

**Noto Sans Devanagari**

Typography should prioritize readability.

Avoid:

- Decorative fonts
- Very thin text
- Extremely large headings
- Excessive uppercase text

---

# 7. LANGUAGE SUPPORT

The platform MUST support:

### English

and

### हिंदी

Add a visible language switcher in the top navigation.

Example:

```text
English | हिंदी
```

The language switch should work consistently across the interface.

Do not create separate designs for each language.

Use the same layout while changing displayed text.

### Important

Hindi translations should feel natural and simple.

Example:

English:

> Find Healthcare

Hindi:

> स्वास्थ्य सेवा खोजें

English:

> Hospital Availability

Hindi:

> अस्पताल की उपलब्धता

English:

> Medicine Stock

Hindi:

> दवा का स्टॉक

---

# 8. INDIAN DESIGN CONTEXT

The product should clearly feel designed for Indian users.

Use:

- Indian names
- Indian cities
- Indian healthcare terminology
- Indian phone number formatting
- Indian date formatting
- Hindi language option
- INR where monetary information is eventually shown

Example locations:

- Bhopal
- Indore
- Ujjain
- Jabalpur
- Rewa

Example names:

- Dr. Rahul Sharma
- Dr. Priya Verma
- Dr. Amit Patel

These are demo names only.

---

# 9. RESPONSIVE DESIGN

The application MUST work on:

### Desktop

Primary hackathon presentation experience.

### Tablet

Secondary.

### Mobile

Important for patient experience.

The patient search experience should be especially mobile-friendly.

Do not create separate codebases for mobile and desktop.

Use responsive CSS.

---

# 10. APPLICATION STRUCTURE

The application should have two major areas:

```text
Public / Patient Experience
        │
        ├── Home
        ├── Healthcare Search
        ├── Hospital Results
        └── Hospital Details

Hospital Admin Experience
        │
        ├── Dashboard
        ├── Inventory
        └── AI Insights
```

Keep navigation simple.

---

# 11. PATIENT HOME PAGE

The homepage should immediately communicate the product.

## Hero Section

Main heading:

> **Find the right healthcare resource, when you need it.**

Supporting text:

> Search connected hospitals for available healthcare services, doctors and resources.

Primary CTA:

> **Find Healthcare**

Secondary CTA:

> **Hospital Login**

---

## Search Area

Large central search box.

Placeholder:

> "What healthcare service do you need?"

Examples below:

```text
Orthopedic consultation
Cardiologist today
X-ray
Blood test
Emergency care
```

Allow natural-language input.

---

# 12. PATIENT SEARCH SCREEN

The search screen should be extremely simple.

### Top

Large search field.

Example:

> "I need an orthopedic doctor today."

### AI Understanding Card

Show a small structured interpretation:

```text
We understood:

Department
Orthopedics

Service
Doctor Consultation

Urgency
Today
```

Do not make this section overly technical.

---

# 13. HOSPITAL RESULTS SCREEN

Display matching hospitals as clean cards.

Example:

```text
┌─────────────────────────────────┐
│ Bhopal City Hospital            │
│ ★ Connected Hospital            │
│                                 │
│ ✓ Orthopedics Available         │
│ ✓ Doctor Available              │
│ ✓ Consultation Available        │
│                                 │
│ 3.2 km away                     │
│                                 │
│ Updated 10 min ago              │
│                                 │
│ [View Hospital]                 │
└─────────────────────────────────┘
```

Each hospital card should have:

- Hospital name
- Hospital type
- Relevant department
- Doctor availability
- Service availability
- Distance
- Last updated time
- View button

---

# 14. AVAILABILITY INDICATORS

Use simple visual status indicators.

### Available

Green dot +:

> Available

### Limited

Amber dot +:

> Limited

### Unavailable

Red/gray indicator +:

> Currently unavailable

Do not rely only on colors.

Always include text.

This improves accessibility.

---

# 15. HOSPITAL DETAIL PAGE

Keep it focused.

Show:

### Hospital Header

- Hospital name
- City
- Hospital type
- Availability status

### Relevant Resources

```text
Orthopedics
✓ Available

Doctor
✓ Available

Consultation
✓ Available
```

### Doctors

Simple doctor cards:

```text
Dr. Rahul Sharma
Orthopedics

Available Today

[View Availability]
```

### Last Updated

Clearly display:

> Last updated 10 minutes ago

---

# 16. HOSPITAL ADMIN LOGIN

Simple professional login.

Fields:

- Email
- Password

Button:

> Sign in

Language selector should remain available.

Do not add unnecessary authentication options in the MVP.

No:

- Social login
- OTP workflow
- Multi-step onboarding
- Complex registration

unless technically required later.

---

# 17. HOSPITAL ADMIN DASHBOARD

The admin dashboard is the second major visual experience.

## Header

Show:

> Bhopal City Hospital

and:

> Hospital Admin

Include:

- Language switch
- User/profile menu
- Logout

---

# 18. DASHBOARD OVERVIEW

Top-level metric cards:

```text
Total Medicines
24
```

```text
Low Stock
5
```

```text
Critical
2
```

```text
Predicted Shortages
3
```

Keep the number of cards limited.

Do not create 15–20 KPI cards.

---

# 19. INVENTORY TABLE

Main dashboard section.

Columns:

| Medicine | Stock | Daily Usage | Status | Risk |
|---|---:|---:|---|---|
| Paracetamol | 1200 | 100 | Healthy | — |
| Amoxicillin | 120 | 40 | Low | 3 days |
| Insulin | 18 | 6 | Critical | 3 days |

Use compact table design.

On mobile, convert rows into cards.

---

# 20. STOCK STATUS DESIGN

### Healthy

Use:

> ● Healthy

### Low

Use:

> ● Low Stock

### Critical

Use:

> ● Critical

Critical information should be visually prominent but not overwhelming.

---

# 21. AI INSIGHTS SECTION

This is one of the most important sections of the dashboard.

Title:

> **AI Supply Chain Insights**

Subtitle:

> Identify potential shortages before they become critical.

---

## Stockout Insight Card

Example:

```text
⚠ Stockout Risk

Insulin may reach critical stock
in approximately 3 days.

Current stock
18 units

Daily consumption
6 units/day

[View Analysis]
```

The card should clearly communicate:

**What is happening + Why + Expected time**

---

# 22. REDISTRIBUTION OPPORTUNITY CARD

This should visually stand out as one of the main USP elements.

Example:

```text
↔ Redistribution Opportunity

Hospital B has higher available stock
of Insulin while your hospital is
approaching a shortage.

Hospital A
18 units

Hospital B
500 units

[View Opportunity]
```

Use a visual connection between the two hospitals.

Example:

```text
Hospital A  ─────────→  Hospital B
 Shortage                 Excess
```

Do NOT make it look like an automatic transfer.

The action should say:

> **Review Opportunity**

NOT:

> Transfer Now

---

# 23. AI EXPLANATION DESIGN

AI explanations should be short.

Bad:

> A comprehensive multivariate predictive analysis indicates...

Good:

> Insulin consumption is currently higher than available stock. At the current usage rate, the inventory may reach the critical level in about 3 days.

Use a small:

> AI Insight

label.

Do not create a giant chatbot interface.

---

# 24. NAVIGATION

Keep navigation minimal.

## Patient

```text
Home
Find Healthcare
Hospitals
```

## Hospital Admin

```text
Dashboard
Inventory
AI Insights
```

Do not add:

- Analytics
- Reports
- Settings
- Notifications
- Messages
- Billing
- Pharmacy
- Patients

unless required later.

---

# 25. EMERGENCY ENTRY POINT

A small emergency CTA can exist on the patient home/search page.

Example:

> 🚨 Emergency Care

Use a clear warning color.

It should only help find hospitals marked for emergency care.

Do NOT make emergency mode a large separate product.

---

# 26. DEMO DATA LABEL

Because the hackathon uses simulated data, clearly display:

> **Demo Network**

or:

> **Simulated Hospital Data**

Use a small badge near the application header.

Never visually imply that demo availability is real-time hospital data.

---

# 27. LOADING STATES

Create simple skeleton loaders.

For example:

```text
Hospital Card
████████████████
██████████
██████████████
```

Avoid complicated loading animations.

---

# 28. EMPTY STATES

Example:

> No matching hospitals found.

Supporting text:

> Try changing your healthcare requirement or search again.

Button:

> Modify Search

---

# 29. ERROR STATES

Errors should be human-readable.

Bad:

> SupabaseError: 401

Good:

> We couldn't load hospital availability right now.

Button:

> Try Again

Do not expose technical errors to users.

---

# 30. COMPONENT STYLE

Use consistent reusable components.

Required components:

- Button
- Input
- Search Box
- Card
- Status Badge
- Hospital Card
- Doctor Card
- Metric Card
- Inventory Table
- AI Insight Card
- Language Switcher
- Navigation
- Modal where necessary

Do not create dozens of tiny components unnecessarily.

---

# 31. BUTTON STYLE

Primary button:

> Find Healthcare

Secondary:

> View Hospital

Admin action:

> Update Inventory

AI action:

> View Analysis

Redistribution:

> Review Opportunity

Avoid excessive buttons.

Every screen should have one clear primary action.

---

# 32. ICONS

Use a consistent icon library such as:

**Lucide Icons**

Use icons for:

- Search
- Hospital
- Doctor
- Medicine
- Alert
- Location
- Arrow
- Calendar

Do not use random emoji as the main UI icon system.

Emojis may be used sparingly in demo content.

---

# 33. MAP DESIGN

If Google Maps is implemented, keep the map simple.

Use it mainly for:

- Hospital location
- Distance
- Route

Do not build a complicated map dashboard.

The hospital cards should remain the primary information source.

---

# 34. ANIMATION

Use subtle animations only.

Allowed:

- Card hover
- Button hover
- Page transition
- Skeleton loading
- Small status transitions

Avoid:

- Large animated backgrounds
- Excessive motion
- 3D animations
- Particle effects
- AI brain animations

The application should feel professional.

---

# 35. ACCESSIBILITY

The UI should support users with different levels of technical literacy.

Requirements:

- Good contrast
- Large enough buttons
- Readable typography
- Clear labels
- Do not rely only on color
- Keyboard accessible controls
- Simple language
- Hindi support
- Mobile-friendly layout

---

# 36. DESIGN DON'TS

Do NOT create:

- ❌ Generic AI chatbot homepage
- ❌ Dark futuristic dashboard
- ❌ Neon AI graphics
- ❌ Excessive glassmorphism
- ❌ Excessive gradients
- ❌ Giant hero illustrations
- ❌ Overloaded navigation
- ❌ 20 dashboard metrics
- ❌ Complicated charts
- ❌ Fake real-time indicators
- ❌ Fake hospital logos
- ❌ Fake government branding
- ❌ Fake government affiliation
- ❌ Unnecessary animations
- ❌ Complex onboarding

---

# 37. CHARTS

Charts should be used only where they help explain supply-chain behavior.

Maximum useful charts:

### Medicine Consumption Trend

Simple line chart.

### Stock Level Trend

Simple line/area chart.

Do not create charts just to make the dashboard look impressive.

The most important information should remain visible without charts.

---

# 38. RESPONSIVE PATIENT EXPERIENCE

On mobile:

```text
Header
  ↓
Search
  ↓
AI Understanding
  ↓
Hospital Cards
  ↓
Hospital Details
```

The patient should be able to find a hospital without navigating complicated menus.

---

# 39. RESPONSIVE ADMIN EXPERIENCE

On mobile:

Convert:

```text
Inventory Table
```

into:

```text
Medicine Card

Insulin
Stock: 18
Daily Usage: 6
Status: Critical
Risk: ~3 days
```

Desktop can use the full table.

---

# 40. DESIGN TOKENS

Keep design tokens centralized.

Example:

```text
Primary Color
Secondary Color
Success Color
Warning Color
Critical Color
Background
Surface
Text
Muted Text
Border
```

Do not hardcode different colors throughout individual components.

---

# 41. SCREEN LIST FOR STITCH

Stitch should primarily generate these screens:

## Patient

### Screen 1
Landing / Home

### Screen 2
Healthcare Search

### Screen 3
Hospital Search Results

### Screen 4
Hospital Details

### Screen 5
Mobile Patient Search

---

## Hospital Admin

### Screen 6
Hospital Login

### Screen 7
Hospital Dashboard

### Screen 8
Medicine Inventory

### Screen 9
AI Supply Chain Insights

### Screen 10
Redistribution Opportunity Detail

These screens are enough for the MVP.

Do not create additional screens unless necessary.

---

# 42. HACKATHON DEMO DESIGN PRIORITY

The judges should understand the product within **30 seconds**.

The visual story should be:

```text
PATIENT
"I need an orthopedic doctor"
          ↓
AI understands requirement
          ↓
Hospital matching
          ↓
AVAILABLE RESOURCES


HOSPITAL
Medicine inventory
          ↓
AI predicts shortage
          ↓
Another hospital has excess
          ↓
Redistribution opportunity
```

The UI should visually reinforce this story.

---

# 43. STITCH IMPLEMENTATION INSTRUCTION

When generating the UI in Google Stitch:

1. Start with the Patient Home screen.
2. Create the Patient Search flow.
3. Create Hospital Results.
4. Create Hospital Details.
5. Create Hospital Admin Login.
6. Create Hospital Dashboard.
7. Create Inventory screen.
8. Create AI Insights.
9. Create Redistribution Opportunity.
10. Create responsive mobile versions.

Maintain the same design system across all screens.

Do not create unrelated UI concepts.

---

# 44. IMPLEMENTATION RULE FOR ANTIGRAVITY

After Stitch designs are generated, Antigravity should implement the design faithfully.

Do NOT redesign the product unnecessarily.

Use:

**Next.js + React + TypeScript + Tailwind CSS**

Use reusable components.

Keep the codebase small.

Do not introduce a new framework just to implement a UI component.

---

# 45. BACKEND BOUNDARY

The design must not assume that UI components contain backend logic.

Architecture:

```text
Stitch
   ↓
UI Design
   ↓
Next.js
   ↓
Supabase
   ↓
PostgreSQL
```

For AI:

```text
Next.js
   ↓
Supabase Edge Function
   ↓
Gemini API
```

Never put Gemini API keys inside client-side UI code.

---

# 46. DATA VISUALIZATION RULE

Only display information that comes from:

- Supabase
- Calculated application logic
- Gemini analysis based on actual supplied data

Never create visual numbers only to make the dashboard look impressive.

---

# 47. FINAL DESIGN PHILOSOPHY

The product should feel like:

> **A trustworthy Indian healthcare network powered by practical AI.**

Not:

> "Another AI chatbot."

The strongest visual hierarchy should be:

### Patient

**What do you need?**

↓

**Which hospital can help?**

### Hospital

**What resource is at risk?**

↓

**When could it become a shortage?**

↓

**Where might excess inventory exist?**

---

# 48. FINAL DESIGN RULE

> **Simple enough for a patient. Powerful enough for a hospital administrator. Clear enough for a hackathon judge.**

The UI should communicate the USP without requiring the user to read a long explanation.

---

# STITCH MASTER PROMPT

Use the following as the primary prompt when generating the design in Google Stitch:

> Design a modern Indian healthcare technology platform called "Healthcare Resource & Supply Chain Resilience".
>
> The product has two experiences: a patient experience for finding healthcare resources and a hospital-admin experience for managing medicine inventory and identifying supply-chain risks.
>
> Create a clean, trustworthy, professional healthcare SaaS interface with an Indian context. Use a bright healthcare-inspired visual system with deep blue/teal as the primary color, green for healthy/available states, amber for warnings and red only for critical states. Avoid neon colors, excessive gradients, futuristic AI visuals, excessive glassmorphism, dark dashboards and unnecessary animations.
>
> Support English and Hindi with a visible "English | हिंदी" language switcher throughout the interface. Use readable typography with strong Devanagari support. The design should feel accessible to Indian users while still looking like a polished modern startup product.
>
> Patient flow:
> Landing page → healthcare requirement search → AI-understood requirement → matching hospitals → hospital details.
>
> Hospital flow:
> Login → hospital dashboard → medicine inventory → AI stockout prediction → redistribution opportunity between hospitals.
>
> The main patient CTA should be "Find Healthcare".
>
> The main hospital dashboard should clearly show medicine stock, daily consumption, low-stock medicines, critical medicines and predicted shortages.
>
> Create a visually strong "AI Supply Chain Insights" section showing a stockout-risk card and a cross-hospital redistribution opportunity card.
>
> Example stockout card:
> "Insulin may reach critical stock in approximately 3 days."
>
> Example redistribution card:
> "Hospital B has higher available stock of Insulin while Hospital A is approaching a shortage."
>
> Clearly show "Demo Network" or "Simulated Hospital Data" because the hackathon uses synthetic data.
>
> Create responsive desktop and mobile layouts.
>
> Keep navigation minimal.
>
> Do not create unnecessary features such as telemedicine, medical records, insurance, payments, ambulance tracking, blood-bank systems, pharmacy delivery, chatbot interfaces, complex analytics, government portals or other features outside the MVP.
>
> The design must communicate the core USP within 30 seconds:
>
> "Patients find the right healthcare resource. Hospitals predict shortages and identify redistribution opportunities."
>
> Use reusable components and a consistent design system across all screens.
>
> Generate these screens:
> 1. Patient Landing/Home
> 2. Healthcare Search
> 3. Hospital Search Results
> 4. Hospital Details
> 5. Hospital Admin Login
> 6. Hospital Dashboard
> 7. Medicine Inventory
> 8. AI Supply Chain Insights
> 9. Redistribution Opportunity Detail
> 10. Mobile Patient Search
>
> Focus on clarity, trust, accessibility, Indian usability and hackathon presentation quality. Do not design backend functionality. This is a UI/UX design task only.