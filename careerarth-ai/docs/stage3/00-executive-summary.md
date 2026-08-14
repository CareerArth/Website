# Stage 3 Executive Summary — Business Model, Positioning & GTM

*Prepared for entrepreneurship capstone review (ENT-CP-4997-1). Builds on the completed
Stage 1 specification (`docs/01–07`) and Stage 2 MVP (`docs/08`); no product changes were
made. Full detail in `docs/stage3/01`–`08`.*

## The customer

**Beachhead: mid-career professionals (5–10 yrs experience) experiencing career
stagnation** — no promotion or scope change in 2+ years, in the tech/finance/marketing
footprint the MVP's knowledge base actually covers. Chosen because it matches the ARTH
rubric's strongest built-in signal (a deterministic tenure penalty on the Trajectory
dimension) and the pain the production CareerArth site already leads with.

## Positioning

CareerArth is positioned as a **structured diagnostic**, not a validated psychometric
instrument — the ARTH score's own methodology note already disclaims empirical
validation, and Stage 3 positioning is built to match that honesty rather than oversell
it. Value over alternatives (ChatGPT, coaches, LinkedIn, assessments, free content) comes
from structure, citation discipline, and speed — not from any claimed algorithmic edge.

## Business model

**Recommended: free/low-cost AI diagnostic as top-of-funnel, paid human consultation as
the revenue event.** This is not a new model — the production site already runs this
motion informally (free "5-Minute Assessment" → "Talk to a Career Expert"). It also
matches how the MVP is actually built: the customer sees the AI report before consultant
review completes, so charging upfront for the report itself fights the product's real
delivery order.

## Pricing & unit economics (all hypotheses, explicitly unvalidated)

LLM cost is estimated — never measured — at **$0.05–$0.15/report** (~₹4–₹13), from the
real list price constants in `src/report/generate.ts` and estimated token volume. The
larger and more important finding: **consultant time, not LLM cost, is the dominant
variable cost** — in the base scenario (₹2,999 consultation, 10% conversion, 45-min
session), estimated contribution is ~₹2,089/customer; LLM cost is under 3% of that.
Conversion rate and session efficiency matter far more to margin than model choice.

## What's real vs. copyable

The RAG pipeline, the scoring weights, and the prompt design are all straightforward to
replicate — none constitute a technical moat. The honestly-differentiated part is
process and distribution: pairing AI speed with an actual human review step, on top of
an existing advisory relationship CareerArth already has with its market.

## First GTM channel

Direct outreach to the team's existing network matching the ICP, with an explicit
referral ask — free, fast, and doubles as Stage 4 pilot recruitment. Paid acquisition and
content are deliberately deferred until conversion is validated.

## Stage 4 is required before treating any of this as validated

Every conversion rate, price point, and willingness-to-pay figure here is a hypothesis
for a proposed 10–20 person pilot ([08-stage4-validation-plan.md](08-stage4-validation-plan.md))
— pre/post surveys, an interview guide, and WTP questions are designed but not run. Stage
4 has not begun.

## Files created (this deliverable)

```
careerarth-ai/docs/stage3/
  00-executive-summary.md          (this file)
  01-icp-customer-problem.md
  02-value-proposition-positioning.md
  03-business-model.md
  04-pricing-unit-economics.md
  05-customer-journey.md
  06-competitive-analysis.md
  07-lean-gtm.md
  08-stage4-validation-plan.md
```
