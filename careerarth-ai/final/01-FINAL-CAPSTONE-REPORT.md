# CareerArth AI — Entrepreneurship Capstone

**Submitted by:** Aryan Bhandari
**Submitted to:** Professor Tushar Jaruhar
**Course:** Entrepreneurship Capstone (ENT-CP-4997-1)

---

## Evidence key (used throughout this report)

Because this capstone contains both a working product and an untested business plan, every
material claim in this report belongs to one of three categories, marked where it matters:

- **[DEMONSTRATED]** — verifiable in the repository today: running code, passing tests, logged output.
- **[IMPLEMENTED, UNVALIDATED]** — the code exists and is complete, but has never been exercised under real conditions.
- **[HYPOTHESIS]** — a reasoned business assumption with no supporting evidence yet, awaiting the proposed pilot.

No real customer has used this product. No revenue, conversion, or willingness-to-pay data
exists. Nothing in this report should be read as claiming otherwise.

---

## 1. Executive Summary

CareerArth is an existing career-advisory brand whose website funnels visitors from a free
"5-minute assessment" promise toward paid human consultation. This capstone asks a focused
entrepreneurial question: **can an AI-assisted diagnostic make that funnel genuinely
valuable at the top — good enough that a stranger would complete it, trust it, and want to
talk to a consultant afterwards — without the business overclaiming what the AI knows?**

The project delivers four things:

1. **A working MVP** [DEMONSTRATED]: a branded web product where a user completes a 5–7
   minute structured intake, receives a deterministic ARTH scorecard (Alignment, Risk
   Exposure, Trajectory, Human Capital), and gets a personalised career analysis with
   matched career paths and a 90-day plan — followed by a consultant review workflow and
   full funnel instrumentation. 42 of 42 automated tests pass.
2. **A business model recommendation** [HYPOTHESIS]: use the free diagnostic as
   lead-generation for paid consultation (₹1,999–₹4,999 hypothesised price range), because
   modelling shows consultant time — not AI cost (estimated $0.05–$0.15 per report) — is
   the dominant variable cost, and because this formalises a motion the production
   CareerArth site already runs.
3. **An honest evidence audit**: six synthetic personas demonstrate the system
   differentiates inputs (overall scores from 42 to 88 across four interpretation bands),
   but all generated reports to date use a deterministic mock generator — no real
   Claude-generated report has ever been produced or read, and no real user has touched
   the product.
4. **A ready-to-run validation kit**: a 10–20-person pilot protocol with recruitment
   message, consent text, surveys, interview guide, willingness-to-pay questions, and
   explicit success/failure thresholds — executable after submission with zero additional
   engineering, because the MVP's instrumentation already measures every funnel step the
   pilot needs.

The honest bottom line: **technical feasibility is demonstrated; commercial desirability
is deliberately left as a designed, falsifiable experiment.** The most important number in
this venture — the rate at which a free diagnostic converts a stranger into a paying
consultation client — cannot be known from a laptop, and this report does not pretend to
know it.

---

## 2. CareerArth Context and the Problem

### 2.1 The company context

CareerArth operates a live website offering career diagnostics and strategic advisory. Its
public framing is distinctive: careers fail not through dramatic events but through quiet
erosion — "gilded stagnation," where a well-paid professional's options narrow invisibly
while their salary suggests everything is fine. The site offers a free assessment and
routes interested visitors to a consultation page ("Talk to a Career Expert") with no
published pricing. The ARTH framework — **A**lignment, **R**isk Exposure, **T**rajectory,
**H**uman Capital — is the house methodology, with a published sample scorecard.

This capstone was built as a strictly isolated prototype (`careerarth-ai/` in the same
repository). The production website was not modified.

### 2.2 The customer problem

Mid-career professionals who have stopped growing face a specific, uncomfortable
epistemic problem: **they can feel that something is wrong but cannot decompose it.** Is
the problem their skills? Their industry? Their network? Their own ambition? The feeling
is diffuse; the available responses are extreme (do nothing, or quit) or expensive (hire
a coach before knowing whether the problem warrants one).

Their current options each fail in a characteristic way [HYPOTHESIS — reasoned from the
alternatives analysis, not user-researched]:

- **Asking ChatGPT** produces fluent advice with no structure, no grounding in their
  actual profile, and no accountability.
