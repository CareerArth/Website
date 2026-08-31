# 09 — Admin Dashboard & New Questionnaire (Demo Prep + Q&A)

This document exists so you (Aryan) can demo this change confidently and answer
follow-up questions without re-deriving the reasoning live. It covers two things
Professor Tushar Jaruhar asked for: (1) an admin dashboard to change ARTH scoring
weights, and (2) swapping in the questionnaire from `CA_BADS_Summer_2026_D2.xlsx`.

## What changed, in one paragraph

The 20-item ARTH questionnaire (item IDs `A1`–`H5`) was replaced with the professor's
wording and scoring key. Because his spreadsheet has exactly 5 items per Framework
(Alignment/Risk/Trajectory/Human Capital), in the same order as the existing four
dimensions, the swap kept the same item IDs — so nothing about validation, the scoring
formula, or the database of career roles had to change; only the question text, the
1–5 Likert display, and which items are reverse-scored changed. Separately, a new
`/admin` page lets anyone edit scoring weights, band thresholds, and modifier deltas
through a form instead of hand-editing JSON, and those edits now apply immediately
(no server restart), which wasn't true before this change.

## How ARTH scoring actually works (for the demo/Q&A)

1. **Intake** — a respondent answers 20 Likert items (5 per dimension) plus some
   profile fields (role, industry, tenure, etc.).
2. **Scoring** (deterministic, `src/scoring/score.ts`) — each dimension's score is a
   *weighted average* of its 5 items, scaled to 0–100, then a few fixed **modifiers**
   adjust it based on profile facts (e.g. −10 points to Trajectory if you've been in
   your role 5+ years). The overall Arth Score is a weighted average of the four
   dimension scores. **The AI never computes or touches these numbers.**
3. **Retrieval** — the profile is matched against 18 curated career roles to find
   relevant paths.
4. **AI analysis** — an LLM (or, currently, a deterministic mock generator — see
   `docs/08-mvp-implementation.md`) writes an explanation of the already-computed
   scores, citing evidence for every claim.
5. **Human review** — a consultant can approve/edit the draft before it's final.

The weights, modifiers, and bands that drive step 2 all live in one file,
`context/scoring-config.json` — that's exactly what the new `/admin` page edits.

## The new questionnaire: full mapping

Source: `CA_BADS_Summer_2026_D2.xlsx`, Professor Tushar Jaruhar. Full item text is in
`docs/04-diagnostic-questionnaire.md`; this table is the quick-reference for the demo.

| ID | Dimension | Sheet row | Reverse-scored? |
|---|---|---|---|
| A1–A5 | Alignment | 1–5 | A4 only |
| R1–R5 | Risk Exposure | 6–10 | R3, R5 |
| T1–T5 | Trajectory | 11–15 | T4 only (**see flag below re: T3**) |
| H1–H5 | Human Capital | 16–20 | H4 only (**see flag below re: H2**) |

Reverse-scored means: the item describes something *bad* (financial fragility,
restricted choices, stalled career), so agreeing with it should *lower* the score.
The intake UI stores `4 − Likert position` for these instead of the raw position.

## Open question for the professor — please raise this before relying on exact scores

