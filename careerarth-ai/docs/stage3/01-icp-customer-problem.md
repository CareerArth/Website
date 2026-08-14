# Stage 3.1 — Initial Customer / ICP

## Beachhead segment

**Professionals experiencing career stagnation — 5–10 years of experience, mid-level
individual contributor or first-line manager, no promotion or scope change in 2+
years.**

This is chosen over the other two candidate segments for reasons specific to what the
MVP actually measures well:

| Candidate ICP | Why not the beachhead |
|---|---|
| Early-career professionals (1–3 yrs), uncertain about progression | Real pain, but low urgency and low willingness-to-pay — they are still learning the baseline of their first role, and "uncertain about progression" is diffuse rather than acute. Harder to get a paid consultation conversion from this group. |
| Professionals considering a role/industry switch | High-intent segment, but the MVP's knowledge base (18 roles / 3 industries) is its shallowest asset here — a switcher's core need is breadth of adjacent-role information, which is exactly what's most likely to be out-of-corpus. Good **secondary** segment once the KB grows. |
| **Professionals experiencing career stagnation** (chosen) | Matches the MVP's actual strongest signal: the ARTH rubric's Trajectory dimension has an explicit, deterministic penalty for `yearsInCurrentRole ≥ 5` ([02-arth-scoring-rubric.md](../02-arth-scoring-rubric.md) §2.2), and the demo persona built to exercise this exact pattern (`p1-plateaued`, "6 years in the same seat... no idea what the next move even is") produces a coherent, high-conviction diagnostic (Trajectory 23/Critical against Human Capital 76/Stable — a legible, actionable tension). Stagnation is also the pain the *production* CareerArth site already leads with ("gilded stagnation" narrative referenced in [07-evaluation-plan.md](../07-evaluation-plan.md), `p4-gilded-stagnation` persona). |

Narrowing further: **mid-career (5–10 yrs), currently employed, in professional services /
tech / finance / marketing roles** — the three industries the knowledge base actually
covers ([05-knowledge-base-and-retrieval.md](../05-knowledge-base-and-retrieval.md)).
Anyone materially outside this footprint gets the MVP's graceful-degradation path
(nearest-match + coverage note), which is a worse first experience and should not be
the segment used to prove the product.

## Job-to-be-done

"When I notice I've stopped growing but can't tell if the problem is me, my role, or my
industry, help me get an honest, structured read on where I actually stand — and a
credible next move — without me having to reconstruct my whole career history from
scratch to get it."

## Trigger events

- A denied promotion, a peer's promotion, or a reorg that surfaces the plateau.
- A performance review that is "solid" but not "exceptional" for the second year running.
- A LinkedIn moment — seeing a former peer's title change and feeling behind.
- A birthday/年-mark milestone ("I've been in this seat 5+ years").

## Pain points

1. **Diffuse anxiety, no structure.** They know *something* is off but can't name which
   part (skills? industry? network? ambition itself) — this is precisely the A/R/T/H
   decomposition the product is built to produce.
2. **Self-assessment is unreliable alone.** They over- or under-weight their own risk
   (addressed only partially by the MVP — see limitations below).
3. **Generic advice fatigue.** They have already read career-advice content; it didn't
   feel specific to them.
4. **High cost of a real conversation.** A career coach or consultant engagement feels
   like a big, vague, expensive commitment before they know if it's warranted.

## Existing alternatives (what they do today, absent CareerArth)

- Ask ChatGPT/Claude directly, in open chat, with no structured framework.
- Talk to friends/mentors informally (biased, small sample, no market grounding).
- Take a generic personality/strengths assessment (not career-transition specific).
- Do nothing until the discomfort becomes acute (quit abruptly, or don't move at all).
- Book an expensive career coach engagement (₹15,000–₹50,000+ range, multi-session,
  high commitment) — **assumption, unvalidated**, based on general market awareness of
  Indian career-coaching pricing, not primary research.

## Willingness-to-pay hypothesis

**Unvalidated hypothesis, to be tested in Stage 4:** this segment will not pay much for
the *diagnostic itself* (they can't yet tell if it's good), but will pay for a
**follow-up human consultation** once the diagnostic has demonstrated specificity and
correctly named their situation. This mirrors the free-diagnostic → paid-consultation
motion the production CareerArth site already runs (`/` → "Free Diagnostic... 5-Minute
Assessment" → `/consultation` "Talk to a Career Expert"). See
[03-business-model.md](03-business-model.md) for why this shapes the Stage 3
recommendation.

No pricing, conversion rate, or willingness-to-pay figure in this document set is drawn
from real customer data — none exists yet. All figures elsewhere in Stage 3 are labeled
hypotheses pending the Stage 4 pilot ([08-stage4-validation-plan.md](08-stage4-validation-plan.md)).
