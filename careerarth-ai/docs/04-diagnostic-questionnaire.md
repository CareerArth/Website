# 04 — ARTH Diagnostic Questionnaire (Draft)

Week-1 deliverable. 20 items, 5 per dimension, each answered on a 0–4 scale. Item IDs
map 1:1 to the weights in `docs/02-arth-scoring-rubric.md` §2.1 and to the
`questionnaire` object in `context/profile.schema.json`.

Answer scale (shown to the respondent under every item):

| Value | Meaning |
|---|---|
| 0 | Not at all / never / very weak |
| 1 | Slightly / rarely / weak |
| 2 | Moderately / sometimes / average |
| 3 | Largely / often / strong |
| 4 | Fully / consistently / very strong |

Per-item anchors below give the 0 and 4 endpoints so answers are comparable across
respondents (and so a consultant can sanity-check them during review).

## A — Alignment

- **A1. Role–ambition coherence.** "My day-to-day work directly builds toward the career
  position I want to hold in 5–10 years."
  *(0 = my current work has nothing to do with where I want to end up; 4 = it is a direct stepping stone)*
- **A2. Skills utilization.** "My strongest skills are actively used and valued in my
  current role."
  *(0 = my best skills sit unused; 4 = my role is built around them)*
- **A3. Industry/domain fit.** "The industry I work in today is the industry (or an
  adjacent one) where I want my future career."
  *(0 = I want out of this industry entirely; 4 = same or deliberately adjacent industry)*
- **A4. Values & interest fit.** "The content of my work is genuinely interesting to me
  and consistent with what I value."
  *(0 = I am indifferent or opposed to what the work is; 4 = strongly engaged)*
- **A5. Goal clarity.** "I can state my long-term career goal in one specific sentence."
  *(0 = no idea; 4 = specific role/domain and rough timeline)*

## R — Risk Exposure

*(higher answer = better insulated, matching the favorable-direction scoring)*

- **R1. Industry stability.** "My industry's demand for people like me will be stable or
  growing over the next 5 years."
  *(0 = clearly shrinking; 4 = clearly growing)*
- **R2. Automation insulation.** "The core of my job would be hard to automate or
  commoditize with current technology trends."
  *(0 = largely automatable today; 4 = judgment/relationship-heavy, hard to automate)*
- **R3. Skill currency.** "I have meaningfully updated or extended my core professional
  skills within the last 2 years."
  *(0 = skills last refreshed 5+ years ago; 4 = continuously refreshed, within 12 months)*
- **R4. Employer concentration.** "If my current employer disappeared tomorrow, my
  skills, reputation, and income prospects would transfer intact."
  *(0 = my value is tied to this one employer's systems and people; 4 = fully portable)*
- **R5. Shock absorption.** "I have the financial and geographic flexibility to absorb a
  6-month career disruption."
  *(0 = none; 4 = comfortable runway and mobility)*

## T — Trajectory

- **T1. Scope growth.** "Over the last 3 years my responsibilities, scope, or level have
  grown materially."
  *(0 = identical or reduced scope; 4 = step-change growth, e.g. promotion with expanded remit)*
- **T2. Learning velocity.** "In the last 12 months I acquired a new skill, credential,
  or body of expertise."
  *(0 = nothing new; 4 = multiple substantial additions)*
- **T3. Optionality signals.** "I receive credible external interest — recruiter
  outreach for relevant roles, interview invitations, or offers."
  *(0 = none in the last 2 years; 4 = regular, relevant, senior-appropriate interest)*
- **T4. Momentum.** "My career options feel like they are expanding rather than
  narrowing."
  *(0 = clearly narrowing; 4 = clearly expanding)*
- **T5. Next-step visibility.** "I can name a realistic next role and roughly how I
  would get there."
  *(0 = no visible next step; 4 = named role, known path, rough timeline)*

## H — Human Capital

- **H1. Network strength.** "I can name several senior people outside my current
  employer who would take my call and advocate for me."
  *(0 = none; 4 = five or more across multiple organizations)*
- **H2. Brand & visibility.** "My professional work is visible beyond my employer —
  an active LinkedIn presence, portfolio, talks, publications, or community standing."
  *(0 = invisible externally; 4 = recognized name in my niche)*
- **H3. Transferable breadth.** "My skill set would be valued across multiple roles or
  industries, not just my current one."
  *(0 = single-role, single-industry; 4 = demonstrably cross-industry)*
- **H4. Credentials.** "My degrees, certifications, or formal credentials signal well
  for the roles I want next."
  *(0 = missing an expected credential; 4 = fully credentialed for the target)*
- **H5. Mentorship & sponsorship.** "I have access to mentors or sponsors who actively
  help me navigate career decisions."
  *(0 = no one; 4 = active mentor(s) and at least one sponsor)*

## Administration notes

- Estimated completion time: ~5 minutes, consistent with the "5-Minute Assessment"
  promise on the site's home page.
- The questionnaire is delivered together with the structured profile fields
  (`docs/03-profile-schema.md`); for this capstone both are filled into a JSON file per
  test profile rather than a web UI.
- Self-report bias is acknowledged: R1/R2 answers are cross-checked against the
  knowledge-base outlook data during human review (Layer 5), and the report template
  requires the consultant to flag material disagreements.
