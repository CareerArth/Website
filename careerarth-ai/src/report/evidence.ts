import type { EvidenceLint, Profile, Report, RetrievalResult } from '../types.js';
import { questionnaireKeys } from '../types.js';

/**
 * Evidence-resolution lint (MVP successor to the Stage-1 groundedness lint).
 * Evidence refs are internal — never shown raw in the customer UI — but every
 * substantive item must carry at least one, and every ref must resolve.
 *
 * Ref grammar:  profile:<dot.path>  |  score:<dimension|overall>  |  kb:<entry-id>  |  questionnaire:<A1..H5>
 */
export function lintReport(report: Report, profile: Profile, retrieval: RetrievalResult): EvidenceLint {
  const issues: string[] = [];
  let checked = 0;

  const retrievedIds = new Set(retrieval.entries.map((r) => r.entry.id));
  const scoreDims = new Set(['alignment', 'riskExposure', 'trajectory', 'humanCapital', 'overall']);
  const qKeys = new Set<string>(questionnaireKeys);

  const resolveProfilePath = (path: string): boolean => {
    let node: unknown = profile;
    for (const part of path.split('.')) {
      if (node !== null && typeof node === 'object' && part in (node as Record<string, unknown>)) {
        node = (node as Record<string, unknown>)[part];
      } else return false;
    }
    return node !== undefined;
  };

  const checkRef = (ref: string, where: string) => {
    checked++;
    const [kind, ...rest] = ref.split(':');
    const value = rest.join(':');
    switch (kind) {
      case 'profile':
        if (!resolveProfilePath(value)) issues.push(`${where}: unresolvable profile ref "${ref}"`);
        break;
      case 'score':
        if (!scoreDims.has(value)) issues.push(`${where}: unknown score ref "${ref}"`);
        break;
      case 'kb':
        if (!retrievedIds.has(value)) issues.push(`${where}: kb ref "${ref}" was not among retrieved entries`);
        break;
      case 'questionnaire':
        if (!qKeys.has(value)) issues.push(`${where}: unknown questionnaire ref "${ref}"`);
        break;
      default:
        issues.push(`${where}: malformed evidence ref "${ref}"`);
    }
  };

  const requireEvidence = (items: { evidence: string[] }[], section: string) => {
    items.forEach((item, i) => {
      if (!item.evidence || item.evidence.length === 0) {
        issues.push(`${section}[${i}]: no evidence refs`);
      } else {
        item.evidence.forEach((ref) => checkRef(ref, `${section}[${i}]`));
      }
    });
  };

  requireEvidence(report.dimensionInsights, 'dimensionInsights');
  requireEvidence(report.strengths, 'strengths');
  requireEvidence(report.risks, 'risks');
  requireEvidence(report.tensions, 'tensions');
  requireEvidence(report.careerPaths, 'careerPaths');
  requireEvidence(report.skillGaps, 'skillGaps');

  // careerPaths.kbId, when set, must be a retrieved entry
  report.careerPaths.forEach((p, i) => {
    if (p.kbId && !retrievedIds.has(p.kbId)) {
      issues.push(`careerPaths[${i}]: kbId "${p.kbId}" not among retrieved entries`);
    }
  });

  return { ok: issues.length === 0, checked, issues };
}
