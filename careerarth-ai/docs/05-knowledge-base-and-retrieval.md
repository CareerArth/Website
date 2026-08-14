# 05 — Curated Knowledge Base & Retrieval (Layer 3)

## Scope

18 occupation profiles (within the proposal's 15–25 range) across **3 industries**:

| Industry | Roles (6 each) |
|---|---|
| Technology | Software Engineer, Engineering Manager, Product Manager, Data Analyst, Data Scientist, UX Designer |
| Finance | Financial Analyst, Accountant/Auditor, Investment Associate, Risk Analyst, FP&A Manager, Fintech Product Manager |
| Marketing & Consulting | Digital Marketing Manager, Brand Manager, Content Strategist, Management Consultant, Operations Manager, Customer Success Manager |

Sourcing: **O*NET OnLine** (public U.S. Department of Labor database) for role summaries,
core skills/knowledge areas, and outlook categories; each entry records its O*NET SOC
code and retrieval date. Transition notes (which moves are common/feasible) are curated
by the researcher from O*NET "related occupations" plus consultant judgment, and marked
as such.

## Entry schema (`context/kb/<slug>.json`)

```json
{
  "id": "kb-product-manager",
  "title": "Product Manager",
  "onetCode": "11-2021.00",
  "industry": "technology",
  "summary": "2–4 sentence role description (paraphrased from O*NET).",
  "coreSkills": ["product strategy", "stakeholder management", "analytics", "..."],
  "adjacentRoles": ["kb-engineering-manager", "kb-ux-designer"],
  "transitionsFrom": [
    { "role": "kb-software-engineer", "difficulty": "moderate",
      "note": "Common path; gap is usually customer discovery and roadmap ownership." }
  ],
  "outlook": { "category": "growing", "note": "...", "asOf": "2026-08" },
  "volatility": "medium",
  "source": { "name": "O*NET OnLine", "url": "https://www.onetonline.org/link/summary/11-2021.00", "retrieved": "2026-08" }
}
```

Plus one index file `context/kb/_industries.json` mapping industry keys to
`volatility: low|medium|high` — this table also feeds the R-dimension scoring modifier
(`docs/02-arth-scoring-rubric.md` §2.2).

## Retrieval (`src/retrieval/`)

Deterministic keyword retrieval — appropriate for an 18-document corpus; embeddings are
an optional stretch goal only.

1. **Query construction** from the profile: `currentRole`, `goals.targetRole`,
   `goals.targetIndustry`, `industry`, all `skills[].name`, and `concernCategory`.
   Tokens lowercased, punctuation stripped, a small synonym map applied
   (e.g. "PM" → "product manager", "dev" → "software engineer").
2. **Scoring** per KB entry, BM25-style: term matches weighted by field
   (title match ×3, coreSkills ×2, summary/transition text ×1), with inverse document
   frequency across the corpus so ubiquitous terms ("management") don't dominate.
3. **Guaranteed inclusions:** the entry matching `currentRole` (if any) and the entry
   matching `goals.targetRole` (if any) are always included regardless of rank, because
   the report must discuss both the current position and the target.
4. **Output:** top **K = 5** entries, each with its score and a human-readable
   `matchReasons[]` list (which query terms hit which fields) — passed to the LLM and
   logged for the groundedness evaluation.

Determinism requirement: identical profile + corpus ⇒ identical ranked list. Ties broken
by entry `id` (lexicographic).

## Tests (Week 3)

- Fixture corpus + profile → expected ranked list (golden test).
- Guaranteed-inclusion rule when the target role would otherwise rank below K.
- Synonym map behavior; unknown-industry fallback (`volatility: "medium"`).
