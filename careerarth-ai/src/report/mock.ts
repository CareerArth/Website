import type { ArthScores, Dimension, Profile, Report, RetrievalResult } from '../types.js';
import { careerStage } from '../types.js';
import { bestTitleMatch, tokenize } from '../retrieval/retrieve.js';

const MOD_LABEL: Record<string, string> = {
  T_TENURE_LONG: 'five or more years in the same role',
  T_TENURE_FRESH: 'a recent move into a new role',
  T_PROMOTIONS: 'multiple recent promotions',
  R_VOLATILE_INDUSTRY: 'working in a high-volatility industry',
  R_STABLE_INDUSTRY: 'working in a comparatively stable industry',
  H_NO_LINKEDIN: 'no external professional profile provided',
  A_MISALIGNMENT_CONCERN: 'your stated concern about misalignment',
};

const DIM_LABEL: Record<Dimension, string> = {
  alignment: 'Alignment',
  riskExposure: 'Risk Exposure',
  trajectory: 'Trajectory',
  humanCapital: 'Human Capital',
};

/**
 * Deterministic report generator used when no ANTHROPIC_API_KEY is set (and in tests).
 * Builds the same Report shape from real scores/retrieval so demos and tests run at
 * zero API cost. Text is templated but data-driven, so personas differ meaningfully.
 */
