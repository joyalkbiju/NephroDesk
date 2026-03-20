# NephroDesk

A full-stack dialysis session intake and anomaly dashboard built to support nurses during a shift. Tracks patient treatment sessions, surfaces potentially unsafe situations, and provides a clean UI for managing today's schedule.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS v4 |
| Backend | Node.js · Express · TypeScript |
| Database | MongoDB · Mongoose |
| Testing (frontend) | Vitest · React Testing Library |
| Testing (backend) | Jest · Supertest |

---

## Project Structure

```
NephroDesk/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts               ← axios instance + interceptors
│   │   │   ├── patients.api.ts         ← registerPatient()
│   │   │   ├── sessions.api.ts         ← startSession(), completeSession(), updateNotes()
│   │   │   └── schedule.api.ts         ← getTodaySchedule()
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Header.tsx          ← unit selector, live clock, shift label, anomaly alert
│   │   │   ├── patient/
│   │   │   │   ├── PatientCard.tsx     ← vitals grid, status, session actions
│   │   │   │   ├── PatientList.tsx     ← schedule list with all states
│   │   │   │   ├── StatusBadge.tsx     ← not started / in progress / completed
│   │   │   │   └── RegisterPatientForm.tsx
│   │   │   ├── session/
│   │   │   │   ├── StartSessionForm.tsx    ← pre-weight, pre-BP, machine ID
│   │   │   │   ├── CompleteSessionForm.tsx ← post-weight, post-BP, end time, notes
│   │   │   │   ├── SessionDetails.tsx
│   │   │   │   └── NotesEditor.tsx     ← inline save on blur
│   │   │   ├── anomaly/
│   │   │   │   ├── AnomalyBadge.tsx
│   │   │   │   ├── AnomalyList.tsx
│   │   │   │   └── AnomalyFilter.tsx   ← toggle: show anomalies only
│   │   │   └── ui/
│   │   │       ├── Modal.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Spinner.tsx
│   │   │       ├── ErrorBanner.tsx
│   │   │       └── EmptyState.tsx
│   │   ├── hooks/
│   │   │   ├── useSchedule.ts
│   │   │   ├── useCreateSession.ts
│   │   │   └── useUpdateNotes.ts
│   │   ├── types/
│   │   │   ├── patient.types.ts
│   │   │   ├── session.types.ts
│   │   │   └── anomaly.types.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── anomaly.utils.ts
│   │   ├── mocks/
│   │   │   └── mockData.ts
│   │   └── tests/
│   │       ├── setup.ts
│   │       ├── components/
│   │       │   ├── PatientCard.test.tsx
│   │       │   ├── StartSessionForm.test.tsx
│   │       │   └── AnomalyBadge.test.tsx
│   │       └── hooks/
│   │           └── useSchedule.test.ts
│   ├── vite.config.ts
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   └── anomaly.config.ts       ← all thresholds, no magic numbers
    │   ├── models/
    │   │   ├── patient.model.ts
    │   │   └── session.model.ts
    │   ├── routes/
    │   │   ├── patient.routes.ts
    │   │   ├── session.routes.ts
    │   │   └── schedule.routes.ts
    │   ├── services/
    │   │   └── anomaly.service.ts      ← pure function, fully unit tested
    │   ├── tests/
    │   │   ├── anomaly.service.test.ts
    │   │   └── schedule.routes.test.ts
    │   ├── app.ts
    │   ├── index.ts
    │   └── seed.ts
    ├── .env.example
    ├── jest.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier is sufficient)

### 1. Clone the repo

```bash
git clone https://github.com/joyalkbiju/NephroDesk.git
cd NephroDesk
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nephro-desk
```

### 3. Seed the database

```bash
npm run seed
```

Inserts 8 patients across 4 units with 3 sample sessions — completed with anomalies, in progress, and completed with a short session warning.

### 4. Start the backend

```bash
npm run dev
```

API running at `http://localhost:3000`

### 5. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

App running at `http://localhost:5173`

The Vite dev server proxies all `/api` requests to `http://localhost:3000` automatically — no CORS issues in development.

---

## API Documentation

**Base URL:** `http://localhost:3000/api`

---

### `POST /api/patients`
Register a new patient.

**Request body:**
```json
{
  "name": "Arun Kumar",
  "dob": "1970-03-15",
  "unit": "ICU",
  "dryWeightKg": 68.0
}
```

**Response `201`:** Patient document.

---

### `GET /api/patients`
List all patients.

