# 06 — LLM Advisory Synthesis & Human Review (Layers 4–5)

## Role of the LLM

The model **explains and organizes**; it never scores and never asserts labor-market
facts of its own. Inputs: the validated profile, the deterministic ARTH scores + bands,
and the top-5 retrieved KB entries. Output: a draft report in a fixed section structure,
with an inline citation for every claim.

## API usage

- SDK: `@anthropic-ai/sdk` (TypeScript, matching the repo).
- Model: `claude-opus-5`. Thinking is on by default (adaptive); no `thinking` parameter
  is passed. No sampling parameters (not accepted on this model).
- Streaming (`client.messages.stream(...)` → `finalMessage()`), `max_tokens: 16000` —
  reports are long-form.
- Prompt caching: the system prompt and KB corpus framing are stable across the 5–8 test
  profiles; a `cache_control: {type: "ephemeral"}` breakpoint is placed on the last
  system block, with the per-profile content after it.
- `stop_reason` is checked before reading content; `refusal` and `max_tokens` are
  surfaced as pipeline errors, never silently truncated into a report.

## Prompt design

**System prompt (stable, cached):**
- Role: "You draft career diagnostic reports for a human consultant to review. You are
  a writer and explainer, not the source of truth."
- Hard rules:
  1. Never state or adjust a numeric score; use only the scores provided.
  2. Every factual or evaluative claim carries a citation: `[profile:<field>]`,
     `[score:<dimension>]`, or `[kb:<id>]`. A sentence you cannot cite must be removed
     or rephrased as an open question for the consultation.
  3. Hedged language only: "likely", "based on the information provided". Never promise
     outcomes (salary, placement, admission).
  4. Do not infer protected characteristics or use them in reasoning.
  5. Address the reader as the consultant ("the client…"), not the client directly.
- Output contract: the exact section structure below, in Markdown.

**User message (per profile):** JSON blocks for profile, scores (with band labels and
the modifier list that fired), and retrieved KB entries with `matchReasons`.

## Report structure (fixed)

```
# Career Arth Diagnostic — DRAFT (pending consultant review)
1. Profile summary            (3–5 sentences, all cited [profile:*])
2. ARTH score readout         (table of 4 dimensions + overall, with band labels [score:*];
                               one explanation paragraph per dimension citing the
                               questionnaire items and modifiers that drove it)
3. Strengths                  (3–5 bullets, cited)
4. Risks & watch items        (3–5 bullets, cited)
5. Likely career paths        (2–3, grounded in [kb:*] transition notes)
6. Unlikely / high-friction paths (1–2, with the KB-grounded reason)
7. Skill gaps                 (target-role coreSkills minus profile skills, cited both ways)
8. 90-day action plan         (5–7 concrete steps tied to the gaps and risks above)
9. Open questions for the consultation  (what the data cannot answer; includes any
                               R1/R2 self-assessment vs KB-outlook disagreements)
```

## Groundedness lint (`src/report/groundedness.ts`)

Automated pre-review check, run on every draft:
- every paragraph/bullet in sections 1–8 contains ≥1 citation token;
- every `[kb:<id>]` refers to an entry that was actually retrieved for this profile;
- every `[profile:<field>]` resolves against the profile JSON;
- section 2 numbers exactly match the computed scores (regex-extract and compare).

Lint failures block the draft from moving to review; the failure list is saved next to
the draft. Lint results feed the proposal's **groundedness** metric directly.

## Human review workflow (Layer 5)

For each test profile:
1. Reviewer (researcher acting as consultant, ideally with a Career Arth team member)
   reads `reports/<id>/draft.md` beside the raw profile and scores.
2. Review checklist: factual accuracy of every cited claim; score explanations match the
   rubric; no promises/guarantees; no un-cited assertions the lint missed; tone fit for
   a paying client; action plan is realistic.
3. Edits are made in a copy, saved as `reports/<id>/final.md`; the diff between draft
   and final is the **edit-rate** metric (see `docs/07-evaluation-plan.md`).
4. Reviewer records a 1–5 **perceived usefulness** rating and free-text notes in
   `reports/<id>/review.json`.

No draft is ever delivered without a `final.md` produced by this process.

## Ethics guardrails (proposal §8, enforced in code where possible)

- Pipeline refuses profiles with `consent !== true`.
- Synthetic test data flagged `isSynthetic: true`; real volunteer data (if any) requires
  recorded informed consent and is excluded from the git repository.
- No fine-tuning; no data sharing beyond the Claude API call needed for drafting.
- Hedging and no-guarantee rules live in the system prompt *and* the review checklist.