- **Career coaches** are effective but demand a large, vague commitment upfront —
  precisely when the customer doesn't yet know if their problem justifies it.
- **LinkedIn** shows them a feed, not a decision.
- **Personality assessments** describe traits, not their situation.
- **Free content** requires them to do all the synthesis themselves.

### 2.3 The entrepreneurial opportunity

The opportunity is not "AI career advice" — that is free and abundant. The opportunity is
narrower and more defensible as a *business motion*: **an inexpensive, structured,
trustworthy first step that sits between "vague worry" and "expensive commitment,"**
owned by a brand that already sells the expensive commitment. The diagnostic's job is not
to be the product; its job is to convert diffuse anxiety into a specific, named problem —
at near-zero marginal cost — and hand a well-briefed, high-intent client to a human
consultant whose time is the scarce, monetisable asset.

This reframing matters because it survives the strongest objection ("ChatGPT does this
for free"): a generic chatbot can produce advice, but it cannot produce a structured,
consistent intake, a deterministic score, a consultant-ready brief, and a booked
consultation for a firm the customer already half-trusts.

---

## 3. Initial Customer: ICP and Job-To-Be-Done

### 3.1 Beachhead segment [HYPOTHESIS]

**Mid-career professionals (5–10 years of experience) experiencing career stagnation** —
no promotion or material scope change in 2+ years, currently employed, in the
technology, finance, or marketing/consulting footprint the product's knowledge base
actually covers.

Three candidate segments were evaluated in Stage 3. Early-career professionals (1–3
years) have real but diffuse pain and the weakest willingness-to-pay case. Role/industry
switchers are high-intent but stress the product's shallowest asset — an 18-role
knowledge base — where a switcher's need is breadth. The stagnation segment was chosen
because it matches what the product measures *best*: the ARTH rubric contains an
explicit, deterministic tenure penalty (5+ years in role reduces the Trajectory score),
and the persona built around this pattern produces the most legible diagnostic tension
in testing — strong Human Capital (76) against Critical Trajectory (23), which reads as
"you have assets; you are not using them to move." Stagnation is also the exact pain the
production CareerArth brand already markets to.

### 3.2 Job-to-be-done

> "When I notice I've stopped growing but can't tell whether the problem is me, my role,
> or my industry, help me get an honest, structured read on where I actually stand — and
> a credible next move — without requiring a big commitment before I know it's warranted."

**Triggers:** a denied or bypassed promotion; a second consecutive "solid" (not
"exceptional") review; a peer's title change on LinkedIn; a tenure milestone.

**Willingness-to-pay hypothesis [HYPOTHESIS]:** this segment will not pay meaningfully
for the diagnostic itself (they cannot yet judge its quality) but will pay for a human
consultation *after* the diagnostic has demonstrated specificity about their situation.
This is the single most important untested assumption in the venture.

---

## 4. The Solution: CareerArth AI

### 4.1 Product flow

*Figure 1 — Customer & product flow (see `assets/diagrams/customer-product-flow.svg`)*

The customer experience, as actually built [DEMONSTRATED]:

1. **Structured intake (5–7 min):** a branded wizard collects a compact profile (role,
   industry, experience, skills, goals, constraints, primary concern) and a 20-item ARTH
   questionnaire — five items per dimension, each answered 0–4 against anchored
   endpoints.
2. **Deterministic ARTH scorecard:** fixed weights and thresholds compute four dimension
   scores and an overall Arth Score. **No AI touches the numbers.**
3. **Personalised analysis:** the system retrieves the most relevant roles from a
   curated career knowledge base and drafts a structured report — overall diagnosis,
   dimension explanations, strengths, risks, honest tensions, 2–3 matched career paths
   with trade-offs, skill gaps, a 90-day action plan, and open questions for a
   consultant.
4. **Consultation CTA + instrumentation:** the report ends with a consultation
   call-to-action; every funnel step logs an event.
5. **Consultant review:** a separate review screen lets a human approve, flag, or edit
   each section, tracks review minutes automatically, and flips the customer-visible
   badge to "Consultant reviewed."

### 4.2 The ARTH framework — what it is and is not

ARTH organises a career situation into four questions:

| Dimension | Question it answers | Weight |
|---|---|---|
| **A**lignment | Does today's work build toward the stated ambition? | 0.30 |
| **R**isk Exposure | How insulated is this position from industry and automation shifts? (higher = safer) | 0.25 |
| **T**rajectory | Are options expanding or narrowing over time? | 0.20 |
| **H**uman Capital | How strong are the network, brand, and transferable assets? | 0.25 |

Scores fall into five fixed interpretation bands (Strong 85–100, Stable 70–84, Watch
55–69, Vulnerable 40–54, Critical 0–39). The weighted formula reproduces the sample
scorecard published on the production site (72/48/52/81 → 64) — kept in the test suite
as a regression check, explicitly *not* as validation.

**ARTH is a prototype structured diagnostic framework, not a scientifically validated
instrument.** Its weights are heuristic choices by the founding team. The system embeds
this disclaimer in every generated score object and report footer, and this report's
positioning (§9) treats that honesty as a feature: the product's credibility rests on
structure, evidence-citation, and human review — not on claimed psychometric authority.

### 4.3 Why this design is an entrepreneurship decision, not just an engineering one

Three product rules were chosen specifically to make the *business* defensible:

1. **The AI never scores.** Scores come from a fixed rubric; the AI only explains them.
   A customer (or regulator, or professor) can ask "why is my Trajectory 23?" and receive
   a deterministic answer. This converts the product's weakest point (heuristic weights)
   from a hidden liability into an auditable, improvable asset.
2. **Every claim must cite its evidence.** The report generator is contractually required
   to tag each claim to a profile field, a score, or a knowledge-base entry; an automated
   lint rejects drafts that don't comply. This is the structural answer to "how is this
   better than ChatGPT?"
3. **A human reviews before anything is final.** The review layer is both a trust
   mechanism and the bridge to the revenue event — the consultant meets the client
   already briefed.

---

## 5. The Working MVP [DEMONSTRATED]

### 5.1 What exists and runs

*Figure 2 — System architecture (see `assets/diagrams/architecture.svg`)*

- Branded web intake wizard, customer report, consultant review screen, and runs index,
  served by a small Node server (`npm start`, localhost:4747).
- Deterministic scoring engine reading all weights, modifiers, and bands from a single
  configuration file, so documentation and code cannot drift apart.
- Curated knowledge base: 18 occupation profiles across technology, finance, and
  marketing/consulting, hand-curated from O*NET (the U.S. Department of Labor
  occupational database), each with core skills, transition notes, outlook, and source
  citation. Deterministic keyword retrieval selects the top 5 for each profile, always
  including the user's current and target roles when present, with a graceful
  out-of-corpus fallback that tells the user honestly when their field isn't covered.
- Report generation with a strict JSON structure and the citation lint described above.
- Consultant review workflow with per-section decisions, inline edits, confidence
  rating, and automatic time tracking.
- Instrumentation: eight event types covering the funnel from intake start to
  consultation interest, aggregated by a metrics endpoint.
- **42 of 42 automated tests pass** (re-verified for this report): 16 scoring tests
  (including the hand-calculated worked example and the sample-score calibration), 8
  validation tests, 10 retrieval tests, 8 end-to-end pipeline tests.

### 5.2 The Claude integration [IMPLEMENTED, UNVALIDATED]

The Claude API integration is fully written — model call, structured-output JSON schema,
refusal and truncation handling, token-usage cost accounting. It has **never been
executed**, because no API key was configured during the project. Every report ever
generated by this system — including all six persona reports — was produced by a
deterministic mock generator that fills the same report structure from the scores and
retrieval results.

This is reported plainly because it bounds what the project can claim: the *pipeline* is
demonstrated; the *quality of a real AI-generated report* — its tone, specificity, and
groundedness under real generation — is unknown, and is the first item on the
post-capstone validation roadmap (§13).

---

## 6. Synthetic Testing and Results [DEMONSTRATED — as QA only]

Six synthetic personas were designed to stress different parts of the system. Their
results, re-verified from the stored runs:

| Persona | Situation (invented) | A | R | T | H | Overall | Band |
|---|---|---|---|---|---|---|---|
| p4 gilded-stagnation | Highly paid senior engineer, obsolete stack | 60 | 34 | 10 | 55 | **42** | Vulnerable |
| p6 returner | Re-entering after an 18-month career break | 73 | 38 | 38 | 48 | **51** | Vulnerable |
| p1 plateaued | Ops manager, 6 years in seat, strong network | 73 | 49 | 23 | 76 | **58** | Watch |
| p3 industry-switcher | Finance analyst targeting tech PM | 54 | 64 | 58 | 65 | **60** | Watch |
| p2 early-career | 2 years in, fast learner, thin network | 69 | 73 | 75 | 38 | **63** | Watch |
| p5 high-performer | Recently promoted PM, active brand | 94 | 80 | 100 | 81 | **88** | Strong |

**What this demonstrates:** the scoring rubric differentiates — overall scores span 42 to
88; dimension profiles move independently (p2 and p1 share a band for opposite reasons:
thin network versus stalled momentum); each persona retrieves a different career-path
set; the sparse-data persona (p6, career break, tight constraints) processes cleanly; all
six reports pass the citation lint; and the review workflow functions (exercised once:
6.5 minutes, on p3).

**What this cannot demonstrate — stated without hedging:** customer demand, usefulness
to real people, willingness to pay, recommendation accuracy in real careers, real report
quality, or product-market fit. Six profiles written by the developer to exercise the
rubric are unit-test fixtures, not a user study. This report never counts them as
customer evidence.

---

## 7. Alternatives and the Market Gap

| Alternative | Strength | Characteristic failure for this ICP | CareerArth AI's edge |
|---|---|---|---|
| Generic LLM chat (ChatGPT/Claude) | Free, fluent, always on | No structure, no grounding, quality depends on the user's prompting skill | Fixed framework, cited evidence, human review — discipline the user doesn't have to supply |
| Career coach | Deep human judgment | Large vague commitment before the problem is even named | Cheap structured first step; coach's time spent on strategy, not intake |
| LinkedIn / platforms | Market data, network | A feed, not a decision | A synthesized point-of-view with named trade-offs |
| Personality assessments | Established methodology | Describes traits, not this situation | Situational: uses actual role, tenure, goals, constraints |
| Free content | Breadth | User does all the synthesis | 7 minutes to a personalised, consultant-reviewed brief |

**Critical honesty about the moat (developed further in §10):** none of the *technology*
here is defensible — the pipeline, rubric, and prompts could be replicated by a competent
team in weeks. The differentiation that might endure is (a) the pairing of AI speed with
genuine human review as a trust posture, and (b) CareerArth's existing brand and
advisory funnel, which a standalone tool cannot copy. [HYPOTHESIS — user-perceived
differentiation is untested.]

---

## 8. Business Model

### 8.1 Three models compared [HYPOTHESIS]

| | A. Paid AI report | B. Free diagnostic → paid consultation | C. Premium AI + human bundle |
|---|---|---|---|
| Customer trust at payment moment | Low — pay before any evidence of quality | High — value shown before money asked | Medium-high |
| Scalability | High (software margins) | Diagnostic scales; revenue capped by consultant hours | Capped by consultant throughput |
| Consultant dependency | Low | High but well-targeted (only high-intent clients) | Highest |
| Fit with MVP as built | Weak — the report ships in draft status before review completes | **Strong — mirrors the flow as built and the live site's motion** | Medium — needs delivery re-sequencing |

### 8.2 Recommendation: Model B

**Free (or nominal-cost) AI diagnostic as top-of-funnel; the paid human consultation
(hypothesised ₹1,999–₹4,999) is the revenue event.**

Four reasons, in order of weight: (1) it formalises the funnel the production CareerArth
site already runs — free assessment → "Talk to a Career Expert" — so it requires no new
customer behaviour and no product changes; (2) it matches the MVP's actual delivery
order; (3) it avoids demanding payment for a score whose own methodology note disclaims
validation — protecting the honesty-based positioning; (4) Model C remains a credible
phase-2 evolution once conversion evidence exists.

### 8.3 Pricing and unit economics [HYPOTHESIS — every input unvalidated]

Estimated AI cost per report: **$0.05–$0.15 (~₹4–₹13)** — computed from the model's
published list prices and estimated token volumes, because no live API call has ever been
made. This is an estimate, not a measurement, and is labelled as such wherever cited.

Contribution model per *paying* customer (consultation price − amortised free-tier AI
cost − consultant session cost − ~2.5% gateway fee):

| Scenario | Price | Assumed free→paid conversion | Consultant session | **Contribution** |
|---|---|---|---|---|
| Conservative | ₹1,999 | 5% | 60 min @ ₹1,500/hr | **≈ ₹194** |
| Base | ₹2,999 | 10% | 45 min @ ₹1,000/hr | **≈ ₹2,089** |
| Upside | ₹4,999 | 20% | 30 min @ ₹800/hr | **≈ ₹4,453** |

Conversion rate, prices, consultant rates, and session lengths are all assumptions.

**The genuinely useful finding is structural:** AI cost is 1–13% of price in every
scenario — a rounding error. **Consultant time is the dominant variable cost, and
conversion rate is the dominant margin lever.** The venture's economics therefore hinge
on two questions a pilot can answer cheaply — does the diagnostic convert, and does the
AI brief actually shorten consultant work? — and not on any AI cost optimisation.

---

## 9. Customer Journey and Funnel

The full journey — discovery → landing → diagnostic → report → consultation interest →
paid service → follow-up/referral — is mapped stage-by-stage in the business appendix.
The essential points:

- **The MVP already measures the funnel's critical early stages** [DEMONSTRATED]:
  intake completion (with per-step drop-off location), report generation and viewing,
  usefulness rating (1–5 widget), and consultation-CTA clicks. A pilot reads these
  numbers directly from the metrics endpoint.
- **The gap is at the money end** [DEMONSTRATED as a gap]: the consultation CTA records
  interest but books nothing — no calendar, no payment. This is deliberate scope
  control, but it means "interest ≠ payment" remains unbridged evidence-wise, and the
  pilot's willingness-to-pay questions are the interim instrument.
- Positioning throughout the journey follows one rule: **structure, evidence, and human
  review are the promise — never predictive authority.** The intake page itself carries
  the disclaimer that scores are heuristic and unvalidated.

---

## 10. Competition and Differentiation — the honest version

What CareerArth AI actually differentiates on today: the *combination* of a fixed
diagnostic framework, deterministic scoring, per-claim evidence citation, curated
labor-market grounding, and mandatory human review — wrapped in an existing advisory
brand. No single element is defensible; the combination plus the brand context is the
bet. [HYPOTHESIS]

What it does **not** differentiate on, stated to avoid any overclaim:

- **No technological moat.** Keyword retrieval over 18 hand-curated entries and a
  well-written prompt are replicable. Claimed otherwise nowhere in this report.
- **No data moat yet.** No proprietary outcome data exists; the rubric's weights are
  authored, not learned.
- **No validated quality edge.** Until a real Claude-generated report is produced and
  read (§13, day 1–30), even the quality comparison against raw ChatGPT is untested.

The durable asset, if the venture proceeds, would be built deliberately: real funnel
data, consultant-review learnings, and eventually outcome tracking — none of which
exist today.

---

## 11. Go-To-Market (first 10–50 users)

Lean by design; this is a validation-stage GTM, not a marketing plan. [HYPOTHESIS]

1. **First ~10:** direct outreach to known contacts matching the ICP — doubling as pilot
   recruitment (recruitment message and consent text are written and ready in the
   validation appendix).
2. **Next ~20:** a referral ask built into every pilot conversation ("who else do you
   know in a similar spot?").
3. **Remaining ~20:** one or two honest "help me test this prototype" posts in career
   communities — explicitly not sales pitches.

University/alumni networks, partnerships, paid channels, and content are deliberately
deferred: they are either mis-targeted for this ICP or premature before conversion
evidence exists.

---

## 12. Privacy, Trust, and Ethics

- **Consent is enforced in code** [DEMONSTRATED]: the pipeline refuses any profile
  without explicit consent; synthetic data is flagged as synthetic; real participant
  data (when the pilot runs) requires recorded informed consent and stays out of the
  repository.
- **No overclaiming by construction** [DEMONSTRATED]: hedged language and no-guarantee
  rules live in the generation prompt *and* the review checklist; the heuristic-score
  disclaimer ships inside every score object, on the intake page, and in the report
  footer.
- **Data minimisation:** name and email are stripped from the content sent to the model;
  data stays in local files; no fine-tuning, no third-party sharing.
- **Known trust limitations, openly listed** [DEMONSTRATED as limitations]: self-reported
  answers are unverified (the only cross-check is the human review layer); review URLs
  are unauthenticated (acceptable for a demo, unacceptable beyond it); an AI-drafted
  report reviewed by a consultant is still not licensed career counselling, and the
  consent text for the pilot says so.

---

## 13. Validation: What Would Be Tested Next

### 13.1 The assumption register (top 5 of 10, ranked)

| # | Assumption | Cheapest test | Success threshold |
|---|---|---|---|
| 1 | A real Claude-generated report is clearly better than the mock template | Generate 3–5 real reports; read them before recruiting anyone | Team judges them specific enough to show a stranger |
| 2 | The ICP recognises itself in the report and finds it credible | Pilot post-survey (accuracy, specificity, trust) | Averages ≥ 3.5/5 |
| 3 | Free→paid conversion can sustain Model B | CTA click-rate, already instrumented | ≥ 30% of report viewers express interest |
| 4 | Real users complete the 20-item intake | Completion rate, already instrumented | ≥ 80%, median 5–8 minutes |
| 5 | Stated willingness-to-pay clears a viable floor | Unanchored WTP question post-report | Median ≥ ₹1,500 |

### 13.2 The pilot (designed, not executed)

10–20 participants matching the ICP: recruit → consent → pre-survey (4 questions) → real
diagnostic → real report → post-survey (8 questions) → willingness-to-pay questions (4) →
optional 10-minute interview → consultation-interest measurement. All quantitative steps
map to instrumentation already in the MVP; the qualitative materials are fully drafted.
**No new engineering is required to run it.** If any result is within ~10% of its
threshold at this sample size, it is treated as inconclusive and the interview data
governs.

### 13.3 The 30/60/90-day roadmap

*Figure 3 — Validation journey (see `assets/diagrams/validation-journey.svg`)*

- **Days 1–30:** first real Claude generations (read before recruiting); run the pilot;
  pull the production funnel's real baseline conversion — the cheapest high-leverage
  data point available.
- **Days 31–60:** pricing-anchor testing; time a real consultant reviewing a real
  report; re-run unit economics with measured (not estimated) AI cost and review time;
  re-decide Model B vs. A/C on evidence.
- **Days 61–90:** report-quality and groundedness checks at pilot scale; synthesis
  against thresholds; a written **continue / revise / pivot / stop** decision memo citing
  specific numbers. Explicit stop condition: low completion *and* low interest *and*
  generic-reading real reports means the core value proposition — not the packaging —
  has failed.

No product features are added anywhere in this roadmap until the day-90 decision is
"continue."

---

## 14. Limitations

Consolidated and unhedged:

1. **No real user has ever used the product.** All personas are synthetic; all survey
   instruments are unexecuted.
2. **No real AI report has ever been generated.** All reports are mock-template output;
   the flagship capability is implemented but unobserved.
3. **The ARTH rubric is heuristic and partly circular** — calibrated to reproduce the
   site's marketing sample, not validated against outcomes. Every score carries this
   disclaimer.
4. **All pricing, conversion, and cost-side figures are assumptions or estimates**, and
   are labelled as such at every appearance.
5. **The knowledge base covers 18 roles in 3 industries**; users outside it get a
   degraded (though honestly flagged) experience.
6. **Self-report bias is unmitigated in-product**; the human review layer is the only
   check.
7. **The MVP is a prototype, not a production system**: single-process, file-backed,
   unauthenticated review URLs, no booking or payment.
8. **The production funnel's real conversion baseline was never measured** — its
   *shape* supports Model B; its performance is unknown.

---

## 15. Conclusion

This capstone set out to answer an entrepreneurial question with an unusually honest
evidence posture: build the real product, model the real business, and then refuse to
blur the line between what has been demonstrated and what remains a hypothesis.

What stands demonstrated is meaningful: a complete, tested, instrumented product flow
that turns a seven-minute structured intake into a scored, evidence-cited, humanly
reviewable career diagnostic — architected so that its weakest scientific point (a
heuristic rubric) is contained, disclosed, and auditable rather than hidden behind AI
fluency. What stands unvalidated is equally clear, and this report has named it
repeatedly rather than once: no real user, no real report, no real rupee of evidence on
conversion or willingness to pay.

The venture's next step is therefore not a build decision but an evidence decision, and
it has been made executable: a pilot that needs no code, materials ready to send, and
thresholds committed to in writing *before* the data arrives — so that in ninety days,
"continue, revise, pivot, or stop" can be answered by numbers against promises, which is
the discipline this course teaches and the discipline this document has tried to
practice.

---

*Appendices: Business & Validation Appendix (04), Technical & Product Appendix (05),
Pitch Deck (03), Demo Guide (06). All source material: `careerarth-ai/docs/` Stages 1–4.*
