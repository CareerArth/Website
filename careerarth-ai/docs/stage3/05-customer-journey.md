# Stage 3.5 — Customer Journey / Funnel

This maps the funnel to what the MVP's own instrumentation already logs
(`data/events.jsonl`, aggregated by `src/metrics.ts`, exposed at `GET /api/metrics`) so
Stage 4 can read real numbers against this map rather than re-instrumenting anything.

| Stage | Desired customer action | Likely friction | Conversion metric | Already measured by MVP? |
|---|---|---|---|---|
| **Discovery** | Land on CareerArth (site or campaign) | Doesn't understand what "ARTH" means or why it's different from any other quiz | Landing → intake start | **No** — outside `careerarth-ai/`; production site has no funnel instrumentation for this in scope here |
| **Landing page** | Click "Free Diagnostic" / "5-Minute Assessment" | Skepticism about "free," time-cost estimate feels wrong if it's not actually ~5–7 min | Page view → intake start | **No** — same as above |
| **Diagnostic (intake)** | Complete the 8-screen wizard + 20-item questionnaire | Fatigue/drop-off partway through 20 self-report items; unclear why some fields matter | `intake_started` vs `intake_completed`; `intake_step_completed` gives **per-step drop-off location** | **Yes** — `src/metrics.ts` → `funnel.intakeCompletionRate` |
| **Report** | Read the generated report, engage with it (not just skim the number) | Report feels generic/mock-flavored (a real risk: `generateMockReport` is deterministic-template, "readable but formulaic" per `docs/08-mvp-implementation.md`); trust gap around an unvalidated score | `report_generated` (with lint result, band, cost) vs `report_viewed` | **Yes** |
| **Consultation interest** | Click the consultation CTA on the report | The gap between "here's your AI report" and "now pay/commit to talk to a human" — this is the single highest-friction step in Model B | `consultation_interest` events vs `report_viewed` → `funnel.consultationInterestRate` | **Yes** |
| **Paid service** | Book and pay for the consultation | No booking/payment flow exists yet — "Consultation CTA records interest but books nothing: no calendar, no email delivery" (`docs/08-mvp-implementation.md`, Known limitations) | Would need a new `consultation_booked` / `payment_completed` event | **No — explicit MVP gap** |
| **Consultation delivered** | Attend the session, perceive it as worth the price | Consultant time is scarce and unpriced-for-effort if the AI draft doesn't actually save prep time | `consultantOps.avgReviewMinutes`, `avgEditedChars`, `approved` vs `needs-revision` counts | **Yes, for the review workflow itself** — but this measures consultant *review* of the draft, not the live consultation session, which doesn't exist as a tracked event yet |
| **Follow-up / referral** | Return for a future diagnostic, refer a peer | No mechanism exists to prompt this | Would need a `referral` or repeat-visit event | **No — explicit MVP gap** |

## What this table implies for Stage 3/4 priorities

1. The MVP already instruments the two most important early-funnel numbers for
   validating Model B: **intake completion rate** and **consultation interest rate**.
   Stage 4 should treat these as the primary quantitative outputs of the pilot, not
   numbers to invent new instrumentation for.
2. The funnel has a real, acknowledged **gap between "interest" and "paid"** — nothing
   downstream of the CTA click is tracked or built. This is intentionally out of scope
   for this capstone ("do not add... payments," per the Stage 3 task brief) but must be
   named explicitly as the biggest open question before Model B can be called validated:
   *interest ≠ willingness to pay*, and only the Stage 4 interview guide
   ([08-stage4-validation-plan.md](08-stage4-validation-plan.md)) currently has a plan
   to close that gap, since no real payment flow exists to observe it directly.
3. Perceived usefulness (`usefulness_rating`, 1–5) sits at the report stage and is the
   best current proxy for "did this feel worth paying for" until real booking/payment
   data exists.
