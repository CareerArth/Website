# Screenshot Plan & Capture Log

All screenshots below were **captured from the actual running MVP** (`npm start`,
localhost:4747) using headless Chrome at 1280×800 @1.5× scale, with **synthetic demo
data only** (persona `p1-plateaued` for the customer flow; the QA-reviewed
`p3-industry-switcher` run for the consultant view). Saved under
`final/assets/screenshots/`.

| # | File | Screen | Shows | Status |
|---|---|---|---|---|
| 1 | `01-intake-intro.png` | Intake landing (`/`) | Branded intro, ARTH framing, 6-minute promise, heuristic-score disclaimer, persona demo dropdown | ✅ captured |
| 2 | `02-intake-profile-prefilled.png` | Intake step 1 | "About you" profile screen prefilled with the p1 persona | ✅ captured |
| 3 | `03-questionnaire-alignment.png` | Diagnostic 1 of 4 | Alignment questionnaire — 0–4 scale with anchored endpoints, progress bar | ✅ captured |
| 4 | `04-questionnaire-risk.png` | Diagnostic 2 of 4 | Risk Exposure questionnaire screen | ✅ captured |
| 5 | `05-report-scorecard.png` | Report top (`/report/p1-plateaued`) | Arth Score ring (58 · Watch), four dimension tiles with bands, "Draft — pending consultant review" badge | ✅ captured |
| 6 | `06-report-career-paths.png` | Report — "Realistic paths from here" | Matched career paths with fit rationale and trade-offs | ✅ captured |
| 7 | `07-report-90day-plan.png` | Report — 90-day plan | Three-phase plan targeting the weakest dimension | ✅ captured |
| 8 | `08-consultant-review.png` | Review (`/review/p3-industry-switcher`) | Consultant view: report beside evidence, per-section decisions, confidence, tracked minutes | ✅ captured |
| 9 | `09-runs-index.png` | Runs index (`/runs`) | All six persona runs with scores, bands, statuses | ✅ captured |
| 10 | `10-report-consultation-cta.png` | Report — consultation CTA | "Talk this through with a CareerArth consultant" + usefulness rating widget | ✅ captured |
| — | `report-full.png` | Full report page | Entire p1 report top-to-bottom (reference/fallback) | ✅ captured |

**Usage:** report PDF (product walkthrough figures), technical appendix (UI evidence),
pitch deck (MVP slide), and the demo guide's stated fallback if the live demo fails.

**Re-capture procedure** (if the UI changes): start the server, then run
`node shots.js` (script preserved in the session scratchpad; ~30 seconds). All shots use
deterministic synthetic data, so re-captures are reproducible.

**Not captured, deliberately:** any screen with real user data (none exists), the
loading spinner (transient), and the consent step (its text is reproduced in full in
the validation appendix instead).