**Response `200`:** Array of patient documents.

---

### `POST /api/sessions`
Start a new dialysis session. Records pre-session vitals only — post-vitals are recorded when the session is completed.

**Request body:**
```json
{
  "patientId": "<patient _id>",
  "machineId": "HD-01",
  "startTime": "2026-03-20T08:00:00.000Z",
  "preWeightKg": 73.5,
  "preBP": { "systolic": 145, "diastolic": 88 }
}
```

**Response `201`:** Session document with `status: "in_progress"`.

---

### `PATCH /api/sessions/:id/complete`
Complete a session. Records post-session vitals and runs anomaly detection automatically.

**Request body:**
```json
{
  "postWeightKg": 70.2,
  "postBP": { "systolic": 165, "diastolic": 95 },
  "endTime": "2026-03-20T12:00:00.000Z",
  "notes": "Patient tolerated session well."
}
```

**Response `200`:** Updated session with `status: "completed"` and `anomalies[]` embedded.

---

### `PATCH /api/sessions/:id/notes`
Edit nurse notes on a session.

**Request body:**
```json
{ "notes": "Updated observation." }
```

**Response `200`:** Updated session document.

---

### `GET /api/schedule/today?unit=ICU`
Fetch today's schedule for a unit. Returns all patients with their session and computed status embedded.

**Query params:**

| Param | Required | Accepted values |
|-------|----------|-----------------|
| `unit` | Yes | `ICU`, `Ward A`, `Ward B`, `HDU` |

**Response `200`:**
```json
[
  {
    "patient": {
      "_id": "...",
      "name": "Arun Kumar",
      "dryWeightKg": 68,
      "unit": "ICU"
    },
    "session": {
      "_id": "...",
      "status": "completed",
      "preWeightKg": 73.5,
      "postWeightKg": 70.2,
      "preBP": { "systolic": 145, "diastolic": 88 },
      "postBP": { "systolic": 165, "diastolic": 95 },
      "anomalies": [
        { "type": "WEIGHT_GAIN", "value": 5.5, "threshold": 4, "severity": "critical" },
        { "type": "HIGH_POST_BP", "value": 165, "threshold": 160, "severity": "critical" }
      ]
    },
    "status": "completed"
  }
]
```

---

### `GET /api/health`
Health check.

**Response `200`:** `{ "status": "ok", "timestamp": "..." }`

---

## Architecture Overview

```
┌──────────────────────────────────────────┐
│         React Frontend  (Vite)           │
│                                          │
│  Header (unit selector, clock, shift)    │
│  PatientList                             │
│    └── PatientCard                       │
│         ├── StartSessionForm  (modal)    │
│         ├── CompleteSessionForm (modal)  │
│         ├── AnomalyList                  │
│         └── NotesEditor (inline)         │
│  AnomalyFilter  ·  RegisterPatientForm   │
└─────────────────┬────────────────────────┘
                  │  HTTP/REST  (axios)
                  │  Vite proxy in dev
┌─────────────────▼────────────────────────┐
│         Express Backend  (Node)          │
│                                          │
│  POST   /api/patients                    │
│  POST   /api/sessions         (start)    │
│  PATCH  /api/sessions/:id/complete       │
│  PATCH  /api/sessions/:id/notes          │
│  GET    /api/schedule/today?unit=        │
│                                          │
│  anomaly.service.ts ← detectAnomalies()  │
│  anomaly.config.ts  ← all thresholds     │
└─────────────────┬────────────────────────┘
                  │  Mongoose ODM
┌─────────────────▼────────────────────────┐
│           MongoDB Atlas                  │
│                                          │
│  patients  — name, dob, unit,            │
│              dryWeightKg                 │
│                                          │
│  sessions  — patientId, machineId,       │
│              status, startTime,          │
│              endTime?, preWeightKg,      │
│              postWeightKg?, preBP,       │
│              postBP?, anomalies[]        │
└──────────────────────────────────────────┘
```

### Key design decisions

**Session split into start and complete** — the nurse records pre-weight and pre-BP when the session begins, and post-weight and post-BP when it ends. Post-vitals cannot be known at session start — a single form for both was clinically incorrect.

**Status stored explicitly** — `session.status` is `"in_progress"` or `"completed"`, set by the backend. Status is not derived from timestamps to avoid timezone edge cases and to give nurses explicit control over when a session is considered done.

**Anomalies embedded in the session document** — anomaly detection runs once at completion and the results are stored inside the session. The schedule query returns them directly with no recomputation on every request.

