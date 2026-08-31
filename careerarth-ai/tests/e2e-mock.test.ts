/**
 * End-to-end synthetic flows: all six personas through validate → score → retrieve →
 * generate (mock) → lint. Runs with no API key and no network; writes to a temp data dir.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';
import type { Run } from '../src/types.js';

process.env.CAREERARTH_DATA_DIR = mkdtempSync(join(tmpdir(), 'careerarth-test-'));
delete process.env.ANTHROPIC_API_KEY; // force mock generator

const { runDiagnostic } = await import('../src/pipeline.js');
const { lintReport } = await import('../src/report/evidence.js');

const personasDir = new URL('../demo/personas/', import.meta.url);
const personaFiles = readdirSync(personasDir).filter((f) => f.endsWith('.json')).sort();

const runs: Record<string, Run> = {};

beforeAll(async () => {
  for (const f of personaFiles) {
    const profile = JSON.parse(readFileSync(new URL(f, personasDir), 'utf8'));
    const run = await runDiagnostic(profile);
    runs[run.id] = run;
  }
}, 30000);

describe('end-to-end synthetic flows (mock generator)', () => {
  it('all six personas produce complete runs', () => {
    expect(Object.keys(runs).length).toBe(6);
    for (const run of Object.values(runs)) {
      expect(run.generator).toBe('mock');
      expect(run.report.careerPaths.length).toBeGreaterThanOrEqual(2);
      expect(run.report.ninetyDayPlan.length).toBe(3);
      expect(run.report.overallDiagnosis.length).toBeGreaterThan(50);
      expect(run.report.discussWithConsultant.length).toBeGreaterThan(0);
      expect(run.report.missingInfo.length).toBeGreaterThan(0);
    }
  });

  it('every report passes the evidence lint', () => {
    for (const run of Object.values(runs)) {
      expect(run.lint.ok, `${run.id}: ${run.lint.issues.join('; ')}`).toBe(true);
      expect(run.lint.checked).toBeGreaterThan(5);
    }
  });

  it('persona scores land in the expected, meaningfully different positions', () => {
    // Re-derived for the Prof. Tushar Jaruhar questionnaire (CA_BADS_Summer_2026_D2.xlsx,
    // docs/04-diagnostic-questionnaire.md) — item content and scoring key are entirely
    // different from the original Stage 1 questionnaire, so exact score thresholds were
    // recomputed against real pipeline runs rather than hand-calculated. See
    // docs/09-admin-dashboard-and-new-questionnaire.md for the persona-by-persona detail
    // and the T3/H2 scoring-key ambiguity that materially affects several of these.
    const s = (id: string) => runs[id].scores;
    // p1 plateaued: strong human capital, critical trajectory (tenure penalty)
    expect(s('p1-plateaued').overall).toBe(50);
    expect(s('p1-plateaued').overallBand).toBe('Vulnerable');
    expect(s('p1-plateaued').dimensions.trajectory.band).toBe('Critical');
    // p2 early-career: elevated trajectory, weak human capital (thin network, no LinkedIn)
    const p2 = s('p2-early-career').dimensions;
    expect(p2.humanCapital.score).toBeLessThan(45);
    expect(p2.trajectory.score).toBeGreaterThan(55);
    // p4 gilded stagnation: vulnerable/critical overall despite seniority and high pay
    expect(s('p4-gilded-stagnation').overall).toBeLessThanOrEqual(45);
    // p5 high performer: comfortably the top-scoring persona, trajectory modifiers both fire
    expect(s('p5-high-performer').overall).toBeGreaterThanOrEqual(70);
    expect(s('p5-high-performer').dimensions.trajectory.score).toBe(90);
    expect(s('p5-high-performer').dimensions.trajectory.modifiers.map((m) => m.id).sort()).toEqual(['T_PROMOTIONS', 'T_TENURE_FRESH']);
    // p6 returner: fresh-tenure modifier fired, no-LinkedIn penalty fired
    const p6 = s('p6-returner').dimensions;
    expect(p6.trajectory.modifiers.map((m) => m.id)).toContain('T_TENURE_FRESH');
    expect(p6.humanCapital.modifiers.map((m) => m.id)).toContain('H_NO_LINKEDIN');
    // outputs meaningfully differ across personas
    const overalls = Object.values(runs).map((r) => r.scores.overall);
    expect(Math.max(...overalls) - Math.min(...overalls)).toBeGreaterThan(30);
    expect(new Set(Object.values(runs).map((r) => r.scores.overallBand)).size).toBeGreaterThanOrEqual(3);
    // p5 is the strongest persona and p4 the weakest, regardless of exact thresholds
    expect(s('p5-high-performer').overall).toBeGreaterThan(s('p4-gilded-stagnation').overall);
  });

  it('reports differ meaningfully across personas (paths + diagnosis text)', () => {
    const diagnoses = Object.values(runs).map((r) => r.report.overallDiagnosis);
    expect(new Set(diagnoses).size).toBe(6);
    const pathSets = Object.values(runs).map((r) => r.report.careerPaths.map((p) => p.kbId).join(','));
    expect(new Set(pathSets).size).toBeGreaterThanOrEqual(4);
  });

  it('the switcher persona surfaces the finance→product transition and skill gaps', () => {
    const r = runs['p3-industry-switcher'].report;
    const pathIds = r.careerPaths.map((p) => p.kbId);
    expect(pathIds.some((id) => id === 'kb-product-manager' || id === 'kb-fintech-product-manager' || id === 'kb-financial-analyst')).toBe(true);
    expect(r.skillGaps.length).toBeGreaterThan(0);
  });

  it('missing-data handling: returner (no LinkedIn) and undecided (no target role) are flagged', () => {
    expect(runs['p6-returner'].report.missingInfo.join(' ')).toMatch(/LinkedIn/i);
    expect(runs['p1-plateaued'].report.missingInfo.join(' ')).toMatch(/target role/i);
  });

  it('evidence lint catches bad refs (negative control)', () => {
    const run = runs['p1-plateaued'];
    const corrupted = JSON.parse(JSON.stringify(run.report));
    corrupted.strengths[0].evidence = ['kb:kb-not-retrieved'];
    corrupted.risks[0].evidence = [];
    corrupted.skillGaps[0].evidence = ['profile:no.such.field'];
    const lint = lintReport(corrupted, run.profile, run.retrieval);
    expect(lint.ok).toBe(false);
    expect(lint.issues.length).toBeGreaterThanOrEqual(3);
  });

  it('consent gate refuses profiles without consent', async () => {
    const profile = JSON.parse(readFileSync(new URL(personaFiles[0], personasDir), 'utf8'));
    profile.consent = false;
    await expect(runDiagnostic(profile)).rejects.toThrow(/validation|consent/i);
  });
});
