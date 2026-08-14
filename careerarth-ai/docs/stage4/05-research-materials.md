# Stage 4.5 — Ready-to-Use Research Material

Copy-paste-ready. Kept short deliberately so the pilot in
[04-pilot-protocol.md](04-pilot-protocol.md) is actually runnable, not just designed.

---

## 1. Recruitment message

> Subject: 10 minutes — try something I've been building?
>
> Hi [Name] — I've built a short career diagnostic tool (~5–7 minutes) that gives you a
> structured read on where you stand career-wise, plus a couple of realistic next steps.
> It's a prototype, not a finished product, and I'd genuinely value your honest reaction
> — good or bad.
>
> It's free, takes about 10 minutes total including 2 short surveys, and your answers
> help me decide whether this is worth continuing to build. No sales pitch attached.
>
> Interested? I'll send the link and a 1-minute consent note.

---

## 2. Consent text

> **What this is:** A prototype career-diagnostic tool built as part of an
> entrepreneurship capstone project (not a finished commercial product).
>
> **What I'm asking:** Complete a short intake form, read your generated report, and
> answer two short surveys (~10 minutes total). You may optionally do a 10-minute
> follow-up call.
>
> **Your data:** Your responses (profile info, questionnaire answers, survey answers) are
> stored locally for this research only, will not be shared outside the project team,
> and will not be used for any commercial purpose without asking you again first. You can
> ask for your data to be deleted at any time.
>
> **Your report is AI-generated** and reviewed by the project team, not a licensed
> career counselor. It is not professional career or financial advice.
>
> **Participation is voluntary** — you can stop at any point with no consequence.
>
> By continuing, you confirm you're 18+ and agree to the above. *(Record: Name, date, "I
> agree" — a checkbox is enough; no signature needed.)*

---

## 3. Pre-use questionnaire

1. In one sentence, what's prompting you to think about your career right now?
2. On a scale of 1–5, how stuck or stagnant do you currently feel in your career?
3. Have you used a career-assessment tool, coach, or AI chat for career advice before?
   Which, and how useful was it (1–5)?
4. Before you start — what would make this genuinely useful to you?

## 4. Post-report questionnaire

| # | Question | Type |
|---|---|---|
| 1 | How well did this report describe your actual situation? | 1–5 |
| 2 | How specific did this feel, versus generic career advice? | 1–5 |
| 3 | How much do you trust the score as a fair read of your situation? | 1–5 |
| 4 | Did anything surprise you? | Free text |
| 5 | Did this clarify or change how you're thinking about a career decision? | Clearly / Somewhat / No |
| 6 | If clearly/somewhat — what changed? | Free text |
| 7 | How likely are you to want a follow-up conversation with a consultant about this? | 1–5 |
| 8 | Roughly how long did the intake take, and did it feel long or short? | Minutes + short/about right/long |

## 5. Willingness-to-pay questions (ask after the report, in this order)

1. What would you expect to pay for a live follow-up consultation based on this report?
   *(Open-ended — do not show a price first.)*
2. If the diagnostic itself had cost money upfront, would you still have done it? At
   ₹0 / ₹299 / ₹999 — which of these would you still have paid?
3. Which would you prefer: (a) pay a small amount for the diagnostic alone, (b) free
   diagnostic + pay for a consultation, (c) pay more upfront for a diagnostic bundled
   with a guaranteed human-reviewed strategy session?
4. Would you pay again for an updated diagnostic in 6–12 months? Why or why not?

## 6. 10-minute interview guide (optional, subset of participants)

1. Walk me through your reaction as you read the report — where did you slow down or
   re-read something?
2. Was there a moment you disagreed with it? What, and why?
3. If a friend in a similar spot asked whether this was worth their time, what would
   you tell them?
4. What would make you actually book and pay for a follow-up consultation — and what
   would stop you?
5. Anything the report clearly got wrong or missed about your situation?

## 7. Results data schema (one row per participant)

| Column | Source | Notes |
|---|---|---|
| `participant_id` | Assigned | Anonymized, not name/email |
| `consent_given` | Consent step | Y/N + date |
| `pre_stagnation_score` | Pre-survey Q2 | 1–5 |
| `prior_tool_used` / `prior_tool_rating` | Pre-survey Q3 | Text / 1–5 |
| `intake_started_at` / `intake_completed_at` | `data/events.jsonl` (existing) | Timestamps — also gives completion time directly |
| `run_id` | `data/runs/<id>.json` | Links to the actual generated report for audit |
| `overall_score` / `band` | Run record | For correlating score band with survey response |
| `accuracy_1to5` / `specificity_1to5` / `trust_1to5` | Post-survey Q1–3 | |
| `decision_impact` | Post-survey Q5 | Clearly/Somewhat/No |
| `consultation_interest_1to5` | Post-survey Q7 | |
| `consultation_cta_clicked` | `consultation_interest` event (existing) | Y/N, behavioral not stated |
| `wtp_consultation_open` | WTP Q1 | ₹ amount, open-ended |
| `wtp_diagnostic_price_accepted` | WTP Q2 | ₹0 / ₹299 / ₹999 |
| `preferred_model` | WTP Q3 | A / B / C |
| `repeat_use_intent` | WTP Q4 | Y/N + free text |
| `interview_completed` | Step 9 | Y/N |
| `interview_notes` | Interview guide | Free text summary |

Keep this as a single spreadsheet (Google Sheet or CSV) — one tab, one row per
participant. No database is needed for 10–20 rows.

## 8. Success / failure thresholds (same as Stage 3, restated for direct use)

| Metric | Success | Failure |
|---|---|---|
| Intake completion rate | ≥ 80% | < 50% |
| Median intake time | 5–8 min | > 12 min |
| Accuracy / trust (avg) | ≥ 3.5 / 5 | < 3.0 / 5 |
| Decision-clarifying effect | ≥ 50% "clearly"/"somewhat" | < 25% |
| Consultation interest (CTA click rate) | ≥ 30% | < 10% |
| WTP for consultation (median open-ended) | ≥ ₹1,500 | < ₹500 or majority "wouldn't pay" |
| Preferred model | Clear majority (≥ 50%) for one option | 3-way split |

Treat any metric within ~10% of its threshold as inconclusive at this sample size —
weight the interview notes at least as heavily as the averages.
