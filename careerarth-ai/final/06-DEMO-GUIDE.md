# CareerArth AI — 5-Minute Live Demo Guide

**Persona used:** `p1-plateaued` (Rohan Mehta, Operations Manager, 6 years in seat) —
the clearest diagnostic story: strong network, stalled momentum (Human Capital 76 vs
Trajectory 23), overall 58 "Watch."

**Setup (before the audience arrives):**
```bash
cd careerarth-ai && npm start        # server at http://localhost:4747
```
Open three tabs: `http://localhost:4747/` (intake) · `http://localhost:4747/report/p1-plateaued`
· `http://localhost:4747/review/p3-industry-switcher`. Verify all three load. If
`data/runs/` is empty, run `npm run demo` first (~5 seconds, offline).

**Fallback:** if anything fails live, present the captured screenshots in
`final/assets/screenshots/` in the same order — they show these exact screens.

---

## Minute 0:00–0:45 — Intake (tab 1: `/`)

**Do:** Show the intro card. From the "Demo: load a synthetic persona" dropdown, select
**p1 — plateaued**. Click **Continue** through the profile screen (prefilled).

**Say:** "Six-minute structured intake, not an open chatbot. Structured input is what
makes everything downstream reliable — and note the disclaimer right on the page: the
scoring is heuristic, and we say so."

## Minute 0:45–1:45 — Questionnaire (tab 1, keep clicking Continue)

**Do:** Advance to one questionnaire screen (Alignment or Trajectory). Point at one
item and its anchored endpoints. Don't fill all screens live — say so, and switch tabs.

**Say:** "Twenty items, five per ARTH dimension, each anchored 0–4 so answers are
comparable across people. Every answer feeds a fixed arithmetic rubric — the AI never
touches the numbers. I'll jump to a finished result rather than click through all
eight screens."

## Minute 1:45–3:15 — The report (tab 2: `/report/p1-plateaued`)

**Do:** Walk top to bottom, pausing on: (1) the ARTH scorecard, (2) one dimension
explanation, (3) the career paths section, (4) the 90-day plan, (5) the consultation
CTA + rating widget.

**Say:** "Overall 58 — 'Watch.' The story is the *shape*: Human Capital 76, Trajectory
23. Six years in the same seat triggered a deterministic penalty — I can show you the
exact rule. The analysis explains scores it was given; every claim is tagged to the
profile, the score, or a curated career library — and an automated lint rejects drafts
that can't cite themselves. Three matched paths with honest trade-offs, then a 90-day
plan aimed at the weakest dimension. It ends with the business model in one button:
free diagnostic, paid human conversation."

**Must-say caveat:** "This report is from our deterministic mock generator — the Claude
integration is fully built but hasn't run live yet, so I'm showing you the pipeline,
not real AI prose."

## Minute 3:15–4:15 — Consultant review (tab 3: `/review/p3-industry-switcher`)

**Do:** Show the reviewer's view: report beside profile/scores/evidence, per-section
approve/flag buttons, the inline edit boxes, confidence and auto-tracked minutes. This
run is already approved — point at the recorded review.

**Say:** "Nothing is final until a human approves it — and the system measures the
human: minutes and edit volume per review. That number is the hinge of the unit
economics, because the consultant, not the AI, is the real cost."

## Minute 4:15–5:00 — Close (tab: `/runs` or back to report)

**Do:** Flash the runs index (six personas, score spread 42–88) or `/api/metrics`.

**Say:** "Six synthetic personas, scores 42 to 88 — the rubric differentiates. 42 of 42
tests pass, and the funnel is instrumented end to end. What this demo *cannot* show is
a real customer — that's deliberate. The pilot to get real evidence is designed,
materials written, thresholds pre-committed, and needs zero new code. That's the next
ninety days."

---

**Timing discipline:** if running over, cut the questionnaire stop (0:45–1:45) to one
sentence — the report and review screens carry the demo.
