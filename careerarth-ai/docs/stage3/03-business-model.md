# Stage 3.3 — Business Model Comparison & Recommendation

No product changes are proposed here — this section evaluates monetization models
**against the MVP exactly as built**, including its real constraints (mandatory-ish
human review workflow, per-report LLM cost, unauthenticated review URLs).

## The three models

### A. Paid AI diagnostic report

Customer pays upfront for the AI-generated report itself (with or without consultant
review as a paid add-on).

- **Customer value:** clear, one-time, low-commitment.
- **Trust:** hardest model — asking for payment *before* the customer has seen any
  evidence the product works, for a product whose scoring methodology explicitly
  disclaims validation. High perceived risk for the customer.
- **Scalability:** good — marginal cost is just the LLM call (see
  [04-pricing-unit-economics.md](04-pricing-unit-economics.md)), no consultant time
  required if review is optional.
- **Consultant dependency:** low, unless review is bundled.
- **Margins:** high if review is not bundled; the MVP's mandatory-review design
  intent ([06-llm-report-generation.md](../06-llm-report-generation.md): "No draft is
  ever delivered without a `final.md`") pushes toward bundling, which erodes margin.
- **Fit with current MVP:** weak — the built server delivers the customer-facing report
  in `draft` status immediately after generation, *before* any consultant review
  happens (`src/pipeline.ts` → `saveRun` → customer sees `/report/:id`; `status` only
  flips to `reviewed` after a separate `/review/:id` submission — `src/server.ts`).
  Charging upfront for something explicitly labeled a draft is a hard sell.

### B. Free/low-cost diagnostic → paid consultation

Diagnostic report is free or near-free (loss-leader); revenue comes from a paid
human consultation booked afterward.

- **Customer value:** low-risk entry point; the customer experiences the product's
  specificity before committing money.
- **Trust:** highest of the three — no payment gate before value is demonstrated.
- **Scalability:** diagnostic side scales cheaply (LLM cost only); revenue is bounded
  by consultant capacity, same as any coaching business.
- **Consultant dependency:** high for revenue, but consultant time is spent only on
  customers who already showed intent (booked a consultation), which is efficient
  targeting of scarce human time.
- **Margins:** consultation margins are whatever the underlying advisory business
  already runs at; the diagnostic is a customer-acquisition cost, not a profit center.
- **Fit with current MVP:** **strong, and already the live GTM motion.** The production
  site (`app/page.tsx`) already advertises "Free Diagnostic... 5-Minute Assessment"
  and routes to `/consultation` ("Talk to a Career Expert", `app/consultation/page.tsx`)
  with no price shown — i.e., production CareerArth is *already* running Model B
  informally. This AI MVP is a direct upgrade to the diagnostic step of a model that
  already exists, not a new model requiring new customer behavior.

### C. AI diagnostic + human-reviewed premium career strategy

A single paid, premium product where the AI diagnostic and the human review/strategy
session are sold together as one offering.

- **Customer value:** highest per-unit — combines speed (AI) with judgment (human) in
  one purchase.
- **Trust:** good, if priced to signal "expert-reviewed," but requires the review to be
  substantive and fast enough not to bottleneck delivery.
- **Scalability:** capped by consultant review throughput — every paid unit consumes
  consultant minutes (`consultantOps.avgReviewMinutes`, `src/metrics.ts`, is exactly the
  instrumentation that would reveal this cap in practice).
- **Consultant dependency:** highest of the three.
- **Margins:** healthiest per unit, but the business is structurally a
  consulting/services business with an AI-accelerated front end, not a
  software-margin business.
- **Fit with current MVP:** closest to the *original* Stage-1 spec's intent (mandatory
  human review of every draft), but not how the Stage-2 MVP actually gates delivery
  (see Model A note above — the customer report ships before review completes). Making
  this the *initial* commercial model would require re-sequencing the flow so payment
  and delivery both wait on review — a process change, not a product rebuild, but real
  work beyond what exists today.

## Comparison summary

| | A. Paid diagnostic | B. Free diagnostic → paid consult | C. AI + human premium bundle |
|---|---|---|---|
| Customer trust at time of payment | Low | High | Medium–High |
| Scalability | High | High (diagnostic) / capped (consult) | Capped |
| Consultant dependency | Low | High, but well-targeted | Highest |
| Margin per unit | High | Depends on advisory margin | Highest, but services-shaped |
| Matches MVP as built | Weak (draft-status mismatch) | **Strong (already live)** | Medium (needs re-sequencing) |

## Recommendation: **Model B — free/low-cost AI diagnostic as the top of funnel, paid
human consultation as the revenue event.**

Rationale, in order of weight:

1. **It requires no product change.** It formalizes and instruments a motion
   (`Free Diagnostic → Talk to a Career Expert`) that the production CareerArth site
   is already running. Stage 3 is explicitly scoped to *not* rebuild or expand the MVP.
2. **It matches the MVP's actual delivery order** (report shown before review
   completes) instead of fighting it.
3. **It de-risks the trust problem created by the rubric's own honesty disclaimer** —
   asking for money before the customer has evidence the score means anything would
   undercut the "we don't overclaim" positioning in
   [02-value-proposition-positioning.md](02-value-proposition-positioning.md).
4. **Model C is a credible Phase 2 evolution**, once Stage 4 validation shows the
   diagnostic reliably converts to consultation interest and the team wants to capture
   more value per customer directly rather than through a downstream advisory sale —
   but that requires evidence this document set does not yet have.

This recommendation is a hypothesis for Stage 4 to test, not a settled decision — see
[08-stage4-validation-plan.md](08-stage4-validation-plan.md) item on "preferred product
model."
