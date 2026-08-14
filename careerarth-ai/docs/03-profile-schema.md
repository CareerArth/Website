# 03 — Structured User-Profile Schema

Week-1 deliverable: the JSON schema for Layer 1 (structured intake). The machine-readable
schema is `context/profile.schema.json`; this document explains the design.

## Design rules

1. **Superset of the live audit form.** The production audit form
   (`components/forms/audit-form.tsx`) collects `fullName`, `email`, `currentRole`,
   `yearsExperience`, `linkedInUrl`, `concern`. Those field names are reused verbatim so
   a real audit submission maps directly into a prototype profile with zero renaming.
2. **Structured over free-text wherever scoring depends on it.** Free text (`concern`,
   `goals.narrative`) is kept for the LLM to quote, but every field the scoring rubric or
   retrieval consumes is an enum, number, or string array.
3. **Minimum necessary collection** (proposal §8): no date of birth, no compensation
   figures, no employer names required (titles + industries suffice for scoring and
   retrieval; employer name is optional).

## Field groups

| Group | Fields | Consumed by |
|---|---|---|
| Identity | `id`, `fullName`, `email` | report header only |
| Current position | `currentRole`, `yearsExperience`, `yearsInCurrentRole`, `industry`, `careerStage`, `geography` | scoring modifiers, retrieval |
| Links | `linkedInUrl` (optional) | H modifier |
| Education | `education[]` (level, field, year) | LLM context, H4 review |
| Work history | `workHistory[]` (title, industry, startYear, endYear, levelChange) | T/H modifiers, retrieval |
| Skills | `skills[]` (name, kind: technical/domain/leadership, lastUsedYear) | retrieval, R3 review |
| Goals & constraints | `goals` (targetRole, targetIndustry, horizonYears, narrative), `constraints[]` | A items context, retrieval |
| Concern | `concern` (free text, from audit form), `concernCategory` (enum: stagnation, misalignment, industry-shift, layoff-risk, growth, transition, other) | A modifier, LLM |
| Questionnaire | `questionnaire` — 20 answers, keys `A1..A5, R1..R5, T1..T5, H1..H5`, each 0–4 | scoring (base) |
| Consent | `consent` (boolean, must be true), `isSynthetic` (boolean) | ethics gate: pipeline refuses to run when `consent !== true` |

## Enums

- `careerStage`: `early` (0–3 yrs) · `establishing` (4–8) · `mid` (9–15) · `senior` (16+)
  — derived from `yearsExperience` if omitted, using those breakpoints.
- `concernCategory`: `stagnation` · `misalignment` · `industry-shift` · `layoff-risk` ·
  `growth` · `transition` · `other`.
- `industry`: free string, but must match a key in the KB industry table
  (`context/kb/_industries.json`) for the R volatility modifier to apply; unknown
  industries score as `volatility: "medium"` (no modifier).

## Validation

- Zod schema in `src/types.ts` mirrors `context/profile.schema.json`; the pipeline
  validates before scoring and fails with field-level errors.
- Email format, `yearsExperience` 0–60 (same limits as the live form), all 20
  questionnaire answers present and integer 0–4.