export function generateMockReport(profile: Profile, scores: ArthScores, retrieval: RetrievalResult): Report {
  const dims = Object.entries(scores.dimensions) as [Dimension, ArthScores['dimensions'][Dimension]][];
  const sorted = [...dims].sort((a, b) => a[1].score - b[1].score);
  const weakest = sorted[0];
  const secondWeakest = sorted[1];
  const strongest = sorted[sorted.length - 1];
  const stage = careerStage(profile.yearsExperience);

  const targetTitle = profile.goals.targetRole ?? profile.currentRole;
  const targetEntry = retrieval.entries.find((r) => r.guaranteed && bestTitleMatch(profile.goals.targetRole)?.id === r.entry.id)?.entry
    ?? retrieval.entries[0]?.entry;

  // skill gaps = target entry coreSkills not covered by profile skills (token overlap)
  const profileSkillTokens = new Set(profile.skills.flatMap(tokenize));
  const gaps = (targetEntry?.coreSkills ?? [])
    .filter((s) => !tokenize(s).some((t) => profileSkillTokens.has(t)))
    .slice(0, 4);

  const pathEntries = retrieval.entries.slice(0, 3);

  return {
    overallDiagnosis:
      `Your overall Arth Score is ${scores.overall} (${scores.overallBand}). ` +
      `The pattern behind it matters more than the number: ${DIM_LABEL[strongest[0]]} is your strongest dimension (${strongest[1].display}), ` +
      `while ${DIM_LABEL[weakest[0]]} (${weakest[1].display}, ${weakest[1].band}) is where your position is weakest. ` +
      `Based on the information provided, the most valuable next move for a ${stage}-stage professional in your situation is likely to concentrate effort on ${DIM_LABEL[weakest[0]].toLowerCase()} before it constrains your options further. ` +
      `${retrieval.coverageNote ?? ''}`.trim(),
    dimensionInsights: dims.map(([dim, d]) => ({
      dimension: DIM_LABEL[dim],
      headline: `${d.display} — ${d.band}`,
      explanation:
        `Your ${DIM_LABEL[dim]} score of ${d.display} comes directly from your questionnaire responses` +
        (d.modifiers.length
          ? `, adjusted for ${d.modifiers.map((m) => `${MOD_LABEL[m.id] ?? m.id} (${m.delta > 0 ? '+' : ''}${m.delta} points)`).join(' and ')}.`
          : '.') +
        ` This is a heuristic reading of your self-assessment, not a verdict.`,
      evidence: [`score:${dim}`, 'profile:questionnaire'],
    })),
    strengths: [
      {
        title: `${DIM_LABEL[strongest[0]]} is working for you`,
        detail: `At ${strongest[1].display} (${strongest[1].band}), this is the asset to protect and build on rather than take for granted.`,
        evidence: [`score:${strongest[0]}`],
      },
      {
        title: 'Clear self-reported skill base',
        detail: `You named ${profile.skills.length} working skills (${profile.skills.slice(0, 3).join(', ')}${profile.skills.length > 3 ? '…' : ''}), which gives the analysis concrete material to match against role requirements.`,
        evidence: ['profile:skills'],
      },
    ],
    risks: [
      {
        title: `${DIM_LABEL[weakest[0]]} is the primary drag`,
        detail: `At ${weakest[1].display} (${weakest[1].band}), this dimension is likely to limit your options first if unaddressed.`,
        severity: weakest[1].score < 40 ? 'high' : weakest[1].score < 55 ? 'medium' : 'watch',
        evidence: [`score:${weakest[0]}`],
      },
      {
        title: `${DIM_LABEL[secondWeakest[0]]} needs monitoring`,
        detail: `At ${secondWeakest[1].display} (${secondWeakest[1].band}), a second pressure point that compounds the first.`,
        severity: secondWeakest[1].score < 55 ? 'medium' : 'watch',
        evidence: [`score:${secondWeakest[0]}`],
      },
    ],
    tensions: [
      {
        title: 'Ambition vs. current evidence',
        detail: profile.goals.targetRole
          ? `You are aiming at ${profile.goals.targetRole} within ${profile.goals.horizonYears} years, while your ${DIM_LABEL[weakest[0]].toLowerCase()} signals suggest the groundwork for that move is not yet in place. Neither fact is a problem alone; together they set your real agenda.`
          : `You have not named a target role, yet your concern ("${profile.concernCategory}") implies you want movement. Deciding the destination is itself the first piece of work.`,
        evidence: ['profile:goals', `score:${weakest[0]}`],
      },
    ],
    careerPaths: pathEntries.map((r, i) => ({
      title: r.entry.title,
      kbId: r.entry.id,
      fitRationale:
        `${r.entry.summary} Matched to you via ${r.matchReasons[0] ?? 'your skills and industry'}.` +
        (r.entry.transitionsFrom.length ? ` Transition note: ${r.entry.transitionsFrom[0].note}` : ''),
      keyTradeoff: i === 0
        ? 'Closest fit to your stated direction — lowest friction, but smallest change in trajectory.'
        : i === 1
          ? 'A stretch move: better long-term positioning at the cost of a harder transition.'
          : 'An adjacent option worth pricing before committing to either of the first two.',
      timeframe: i === 0 ? '6–12 months' : '12–24 months',
      firstSteps: [
        `Speak to two people currently in a ${r.entry.title} role`,
        gaps[0] ? `Close the "${gaps[0]}" gap with a scoped project or course` : 'Audit your skills against this role’s requirements',
      ],
      evidence: [`kb:${r.entry.id}`, 'profile:skills'],
    })),
    pathComparison: pathEntries.map((r, i) => ({
      pathTitle: r.entry.title,
      effort: i === 0 ? 'Low–moderate' : i === 1 ? 'High' : 'Moderate',
      risk: r.entry.outlook.category === 'declining' ? 'Elevated (role outlook declining)' : r.entry.outlook.category === 'growing' ? 'Lower (growing demand)' : 'Moderate',
      upside: r.entry.outlook.category === 'growing' ? 'Expanding option set' : 'Stability, incremental growth',
      note: r.entry.outlook.note,
    })),
    skillGaps: gaps.length
      ? gaps.map((g) => ({
          skill: g,
          why: `Listed as a core requirement for ${targetEntry?.title ?? targetTitle} but absent from your stated skills.`,
          howToClose: 'A scoped real project beats a certificate: find one deliverable at or near your current job that exercises this skill.',
          evidence: targetEntry ? [`kb:${targetEntry.id}`, 'profile:skills'] : ['profile:skills'],
        }))
      : [{
          skill: 'No hard gaps detected against the closest matched role',
          why: 'Your stated skills already cover the matched role’s core requirements — the constraint is positioning, not capability.',
          howToClose: 'Shift effort to visibility and network (see 90-day plan).',
          evidence: ['profile:skills'],
        }],
    ninetyDayPlan: [
      {
        phase: 'Days 1–30',
        focus: `Diagnose and decide — pressure-test this report against reality`,
        actions: [
          'Hold 3 conversations with people one step ahead of you on your preferred path',
          `Write a one-page decision memo: stay-and-grow vs. ${profile.goals.targetRole ? `move toward ${profile.goals.targetRole}` : 'a named target role'}`,
        ],
      },
      {
        phase: 'Days 31–60',
        focus: `Attack the weakest dimension (${DIM_LABEL[weakest[0]]})`,
        actions: weakest[0] === 'humanCapital'
          ? ['Reconnect with 5 former colleagues', 'Publish or present one piece of work externally']
          : weakest[0] === 'trajectory'
            ? ['Negotiate one scope expansion in your current role', 'Start one visible stretch project']
            : weakest[0] === 'riskExposure'
              ? ['Refresh one core skill to current market standard', 'Map your skills to two employers beyond your current one']
              : ['Define your 5-year target in writing', 'Realign one current responsibility toward it'],
      },
      {
        phase: 'Days 61–90',
        focus: 'Convert into motion',
        actions: [
          gaps[0] ? `Complete a scoped project exercising "${gaps[0]}"` : 'Complete one externally visible deliverable',
          'Review progress against this scorecard and re-decide',
        ],
      },
    ],
    nextDecision:
      `The single decision in front of you: commit to ${pathEntries[0] ? `a deliberate move toward ${pathEntries[0].entry.title}` : 'a named target role'} within ${profile.goals.horizonYears} years, or commit to repositioning inside your current role — and stop hedging between the two. The 90-day plan is designed to make that decision with evidence.`,
    discussWithConsultant: [
      `Whether the self-assessed ${DIM_LABEL[weakest[0]]} reading matches how the market actually sees you`,
      profile.constraints.length ? `How your constraints (${profile.constraints.join('; ')}) reshape the realistic path set` : 'Which of the compared paths best fits constraints not captured in this intake',
      'Compensation and market positioning — deliberately out of scope for this automated analysis',
    ],
    missingInfo: [
      ...(retrieval.coverageNote ? [retrieval.coverageNote] : []),
      ...(!profile.goals.targetRole ? ['No target role provided — path ranking is inferred from skills and industry only.'] : []),
      ...(!profile.linkedInUrl ? ['No LinkedIn profile provided — external-brand assessment relies solely on self-report.'] : []),
      'All questionnaire inputs are self-reported and not independently verified.',
    ],
  };
}
