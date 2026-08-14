# 08 — MVP Implementation (Stage 2)

Stage 2 turns the Stage-1 research specification into a demonstrable product flow for the
target user: **early-career professionals (~1–7 years experience) who feel stuck or are
considering a role/industry transition**. Everything lives in `careerarth-ai/`; the
production website is untouched.

## Architecture

```
                        ┌─────────────────────────────────────────────┐
 Browser                │  Node HTTP server (src/server.ts, :4747)    │
 ─────────              │                                             │
 /            intake ──►│ POST /api/diagnostic                        │
 (4-step wizard,        │   ├─ validate (zod, src/types.ts)           │
  20-Q diagnostic,      │   ├─ score   (src/scoring/ ← scoring-config)│──► deterministic
  persona prefill)      │   ├─ retrieve(src/retrieval/ ← context/kb/) │    ARTH scores
                        │   ├─ generate(src/report/generate.ts)       │──► Claude opus-5
 /report/:id  ◄─────────│   │    └─ mock.ts when no API key           │    (or mock)
 (customer report,      │   ├─ lint    (src/report/evidence.ts)       │
  CTA + rating)         │   └─ persist (src/store.ts → data/runs/)    │
                        │                                             │
 /review/:id  ◄────────►│ POST /api/runs/:id/review                   │
 (consultant view)      │ POST /api/runs/:id/feedback                 │
                        │ POST /api/events   → data/events.jsonl      │
 /runs        ◄─────────│ GET  /api/metrics  → funnel/quality summary │
                        └─────────────────────────────────────────────┘
```

Five Stage-1 layers → MVP components:

| Layer | MVP implementation |
|---|---|
| 1. Structured intake | Branded 8-screen wizard (`web/intake.html/js`), ~5–7 min; optional fields off the critical path; synthetic-persona prefill |
| 2. Deterministic scoring | `src/scoring/score.ts` reading `context/scoring-config.json`; LLM never touches scores |
| 3. Knowledge base | 18 O*NET-sourced role entries (`context/kb/roles.json`) + industry volatility table; keyword/IDF retrieval with synonym map, guaranteed inclusion of current/target roles, graceful out-of-corpus fallback with customer-visible coverage note |
| 4. AI analysis | `claude-opus-5` via structured outputs (JSON schema), system-prompt grounding rules, internal `evidence` refs; deterministic mock generator when no `ANTHROPIC_API_KEY` |
| 5. Human review | `/review/:id` — per-section approve/flag/reject, inline edits of diagnosis & next decision, confidence 1–5, auto-tracked minutes; approval flips the customer badge to "Consultant reviewed" |

## Run instructions

```bash
cd careerarth-ai
npm install
npm test                 # 42 tests, no network, no API key needed
npm run demo             # run all 6 personas through the pipeline (mock mode)
npm start                # server at http://localhost:4747
```

- **Intake:** http://localhost:4747/ (use the "load synthetic persona" dropdown to demo)
- **Runs index:** http://localhost:4747/runs → links to each report & review
- **Metrics:** http://localhost:4747/api/metrics

With real LLM generation:

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."   # PowerShell (bash: export ANTHROPIC_API_KEY=...)
npm run demo                             # ~$0.10–0.25 per report (measured usage is stored per run)
npm start
```

Runtime data (runs, events) lives in `data/` — gitignored, delete to reset.
`CAREERARTH_MODEL` overrides the model; `CAREERARTH_DATA_DIR` relocates storage;
`PORT` changes the port.

## Stage-1 decisions changed in this MVP

1. **CLI → web product.** Stage 1 specified a researcher-operated CLI; Stage 2's deliverable is a customer-testable flow, so the pipeline sits behind a branded web intake/report/review.
2. **Simplified intake schema.** `education[]` and `workHistory[]` arrays dropped for the early-career target (high friction, low scoring value); replaced by a single `promotionsLast5Years` field. The `H_MULTI_INDUSTRY` modifier is marked `active: false` in config until work history returns.
3. **Report voice.** Customer-facing ("you"), not consultant-facing. Research citation tags became internal `evidence` arrays — validated by lint, never rendered raw; sources surfaced in an elegant collapsible.
4. **KB as one file.** 18 entries in `context/kb/roles.json` (same per-entry schema as Stage 1) instead of one file per role.
5. **Mock generation mode.** Deterministic template generator keeps tests/demo at zero API cost and makes e2e tests reproducible.
6. **Heuristic labeling.** `scoring-config.json` carries a `methodologyNote` embedded in every score object and echoed in the report footer; the `/sample-score` calibration is a regression test (`tests/scoring.test.ts`), explicitly *not* validation.

## Instrumentation (for Stage 4 validation)

Events append to `data/events.jsonl`; `GET /api/metrics` aggregates:

| Measure | Source |
|---|---|
| Intake completion rate | `intake_started` vs `intake_completed` (+ per-step `intake_step_completed` for drop-off location) |
| Reports generated | `report_generated` (with generator, lint result, score band, cost) |
| Consultation interest | `consultation_interest` (report CTA clicks) vs `report_viewed` |
| Perceived usefulness | `usefulness_rating` 1–5 widget on the report |
| Consultant review time | auto-tracked minutes on review submit |
| Consultant edit amount | char-diff of edited diagnosis/next-decision + per-section decisions |
| LLM unit cost | per-run token usage × list price, stored on the run |

No real customer data exists yet; all current events come from synthetic personas and QA.

## Known limitations (honest list)

- **Weights are heuristic and partly circular** — calibrated to reproduce the marketing sample score, not validated against outcomes. Labeled as such everywhere, but still the methodology's weakest point.
- **Self-report bias is unmitigated in-product**: the only cross-check (self-assessed risk vs KB outlook) happens in human review.
- **KB covers 18 roles / handful of industries.** Out-of-corpus users get nearest-match analysis with a coverage note — graceful, but path quality degrades. No KB refresh mechanism.
- **Keyword retrieval** misses semantic matches the synonym map doesn't anticipate.
- **Mock reports are readable but formulaic**; tone subtleties (e.g. protect-and-extend for high performers) only emerge with real LLM generation.
- **Single-process, file-backed, no auth** — the review URL is not protected; anyone with the link can review. Fine for a demo, unacceptable beyond it.
- **Review edits limited** to diagnosis + next decision text; other sections get approve/flag/reject + notes only.
- **Consultation CTA records interest but books nothing** — no calendar, no email delivery.
