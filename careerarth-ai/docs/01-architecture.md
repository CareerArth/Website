# 01 — System Architecture

## Design principles (from the proposal)

1. **The LLM is a writer and explainer, not a source of truth.** All ARTH scores come
   from deterministic rules (Layer 2). All factual career claims must trace to either a
   profile field or a retrieved knowledge-base entry (Layer 3).
2. **Structured input over open chat.** Layer 1 collects structured fields so scoring and
   retrieval are reliable and repeatable.
3. **Human review is mandatory.** No AI-drafted report reaches a user without consultant
   review (Layer 5).
4. **Preserve the existing product.** The prototype reuses the ARTH framework and the
   audit-form field vocabulary already live on careerarth.com; it does not modify the
   production Next.js app or AWS backend.

## Data flow

```
profile.json (Layer 1, validated against context/profile.schema.json)
      │
      ▼
src/scoring/  ── deterministic ARTH scores (Layer 2, config: context/scoring-config.json)
      │
      ▼
src/retrieval/ ── top-K knowledge-base entries for this profile (Layer 3, corpus: context/kb/)
      │
      ▼
src/report/   ── Claude drafts a source-cited report (Layer 4)
      │
      ▼
reports/<profile-id>/draft.md  ──►  human review/edit  ──►  reports/<profile-id>/final.md
```

## Technology choices

| Concern | Choice | Rationale |
|---|---|---|
| Language / runtime | TypeScript on Node.js 20 | Matches the existing repo (Next.js + Lambda handlers are TypeScript); scoring/validation code could later be shared with the Lambda layer |
| Validation | `zod` | Already a dependency of the repo's Lambda validation layer |
| Scoring | Pure functions, no I/O | Determinism and unit-testability (proposal metric: scoring consistency) |
| Knowledge base | One JSON file per occupation in `context/kb/`, hand-curated from O*NET | Small (15–25 entries), reviewable, versioned in git |
| Retrieval | Keyword scoring (BM25-style term weighting over role/skills/goals) | Adequate at this corpus size; deterministic; no external service. Embeddings are a flagged stretch goal, not required |
| LLM | Anthropic TypeScript SDK (`@anthropic-ai/sdk`), model `claude-opus-5`, streaming, default adaptive thinking | Current recommended model; long report output needs streaming |
| Interface | CLI pipeline (`npm run ai:pipeline -- --profile tests/profiles/p1.json`) | Proposal scope excludes production UI; CLI keeps the prototype isolated from the website |
| Tests | `vitest` (dev-dependency scoped to this folder's scripts) | Unit tests for scoring vs hand-calculated examples, retrieval ranking, and report groundedness lint |

## Module layout (`src/`)

```
src/
  types.ts            Shared types generated from the zod schemas
  scoring/
    config.ts         Loads context/scoring-config.json (weights, thresholds, modifiers)
    score.ts          scoreProfile(profile) -> { alignment, riskExposure, trajectory, humanCapital, arthScore, bands }
  retrieval/
    corpus.ts         Loads and indexes context/kb/*.json
    retrieve.ts       retrieve(profile, k=5) -> ranked KB entries with match reasons
  report/
    prompt.ts         Builds the system + user prompt (profile + scores + KB snippets)
    generate.ts       Calls Claude, streams, writes reports/<id>/draft.md
    groundedness.ts   Lints the draft: every claim paragraph must carry [profile:*] or [kb:*] citations
  pipeline.ts         CLI entry: validate -> score -> retrieve -> generate -> lint
```

## Non-goals (explicitly out of scope, per proposal §3)

- Fine-tuning any model
- Production multi-tenant app, auth, billing
- Large-scale data collection
- Consultant dashboard (Phase 2+)

## Environment

- `ANTHROPIC_API_KEY` via environment (never committed; `.env.local` is already gitignored
  by the repo). No personal data leaves the machine except the profile content sent to the
  Claude API for drafting; test profiles are synthetic (see `docs/07-evaluation-plan.md`).
