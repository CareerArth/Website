# Stage 4.1 — Evidence Audit

Purpose: separate what this capstone has actually shown from what it currently assumes.
Every claim below was checked directly against the code, test run, and log files in
`careerarth-ai/` as of this audit (`npm test`, `data/runs/*.json`, `data/events.jsonl`) —
not restated from Stage 1–3 prose.

## A. DEMONSTRATED — has direct, checkable evidence in this repo

| Item | Evidence | Notes |
|---|---|---|
| Working end-to-end pipeline (validate → score → retrieve → generate → lint → persist) | `src/pipeline.ts`; produces `data/runs/*.json` for all 6 personas | Runs via CLI (`npm run demo`), not (yet) confirmed via full browser intake — see intake-UI caveat below |
| Deterministic ARTH scoring implementation | `src/scoring/`, `context/scoring-config.json`; `tests/scoring.test.ts` (16 tests) including the `/sample-score` calibration check | Deterministic and unit-tested; **not** validated against real career outcomes (that's a business hypothesis, see register) |
| Six differentiated synthetic personas | Re-verified directly: overall scores 42/51/58/60/63/88 spanning all four bands (Strong→Vulnerable); dimension scores vary independently per persona (e.g. p5 T=100 vs p4 T=10) | Confirms the scoring/report logic responds to different inputs — a code-correctness result, not a market result |
| 42/42 automated tests passing | Re-ran `npx vitest run` directly: `4 files, 42 tests, all passed` | Covers scoring, validation, retrieval, e2e-mock — no live-API test exists (none can, without a key) |
| Retrieval over the curated knowledge base | `src/retrieval/`, `tests/retrieval.test.ts` (10 tests); `p1-plateaued.json` shows 5 ranked KB entries with match reasons and `guaranteed: true` on the current-role match | Deterministic keyword retrieval works as specified; KB is 18 roles / 3 industries — coverage outside that is untested |
| Groundedness lint | `src/report/evidence.ts`; every one of the 6 persona runs shows `"lint": {"ok": true, "issues": []}` | Confirms the citation-discipline mechanism runs and passes on mock output; **has never been exercised against real Claude output**, where hallucination risk is the actual target |
| Consultant review workflow exists and functions | `src/server.ts` review endpoint; **one** real record: `p3-industry-switcher` reviewed, 6.5 min, confidence 4, note "sample reviewed run for demo" | Technically functional. Exercised exactly once, by the developer acting as the consultant on a synthetic profile — this is a mechanism test, not evidence the workflow works for a real consultant under real time pressure |
| Instrumentation (events + metrics aggregation) | `data/events.jsonl` (18 events logged: `report_generated` ×6 twice, `intake_started` ×2, `report_viewed` ×2, `review_submitted` ×2); `src/metrics.ts` | The aggregation code is demonstrated to run correctly on what little data exists. **No `intake_completed` event has ever been logged** — the web intake wizard has not been shown, end-to-end, to be completable by anyone, including the team, based on current logs |
| Existing production CareerArth funnel | `app/page.tsx` ("Free Diagnostic... 5-Minute Assessment"), `app/consultation/page.tsx` ("Talk to a Career Expert") | Confirms the free-diagnostic → paid-consultation *shape* already exists on the live site; says nothing about that funnel's actual conversion rate, which was not investigated here |

## B. TECHNICALLY IMPLEMENTED BUT NOT LIVE-VALIDATED

| Item | What exists | What's missing |
|---|---|---|
| Claude API integration | Full implementation in `src/report/generate.ts` — model call, JSON-schema output, streaming-equivalent handling, `stop_reason` checks, usage-based cost calculation | Never executed against the real API — `ANTHROPIC_API_KEY` has not been set in this environment for any run to date. Code correctness is plausible by inspection, not proven by execution. |
| Estimated LLM cost ($0.05–$0.15/report) | Computed from real list-price constants (`PRICE_IN=$5`, `PRICE_OUT=$25` per MTok) × estimated token volume | No actual `usage` object has ever been returned by the API; token counts are estimates, not measurements |
| Real AI-generated customer report (quality, tone, groundedness under real generation) | Prompt, schema, and grounding rules are fully specified (`docs/06`) | Every report seen anywhere in this repo — all 6 personas, `data/runs/*.json` — has `"generator": "mock"`. Nobody, including the team, has read a real Claude-generated report from this system. Tone, specificity, and hallucination behavior are unknown. |
| Web intake wizard as a real completable flow | `web/intake.html`/`.js` exist and are wired to `POST /api/diagnostic` | No `intake_completed` event exists in the logs; the only browser-side evidence is 2 `intake_started` and 2 `report_viewed` (on an already-generated persona) events. Whether a first-time user can complete the 20-item questionnaire without confusion or drop-off is unverified. |

## C. BUSINESS HYPOTHESES — Stage 3 conclusions, no external evidence

- Target ICP (mid-career, stagnation-driven professionals)
- Willingness to pay for a diagnostic or consultation, at any price point
- Free diagnostic → paid consultation conversion rate (assumed 5–20% in Stage 3 scenarios)
- Preferred pricing / preferred business model (A vs. B vs. C)
- Perceived usefulness / trust in the ARTH score, from a real (non-team) user
- Consultant economics (hourly rate, session length) — Stage 3's figures are illustrative market guesses, not sourced from CareerArth's actual consulting operation
- Competitive positioning claims (that CareerArth is meaningfully differentiated from a well-prompted ChatGPT session, in a real user's judgment)

Every item in this category is treated in Stage 3 as an explicitly labeled hypothesis
already — this audit's contribution is confirming none of them have since acquired any
evidence, synthetic or otherwise.

## D. COMPLETELY UNTESTED — assumed by Stage 3 without examination there

- **Real-world questionnaire comprehension.** Whether a first-time, non-technical user
  interprets the 20 ARTH items (e.g., "R2. Automation insulation") the way the rubric
  designer intended. Self-report bias is *named* in `docs/04` but never observed.
- **Consultant capacity/willingness.** Whether a real consultant (not the developer)
  would actually adopt the review tool, trust the AI draft enough to edit rather than
  rewrite, and complete a review within the 15–30 min planning assumption.
- **KB coverage failure mode in practice.** The "graceful degradation" for out-of-corpus
  users (`docs/05`) has never been triggered against a real profile; whether the
  resulting coverage note reads as honest or as a disappointing product experience is
  unknown.
- **Production-funnel baseline numbers.** Stage 3 cites the production site's *shape*
  (free diagnostic → consultation CTA) as evidence Model B is a live motion, but no
  actual conversion/traffic numbers from that funnel were reviewed — the shape is
  confirmed, the performance is not.
- **Repeat-use / referral behavior.** No mechanism or data exists for this at all
  (already flagged as a funnel gap in Stage 3's customer-journey doc).

## What this means for evidence quality going in to Stage 5

The project has strong, verifiable evidence of **technical correctness of a
deterministic system** (scoring, retrieval, lint, tests). It has **zero** evidence —
synthetic or real — of the two things a commercial recommendation actually depends on:
(1) how a real Claude-generated report reads, and (2) how a real human responds to it.
Stage 5 claims must be bounded accordingly — see
[06-capstone-claim-boundaries.md](06-capstone-claim-boundaries.md).
