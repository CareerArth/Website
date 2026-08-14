# Appendix A — Business & Validation

**CareerArth AI · Aryan Bhandari · for Professor Tushar Jaruhar**

Consolidates the Stage 3 business analysis and Stage 4 validation kit. Everything in
this appendix is a **hypothesis or a designed-but-unexecuted instrument** unless marked
[DEMONSTRATED]. Source: `docs/stage3/`, `docs/stage4/`.

---

## A1. ICP and Job-To-Be-Done

**Beachhead:** mid-career professionals, 5–10 years of experience, no promotion or
material scope change in 2+ years, employed, within the tech/finance/marketing footprint
of the 18-role knowledge base.

**Why this segment (and not the others considered):**

| Candidate | Verdict |
|---|---|
| Early-career (1–3 yrs) | Real pain, diffuse urgency, weakest WTP case — secondary audience |
| Role/industry switchers | High intent, but their core need (breadth of adjacent-role knowledge) stresses the product's thinnest asset |
| **Stagnating mid-career** | Matches the rubric's strongest built-in signal (deterministic tenure penalty on Trajectory) and the production brand's existing "gilded stagnation" narrative |

**JTBD:** "When I've stopped growing but can't tell if the problem is me, my role, or my
industry — give me an honest, structured read and a credible next move, without a big
commitment first."

**Triggers:** denied/bypassed promotion · second consecutive "solid" review · peer's
title change · tenure milestone.

**WTP hypothesis:** low for the diagnostic itself; real for the follow-up consultation
*after* the diagnostic demonstrates specificity. The single most important untested
assumption.

## A2. Business model comparison

| Criterion | A. Paid AI report | **B. Free → paid consult (recommended)** | C. Premium bundle |
|---|---|---|---|
| Trust at payment | Low — pay before evidence | **High — value first** | Medium-high |
| Scalability | High | Diagnostic scales; revenue capped by consultant hours | Capped |
| Consultant dependency | Low | High, but only on high-intent clients | Highest |
| Margins | High if unbundled | Advisory margins; diagnostic = CAC | Highest/unit, services-shaped |
| Fit with MVP as built | Weak (report ships as draft pre-review) | **Strong — mirrors built flow + live site funnel** | Needs re-sequencing |

**Recommendation: B.** No product change required; matches the real delivery order;
avoids charging for an explicitly-disclaimed heuristic score; C remains the phase-2
evolution once conversion evidence exists.

## A3. Pricing & unit economics (all inputs assumptions)

Estimated AI cost/report: **$0.05–$0.15 (~₹4–₹13 at an assumed ₹85/$)** — derived from
published list prices (input $5/MTok, output $25/MTok) × estimated token volume
(~1,500–2,500 in / ~1,500–4,000 out). **Never measured live.**

Contribution = price − (AI cost ÷ conversion) − consultant session − ~2.5% gateway:

| Scenario | Price | Conversion | Session | AI amortised | **Contribution** |
|---|---|---|---|---|---|
| Conservative | ₹1,999 | 5% | 60 min @ ₹1,500/hr | ≈ ₹255 | **≈ ₹194** |
| Base | ₹2,999 | 10% | 45 min @ ₹1,000/hr | ≈ ₹85 | **≈ ₹2,089** |
| Upside | ₹4,999 | 20% | 30 min @ ₹800/hr | ≈ ₹21 | **≈ ₹4,453** |

Structural finding: conversion rate and consultant minutes dominate; AI cost is 1–13% of
price. Conservative-case margin is thin enough that conversion below ~5% or sessions
beyond ~60 min break the model — the pilot's most important numbers.

## A4. Funnel map vs. existing instrumentation [instrumentation DEMONSTRATED]

| Stage | Desired action | Main friction | Metric | Already measured? |
|---|---|---|---|---|
| Discovery / landing | Click "Free Diagnostic" | Skepticism, unclear differentiation | landing → intake start | No (production site, out of scope) |
| Intake | Complete 8-screen wizard | 20-item fatigue | `intake_completion_rate` + per-step drop-off | **Yes** |
| Report | Read, engage | Generic feel; trust gap on unvalidated score | `report_viewed`, `usefulness_rating` | **Yes** |
| Consultation interest | Click CTA | Free-AI → paid-human leap | `consultation_interest` rate | **Yes** |
| Paid service | Book + pay | **No booking/payment exists** | would need new events | **No — known gap** |
| Follow-up/referral | Return, refer | No mechanism | — | **No — known gap** |

## A5. Competition (summary)

