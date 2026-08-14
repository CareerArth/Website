# Stage 4.4 — Validation-Ready Pilot Protocol

Refines [Stage 3's validation plan](../stage3/08-stage4-validation-plan.md) into the
smallest version that could genuinely be run after this capstone is submitted, using
only what already exists. **Nothing in this document has been executed.** No
participant has been recruited. This is a protocol, not a report of results.

## Prerequisite (must happen before recruiting anyone)

Run 3–5 real personas through the pipeline with `ANTHROPIC_API_KEY` set and personally
read the output (Assumption #1 in the [register](03-business-assumption-register.md)).
If the real report reads as generic or unconvincing, fix that *before* spending pilot
goodwill on it — recruiting real people to read a report the team hasn't itself
validated is a wasted pilot slot per person.

## Protocol steps

| Step | Action | Owner | Instrumentation used |
|---|---|---|---|
| 1. Recruit | Send the recruitment message ([05-research-materials.md](05-research-materials.md)) to 15–25 people matching the ICP, expecting ~10–20 completions | Team, via existing network + referral ask (per Stage 3 GTM) | None yet — track responses in the results sheet |
| 2. Consent | Send/collect the consent text before any data is gathered | Team | Results sheet, consent column |
| 3. Pre-survey | 4 short questions, before the participant touches the product | Participant, self-serve (form) | Results sheet |
| 4. Use diagnostic | Participant completes the real intake wizard (`web/intake.html`) end to end | Participant | `intake_started`, `intake_step_completed`, `intake_completed` (already built) |
| 5. View report | Participant reads their real, Claude-generated report | Participant | `report_generated`, `report_viewed` (already built) |
| 6. Post-survey | 8 questions on accuracy, trust, decision impact, time perception | Participant, self-serve (form) | Results sheet + `usefulness_rating` widget on the report page |
| 7. Willingness-to-pay | 4 questions, asked *after* the report so answers reflect real reaction, not speculation | Participant | Results sheet |
| 8. Consultation-interest measurement | Click (or not) the consultation CTA on the report | Participant | `consultation_interest` (already built) |
| 9. Optional short interview | 10-minute call with a subset (~5–8 of the 10–20) who agree | Team + participant | Recorded notes, results sheet |

## What is deliberately NOT built for this pilot

- No payment flow — WTP is measured by stated-intent questions only, not a real
  transaction (consistent with Stage 3's explicit non-goal of adding payments).
- No new event types — every instrumented step above maps to an event or metric that
  already exists in `src/metrics.ts` / `data/events.jsonl`. If a step in this protocol
  ever seems to need a new event, that is a signal to simplify the protocol, not to
  extend the MVP.
- No consultant-facing changes — the existing `/review/:id` flow is used as-is if any
  consultant review is exercised during the pilot window.

## Minimum viable execution

If time allows only a partial pilot, run steps 1–6 and 8 (skip the optional interview)
for at least 10 participants — that alone produces real numbers against 6 of the 10
assumptions in the register (#1–4, #6, #8) using instrumentation that already exists and
requires zero new engineering.

## Data handling

- Synthetic-vs-real data must never be mixed in `data/runs/` reporting — real pilot
  runs should be tagged distinctly (e.g., a `pilot: true` note kept in the results
  sheet, since `isSynthetic` in the profile schema should be `false` for real
  participants, which the schema already supports).
- Real participant data requires the same recorded-consent standard already specified
  in [docs/06](../06-llm-report-generation.md) for any non-synthetic data.