Two items — **T3** ("Real opportunities for promotion... have become infrequent for
you") and **H2** ("Your LinkedIn... does not clearly communicate...") — are phrased
just as negatively as the five reverse-scored items above, but the spreadsheet keys
them **forward** (Strongly Agree = highest raw score), not reversed. This was
implemented exactly as the sheet specifies — nothing was silently "corrected" — but the
effect is concrete and worth showing:

- **p1 (plateaued)** honestly agrees ("Strongly Agree") that promotion opportunities
  have become infrequent — true and central to his story — but because T3 is
  forward-keyed, that answer adds points to his Trajectory score instead of
  subtracting them.
- **p5 (high performer)**, who is unambiguously thriving, correctly *disagrees* that
  opportunities are infrequent — and that disagreement scores the *worst possible*
  value on T3, the only item where she doesn't max out.
- The same pattern shows up on **H2** for p2, p5, and p6: agreeing that your LinkedIn
  profile is weak (true for someone with no profile at all) scores as a *positive*
  contribution to Human Capital.

**Ask the professor directly:** were T3 and H2 intentionally left forward-keyed, or
should they be reverse-scored like their neighbors (T4, H4)? If reverse, the fix is a
two-character change in `web/intake.js` (`false` → `true` on those two lines) — no
other code is affected.

## The admin dashboard (`/admin`)

**What it edits:** dimension weights, per-item weights (grouped by dimension, with a
live sum check so you can see if a dimension's weights drift from 1.0), each
modifier's point delta and on/off toggle, band score ranges, and the two internal
clamps. Saving writes straight to `context/scoring-config.json` and **takes effect on
the very next diagnostic run — no restart needed** (this required removing an
in-memory cache that used to hold the config after first load).

**What it deliberately does *not* cover**, and why:
- **Adding a brand-new modifier** (e.g. "bonus points for X"). Modifier *trigger
  conditions* are a `switch` statement in code (`src/scoring/score.ts`), not data —
  only an existing modifier's size and on/off state are config-driven.
- **Changing the number of questionnaire items or the answer scale.** Both are
  hardcoded in a few places (validation schema, the intake UI) for correctness reasons;
  changing them is a code change, not a config edit.
- **A live score preview while editing.** You save, then re-run a persona through the
  normal flow to see the effect — kept simple on purpose.

**No login is required.** Like every other internal screen in this prototype
(`/review/:id`, `/runs`), `/admin` is unauthenticated — anyone with the URL can change
live scoring weights. Fine for a demo on your own machine; would need real
authentication before this link is shared beyond the immediate team.

## Anticipated questions

**"Why store 1–5 answers as 0–4 internally instead of just using 1–5?"**
Minimal-change design: the entire backend (validation, scoring math, database schema)
already assumed a 0–4 scale. Mapping happens once, at the moment of intake, so nothing
downstream had to change. The trade-off is the raw 1–5 spreadsheet values aren't stored
verbatim — only the already-normalized 0–4 answer is. That's fine for a prototype; if
raw-response fidelity mattered for later research, that would be a deliberate follow-up
change, not something this update quietly assumes.

**"Is any of this — the weights, the questionnaire, the scores — scientifically
validated?"**
No, and this hasn't changed with this update. Every generated report and the config
file itself carry a methodology note saying the weights are heuristic, chosen by the
team, not validated against real career outcomes. The admin dashboard makes weights
*easier to change*, not *more validated* — treat any weight change the same way:
as a hypothesis to test, not a calibration.

**"What if the professor and I both open /admin and save different changes?"**
Last write wins — whoever saves last overwrites the file. There's no locking or
conflict detection. Worth mentioning if editing weights becomes a shared, ongoing
activity rather than a one-person task.

**"Does changing the questionnaire wording without changing the item weights make the
weights wrong?"**
The weights were kept at their original values, applied positionally to the new items,
as a neutral starting point — not because they were re-validated against the new
question meanings. This is explicitly why the admin dashboard exists: so someone with a
view on which of the *new* items should matter more can retune it without touching code.

**"What about the 6 demo personas — did their stories change?"**
Their profile facts (role, tenure, industry, constraints) are untouched; only their
questionnaire answers were rewritten to honestly reflect each persona's narrative under
the *new* question wording, then verified by actually running the scoring engine (not
hand-calculated). All six still land in meaningfully different bands (Critical through
Stable) and the automated test suite (42/42) was updated to check the new real numbers
rather than the old ones. One persona's headline band did shift (p5, the "high
performer," now lands "Stable" rather than "Strong") — directly because of the H2
scoring-key issue above, which is itself a useful, concrete talking point.

## Quick demo add-on

If asked to show this live, after the existing demo flow (`docs/06` in `final/`, or
just walk `/`, `/report/:id`, `/review/:id`): open `/admin`, point out the live sum
checks, change one dimension weight, hit Save, then reload `/api/config` in another tab
(or just refresh `/admin`) to show it changed with no restart. That's the whole feature.
