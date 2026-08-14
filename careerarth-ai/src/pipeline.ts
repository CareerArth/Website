import type { Profile, Run } from './types.js';
import { careerStage, profileSchema } from './types.js';
import { scoreProfile } from './scoring/score.js';
import { industryVolatility, retrieve } from './retrieval/retrieve.js';
import { generateReport } from './report/generate.js';
import { lintReport } from './report/evidence.js';
import { newRunId, saveRun, logEvent } from './store.js';

/**
 * Full diagnostic pipeline: validate → score → retrieve → generate → lint → persist.
 * Throws on validation failure (with zod field errors) and on generation failure.
 */
export async function runDiagnostic(rawProfile: unknown): Promise<Run> {
  const parsed = profileSchema.safeParse(rawProfile);
  if (!parsed.success) {
    const fieldErrors = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new ValidationError(`Profile validation failed — ${fieldErrors}`);
  }
  const profile: Profile = parsed.data;
  if (profile.consent !== true) throw new ValidationError('Consent is required.');

  const volatility = industryVolatility(profile.industry);
  const scores = scoreProfile(profile, volatility);
  const retrieval = retrieve(profile, 5);
  const generation = await generateReport(profile, scores, retrieval);
  const lint = lintReport(generation.report, profile, retrieval);

  const run: Run = {
    id: profile.id ?? newRunId(),
    createdAt: new Date().toISOString(),
    profile,
    stage: careerStage(profile.yearsExperience),
    scores,
    retrieval,
    report: generation.report,
    generator: generation.generator,
    model: generation.model,
    usage: generation.usage,
    lint,
    status: 'draft',
  };
  saveRun(run);
  logEvent('report_generated', run.id, {
    generator: run.generator,
    lintOk: lint.ok,
    lintIssues: lint.issues.length,
    overall: scores.overall,
    band: scores.overallBand,
    isSynthetic: profile.isSynthetic,
    ...(run.usage ? { inputTokens: run.usage.inputTokens, outputTokens: run.usage.outputTokens, estCostUsd: run.usage.estCostUsd } : {}),
  });
  return run;
}

export class ValidationError extends Error {}
