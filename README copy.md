# Dream Brain — Question Bank & Scoring

240 reflective self-assessment questions (60 per age group × 4 groups), each with 4 options, and a drop-in scorer that turns answers into dimension scores, domain scores, brain-region scores and a strengths-based summary.

## Files
- `dream_brain_question_bank.json` — all questions + metadata + scoring spec.
- `scoring.js` — `pickQuestions()` and `scoreSession()`. No dependencies.

## Age groups
`below_12` (Little Explorer) · `age_12_14` (Bright Seeker) · `age_14_18` (Rising Mind) · `age_18_plus` (Open Thinker)

## What's real, and what isn't (so the product stays honest)
- The **questions and the 11 trait dimensions** are written in the spirit of established self-report frameworks (Big-Five-adjacent traits, emotion regulation, temperament). They are legitimate *reflection* items.
- They are **not a clinically validated instrument**. Real validation needs a psychometric study (sample testing, reliability/validity stats). Until then, present scores as "how you described yourself today," not a verdict.
- The **brain-region scores are a visualisation metaphor**, not a measurement of neural activity. A quiz cannot read which brain regions are active. Keep your in-app line: *"a reflective profile for self-awareness — not a medical or clinical diagnosis."* For under-18s especially, keep every label strengths-based (Strong / Balanced / **Growing** — never "weak/low/deficient").

## The 11 dimensions → 4 domains → 6 brain regions
| Domain | Dimensions | Region (mapped from) |
|---|---|---|
| Emotional | Emotional Stability, Mood Patterns, Sensitivity | Limbic System ← Emotional Stability |
| Cognitive | Memory, Focus, Learning Speed | Temporal Lobe ← Memory · Prefrontal Cortex ← Focus · Parietal Lobe ← Learning Speed |
| Behavioral | Extroversion, Leadership Traits, Social Comfort | Frontal Lobe ← Leadership |
| Stress | Anxiety Indicators, Pressure Handling | Amygdala ← Pressure Handling |

## Scoring
- Each option carries a `weight` (0–100) = how strongly it expresses the **adaptive / strong** end of its dimension. Higher is always the calmer/stronger end — including for Anxiety and Pressure — so labels never come out negative.
- `dimensionScore` = mean of chosen weights for that dimension.
- `domainScore` = mean of its dimension scores.
- `regionScore` = score of its mapped dimension.
- Labels: **≥70 Strong · 50–69 Balanced · <50 Growing**. Extroversion is bipolar (slider): **≥66 Outgoing · 40–65 Balanced · <40 Reflective**.
- The high-weight option is **not** always "A" — positions are varied to avoid a give-away pattern.

## Use it (≈10-question session, then score)
```js
import { pickQuestions, scoreSession } from "./scoring.js";
import bank from "./dream_brain_question_bank.json";

// Your UI shows "Question 1 of 10" — draw a balanced 10 from the 60-item bank
const session = pickQuestions(bank, "age_14_18", 10);

// collect answers as the user taps options
const answers = [{ questionId: session[0].id, optionKey: "B" }, /* ... */];

const report = scoreSession(bank, answers);
// report.dimensions, report.domains, report.regions, report.dominantZones, report.summary
```
Pass `Infinity` as the count to use all 60. Re-takers get fresh questions because the pool is larger than a session.

## Tuning
Thresholds (`labelFor`) and the dimension counts are easy to adjust. Current split per group: Emotional Stability 6, Memory 6, Focus 6, Anxiety 6, Pressure 6, the rest 5 — weighted toward the region-mapped dimensions so the brain map has solid signal.
