<div align="center">

# 🧠 Dream Brain

### A gentle, interactive psychological assessment that maps how a young mind *feels, thinks, connects and copes* — and lights up the brain regions behind it.

[![MERN](https://img.shields.io/badge/Stack-MERN-7C6FE8?style=for-the-badge)](#-tech-stack)
[![React](https://img.shields.io/badge/React-18-60A5FA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-34D399?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-13aa52?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](#-license)

*240 psychologist-designed questions · 4 age groups · 11 trait dimensions · 6 brain regions*

</div>

---

## ✨ Overview

**Dream Brain** turns a short, friendly quiz into a beautiful, visual portrait of the mind. A student picks their age group, answers **10 balanced questions** drawn from a curated bank, and receives an animated report: category scores, a glowing **brain map** of active regions, and warm, non-judgemental insights.

It's built to feel like *play*, not a test — soft gradients, floating bubbles, a friendly brain mascot, and a calm countdown timer — while a real scoring engine works underneath.

> 💜 **Designed to encourage, never to label.** Every score band uses supportive language ("Strong", "Balanced", "Growing") and bipolar traits like Extroversion are described as a *direction*, never a deficit.

---

## 🎯 Key Features

| | |
|---|---|
| 🧩 **240-question bank** | Psychologist-style questions, **60 per age group**, each tied to one of 11 trait dimensions with per-option weights. |
| 🎲 **Balanced sessions** | Every attempt serves a **fresh, balanced 10 of 60** via round-robin sampling across dimensions — re-takers always get variety. |
| 👶 **Age-aware** | Four tailored journeys: *Little Explorer*, *Bright Seeker*, *Rising Mind* and *Open Thinker*. |
| 🧠 **Brain map** | Scores light up 6 brain regions (Prefrontal Cortex, Amygdala, Limbic System…) on an animated SVG. |
| 📊 **4 analysis lenses** | Emotional · Cognitive · Behavioral · Stress — each with its own sub-metrics. |
| ⚖️ **Bipolar traits** | Extroversion reads as *Outgoing ↔ Balanced ↔ Reflective* rather than a strength score. |
| 🔒 **Tamper-resistant** | Scoring weights are **stripped** before questions reach the browser — answers can't be reverse-engineered. |
| 💾 **Persistent reports** | Every assessment is saved to MongoDB Atlas and retrievable by ID. |
| ⬇️ **Downloadable** | Reports export to a file with a cross-browser-safe download flow. |
| 🎨 **Delightful UI** | Tailwind + Framer Motion: floating bubbles, radial meters, a brain mascot and a circular timer. |

---

## 🗺️ How It Works

```
   ┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
   │   Landing   │ ──▶ │  Age Select  │ ──▶ │     Quiz    │ ──▶ │   Results    │
   │  hero + CTA │     │  4 journeys  │     │ 10 balanced │     │  brain map   │
   └─────────────┘     └──────────────┘     │  questions  │     │  + insights  │
                                            └─────────────┘     └──────────────┘
                                                   │                    ▲
                                                   ▼                    │
                                      POST /api/assessments ── scoring engine
                                                   │                    │
                                                   └──▶ MongoDB Atlas ◀──┘
```

1. **Pick an age group** → the client fetches `GET /api/questions/:ageGroup`.
2. The server draws a **balanced 10-question sample** from that group's 60-item pool and strips all scoring weights.
3. **Answer the quiz** → the client posts responses to `POST /api/assessments`.
4. The **scoring engine** averages per-option weights into 11 metric scores, rolls them up into 4 categories and 6 brain regions, picks the two **dominant zones**, and writes the report to Atlas.
5. **Results page** animates the scores, the brain map and a supportive summary.

---

## 🧬 The Model

### Four analysis lenses

| Lens | Captures | Sub-metrics |
|------|----------|-------------|
| 💜 **Emotional** | How feelings are sensed, held and balanced | Emotional Stability · Mood Patterns · Sensitivity |
| 💚 **Cognitive** | How the mind remembers, focuses and learns | Memory · Focus · Learning Speed |
| 💙 **Behavioral** | How energy, leadership and connection show up | Extroversion* · Leadership Traits · Social Comfort |
| 🧡 **Stress** | How pressure is met and managed | Anxiety Indicators · Pressure Handling |

<sub>*Extroversion is **bipolar** — scored as a direction (Outgoing / Balanced / Reflective), not a strength.*</sub>

### Brain regions

`Prefrontal Cortex` · `Frontal Lobe` · `Parietal Lobe` · `Temporal Lobe` · `Limbic System` · `Amygdala`

Each region is driven by a primary metric and rendered as a positioned glow on the brain SVG, with the two highest-scoring regions surfaced as **dominant zones**.

### Score bands

| Standard metric | Bipolar (Extroversion) |
|---|---|
| **Strong** ≥ 70 | **Outgoing** ≥ 66 |
| **Balanced** 50–69 | **Balanced** 40–65 |
| **Growing** < 50 | **Reflective** < 40 |

---

## 🛠️ Tech Stack

**Frontend** — React 18 · Vite · Tailwind CSS · Framer Motion · Axios · React Router
**Backend** — Node.js · Express · Mongoose · Morgan · CORS · dotenv
**Database** — MongoDB Atlas
**Tooling** — Concurrently (single-command dev)

---

## 📂 Project Structure

```
Dream-Brain/
├── package.json                 # root — orchestrates server + client
├── client/                      # React + Vite front-end
│   └── src/
│       ├── pages/               # Landing · AgeSelect · Quiz · Results
│       ├── components/          # BrainMap · ScoreMeter · CircularTimer · BrainMascot · …
│       ├── store/               # AssessmentContext (session state)
│       ├── api/client.js        # Axios instance
│       └── lib/colors.js        # category / label colour system
└── server/                      # Express API
    └── src/
        ├── index.js             # app bootstrap + middleware
        ├── seed.js              # loads the 240-question bank into Atlas
        ├── config/db.js         # Mongo connection
        ├── models/              # Question · Assessment (Mongoose)
        ├── controllers/         # meta · question · assessment
        ├── routes/index.js      # /api router
        ├── services/scoring.js  # the scoring engine
        └── data/
            ├── catalog.js                    # age groups · metrics · regions · labels
            ├── questions.js                  # maps the bank into seed-ready docs
            └── dream_brain_question_bank.json # 240 real questions
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js ≥ 18**
- A **MongoDB Atlas** cluster (or local MongoDB)

### 1 · Clone & install

```bash
git clone https://github.com/srivardhan-kondu/Dream-Brain.git
cd Dream-Brain
npm run install:all      # installs root, server and client deps
```

### 2 · Configure the server

Create `server/.env`:

```env
PORT=5050
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dream_brain?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```

> 🔐 `server/.env` is gitignored — your credentials never get committed. If using Atlas, add your IP to the cluster's **Network Access** allowlist.

### 3 · Seed the question bank

```bash
npm run seed     # inserts all 240 questions (60 per age group)
```

### 4 · Run it

```bash
npm run dev      # starts API + client together
```

| Service | URL |
|---------|-----|
| 🌐 Client | http://localhost:5173 |
| ⚙️ API | http://localhost:5050 |

---

## ☁️ Deployment

Deploy the API to **Render** and the client to **Vercel** (with MongoDB Atlas as the shared DB).
See the full step-by-step walkthrough in **[DEPLOYMENT.md](DEPLOYMENT.md)** — covering env vars, CORS, seeding and cold-start gotchas.

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Liveness check. |
| `GET` | `/api/meta` | Age groups, categories and metric catalog. |
| `GET` | `/api/questions/:ageGroup` | A **balanced 10-question** session (weights stripped). |
| `POST` | `/api/assessments` | Submit responses → returns the scored report. |
| `GET` | `/api/assessments/:id` | Retrieve a saved report by ID. |

<details>
<summary><b>Example — submit an assessment</b></summary>

```http
POST /api/assessments
Content-Type: application/json

{
  "nickname": "Explorer",
  "ageGroup": "little-explorer",
  "responses": [
    { "questionId": "6a3d...c17", "optionId": "A" },
    { "questionId": "6a3d...c18", "optionId": "C" }
  ]
}
```

```jsonc
// 201 Created
{
  "id": "6a3d2d9103fc5420b4597c17",
  "overall": 78,
  "overallLabel": "Strong",
  "categories": [ /* 4 lenses, each with sub-metrics */ ],
  "regions":    [ /* 6 brain regions with scores + glow positions */ ],
  "dominantZones": [
    { "name": "Frontal Lobe",  "zone": "Behavioral", "score": 82 },
    { "name": "Limbic System", "zone": "Emotional",  "score": 79 }
  ],
  "summary": "Your mind shows its brightest activity in the Frontal Lobe and Limbic System…"
}
```
</details>

---

## 📜 Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Run server + client together (colour-coded). |
| `npm run server` | API only, with reload. |
| `npm run client` | Vite dev server only. |
| `npm run seed` | Seed the 240-question bank into the database. |
| `npm run build` | Production build of the client. |
| `npm run install:all` | Install all workspace dependencies. |

---

## 🌱 Roadmap

- [ ] Auth + per-user history of past reports
- [ ] Trend view across multiple attempts over time
- [ ] PDF export with the rendered brain map
- [ ] Localisation / multi-language question banks
- [ ] Educator dashboard (aggregate, anonymised insights)

---

## ⚠️ Disclaimer

Dream Brain is an **educational and self-reflection tool**, not a clinical or diagnostic instrument. Its insights are intended to encourage curiosity and conversation — not to assess, diagnose or label any individual.

---

## 📄 License

Released under the **MIT License**.

<div align="center">

---

Made with 💜 by [**srivardhan-kondu**](https://github.com/srivardhan-kondu)

*Mapping bright young minds, one gentle question at a time.*

</div>
