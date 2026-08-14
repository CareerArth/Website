# 07 — Evaluation Plan (Weeks 4–5)

## Test profiles (6 synthetic; within the proposal's 5–8 range)

| ID | Persona | What it stresses |
|---|---|---|
| p1-plateaued | Ops director, 6 yrs in role, strong network, no recent growth | T floor + modifiers; the §4 rubric worked example |
| p2-early-career | 2 yrs experience, high learning velocity, thin network | careerStage derivation; low-H, high-T pattern |
| p3-industry-switcher | Finance analyst targeting tech product management | cross-industry retrieval, transition notes, skill gaps |
| p4-gilded-stagnation | Highly paid senior engineer, obsolete stack, single employer | high compensation ≠ high score; R modifiers (mirrors the site's "gilded stagnation" narrative) |
| p5-high-performer | Recently promoted PM, active brand, growing industry | upper bands; report should be protect-and-extend, not alarmist |
| p6-returner | 18-month career break, re-entering marketing | missing-data handling, R5/T3 lows, constraint fields |

Each is a JSON file in `tests/profiles/` validated against `context/profile.schema.json`,
with hand-calculated expected scores committed beside it (`expected-scores.json`).

## Metrics (from proposal §7)

| Metric | How measured | Target |
|---|---|---|
| Scoring consistency | Re-run scoring 3× per profile → identical output; computed scores == hand-calculated `expected-scores.json` | 100% exact match |
| Groundedness | % of report paragraphs/bullets passing the automated citation lint, plus manual spot-check that citations actually support the claim | ≥95% lint pass; note every unsupported citation found manually |
| Edit rate | Word-level diff between `draft.md` and `final.md` per profile: % of draft tokens changed/removed | Record per profile; no fixed target (this is the research finding) |
| Perceived usefulness | 1–5 rating per report by researcher + any Career Arth reviewer, with notes | Record; discuss ≥/< 3 split |

Secondary observations to record per profile: retrieval quality (were the top-5 KB
entries the right ones for this persona?), LLM failure modes (hallucinated claims caught
by lint vs. caught only by review), and time spent reviewing each draft (proxy for the
"consultant copilot saves prep time" sub-question).

## Procedure

1. Freeze rubric config, KB, and prompts (tag the commit) before the first evaluation run.
2. Run the full pipeline on all 6 profiles; archive drafts, lint output, and logs.
3. Human review per `docs/06-llm-report-generation.md`; produce finals + review.json.
4. Compute metrics; tabulate per profile and aggregate.
5. Write-up (`reports/EVALUATION.md`): findings vs. the three research sub-questions,
   limitations (small n, self-review bias, self-reported questionnaire), and
   recommendations for Career Arth Phase 2 investment.

## Answering the research sub-questions

1. **Deterministic ARTH scoring credible?** → scoring-consistency metric + reviewer
   judgment of section 2 explanations per report.
2. **RAG over curated KB better than model-only knowledge?** → for 2 profiles, generate
   a comparison draft with retrieval disabled (same prompt, no KB block, citations
   limited to profile/score) and compare groundedness lint results and review notes.
3. **Copilot briefing reduces prep time / improves quality?** → review-time proxy +
   perceived-usefulness ratings + qualitative reviewer notes.
