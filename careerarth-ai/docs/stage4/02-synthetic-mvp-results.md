# Stage 4.2 — Synthetic MVP Results (Technical/Product QA Only)

**Framing:** everything below is a QA analysis of code behavior against six
hand-designed synthetic profiles ([07-evaluation-plan.md](../07-evaluation-plan.md)).
It demonstrates that the pipeline computes different, internally consistent outputs
for different inputs. It says nothing about real people, real careers, or real demand,
and is not presented as such anywhere in this document.

## What the six personas demonstrate

**1. Scoring differentiation.** Re-run directly against `data/runs/*.json`:

| Persona | Overall | Band | A | R | T | H |
|---|---|---|---|---|---|---|
| p4-gilded-stagnation | 42 | Vulnerable | 60 | 34 | 10 | 55 |
| p6-returner | 51 | Vulnerable | 73 | 38 | 38 | 48 |
| p1-plateaued | 58 | Watch | 73 | 49 | 23 | 76 |
| p3-industry-switcher | 60 | Watch | 54 | 64 | 58 | 65 |
| p2-early-career | 63 | Watch | 69 | 73 | 75 | 38 |
| p5-high-performer | 88 | Strong | 94 | 80 | 100 | 81 |

All four bands (Strong/Watch/Vulnerable — Critical does not occur at the *overall*
level for any of the six, though it does at the dimension level, e.g. p4's Trajectory=10)
are exercised. No two personas share a dimension profile shape, confirming the scoring
function is sensitive to input rather than collapsing toward a default.

**2. Different dimension profiles, not just different totals.** p2-early-career and
p5-high-performer land in different bands but both have *low-ish Human Capital* (38, 81
— actually opposite ends), while p1-plateaued and p6-returner both land Watch/Vulnerable
via *low Trajectory* for structurally different reasons (tenure penalty vs. re-entry
gap). This shows the rubric's four dimensions move independently, which is the
mechanism the ARTH framework depends on to be more informative than a single score.

**3. Different recommendations/path sets per persona.** Each run's `report.careerPaths`
draws from different top-ranked KB entries (e.g., p1 → Operations Manager/FP&A
Manager/Management Consultant; a cross-industry switcher persona pulls a visibly
different set) — confirming retrieval, not just scoring, responds to profile content.

**4. Missing-data handling.** `p6-returner` is purpose-built to stress this: 18-month
career break, `yearsInCurrentRole: 0.5`, explicit constraints ("limited runway," "school-
hours schedule"). The pipeline processed it without error and produced a coherent
report referencing the re-entry narrative — confirming the schema and scoring tolerate
sparse/atypical profiles rather than crashing or silently defaulting.

**5. Report generation flow.** All 6 runs show `lint.ok: true` with zero issues —
the citation-discipline mechanism (`src/report/evidence.ts`) runs correctly end-to-end
against mock output.

**6. Consultant review workflow.** Exercised once (`p3-industry-switcher`, reviewed,
6.5 minutes, confidence 4/5, one section decision recorded) — confirms the review
endpoint, edit-tracking, and status transition (`draft` → `reviewed`) work mechanically.

## What these results explicitly cannot demonstrate

- **Customer demand.** No customer, real or prospective, was involved. Six profiles
  written by the team to stress specific rubric behaviors are not a sample of the
  market.
- **Usefulness to real users.** `lint.ok: true` measures citation format compliance, not
  whether a human found the report insightful, accurate, or worth reading.
- **Willingness to pay.** Not applicable — no pricing was ever presented to anyone in
  these runs.
- **Product-market fit.** Undefined without real customers; nothing here bears on it.
- **Recommendation accuracy in real careers.** The career paths suggested for, say,
  p1-plateaued (Operations Manager → FP&A Manager / Management Consultant) are
  retrieval-ranked against a curated KB, not verified against what actually happens to
  operations managers with this profile in the real labor market. The rubric's own
  methodology note already disclaims this; this QA exercise does not change that.
- **Report quality under real generation.** All 6 reports are `generator: "mock"` —
  template-filled from scores and retrieval, not LLM-authored. The actual tone,
  specificity, and hallucination behavior of a real Claude-generated report — the thing
  a real customer would actually read — has not been observed even once, synthetically
  or otherwise.

## Bottom line

The synthetic personas are valid, useful **unit/integration test fixtures** — they
prove the deterministic parts of the system (scoring, retrieval, lint, review
mechanics) work as specified across a deliberately varied input set. They are not
customer research and are not used as such anywhere else in this Stage 4 deliverable.
