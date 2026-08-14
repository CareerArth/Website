import Anthropic from '@anthropic-ai/sdk';
import type { ArthScores, Profile, Report, RetrievalResult } from '../types.js';
import { careerStage, reportSchema } from '../types.js';
import { generateMockReport } from './mock.js';

const MODEL = process.env.CAREERARTH_MODEL ?? 'claude-opus-5';
// list prices per MTok for claude-opus-5 (USD)
const PRICE_IN = 5, PRICE_OUT = 25;

export interface GenerationResult {
  report: Report;
  generator: 'claude' | 'mock';
  model?: string;
  usage?: { inputTokens: number; outputTokens: number; estCostUsd: number };
}

const str = { type: 'string' } as const;
const strArr = { type: 'array', items: str } as const;
const evidence = { type: 'array', items: str } as const;

function obj(properties: Record<string, unknown>) {
  return { type: 'object', properties, required: Object.keys(properties), additionalProperties: false };
}

const REPORT_JSON_SCHEMA = obj({
  overallDiagnosis: str,
  dimensionInsights: { type: 'array', items: obj({ dimension: str, headline: str, explanation: str, evidence }) },
  strengths: { type: 'array', items: obj({ title: str, detail: str, evidence }) },
  risks: { type: 'array', items: obj({ title: str, detail: str, severity: str, evidence }) },
  tensions: { type: 'array', items: obj({ title: str, detail: str, evidence }) },
  careerPaths: { type: 'array', items: obj({ title: str, kbId: str, fitRationale: str, keyTradeoff: str, timeframe: str, firstSteps: strArr, evidence }) },
  pathComparison: { type: 'array', items: obj({ pathTitle: str, effort: str, risk: str, upside: str, note: str }) },
  skillGaps: { type: 'array', items: obj({ skill: str, why: str, howToClose: str, evidence }) },
  ninetyDayPlan: { type: 'array', items: obj({ phase: str, focus: str, actions: strArr }) },
  nextDecision: str,
  discussWithConsultant: strArr,
  missingInfo: strArr,
});

const SYSTEM_PROMPT = `You write personalised career diagnostic analyses for CareerArth, addressed directly to the client ("you"). A human consultant reviews every analysis before it is treated as final.

Hard rules:
1. SCORES ARE FIXED. The ARTH scores you receive were computed by a deterministic rubric. Never invent, restate incorrectly, adjust, or second-guess a number. When explaining a score, reference the questionnaire answers and modifiers provided.
2. GROUND EVERY CLAIM. Each item's "evidence" array must contain refs of the form profile:<field.path>, score:<alignment|riskExposure|trajectory|humanCapital|overall>, kb:<entry-id>, or questionnaire:<A1..H5>. Only cite kb ids from the retrieved entries provided. If you cannot ground a claim, either drop it or move it to missingInfo/discussWithConsultant.
3. CALIBRATED LANGUAGE. Use "likely", "based on what you've told us". Never promise outcomes (salary, offers, admission). Flag self-report limits where material.
4. NAME WHAT'S MISSING. Put genuine gaps in missingInfo, and judgment calls that need a human in discussWithConsultant.
5. Career paths: 2–4, each tied to a retrieved kb entry via kbId where possible (kbId may be "" only if no retrieved entry fits). Compare them honestly, including trade-offs. First steps must be concrete and startable within two weeks.
6. The 90-day plan has exactly three phases (Days 1–30, 31–60, 61–90) and must target the client's weakest dimensions, not generic advice.
7. Tone: direct, warm, strategic — a sharp consultant, not a cheerleader. No filler. This client is relatively early-career; make advice concrete and low-jargon.`;

export async function generateReport(
  profile: Profile,
  scores: ArthScores,
  retrieval: RetrievalResult,
): Promise<GenerationResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { report: generateMockReport(profile, scores, retrieval), generator: 'mock' };
  }

  const client = new Anthropic();
  const { fullName, email, ...profileForModel } = profile; // name/email not needed for analysis
  const userContent = [
    `## Client profile (career stage: ${careerStage(profile.yearsExperience)})`,
    JSON.stringify(profileForModel, null, 1),
    `## Deterministic ARTH scores (fixed — explain, never alter)`,
    JSON.stringify(scores, null, 1),
    `## Retrieved knowledge-base entries (the only kb: ids you may cite)`,
    JSON.stringify(retrieval.entries.map((r) => ({
      id: r.entry.id, title: r.entry.title, summary: r.entry.summary,
      coreSkills: r.entry.coreSkills, transitionsFrom: r.entry.transitionsFrom,
      outlook: r.entry.outlook, matchReasons: r.matchReasons, guaranteed: r.guaranteed,
    })), null, 1),
    retrieval.coverageNote ? `## Coverage note\n${retrieval.coverageNote}` : '',
    `Produce the full diagnostic JSON now.`,
  ].filter(Boolean).join('\n\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userContent }],
    output_config: { format: { type: 'json_schema', schema: REPORT_JSON_SCHEMA } },
  } as Anthropic.MessageCreateParamsNonStreaming);

  if (response.stop_reason === 'refusal') {
    throw new Error('Model declined to generate this analysis (refusal). No report produced.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('Analysis truncated at max_tokens; not saving a partial report.');
  }

  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new Error('No text content in model response.');
  const parsed = reportSchema.safeParse(JSON.parse(text.text));
  if (!parsed.success) {
    throw new Error(`Model output failed report schema validation: ${parsed.error.message}`);
  }

  const inputTokens = response.usage.input_tokens + (response.usage.cache_creation_input_tokens ?? 0) + (response.usage.cache_read_input_tokens ?? 0);
  const outputTokens = response.usage.output_tokens;
  const estCostUsd =
    ((response.usage.input_tokens / 1e6) * PRICE_IN) +
    (((response.usage.cache_creation_input_tokens ?? 0) / 1e6) * PRICE_IN * 1.25) +
    (((response.usage.cache_read_input_tokens ?? 0) / 1e6) * PRICE_IN * 0.1) +
    ((outputTokens / 1e6) * PRICE_OUT);

  return {
    report: parsed.data,
    generator: 'claude',
    model: response.model,
    usage: { inputTokens, outputTokens, estCostUsd: Math.round(estCostUsd * 10000) / 10000 },
  };
}
