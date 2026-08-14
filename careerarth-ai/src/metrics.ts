import { listRuns, readEvents } from './store.js';

/**
 * Aggregates the business-relevant instrumentation into a simple summary.
 * These are the measures Stage 4 validation will care about; no fabricated data —
 * everything here is computed from locally logged events and runs.
 */
export function metricsSummary() {
  const events = readEvents();
  const runs = listRuns();

  const count = (type: string) => events.filter((e) => e.type === type).length;

  const intakeStarted = count('intake_started');
  const intakeCompleted = count('intake_completed');
  const reportsGenerated = count('report_generated');
  const reportViews = count('report_viewed');
  const consultationInterest = count('consultation_interest');

  const ratings = events
    .filter((e) => e.type === 'usefulness_rating')
    .map((e) => Number((e.meta as { rating?: number })?.rating))
    .filter((r) => Number.isFinite(r));

  const reviews = runs.filter((r) => r.review);
  const reviewMinutes = reviews.map((r) => r.review!.minutes);
  const editedChars = reviews.map((r) => r.review!.editedChars);
  const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

  const llmRuns = runs.filter((r) => r.usage);
  const avgCost = avg(llmRuns.map((r) => r.usage!.estCostUsd));

  return {
    funnel: {
      intakeStarted,
      intakeCompleted,
      intakeCompletionRate: intakeStarted ? Math.round((100 * intakeCompleted) / intakeStarted) : null,
      reportsGenerated,
      reportViews,
      consultationInterest,
      consultationInterestRate: reportViews ? Math.round((100 * consultationInterest) / reportViews) : null,
    },
    quality: {
      usefulnessRatings: ratings.length,
      avgUsefulness: avg(ratings),
      lintPassRate: runs.length ? Math.round((100 * runs.filter((r) => r.lint.ok).length) / runs.length) : null,
    },
    consultantOps: {
      reviewsSubmitted: reviews.length,
      avgReviewMinutes: avg(reviewMinutes),
      avgEditedChars: avg(editedChars),
      approved: reviews.filter((r) => r.review!.overall === 'approved').length,
      needsRevision: reviews.filter((r) => r.review!.overall === 'needs-revision').length,
    },
    unitEconomics: {
      llmGeneratedRuns: llmRuns.length,
      mockRuns: runs.filter((r) => r.generator === 'mock').length,
      avgLlmCostUsdPerReport: avgCost,
      note: 'LLM cost only; excludes consultant review time (see consultantOps.avgReviewMinutes).',
    },
    totalRuns: runs.length,
  };
}