**All thresholds in config** — `anomaly.config.ts` is the single source of truth for every clinical threshold. No magic numbers appear anywhere in route handlers or service logic.

---

## Clinical Assumptions & Trade-offs

All thresholds are defined in `backend/src/config/anomaly.config.ts`.

### 1. Excess Interdialytic Weight Gain

**Threshold:** > 4.0 kg — flagged as `critical`

**Calculation:**
```
weight gain = preWeightKg − dryWeightKg
```

Dry weight is the patient's ideal post-dialysis weight set at registration. Pre-weight is measured at the start of each session. The difference is the fluid accumulated since the last session — this is interdialytic weight gain.

**Justification:** KDOQI (Kidney Disease Outcomes Quality Initiative) guidelines recommend limiting interdialytic weight gain to less than 4 kg. Gains above this require a higher ultrafiltration rate during dialysis, increasing cardiovascular stress and the risk of hypotension, cramping, and arrhythmia.

**Trade-off:** A fixed 4 kg threshold does not account for patient body size. A more precise approach would use percentage of dry weight (e.g. > 5%). This is a known simplification — a future improvement would make the threshold configurable per patient.

---

### 2. High Post-Dialysis Systolic Blood Pressure

**Threshold:** > 160 mmHg — flagged as `critical`

**Justification:** JNC 8 and KDIGO guidelines classify systolic BP above 160 mmHg as Stage 2 hypertension. Post-dialysis hypertension is associated with left ventricular hypertrophy and increased cardiovascular mortality in dialysis patients. Unlike pre-dialysis hypertension which may be partly fluid-driven, post-dialysis hypertension persists after fluid removal and signals inadequate BP control.

**Trade-off:** Only systolic BP is evaluated. Diastolic hypertension is not flagged separately — systolic is the primary cardiovascular risk predictor in this population and keeps the alert surface manageable.

---

### 3. Abnormal Session Duration

**Target:** 240 minutes (4 hours — standard HD session)

**Short threshold:** < 210 minutes — flagged as `warning`

**Long threshold:** > 285 minutes — flagged as `warning`

**Justification:** Sessions under 210 minutes (3.5 hours) are unlikely to achieve adequate solute clearance (target Kt/V < target). Sessions over 285 minutes (4.75 hours) may indicate machine issues, access problems, or scheduling errors. Both are `warning` rather than `critical` because a short or long session can be clinically justified — the nurse is alerted, not alarmed.

---

## Running Tests

### Backend

```bash
cd backend
npm test
```

| File | Coverage |
|------|----------|
| `anomaly.service.test.ts` | 8 unit tests — weight gain, high BP, short/long session, boundary conditions, multiple anomalies at once |
| `schedule.routes.test.ts` | 6 integration tests — missing unit param, empty unit, not started, in progress, completed, unit filtering |

### Frontend

```bash
cd frontend
npm test
```

| File | Coverage |
|------|----------|
| `PatientCard.test.tsx` | 9 tests — all three statuses, action buttons, anomaly badges, notes editor visibility, pending post-weight |
| `StartSessionForm.test.tsx` | 6 tests — validation errors, cancel handler, correct fields present, post-fields absent |
| `AnomalyBadge.test.tsx` | 6 tests — all four anomaly types, critical/warning severity styling |
| `useSchedule.test.ts` | 4 tests — successful fetch, error handling, refetch, unit change triggers refetch |

---

## Seeded Data

`npm run seed` creates the following:

| Patient | Unit | Dry Weight | Session Status |
|---------|------|-----------|----------------|
| Arun Kumar | ICU | 68 kg | Completed — weight gain 5.5 kg + post BP 165 mmHg (2 anomalies) |
| Meera Nair | ICU | 55 kg | In progress — no anomalies |
| Rajesh Menon | ICU | 72 kg | Not started |
| Lakshmi Pillai | ICU | 62 kg | Completed — short session warning |
| Suresh Babu | Ward A | 74.5 kg | Not started |
| Priya Thomas | Ward A | 51 kg | Not started |
| Anand Krishnan | Ward B | 80 kg | Not started |
| Deepa Varghese | HDU | 58.5 kg | Not started |

---

## Environment Variables

**`backend/.env`**
```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nephro-desk
```

**`frontend/.env.development`**
```
VITE_API_URL=/api
```

**`frontend/.env.production`**
```
VITE_API_URL=https://your-backend.onrender.com/api
```
