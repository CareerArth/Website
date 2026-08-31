# 04 — ARTH Diagnostic Questionnaire

**Revision note (2026):** this questionnaire was replaced with the wording and scoring
key supplied by Professor Tushar Jaruhar (`CA_BADS_Summer_2026_D2.xlsx`, course
CA_BADS Summer 2026). It keeps the same structure as the original Stage-1 draft — 20
items, 5 per ARTH dimension, item IDs `A1`–`H5` unchanged — so no schema, validation, or
scoring-code changes were needed; only item text, the answer scale, and reverse-scoring
changed. See `docs/09-admin-dashboard-and-new-questionnaire.md` for the full change
rationale and the source-mapping table (spreadsheet row → item ID).

Each item is answered on a standard 5-point Likert scale, shown to the respondent as
category labels (not raw numbers):

| Label | Strongly Disagree | Disagree | Neutral | Agree | Strongly Agree |
|---|---|---|---|---|---|

Internally, every answer is still stored as an integer **0–4** (Strongly Disagree=0 …
Strongly Agree=4 for a forward-scored item), so `context/scoring-config.json`'s
`answerScale`, `context/profile.schema.json`, and `src/scoring/score.ts` are unchanged
from the original spec — the mapping happens once, at intake, in `web/intake.js`.

## Reverse-scored items

Five items describe a negative or vulnerable situation, so agreeing with them should
*lower*, not raise, the dimension score. For these, the stored value is inverted
(`4 − Likert position`) at the point of intake:

**A4, R3, R5, T4, H4**

**Flag for the professor — not silently resolved:** two items (**T3**, **H2**) are
phrased negatively in the same way as the reverse-scored items above, but the source
spreadsheet keys them **forward** (Strongly Agree = highest raw score), not reversed.
This questionnaire implements the sheet exactly as given. Before using results from
this questionnaire for anything grade-affecting, confirm with the professor whether T3
and H2 were intentionally left forward-keyed or should be reverse-scored like their
neighbors (T4, H4). See `docs/09-admin-dashboard-and-new-questionnaire.md` §"Open
question for the professor" for the side-by-side comparison that prompted this flag.

## A — Alignment

*How well your current skills and effort line up with where the market is going.*

- **A1.** Relevant opportunities rarely come to you unless you actively apply or reach out yourself.
- **A2.** Your current skills are well aligned with what employers in your market actively demand today.
- **A3.** You are actively building skills that are likely to become more valuable over the next few years.
- **A4.** *(reverse-scored)* Your current role helps you perform today, but it is not meaningfully building capabilities that will remain valuable in future roles or career moves.
- **A5.** The industry you work in is likely to create meaningful long-term growth and opportunity over the next decade.

## R — Risk Exposure

*How exposed you'd be if your current role or income were disrupted.*

- **R1.** If you had to leave your current role, you could realistically secure a comparable or better opportunity within the next six months.
- **R2.** The core work you do is unlikely to be significantly reduced, replaced, or devalued by automation or AI in the near future.
- **R3.** *(reverse-scored)* A job loss, career break, or transition would put you under immediate financial pressure.
- **R4.** Your monthly expenses and financial responsibilities do not force you to stay in your current role. If needed, you could leave and take a temporary pay cut or transition role without significant financial strain.
- **R5.** *(reverse-scored)* Your career choices are heavily restricted by location, family responsibilities, health, or other personal constraints.

## T — Trajectory

*Whether your scope, visibility, and momentum are expanding or stalling.*

- **T1.** Over the past few years, your role has expanded in scope, complexity, or decision-making authority.
- **T2.** Your work is visible to senior leaders or key decision-makers.
- **T3.** *(forward-keyed in the source sheet — see flag above)* Real opportunities for promotion, expanded responsibility, or better roles have become infrequent for you.
- **T4.** *(reverse-scored)* Looking back over the past few years, your career has not moved forward in a clear or meaningful way.
- **T5.** You are trusted with work or decisions where the stakes, visibility, or business impact are high.

## H — Human Capital

*The strength of your expertise, network, and visible proof of your value.*

- **H1.** Your expertise is strong enough to help you command above-average compensation for someone with similar experience in your field.
- **H2.** *(forward-keyed in the source sheet — see flag above)* Your LinkedIn, resume, or professional profile does not clearly communicate the skills, strengths, and achievements that distinguish you.
- **H3.** You have relationships with people who could realistically help you access new roles, clients, or career opportunities.
- **H4.** *(reverse-scored)* It would be difficult for others to quickly verify your achievements through credible evidence such as recommendations, endorsements, strong work proof, or visible accomplishments.
- **H5.** The work you do depends on judgment, expertise, or problem-solving that would be difficult to replace with automation or AI.

## Administration notes

- Estimated completion time: ~5–7 minutes, unchanged from the original questionnaire's
  timing (same item count, same intake wizard).
- Item weights (`context/scoring-config.json`) were **kept at their original values**,
  applied positionally to the new items (e.g. the item in each dimension's #1 slot still
  carries that dimension's highest weight). These weights were tuned for the *old*
  question wording and have not been re-validated against the new items' content — they
  are a reasonable starting default, not a professor-approved calibration. The new
  admin dashboard (`/admin`, see `docs/09`) exists specifically so these can be retuned
  without a code change once there's a view on which of the new items should carry more
  or less weight.
- Self-report bias is unmitigated in-product, same limitation as the original
  questionnaire (`docs/06-llm-report-generation.md`'s human-review layer is the only
  check).
