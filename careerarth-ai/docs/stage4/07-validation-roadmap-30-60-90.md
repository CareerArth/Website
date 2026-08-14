# Stage 4.7 — Post-Capstone 30/60/90-Day Validation Roadmap

Scoped to validation only. No new product features are proposed; anything not already
built is deferred until evidence justifies it.

## Days 1–30 — First real signal

- Run 3–5 real personas through the pipeline with a live API key; read the output
  before anyone else does (Assumption #1).
- Recruit and run the 10–20 person pilot per [04-pilot-protocol.md](04-pilot-protocol.md)
  using the materials in [05-research-materials.md](05-research-materials.md).
- Pull real analytics from the production site's existing free-diagnostic →
  consultation funnel (Assumption #9) — cheapest, highest-leverage data point available
  and requires no new participants.
- Deliverable at day 30: pilot results filled into the data schema, compared against
  the success/failure thresholds, and a go/no-go read on Assumptions #1–4.

## Days 31–60 — Pricing and consultant economics

- If day-30 results are not a clear "no": run the willingness-to-pay questions against
  a second small batch (can overlap with pilot recruitment) at 2–3 concrete price
  anchors instead of only open-ended, to sharpen the pricing hypothesis.
- Time a real consultant review (ideally not the developer) of a real Claude-generated
  report end-to-end — tests Assumption #7 directly, the input Stage 3's unit-economics
  model is most sensitive to.
- Decide, with real numbers now available, whether Model B (Stage 3 recommendation)
  still holds or whether Model A/C looks better given actual conversion and review-time
  data.
- Deliverable at day 60: a revised unit-economics model using measured, not estimated,
  LLM cost and consultant time.

## Days 61–90 — Report quality and go/pivot decision

- Run the groundedness lint and a manual spot-check against real (not mock) generated
  reports at pilot scale — confirms whether the citation discipline holds up outside
  the 6 controlled synthetic personas.
- Synthesize all pilot + funnel + economics data against the
  [business assumption register](03-business-assumption-register.md) thresholds.
- Make an explicit **continue / revise / pivot / stop** decision:
  - **Continue** if intake completion, trust, and consultation interest all clear
    threshold and unit economics are not negative in the base case.
  - **Revise** if the product signal is good but the ICP, price, or business model
    assumption fails — adjust that one variable and re-test cheaply rather than
    rebuilding.
  - **Pivot** if the diagnostic itself doesn't land (low trust/accuracy scores)
    regardless of business model — the problem is upstream of pricing/GTM.
  - **Stop** if intake completion is low *and* consultation interest is low *and*
    real report quality reads as generic — indicates the core value prop, not just
    packaging, isn't there.
- Deliverable at day 90: a short written decision memo (1–2 pages) stating which of the
  four outcomes applies and why, citing specific numbers against specific thresholds —
  not a general impression.

## Explicitly out of scope for this roadmap

Payment integration, consultant dashboard, KB expansion, authentication, and any other
engineering work stay deferred until the day-90 decision is "continue" — building any of
them earlier would spend effort validation hasn't yet justified.
