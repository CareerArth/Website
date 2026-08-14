# Stage 4 Executive Summary — Validation Readiness, Evidence & Limitations

*Prepared for entrepreneurship capstone review (ENT-CP-4997-1). Builds on the completed
Stage 1 specification, Stage 2 MVP, and Stage 3 business plan. No product changes were
made. Full detail in `docs/stage4/01`–`07`.*

## What has actually been proven

A working, deterministic, automated-tested pipeline: structured intake → fixed-rubric
ARTH scoring → curated-KB retrieval → grounded report drafting (schema + citation lint)
→ human review workflow → instrumentation. Re-verified directly for this audit: **42/42
tests pass**, and the 6 synthetic personas produce genuinely differentiated scores
(42–88 overall, all four bands touched) confirming the scoring/retrieval logic responds
to input rather than defaulting. This is real evidence of **technical correctness of a
deterministic system** — nothing more.

## What remains completely unvalidated

Everything that requires a real person outside the project team. Confirmed directly: every
report ever produced in this repo has `generator: "mock"` — **no one has ever read a real,
Claude-generated report from this system**. No `intake_completed` event has ever been
logged. The consultant review workflow was exercised exactly once, by the developer, on
a synthetic profile. All pricing, ICP, conversion-rate, and willingness-to-pay figures
in Stage 3 are labeled hypotheses with zero supporting evidence, synthetic or real.

## Top 5 business assumptions (full register: [03](03-business-assumption-register.md))

1. A real Claude-generated report is meaningfully better than the mock template.
2. The chosen ICP (stagnation-driven, mid-career professionals) recognizes itself in
   the report and finds it credible.
3. Free-diagnostic → paid-consultation conversion is high enough to sustain Model B.
4. Real users can complete the 20-item questionnaire without excessive drop-off.
5. People will state a realistic, viable willingness to pay for the consultation.

## Proposed real-user pilot

10–20 participants matching the ICP: recruit → consent → pre-survey → real diagnostic
→ report → post-survey → willingness-to-pay questions → optional 10-min interview →
consultation-interest click, all logged through instrumentation that **already exists**
(`src/metrics.ts`, `data/events.jsonl`) — no new engineering required. Full protocol and
ready-to-send materials: [04](04-pilot-protocol.md), [05](05-research-materials.md).

## Claims Stage 5 must avoid

No claim that customers validated pricing, that product-market fit exists or is close,
that the diagnostic increases real consultation conversion, that synthetic personas
represent real users, or that any dollar/rupee cost or willingness-to-pay figure is
measured rather than estimated. Full MAY/MAY-NOT list: [06](06-capstone-claim-boundaries.md).

## Files created

```
careerarth-ai/docs/stage4/
  00-executive-summary.md              (this file)
  01-evidence-audit.md
  02-synthetic-mvp-results.md
  03-business-assumption-register.md
  04-pilot-protocol.md
  05-research-materials.md
  06-capstone-claim-boundaries.md
  07-validation-roadmap-30-60-90.md
```
