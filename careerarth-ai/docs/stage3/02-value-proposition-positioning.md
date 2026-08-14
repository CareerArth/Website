# Stage 3.2 — Value Proposition & Positioning

## Framing the ARTH score honestly

The scoring rubric ([02-arth-scoring-rubric.md](../02-arth-scoring-rubric.md)) is
explicit that its weights are heuristic, calibrated to reproduce one published example,
not empirically validated against career outcomes — and every generated report carries
this `methodologyNote` verbatim. Stage 3 positioning must inherit that honesty:

> **ARTH is a structured diagnostic framework for organising career information into
> four dimensions — Alignment, Risk Exposure, Trajectory, and Human Capital — not a
> scientifically validated psychometric instrument.** Its value is in forcing a
> structured, repeatable read of a career situation and connecting it to specific,
> cited evidence — not in the numeric precision of the score itself.

Any GTM or sales material that implies predictive or scientific validity misrepresents
the product as built and creates a claim the team cannot support if challenged.

## Incremental value over each alternative

| Alternative | What it's good at | What CareerArth adds |
|---|---|---|
| **Generic ChatGPT/Claude career chat** | Flexible, free, always available | (1) A fixed structure (A/R/T/H) instead of an open-ended conversation that depends on the user asking the right questions; (2) grounding — the MVP's report generator only cites `profile:`, `score:`, or `kb:` references and fails a groundedness lint if it doesn't ([06-llm-report-generation.md](../06-llm-report-generation.md)) — a raw chat has no equivalent discipline; (3) a mandatory human review layer before anything is treated as final. **Honest caveat:** a sufficiently well-prompted user could approximate much of this by pasting the same structured questions into Claude directly — see [06-competitive-analysis.md](06-competitive-analysis.md) on moat. |
| **Career coaches** | Deep, adaptive, high-trust human judgment | Lower cost and near-instant turnaround for the *diagnostic* stage, so the coach's paid time is spent on strategy and negotiation, not on reconstructing the client's situation from scratch. Positions the AI report as *coach-prep*, not coach-replacement. |
| **LinkedIn / career platforms** | Large data, job-market signal, network | A synthesized point-of-view instead of raw listings/content — CareerArth's output is a decision (a next-role recommendation with trade-offs), not a feed. |
| **Assessments / personality tests** (e.g. strengths finders) | Self-knowledge, well-established methodology | Career-specific and situational (uses current role, tenure, industry, concrete goals) rather than a static personality trait; produces an actionable 90-day plan, not just a profile. |
| **Free online resources (Reddit, blogs, YouTube)** | Breadth, real anecdotes, free | Personalization to the individual's actual profile and scores, in one place, in ~7 minutes, instead of hours of the user doing the synthesis themselves. |

## Positioning statement

> **For mid-career professionals who suspect they've stalled but can't tell why,
> CareerArth is a structured career diagnostic that turns a 5–7 minute intake into a
> scored, evidence-cited read of your Alignment, Risk, Trajectory, and Human Capital —
> reviewed by a human consultant — so your next career conversation starts from
> evidence instead of guesswork.**

What this statement deliberately does *not* claim: scientific validation of the score,
a replacement for human judgment, or a guaranteed outcome (salary, offer, placement) —
consistent with the hard rules already enforced in the report-generation system prompt
([06-llm-report-generation.md](../06-llm-report-generation.md) rule 3).
