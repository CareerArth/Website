# Stage 3.6 — Competition / Substitutes

## Categories and representative examples

- **General-purpose LLM chat** — ChatGPT, Claude, Gemini used directly for career
  advice, no structure imposed by the user.
- **Career coaches / consultants** — independent coaches, boutique career-strategy
  firms, executive coaches.
- **Career/professional platforms** — LinkedIn (feed, Learning, Premium "Career
  Advice" features), Glassdoor, professional community forums.
- **Assessments / personality-adjacent tools** — CliftonStrengths, 16Personalities,
  MBTI-based tools, skills assessments bundled into job boards.
- **Free content** — YouTube career channels, Reddit (`r/careerguidance` and similar),
  career blogs and newsletters.

## Comparison

| | Generic LLM chat | Career coach | LinkedIn/platforms | Assessments | Free content | **CareerArth** |
|---|---|---|---|---|---|---|
| Personalisation | Medium (depends entirely on user's prompt skill) | High | Low | Low–Medium (trait-based, not situational) | None | Medium–High (structured intake drives it, bounded by an 18-role KB) |
| Structure | None (open-ended) | Varies by coach | Low | High (fixed instrument) | None | **High — fixed A/R/T/H framework, fixed report sections** |
| Actionability | Medium | High | Low | Low | Low–Medium | Medium–High (90-day plan, cited skill gaps) |
| Human involvement | None | Full | None | None | None (crowd, not expert) | Partial — consultant review layer, positioned honestly as partial (see below) |
| Trust | Low–Medium (no accountability, no citations) | High (relationship-based) | Medium | Medium (branded instruments) | Low (anecdotal) | Medium — earned through citation discipline + human review, undermined if the score is oversold |
| Speed | Instant | Slow (scheduling, session-based) | Instant (but shallow) | Fast | Instant | **Fast (5–7 min intake) + near-instant report** |
| Price | Free/low subscription | High (₹15,000–₹50,000+ range; unverified estimate) | Free/low subscription | Free–Low | Free | Free diagnostic → paid consultation (Model B) |
| Career-specific grounding | None inherent (general knowledge, no curated corpus) | High (human expertise) | Medium (real job/market data, but unstructured) | Low (not career-specific) | Variable, unverified | Medium — 18 O*NET-sourced roles, explicitly labeled coverage gaps outside that corpus |

## What CareerArth actually differentiates on — and what it doesn't

**Genuinely differentiated, given what's built:**

1. **The combination of structure + citation discipline + mandatory scoring
   determinism.** The report generator is contractually forbidden from inventing or
   adjusting a score and must cite every claim to a specific profile field, score, or
   KB entry, enforced by an automated lint (`src/report/evidence.ts`,
   [06-llm-report-generation.md](../06-llm-report-generation.md)). A user prompting
   ChatGPT directly gets none of this discipline unless they build it themselves.
2. **Bundling with an existing human-advisory business.** CareerArth is not launching
   into a cold market — it already runs `/consultation` and has (per the production
   site) an existing "Strategic Advisory" offer. The AI diagnostic is additive to an
   existing trust relationship and existing distribution, not a standalone new brand
   fighting for attention against LinkedIn or a coach.

**Not a real moat — copyable by any competent competitor within weeks:**

1. **The RAG-over-a-small-KB architecture itself.** 18 hand-curated O*NET entries with
   keyword retrieval is explicitly the simplest workable version
   ([01-architecture.md](../01-architecture.md): "adequate at this corpus size...
   embeddings are a flagged stretch goal, not required"). Any team can build an
   equivalent pipeline; this is process, not proprietary technology.
2. **The scoring rubric's weights.** They are heuristic, hand-set, and calibrated to
   reproduce one published sample score — not derived from proprietary outcome data. A
   competitor does not need to reverse-engineer anything; the methodology note on every
   report says this outright.
3. **The prompt design.** A well-written system prompt enforcing citations and hedged
   language is good practice, not a technical barrier.

**Honest conclusion:** CareerArth's durable advantage, if any, is **not algorithmic**.
It is the combination of (a) an existing brand/distribution relationship with its
target segment, and (b) the discipline of pairing AI speed with a real human review step
— which is a process and trust choice, not a technology one. Positioning and GTM material
should lean on "we pair AI drafting with a consultant who actually reviews it" and
existing brand trust, not on any claim of proprietary AI capability, which the codebase
does not support.
