import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { ArthScores, Dimension, DimensionScore, Profile } from '../types.js';
import { careerStage } from '../types.js';

const here = dirname(fileURLToPath(import.meta.url));
const configPath = join(here, '..', '..', 'context', 'scoring-config.json');

export interface ScoringConfig {
  version: string;
  methodologyNote: string;
  dimensionWeights: Record<Dimension, number>;
  itemWeights: Record<Dimension, Record<string, number>>;
  answerScale: { min: number; max: number };
  modifiers: { id: string; dimension: Dimension; when: string; delta: number; active: boolean }[];
  modifierClamp: { min: number; max: number };
  scoreClamp: { min: number; max: number };
  bands: { min: number; max: number; label: string }[];
}

/**
 * Re-read on every call (not cached): the admin dashboard writes this file directly,
 * and edits must take effect on the next request without a server restart.
 */
export function loadConfig(): ScoringConfig {
  return JSON.parse(readFileSync(configPath, 'utf8')) as ScoringConfig;
}

export function bandFor(score: number, config: ScoringConfig = loadConfig()): string {
  const rounded = Math.round(score);
  const band = config.bands.find((b) => rounded >= b.min && rounded <= b.max);
  return band ? band.label : 'Unknown';
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** neutralise binary floating-point drift (0.3+0.4+… = 1.2999…) so hand calculations agree */
const round6 = (v: number) => Math.round(v * 1e6) / 1e6;

/**
 * Evaluates which modifiers fire for a profile. Modifier conditions are implemented
 * here (one branch per id) with deltas read from config, so config and code cannot
 * drift on magnitude, and inactive modifiers are skipped uniformly.
 */
export function activeModifiers(
  profile: Profile,
  industryVolatility: 'low' | 'medium' | 'high',
  config: ScoringConfig = loadConfig(),
): { id: string; dimension: Dimension; delta: number }[] {
  const stage = careerStage(profile.yearsExperience);
  const fired: { id: string; dimension: Dimension; delta: number }[] = [];
  for (const m of config.modifiers) {
    if (!m.active) continue;
    let fires = false;
    switch (m.id) {
      case 'T_TENURE_LONG': fires = profile.yearsInCurrentRole >= 5; break;
      case 'T_TENURE_FRESH': fires = profile.yearsInCurrentRole <= 1 && stage !== 'early'; break;
      case 'T_PROMOTIONS': fires = profile.promotionsLast5Years >= 2; break;
      case 'R_VOLATILE_INDUSTRY': fires = industryVolatility === 'high'; break;
      case 'R_STABLE_INDUSTRY': fires = industryVolatility === 'low'; break;
      case 'H_NO_LINKEDIN': fires = !profile.linkedInUrl; break;
      case 'A_MISALIGNMENT_CONCERN': fires = profile.concernCategory === 'misalignment'; break;
      default: fires = false;
    }
    if (fires) fired.push({ id: m.id, dimension: m.dimension, delta: m.delta });
  }
  return fired;
}

export function scoreProfile(
  profile: Profile,
  industryVolatility: 'low' | 'medium' | 'high',
  config: ScoringConfig = loadConfig(),
): ArthScores {
  const dims: Dimension[] = ['alignment', 'riskExposure', 'trajectory', 'humanCapital'];
  const fired = activeModifiers(profile, industryVolatility, config);
  const dimensions = {} as Record<Dimension, DimensionScore>;

  for (const dim of dims) {
    const weights = config.itemWeights[dim];
    let weighted = 0;
    for (const [item, w] of Object.entries(weights)) {
      const answer = profile.questionnaire[item as keyof Profile['questionnaire']];
      weighted += w * answer;
    }
    const base = round6((100 * weighted) / config.answerScale.max);
    const mods = fired.filter((m) => m.dimension === dim);
    const modTotal = clamp(
      mods.reduce((s, m) => s + m.delta, 0),
      config.modifierClamp.min,
      config.modifierClamp.max,
    );
    const score = round6(clamp(base + modTotal, config.scoreClamp.min, config.scoreClamp.max));
    dimensions[dim] = {
      base,
      modifiers: mods.map(({ id, delta }) => ({ id, delta })),
      score,
      display: Math.round(score),
      band: bandFor(score, config),
    };
  }

  const overallRaw = round6(dims.reduce((s, d) => s + config.dimensionWeights[d] * dimensions[d].score, 0));
  const overall = Math.round(overallRaw);

  return {
    dimensions,
    overall,
    overallBand: bandFor(overall, config),
    methodologyNote: config.methodologyNote,
  };
}

/** Overall score from four already-known dimension scores (regression-test helper). */
export function overallFromDimensions(
  a: number, r: number, t: number, h: number,
  config: ScoringConfig = loadConfig(),
): number {
  const w = config.dimensionWeights;
  return Math.round(round6(w.alignment * a + w.riskExposure * r + w.trajectory * t + w.humanCapital * h));
}
