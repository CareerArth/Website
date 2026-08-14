# CareerArth AI Capstone — Structured Career Diagnostic Engine

Entrepreneurship capstone (**ENT-CP-4997-1**) MVP: a structured career diagnostic product
combining rule-based ARTH scoring, retrieval over a curated career knowledge base,
LLM-drafted personalised analysis, and human-in-the-loop consultant review — wrapped in a
branded web flow for early-career professionals (1–7 years experience).

## Quick start

```bash
cd careerarth-ai
npm install
npm test          # 42 tests — no API key, no network
npm run demo      # run the 6 synthetic personas through the full pipeline
npm start         # http://localhost:4747  (intake → report → review)
```

Set `ANTHROPIC_API_KEY` for real Claude-generated analyses (`claude-opus-5`); without it
a deterministic mock generator produces zero-cost, fully personalised-by-data reports.
Full run instructions, architecture diagram, and limitations: `docs/08-mvp-implementation.md`.

> **Isolation guarantee:** everything for this capstone lives inside `careerarth-ai/`.
> The production website (`app/`, `components/`, `lib/`, `aws/`, `public/`) is not
> modified by this project. The prototype *reads* the ARTH framework as published on
> the site (home page + `/sample-score`) and builds around it.

## Architecture (5 layers, per proposal)

| Layer | What | Where |
|---|---|---|
| 1. Structured intake | Profile + ARTH diagnostic questionnaire (JSON, extends the live audit form fields) | `context/profile.schema.json`, `docs/03-profile-schema.md`, `docs/04-diagnostic-questionnaire.md` |
| 2. Deterministic ARTH scoring | Fixed weights & thresholds; no LLM involvement in scores | `docs/02-arth-scoring-rubric.md`, `context/scoring-config.json`, `src/scoring/` |
| 3. Curated knowledge base | 15–25 occupation/transition profiles sourced from O*NET | `context/kb/`, `docs/05-knowledge-base-and-retrieval.md` |
| 4. LLM advisory synthesis | Claude drafts a grounded, source-cited report from profile + scores + retrieved KB entries | `docs/06-llm-report-generation.md`, `src/report/` |
| 5. Human review | Consultant reviews/edits every draft before it reaches anyone | review checklist in `docs/06-llm-report-generation.md`; reviewed output in `reports/` |

## Directory layout

```
careerarth-ai/
  docs/       Specifications (read in numeric order); 08 = MVP implementation
  context/    Scoring config + knowledge base (18 O*NET-sourced roles, industry table)
  src/        TypeScript implementation (scoring, retrieval, report, server, metrics)
  web/        Branded UI: intake wizard, customer report, consultant review, runs index
  demo/       6 synthetic personas + demo runner
  tests/      42 vitest tests (scoring, validation, retrieval, evidence lint, e2e mock)
  data/       Runtime output (runs + events.jsonl) — gitignored
```

## Specification documents

1. `docs/01-architecture.md` — system architecture, tech stack, data flow
2. `docs/02-arth-scoring-rubric.md` — deterministic scoring rubric, weights, thresholds
3. `docs/03-profile-schema.md` — structured user-profile schema
4. `docs/04-diagnostic-questionnaire.md` — ARTH diagnostic questionnaire (20 items)
5. `docs/05-knowledge-base-and-retrieval.md` — KB entry schema, sourcing, retrieval
6. `docs/06-llm-report-generation.md` — prompt design, grounding rules, human review
7. `docs/07-evaluation-plan.md` — test profiles, metrics, write-up plan

## Status (capstone stages)

- [x] Stage 1 — Product thesis + ARTH specification (`docs/01–07`)
- [x] Stage 2 — Working MVP: web intake → deterministic scoring → retrieval → AI analysis → branded report → consultant review (`docs/08`)
- [ ] Stage 3 — Business model, customer journey, GTM
- [ ] Stage 4 — Customer/product validation experiments
- [ ] Stage 5 — Final entrepreneurship capstone package
