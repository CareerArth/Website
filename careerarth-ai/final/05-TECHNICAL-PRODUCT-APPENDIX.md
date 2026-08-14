# Appendix B — Technical & Product

**CareerArth AI · Aryan Bhandari · for Professor Tushar Jaruhar**

Written for a non-CS reader. What the machine actually does, why it was built that way,
and where its edges are. Source: `careerarth-ai/` (code), `docs/01–08` (specifications).

---

## B1. Architecture in one paragraph

A user fills in a structured web form. A small server then runs five steps in a fixed
order: **validate** the input (including refusing anything without consent), **score**
it with a fixed arithmetic rubric, **retrieve** the most relevant roles from a curated
career library, **generate** a written analysis constrained to only use those inputs,
**lint** that analysis to verify every claim cites its evidence — then saves the result
and logs an event. A consultant can open any result in a review screen, edit or approve
it, and the customer's page updates to "Consultant reviewed." (Figure 2 in the main
report shows this visually.)

## B2. ARTH scoring — deterministic by design

- 20 questionnaire items (5 per dimension), each answered 0–4 against anchored
  endpoints ("No idea" ↔ "Specific role + timeline").
- Each dimension = weighted item average scaled to 0–100, plus small fixed modifiers
  from profile facts (e.g., 5+ years in the same role: −10 Trajectory; no LinkedIn:
  −5 Human Capital). Modifiers clamp to [−15, +10]; scores clamp to [0, 100].
- Overall = 0.30·A + 0.25·R + 0.20·T + 0.25·H, computed on unrounded values, rounded
  once. Bands: Strong 85–100 · Stable 70–84 · Watch 55–69 · Vulnerable 40–54 ·
  Critical 0–39.
- All weights/modifiers/bands live in **one configuration file**; code reads it, tests
  verify it, documentation cites it — the three cannot silently drift apart.
- The weighted formula reproduces the production site's published sample scorecard
  (72/48/52/81 → 64). This is kept as a *regression test* — the honest label for
  calibrating to your own marketing example — and every score object carries a
  methodology note saying the rubric is heuristic and unvalidated against outcomes.

**Why it matters commercially:** same answers in, same score out, every time. The
product's numbers are explainable to a customer and auditable by a skeptic — the AI is
never the source of a number.

## B3. Intake

An 8-screen branded wizard (~5–7 minutes): profile → goals → concern → four
questionnaire screens → consent. Optional fields stay off the critical path. A demo
dropdown can prefill any synthetic persona. Every screen transition logs an event, so
drop-off *location* — not just rate — is measurable.

## B4. Knowledge base and retrieval

- **18 occupation profiles** across technology, finance, and marketing/consulting,
  hand-curated from **O*NET** (the U.S. Department of Labor's public occupational
  database), each with summary, core skills, common transitions (with difficulty
  notes), outlook, volatility, and a source citation with retrieval date.
- Retrieval is deterministic keyword matching with field weighting and
  inverse-document-frequency damping (so "management" doesn't match everything). The
  user's current role and target role are always included when the library has them.
  Top 5 entries go to the report generator, each with human-readable match reasons.
- If a user's field isn't covered, the system says so on the report (a "coverage note")
  rather than bluffing — degraded gracefully, disclosed honestly.

## B5. Report generation — grounded, structured, reviewed

The generator receives exactly three inputs: the validated profile, the fixed scores,
and the retrieved library entries. Its rules: never state or adjust a number; tag every
claim with its evidence (`profile:` / `score:` / `kb:` / `questionnaire:` references);
use calibrated language ("likely," "based on what you've told us"); never promise
outcomes; route ungroundable observations to "discuss with your consultant." Output is
a fixed structure: diagnosis → dimension explanations → strengths → risks → tensions →
2–3 career paths with trade-offs → skill gaps → 90-day plan → open questions.

An automated **evidence lint** then checks every section: citations present, `kb:`
references only to entries actually retrieved, score statements matching computed
values. Drafts that fail don't proceed.

**Two generation modes:** with an API key, Claude (Opus) via structured JSON output;
without one, a deterministic mock that fills the same structure from the data. **Every
report produced during this project used the mock** — the Claude path is fully written
but has never executed (no key was configured). Real AI report quality is therefore
unobserved; estimated cost ($0.05–$0.15/report) comes from published prices × estimated
token counts, not measurement.

## B6. Consultant review

A dedicated screen shows the full report beside the profile, scores, and retrieval
evidence. The consultant approves/flags/rejects per section, can edit the diagnosis and
next-decision text inline, records confidence (1–5) and notes; minutes are tracked
automatically and edits measured. Approval flips the customer badge to "Consultant
reviewed." Exercised once in QA (6.5 minutes, by the developer, on a synthetic run) —
a mechanism test, not evidence about real consultant workload.

## B7. The six synthetic personas (QA fixtures)

| Persona | Stresses | A/R/T/H → Overall (band) |
|---|---|---|
| p1 plateaued | Tenure penalty; the rubric's worked example | 73/49/23/76 → **58 (Watch)** |
| p2 early-career | Low network, high momentum pattern | 69/73/75/38 → **63 (Watch)** |
| p3 industry-switcher | Cross-industry retrieval, skill gaps | 54/64/58/65 → **60 (Watch)** |
| p4 gilded-stagnation | High pay ≠ high score; obsolete skills | 60/34/10/55 → **42 (Vulnerable)** |
| p5 high-performer | Upper bands; non-alarmist tone | 94/80/100/81 → **88 (Strong)** |
| p6 returner | Career break, sparse data, constraints | 73/38/38/48 → **51 (Vulnerable)** |

Demonstrates: score differentiation (42–88), independent dimension movement, distinct
retrieved path sets, clean sparse-data handling, lint passing on all six, review
mechanics. Cannot demonstrate: demand, usefulness, WTP, accuracy in real careers, or
real AI quality — these are QA fixtures authored by the developer.

## B8. Tests — 42/42 passing (re-verified)

| Suite | Tests | Covers |
|---|---|---|
| Scoring | 16 | Worked example, sample-score calibration, clamps, each modifier in isolation |
| Validation | 8 | Schema rejection paths, consent enforcement |
| Retrieval | 10 | Golden rankings, guaranteed inclusion, synonyms, unknown-industry fallback |
| End-to-end (mock) | 8 | Full pipeline, lint, persistence, events |

No test touches the network or needs an API key — deliberate, so the whole suite is
reproducible by anyone (including an examiner) with `npm test`.

## B9. Privacy & ethics, as implemented

Consent enforced in code (pipeline refuses without it) · synthetic data flagged
`isSynthetic` · name/email stripped from anything sent to the model · all data in local
files, none committed · no fine-tuning · hedging and no-guarantee rules in both the
prompt and the review checklist · heuristic-score disclaimer on the intake page, in
every score object, and on the report footer.

## B10. Honest limitations (technical)

1. Rubric weights heuristic and partly circular (calibrated to the marketing sample).
2. Self-report bias unmitigated in-product; human review is the only check.
3. 18 roles / 3 industries; outside that, nearest-match with a disclosed coverage note.
4. Keyword retrieval misses semantics the synonym map doesn't anticipate.
5. Mock reports are readable but formulaic; real-generation tone is unobserved.
6. Prototype infrastructure: single process, file storage, unauthenticated review URLs,
   no booking/payment/email. Fine for a demo and a pilot; unacceptable beyond.
