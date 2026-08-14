import { describe, expect, it } from 'vitest';
import { activeModifiers, loadConfig, overallFromDimensions, scoreProfile } from '../src/scoring/score.js';
import type { Profile } from '../src/types.js';

const q = (a: number[], r: number[], t: number[], h: number[]) => ({
  A1: a[0], A2: a[1], A3: a[2], A4: a[3], A5: a[4],
  R1: r[0], R2: r[1], R3: r[2], R4: r[3], R5: r[4],
  T1: t[0], T2: t[1], T3: t[2], T4: t[3], T5: t[4],
  H1: h[0], H2: h[1], H3: h[2], H4: h[3], H5: h[4],
});

const baseProfile: Profile = {
  fullName: 'Test Person',
  currentRole: 'Operations Manager',
  industry: 'professional-services',
  yearsExperience: 12,
  yearsInCurrentRole: 6,
  promotionsLast5Years: 0,
  linkedInUrl: 'https://linkedin.com/in/test',
  skills: ['ops'],
  goals: { horizonYears: 5 },
  constraints: [],
  concernCategory: 'stagnation',
  questionnaire: q([3, 3, 2, 3, 4], [2, 2, 1, 2, 3], [1, 2, 1, 1, 2], [3, 4, 3, 2, 2]),
  consent: true,
  isSynthetic: true,
} as Profile;

describe('ARTH scoring — Stage 1 rubric §4 worked example (p1)', () => {
  it('reproduces the hand-calculated fixture exactly', () => {
    const s = scoreProfile(baseProfile, 'medium');
    expect(s.dimensions.alignment.base).toBeCloseTo(72.5, 5);
    expect(s.dimensions.riskExposure.base).toBeCloseTo(48.75, 5);
    expect(s.dimensions.trajectory.base).toBeCloseTo(32.5, 5);
    expect(s.dimensions.humanCapital.base).toBeCloseTo(76.25, 5);
    // T modifier: -10 for >=5 years in role
    expect(s.dimensions.trajectory.score).toBeCloseTo(22.5, 5);
    expect(s.dimensions.trajectory.modifiers).toEqual([{ id: 'T_TENURE_LONG', delta: -10 }]);
    // display rounding
    expect(s.dimensions.alignment.display).toBe(73);
    expect(s.dimensions.riskExposure.display).toBe(49);
    expect(s.dimensions.trajectory.display).toBe(23);
    expect(s.dimensions.humanCapital.display).toBe(76);
    // overall from unrounded dimensions, rounded once
    expect(s.overall).toBe(58);
    expect(s.overallBand).toBe('Watch');
  });
});

describe('/sample-score calibration (regression test only — NOT validation)', () => {
  it('published dimension scores 72/48/52/81 → overall 64', () => {
    expect(overallFromDimensions(72, 48, 52, 81)).toBe(64);
  });
});

describe('determinism', () => {
  it('same profile in → identical scores out across repeated runs', () => {
    const runs = [1, 2, 3].map(() => JSON.stringify(scoreProfile(baseProfile, 'medium')));
    expect(runs[0]).toBe(runs[1]);
    expect(runs[1]).toBe(runs[2]);
  });
});

describe('clamping', () => {
  it('clamps dimension scores at 100', () => {
    const p = {
      ...baseProfile,
      yearsInCurrentRole: 1, yearsExperience: 6, promotionsLast5Years: 2,
      questionnaire: q([4, 4, 4, 4, 4], [4, 4, 4, 4, 4], [4, 4, 4, 4, 4], [4, 4, 4, 4, 4]),
    } as Profile;
    const s = scoreProfile(p, 'low');
    expect(s.dimensions.trajectory.score).toBe(100); // 100 base + modifiers, clamped
    expect(s.overall).toBeLessThanOrEqual(100);
  });

  it('clamps at 0', () => {
    const p = {
      ...baseProfile,
      linkedInUrl: undefined,
      questionnaire: q([0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]),
    } as Profile;
    const s = scoreProfile(p, 'high');
    for (const d of Object.values(s.dimensions)) expect(d.score).toBeGreaterThanOrEqual(0);
    expect(s.overall).toBe(0);
    expect(s.overallBand).toBe('Critical');
  });

  it('caps total modifiers per dimension at config bounds', () => {
    const cfg = loadConfig();
    expect(cfg.modifierClamp).toEqual({ min: -15, max: 10 });
  });
});

describe('each modifier in isolation', () => {
  const neutral = {
    ...baseProfile,
    yearsInCurrentRole: 3, yearsExperience: 12, promotionsLast5Years: 0,
    linkedInUrl: 'https://linkedin.com/in/x', concernCategory: 'other',
  } as Profile;

  const mods = (p: Profile, vol: 'low' | 'medium' | 'high' = 'medium') =>
    activeModifiers(p, vol).map((m) => m.id);

  it('no modifiers on the neutral profile', () => expect(mods(neutral)).toEqual([]));
  it('T_TENURE_LONG at >=5y', () => expect(mods({ ...neutral, yearsInCurrentRole: 5 } as Profile)).toEqual(['T_TENURE_LONG']));
  it('T_TENURE_FRESH at <=1y when not early-career', () => expect(mods({ ...neutral, yearsInCurrentRole: 1 } as Profile)).toEqual(['T_TENURE_FRESH']));
  it('no T_TENURE_FRESH for early-career', () => expect(mods({ ...neutral, yearsInCurrentRole: 1, yearsExperience: 2 } as Profile)).toEqual([]));
  it('T_PROMOTIONS at >=2', () => expect(mods({ ...neutral, promotionsLast5Years: 2 } as Profile)).toEqual(['T_PROMOTIONS']));
  it('R_VOLATILE_INDUSTRY', () => expect(mods(neutral, 'high')).toEqual(['R_VOLATILE_INDUSTRY']));
  it('R_STABLE_INDUSTRY', () => expect(mods(neutral, 'low')).toEqual(['R_STABLE_INDUSTRY']));
  it('H_NO_LINKEDIN', () => expect(mods({ ...neutral, linkedInUrl: undefined } as Profile)).toEqual(['H_NO_LINKEDIN']));
  it('A_MISALIGNMENT_CONCERN', () => expect(mods({ ...neutral, concernCategory: 'misalignment' } as Profile)).toEqual(['A_MISALIGNMENT_CONCERN']));
  it('inactive H_MULTI_INDUSTRY never fires', () => {
    const cfg = loadConfig();
    const inactive = cfg.modifiers.find((m) => m.id === 'H_MULTI_INDUSTRY');
    expect(inactive?.active).toBe(false);
  });
});