| | Personalisation | Structure | Actionability | Human | Trust | Speed | Price | Career grounding |
|---|---|---|---|---|---|---|---|---|
| LLM chat | Med | None | Med | None | Low-Med | Instant | Free | None inherent |
| Coach | High | Varies | High | Full | High | Slow | High | High |
| LinkedIn | Low | Low | Low | None | Med | Instant | Free-low | Med |
| Assessments | Low-Med | High | Low | None | Med | Fast | Free-low | Low |
| Free content | None | None | Low-Med | None | Low | Instant | Free | Varies |
| **CareerArth** | Med-High | **High** | Med-High | **Partial (real review)** | Med (earned, not claimed) | **Fast** | Free → paid consult | Med (18-role curated KB) |

Honest moat statement: technology copyable in weeks; the bet is brand + funnel +
human-review trust posture; durable assets (funnel data, outcome tracking) must be built.

## A6. Lean GTM (first 10–50 users)

1. **Direct outreach** to known ICP-matching contacts (~10) — doubles as pilot
   recruitment. 2. **Referral ask** inside every pilot conversation (~20). 3. **Honest
   prototype-tester posts** in career communities (~20). Deferred: alumni networks
   (wrong ICP fit), partnerships (premature), content (too slow for n=50), paid (no).

## A7. Assumption register (top 10, ranked)

| # | Assumption | Current evidence | Cheapest test | Threshold |
|---|---|---|---|---|
| 1 | Real Claude report ≫ mock template | **None — zero real generations** | Generate 3–5, read them | Team judges showable |
| 2 | ICP finds report credible/accurate | None | Pilot survey Q1–3 | ≥3.5/5 |
| 3 | Free→paid conversion sustains Model B | None (live funnel shape only) | CTA rate (instrumented) | ≥30% interest |
| 4 | Users complete the 20-item intake | **Zero completions ever logged** | Completion rate (instrumented) | ≥80%, 5–8 min |
| 5 | WTP clears viable floor | None | Unanchored WTP question | Median ≥₹1,500 |
| 6 | Honesty disclaimer doesn't kill trust | None | Survey trust Q + interview | ≥3.5/5 despite disclosure |
| 7 | Consultant review ≤ ~20 min | One QA point (6.5 min, developer, synthetic) | Time a real review of a real report | ≤20 min avg |
| 8 | KB covers pilot cohort | Personas were written to fit | `currentRoleMatched` rate | ≥80% matched |
| 9 | Production funnel converts non-trivially today | Page copy only | Pull site analytics | Baseline established |
| 10 | Users perceive difference vs ChatGPT | None | Interview Q3 | Majority name a specific reason |

## A8. Pilot protocol (designed, not executed)

**Prerequisite:** generate and read 3–5 real Claude reports before recruiting anyone.

Recruit (15–25 invited → 10–20 complete) → consent → pre-survey (4 Q) → real intake →
real report → post-survey (8 Q) → WTP (4 Q) → optional 10-min interview (5–8 people) →
CTA-click measurement. Every quantitative step uses existing instrumentation; a
one-tab spreadsheet (schema drafted in Stage 4) holds the rest. Real participants:
`isSynthetic: false`, recorded consent, data kept out of the repository.

## A9. Research instruments (ready to send — full text in `docs/stage4/05`)

- **Recruitment message** (short, honest, "prototype — no sales pitch")
- **Consent text** (AI-generated + human-reviewed, not licensed counselling; local
  storage; deletion on request; 18+; voluntary)
- **Pre-survey:** prompt, stuck-ness 1–5, prior tools, definition of "useful"
- **Post-survey:** accuracy · specificity · trust (1–5); surprise; decision impact
  (clearly/somewhat/no); consultation likelihood 1–5; perceived vs actual time
- **WTP block:** unanchored consultation price → diagnostic anchors ₹0/₹299/₹999 →
  model preference A/B/C → repeat-use intent
- **Interview guide:** walk-through reaction · disagreement moment · tell-a-friend ·
  what would make you book/pay · what we got wrong

## A10. Success/failure thresholds (pre-committed)

| Metric | Success | Failure |
|---|---|---|
| Intake completion | ≥ 80% | < 50% |
| Median intake time | 5–8 min | > 12 min |
| Accuracy/trust (avg) | ≥ 3.5/5 | < 3.0/5 |
| Decision-clarifying effect | ≥ 50% clearly/somewhat | < 25% |
| Consultation interest | ≥ 30% | < 10% |
| WTP (median, unanchored) | ≥ ₹1,500 | < ₹500 / majority "wouldn't pay" |
| Preferred model | ≥ 50% for one option | 3-way split |
| Consultant review | ≤ 20 min avg | > 40 min / heavy rewrites |

At n=10–20, any metric within ~10% of threshold is inconclusive; interview evidence
governs. Results feed the day-90 continue/revise/pivot/stop memo.
