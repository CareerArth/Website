# Stage 3.4 — Pricing & Unit Economics

**Every figure below is a hypothesis, not a measurement.** No pricing test, no paid
customer, and no live Claude API call has occurred (`ANTHROPIC_API_KEY` was never
configured — every run to date used the deterministic mock generator,
`src/report/mock.ts`). This document builds a unit-economics *model* so the numbers can
be replaced with real ones once Stage 4 produces them.

## 1. LLM cost — explicitly an estimate, not a measurement

`src/report/generate.ts` hardcodes the real list price for `claude-opus-5`:
`PRICE_IN = $5`/MTok input, `PRICE_OUT = $25`/MTok output. No run has ever gone through
this code path with a real key, so token counts are estimated from prompt structure,
not observed:

| Component | Estimated tokens | Basis |
|---|---|---|
| System prompt (cacheable) | ~400–500 | Fixed text in `generate.ts`, counted directly |
| Profile + scores (per report) | ~300–500 | Structure in a real run (`data/runs/p1-plateaued.json`) |
| Retrieved KB entries (top 5) | ~750–1,250 | 5 entries × ~150–250 tokens each, per the schema in [05-knowledge-base-and-retrieval.md](../05-knowledge-base-and-retrieval.md) |
| **Input total (uncached)** | **~1,500–2,500** | Sum of the above |
| Output (structured JSON report) | **~1,500–4,000** | `max_tokens: 8000` is a ceiling, not an estimate; based on section count and the mock report's length as a floor |

```
ESTIMATED cost/report = (input/1e6 × $5) + (output/1e6 × $25)
  low:  1,500 in, 1,500 out → $0.0075 + $0.0375 = $0.045
  high: 2,500 in, 4,000 out → $0.0125 + $0.100  = $0.1125
```

**→ Estimated LLM cost range: $0.05–$0.15 per report (≈ ₹4–₹13 at an assumed ₹85/$1 —
illustrative FX rate, not fetched live).** This is broadly consistent with the informal
"$0.10–0.25/report" note already in `docs/08-mvp-implementation.md`, which was also
written before any real API call and should be treated with the same caution.

Prompt caching (`cache_control: ephemeral` on the system prompt) could reduce input cost
materially at volume, since the system prompt is identical across all customers — this
is a real lever, not a hypothesis, but its size depends on request concurrency/timing
that only production traffic will reveal.

## 2. Consultant review/session cost — assumption

No real consultant time-tracking data exists yet; `src/metrics.ts` computes
`avgReviewMinutes` and `avgEditedChars` from the review workflow, but only synthetic/QA
runs have gone through it. For modeling purposes:

- **Assumed loaded consultant cost: ₹800–₹1,500/hour** (unvalidated — an illustrative
  Indian career-consulting rate, not sourced from CareerArth's actual consultant costs).
- **Assumed time per paid consultation session: 30–60 minutes**, informed by the
  production `/consultation` page's framing ("Positioning Analysis, Risk
  Identification, Strategic Direction" — a substantive single session, not a quick call).

Under the Model B recommendation ([03-business-model.md](03-business-model.md)), the
paid consultation *is* the human-review touchpoint — the consultant discusses the
already-generated AI draft with the client live, rather than reviewing it silently
beforehand for every free user. This keeps the free diagnostic tier from inheriting a
per-user consultant cost it cannot support at volume; it is a sequencing choice this
document proposes, not something already built.

## 3. Pricing hypotheses (INR) and contribution model

Per Model B: diagnostic is free; the paid consultation is the revenue event. Contribution
per **paying** customer must also absorb the diagnostic (LLM) cost of the *non-paying*
users who tried it first — i.e. amortized over the free→paid conversion rate, itself an
unvalidated assumption pending Stage 4's "consultation interest" and
"willingness-to-pay" questions ([08-stage4-validation-plan.md](08-stage4-validation-plan.md)).

```
contribution/paying customer =
    consultation price
  − (estimated LLM cost per report ÷ assumed conversion rate)   ← amortized free-tier cost
  − consultant session cost
  − payment gateway fee (~2.5%, assumed)
```

| Scenario | Price (₹) | Assumed conversion | Amortized LLM cost | Assumed session time / rate | Session cost | Gateway fee | **Contribution/customer** |
|---|---|---|---|---|---|---|---|
| Conservative | 1,999 | 5% | $0.15 ÷ 5% ≈ ₹255 | 60 min @ ₹1,500/hr | ₹1,500 | ₹50 | **≈ ₹194** |
| Base | 2,999 | 10% | $0.10 ÷ 10% ≈ ₹85 | 45 min @ ₹1,000/hr | ₹750 | ₹75 | **≈ ₹2,089** |
| Upside | 4,999 | 20% | $0.05 ÷ 20% ≈ ₹21 | 30 min @ ₹800/hr | ₹400 | ₹125 | **≈ ₹4,453** |

**All of the following are unvalidated assumptions, explicitly flagged:** consultation
price points, free→paid conversion rate, consultant hourly rate, session length, and the
FX rate used to convert the estimated USD LLM cost.

## 4. What this model actually shows

The dominant lever on contribution margin is **conversion rate and consultant session
time — not LLM cost.** Even in the conservative scenario, LLM cost is ~1–13% of price;
consultant time is the largest variable cost by an order of magnitude. This has a
direct implication for GTM and product sequencing: efforts to improve unit economics
should target conversion quality (does the free diagnostic make people want the paid
session?) and consultant efficiency (does the AI draft measurably shorten the session,
consistent with the "copilot saves prep time" sub-question in
[07-evaluation-plan.md](../07-evaluation-plan.md)) — not LLM cost optimization, which is
already a rounding error at this price range.

The conservative scenario's thin ₹194 contribution is a real risk if conversion runs
below 5% or sessions run longer than 60 minutes; Stage 4 should treat conversion rate as
the single most important number to de-risk before committing to Model B at scale.
