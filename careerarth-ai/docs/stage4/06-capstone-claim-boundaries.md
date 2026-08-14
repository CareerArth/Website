# Stage 4.6 — Capstone Claim Boundaries (What Stage 5 MAY and MAY NOT Say)

This document exists so Stage 5 does not accidentally overstate what Stages 1–4 have
actually shown. Every MAY NOT here corresponds to a specific gap named in the
[evidence audit](01-evidence-audit.md).

## Technical feasibility

**MAY:**
- "The project demonstrates the technical feasibility of an AI-assisted CareerArth
  diagnostic workflow: structured intake, deterministic scoring, retrieval-grounded
  report drafting, and human review, implemented end-to-end with 42 passing automated
  tests."
- "The architecture separates deterministic scoring from LLM-generated explanation by
  design, so the system's numeric outputs do not depend on model behavior."

**MAY NOT:**
- "The AI generates high-quality career reports" — no real (non-mock) report has ever
  been produced or read by anyone.
- "The system is production-ready" — it has no auth, no payment flow, unprotected
  review URLs, and single-process file storage, all explicitly logged as limitations.

## Business-model hypotheses

**MAY:**
- "The proposed business model uses the diagnostic as a lead-generation mechanism for
  human consultation, consistent with the shape of CareerArth's existing production
  funnel (free diagnostic → consultation CTA)."
- "Unit-economics modeling suggests consultant time, not LLM inference cost, is the
  dominant variable cost under the proposed model."

**MAY NOT:**
- "The diagnostic increases consultation conversion" — no comparison (with vs. without
  the AI diagnostic) has been run, and the existing funnel's real conversion rate was
  never measured in this project.
- "This business model is validated" — it is a reasoned recommendation among three
  compared options, not a tested outcome.

## Synthetic testing

**MAY:**
- "Six differentiated synthetic personas confirm the scoring and retrieval logic
  produce distinct, internally consistent outputs across a range of career situations,
  including sparse/atypical profiles (career-break re-entry)."
- "Automated tests (42/42 passing) verify scoring determinism and calibration against
  the published `/sample-score` example."

**MAY NOT:**
- "Testing on synthetic personas shows the product works for real users" — synthetic
  personas are QA fixtures, not a user sample; see
  [02-synthetic-mvp-results.md](02-synthetic-mvp-results.md) for the explicit boundary.
- "The ARTH score accurately predicts career outcomes" — the rubric's own methodology
  note disclaims this, and nothing in this project tests it.

## Pricing

**MAY:**
- "The project proposes INR pricing hypotheses (e.g., ₹1,999–₹4,999 per consultation)
  and a contribution-margin model, with every input explicitly labeled as an assumption
  pending real testing."
- "Estimated LLM cost per report ($0.05–$0.15) is derived from published model list
  prices and estimated token volume, since no live API call has been made."

**MAY NOT:**
- "The project proves customers are willing to pay ₹2,999" (or any price) — no customer
  has ever been shown a price, real or hypothetical, in this project.
- "LLM cost per report is $X" stated as measured fact — it is an estimate; state it as
  such every time it is cited.

## Customer validation

**MAY:**
- "No external customer validation has been conducted; Stage 4 defines a specific,
  ready-to-run pilot protocol and materials for the next phase."
- "The chosen ICP (stagnation-driven, mid-career professionals) is a reasoned hypothesis
  based on the scoring rubric's design and the production site's existing narrative."

**MAY NOT:**
- Any claim using the words "customers report," "users found," "participants said," or
  similar, unless it is explicitly followed by "(hypothesized)" or is drawn from a
  pilot that was actually run and documented. If Stage 5 is written before a real pilot
  runs, no such sentence should appear at all.
- "Product-market fit" in any form — the term should not appear as an achieved state.

## Scalability

**MAY:**
- "The deterministic scoring and retrieval components are low marginal cost and scale
  independently of consultant capacity."
- "Consultant review is the identified scaling constraint under the recommended
  business model, based on the unit-economics model in Stage 3."

**MAY NOT:**
- "The business is scalable" as an unqualified claim — scalability of the *product*
  (software) and scalability of the *business* (which depends on consultant capacity
  under the recommended model) are different claims and must not be conflated.

## Product-market fit

**MAY:**
- "This project establishes the technical and business-model groundwork required
  before product-market fit could be tested."

**MAY NOT:**
- Any statement asserting product-market fit exists, is likely, or is "close" — zero
  real customers have interacted with the product at the time of this capstone.

## A general rule for Stage 5 drafting

If a sentence describes what a **real person outside the project team** did, thought,
paid, or decided, it requires either (a) a citation to actual pilot data collected under
[04-pilot-protocol.md](04-pilot-protocol.md), or (b) explicit hedging language
("hypothesized," "proposed," "if validated"). If neither is present, the sentence should
not be in Stage 5.
