# Stage 3.8 — Proposed Stage 4 Validation Plan

**This is a proposal only.** No pilot has been run. No participant has been recruited.
Every question, metric, and threshold below is designed but not executed — Stage 4 is
explicitly out of scope for this deliverable. Nothing in this document should be read
as a result.

## Pilot design

- **Sample:** ~10–20 prospective users matching the Stage 3 ICP (mid-career, 5–10 yrs
  experience, stagnation signal), sourced via [07-lean-gtm.md](07-lean-gtm.md) channel 1–2.
- **Mode:** each participant completes the real intake (`web/intake.html`) and receives
  a real report — ideally with `ANTHROPIC_API_KEY` configured, since mock-generated
  reports are "readable but formulaic" and would understate the product's quality
  (`docs/08-mvp-implementation.md`, Known limitations). If a live key is not available
  for the pilot, this must be disclosed to participants and noted as a limitation of
  the pilot's own findings, not silently treated as equivalent.
- **Consent:** pipeline already refuses profiles with `consent !== true`
  (`src/pipeline.ts`); real participant data requires the same recorded-consent standard
  described for volunteer data in [06-llm-report-generation.md](../06-llm-report-generation.md).

## Pre-use questions (before intake)

1. In one sentence, what's prompting you to think about your career right now?
2. On a scale of 1–5, how stuck or stagnant do you currently feel in your career?
3. Have you used any career-assessment tool before (personality test, coach, AI chat
   for career advice)? Which, and how useful was it (1–5)?
4. Before you start: what would a genuinely useful outcome from this look like for you?

## Post-report survey

| # | Question | Scale/type |
|---|---|---|
| 1 | How well did this report describe your actual situation? | 1–5 |
| 2 | How specific did this feel to you, versus generic career advice? | 1–5 |
| 3 | How much do you trust the ARTH score as a fair read of your situation? | 1–5 |
| 4 | Did anything in the report surprise you? | Free text |
| 5 | Did the report clarify or change how you're thinking about a career decision? | Yes, clearly / Somewhat / No |
| 6 | If yes/somewhat to Q5 — what specifically changed? | Free text |
| 7 | How likely are you to want a follow-up conversation with a consultant about this? | 1–5 |
| 8 | How long did the intake feel like it took, versus how long it actually took? | Free text + actual time (auto-logged via `intake_started`/`intake_completed`) |

## Short interview guide (5–10 min, subset of participants)

1. Walk me through your reaction as you read the report — where did you slow down or
   re-read something?
2. Was there a moment you disagreed with the report? What was it, and why?
3. If a friend in a similar spot asked whether this was worth their time, what would you
   tell them?
4. What would make you actually book and pay for a follow-up consultation — and what
   would stop you?
5. Was there anything the report clearly got wrong or missed about your situation?

## Willingness-to-pay questions

1. If this diagnostic had cost ₹[X] upfront, would you still have done it? (Ask at
   two or three price anchors, e.g. ₹0 / ₹299 / ₹999, to gauge the free-tier boundary.)
2. What would you expect to pay for a live follow-up consultation based on this report?
   (Open-ended, before showing any price — avoid anchoring bias.)
3. Which would you prefer: (a) pay a small amount for the diagnostic alone, (b) free
   diagnostic + pay for a consultation, (c) pay more upfront for a diagnostic + guaranteed
   human review bundled together? [Maps directly to Models A/B/C in
   [03-business-model.md](03-business-model.md).]
4. Would you pay again for a repeat/updated diagnostic in 6–12 months? Why or why not?

## Metrics table

| Metric | Source | Proposed success threshold | Proposed failure threshold |
|---|---|---|---|
| Intake completion rate | `funnel.intakeCompletionRate` (already instrumented) | ≥ 80% | < 50% |
| Median intake completion time | `intake_started`→`intake_completed` timestamps | 5–8 min (matches "5–7 min" product promise) | > 12 min |
| Perceived usefulness | `usefulness_rating` widget, 1–5 | Avg ≥ 3.5 | Avg < 3.0 |
| Trust in the score | Post-report survey Q3 | Avg ≥ 3.5 | Avg < 3.0 |
| Decision-clarifying effect | Post-report survey Q5 | ≥ 50% "clearly" or "somewhat" | < 25% "clearly"/"somewhat" |
| Consultation interest rate | `funnel.consultationInterestRate` (already instrumented) | ≥ 30% of report viewers | < 10% |
| Willingness to pay (consultation) | WTP Q2, median stated value | Median ≥ ₹1,500 | Median < ₹500 or "wouldn't pay" majority |
| Preferred product model | WTP Q3 distribution | Clear majority (≥50%) for one model | No majority — 3-way split (signals the model choice itself needs more testing) |
| Consultant review time/edit burden | `consultantOps.avgReviewMinutes`, `avgEditedChars` (already instrumented) | ≤ 20 min avg, low edit volume (AI draft mostly usable) | > 40 min avg or heavy rewrites (AI draft not saving real time) |

## Interpreting a mixed result

Because this is a 10–20 person pilot, treat any single metric near its threshold as
inconclusive rather than a hard pass/fail — the qualitative interview data (which
specific claims triggered trust or distrust, what people said they'd actually pay) should
weigh at least as heavily as the quantitative averages at this sample size. The
instrumentation already built (`src/metrics.ts`) means most of the quantitative side
requires no new engineering — only running real participants through the existing flow.
