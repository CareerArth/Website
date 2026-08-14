# 02 — ARTH Scoring Rubric (Deterministic)

Week-1 deliverable: the fixed rules, weights, and thresholds that compute the four ARTH
dimension scores and the overall Arth Score. The LLM never invents or adjusts a score —
it only explains scores this rubric has already produced.

The four dimensions are the ones published on careerarth.com:

- **A — Alignment**: coherence between current role and long-term ambitions
- **R — Risk Exposure**: vulnerability to industry shifts and skill obsolescence
  (scored in the *favorable* direction: higher = better insulated, consistent with the
  `/sample-score` page where Risk Exposure 48% is described as "moderate" exposure)
- **T — Trajectory**: momentum — are options expanding or narrowing over time?
- **H — Human Capital**: strength of network, brand equity, and transferability

## 1. Overall Arth Score

Each dimension is scored 0–100 (higher is better). The overall score is a fixed
weighted average, rounded to the nearest integer:

```
ArthScore = round(0.30·A + 0.25·R + 0.20·T + 0.25·H)
```

**Calibration check** — these weights reproduce the published sample on `/sample-score`
(A=72, R=48, T=52, H=81):

```
0.30·72 + 0.25·48 + 0.20·52 + 0.25·81 = 21.6 + 12.0 + 10.4 + 20.25 = 64.25 → 64  ✓
```

Rationale for the ordering: Alignment carries the most weight (the framework's core
question is role↔ambition coherence), Risk and Human Capital are co-equal secondary
drivers, Trajectory is partially derivative of the other three and weighs least.

## 2. Dimension scores

Each dimension has **5 questionnaire items** (see `docs/04-diagnostic-questionnaire.md`),
answered on a 0–4 scale, plus **deterministic modifiers** derived from profile fields.

```
base(d)  = 100 · Σᵢ (wᵢ · answerᵢ) / 4        (item weights wᵢ sum to 1 per dimension)
score(d) = clamp(base(d) + Σ modifiers(d), 0, 100)
```

### 2.1 Item weights

| Dim | Item | Weight |
|---|---|---|
| A | A1 Role–ambition coherence | 0.30 |
| A | A2 Skills utilization in current role | 0.25 |
| A | A3 Industry/domain fit with target future | 0.20 |
| A | A4 Values & interest fit | 0.15 |
| A | A5 Clarity of long-term goal | 0.10 |
| R | R1 Industry stability (5-yr outlook, self-assessed then KB-checked in review) | 0.25 |
| R | R2 Automation / obsolescence insulation of core skills | 0.25 |
| R | R3 Skill currency (how recently core skills were refreshed) | 0.20 |
| R | R4 Income/employer concentration (single-employer dependence) | 0.15 |
| R | R5 Financial/geographic flexibility to absorb a shock | 0.15 |
| T | T1 Scope/level growth over the last 3 years | 0.30 |
| T | T2 Learning velocity (new skills/credentials in last 12 months) | 0.20 |
| T | T3 Optionality signals (inbound interest, interviews, offers) | 0.20 |
| T | T4 Momentum self-assessment (expanding vs plateaued vs narrowing) | 0.20 |
| T | T5 Visibility of a credible next step | 0.10 |
| H | H1 Network strength (people who would take your call) | 0.30 |
| H | H2 Professional brand/visibility (LinkedIn, portfolio, talks, publications) | 0.25 |
| H | H3 Transferable-skill breadth across roles/industries | 0.25 |
| H | H4 Credentials & signaling assets | 0.10 |
| H | H5 Mentorship / sponsorship access | 0.10 |

### 2.2 Profile-derived modifiers

Applied after the base score, from structured profile fields (not questionnaire answers).
All values fixed; no judgment calls at scoring time.

| Dim | Condition (from profile) | Modifier |
|---|---|---|
| T | `yearsInCurrentRole ≥ 5` | −10 |
| T | `yearsInCurrentRole ≤ 1` and `careerStage ≠ "early"` | +5 |
| T | promotions/level changes in `workHistory` ≥ 2 within last 5 years | +5 |
| R | `industry` listed as `volatility: "high"` in the KB industry table | −10 |
| R | `industry` listed as `volatility: "low"` | +5 |
| H | `linkedInUrl` absent/empty | −5 |
| H | ≥ 3 distinct industries across `workHistory` | +5 |
| A | `concern` category (structured picklist) is `"misalignment"` | −5 |

Modifier caps: total modifiers per dimension are clamped to [−15, +10] before the final
clamp to [0, 100].

## 3. Bands (interpretation thresholds)

Fixed thresholds, used for both dimension scores and the overall Arth Score. Labels are
consistent with the language used on the site ("moderate trajectory risk" at 64–68).

| Range | Band | Interpretation |
|---|---|---|
| 85–100 | Strong | Compounding position; protect and extend |
| 70–84 | Stable | Sound, with targeted improvement areas |
| 55–69 | Watch | Moderate risk; erosion likely if unaddressed |
| 40–54 | Vulnerable | Structural weakness in this dimension |
| 0–39 | Critical | Immediate strategic attention required |

## 4. Worked example (hand-calculated unit-test fixture)

Profile "P1 — plateaued professional": questionnaire answers
A = [3,3,2,3,4], R = [2,2,1,2,3], T = [1,2,1,1,2], H = [3,4,3,2,2];
`yearsInCurrentRole = 6`, LinkedIn present, industry volatility "medium", 1 industry.

```
base(A) = 100·(0.30·3 + 0.25·3 + 0.20·2 + 0.15·3 + 0.10·4)/4 = 100·(2.90)/4 = 72.5
base(R) = 100·(0.25·2 + 0.25·2 + 0.20·1 + 0.15·2 + 0.15·3)/4 = 100·(1.95)/4 = 48.75
base(T) = 100·(0.30·1 + 0.20·2 + 0.20·1 + 0.20·1 + 0.10·2)/4 = 100·(1.30)/4 = 32.5
base(H) = 100·(0.30·3 + 0.25·4 + 0.25·3 + 0.10·2 + 0.10·2)/4 = 100·(3.05)/4 = 76.25

modifiers: T −10 (≥5 yrs in role) → T = 22.5 ; others 0
scores (rounded): A=73, R=49, T=23, H=76   [rounding at dimension level, after clamp]

ArthScore = round(0.30·72.5 + 0.25·48.75 + 0.20·22.5 + 0.25·76.25)
          = round(21.75 + 12.19 + 4.50 + 19.06) = round(57.50) = 58  → band "Watch"
```

Note: the overall score is computed from the *unrounded* dimension scores, then rounded
once. Dimension scores are rounded only for display. This rule is part of the spec so
implementations and hand calculations agree.

## 5. Determinism & test requirements (Week 2)

- Same profile in → same scores out, always (proposal metric: scoring consistency).
- Unit tests must include: the §4 worked example, the `/sample-score` calibration check
  (dimension scores 72/48/52/81 → overall 64), clamp behavior at both ends, and each
  modifier in isolation.
- `context/scoring-config.json` is the single machine-readable source of weights,
  modifiers, and bands; `src/scoring/` must read from it, never hard-code values, so the
  rubric document and code cannot drift independently.
