# CareerArth AI Capstone — Structured Career Diagnostic Engine

Research prototype for **ENT-CP-4997-1**: a structured career diagnostic engine combining
rule-based ARTH scoring, retrieval-augmented generation over a curated career knowledge
base, and human-in-the-loop review. See `ARTH_Career_Diagnostic_Proposal.pdf` for the
full research proposal.

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
  docs/       Specifications (read in numeric order)
  context/    Machine-readable schemas, scoring config, knowledge base entries
  src/        TypeScript implementation (scoring, retrieval, report pipeline)
  tests/      Unit tests (scoring hand-calculation cases, retrieval, groundedness checks)
  reports/    Generated draft reports + human-reviewed finals for the test profiles
```

## Specification documents

1. `docs/01-architecture.md` — system architecture, tech stack, data flow
2. `docs/02-arth-scoring-rubric.md` — deterministic scoring rubric, weights, thresholds
3. `docs/03-profile-schema.md` — structured user-profile schema
4. `docs/04-diagnostic-questionnaire.md` — ARTH diagnostic questionnaire (20 items)
5. `docs/05-knowledge-base-and-retrieval.md` — KB entry schema, sourcing, retrieval
6. `docs/06-llm-report-generation.md` — prompt design, grounding rules, human review
7. `docs/07-evaluation-plan.md` — test profiles, metrics, write-up plan

## Status

- [x] Planning / specification (Week 1 deliverables: rubric, schema, questionnaire)
- [ ] Scoring engine + unit tests (Week 2)
- [ ] Knowledge base curation + retrieval (Week 3)
- [ ] LLM report pipeline + human review of test profiles (Week 4)
- [ ] Evaluation + write-up (Week 5)
