import { describe, expect, it } from 'vitest';
import { bestTitleMatch, industryVolatility, loadCorpus, retrieve } from '../src/retrieval/retrieve.js';
import { profileSchema } from '../src/types.js';
import { readFileSync } from 'node:fs';

const p3 = profileSchema.parse(JSON.parse(readFileSync(new URL('../demo/personas/p3-industry-switcher.json', import.meta.url), 'utf8')));

describe('corpus', () => {
  it('loads 18 entries with required metadata', () => {
    const corpus = loadCorpus();
    expect(corpus.length).toBe(18);
    for (const e of corpus) {
      expect(e.id).toMatch(/^kb-/);
      expect(e.source.name).toBe('O*NET OnLine');
      expect(e.source.url).toContain('onetonline.org');
      expect(['low', 'medium', 'high']).toContain(e.volatility);
      expect(e.coreSkills.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('industry volatility table', () => {
  it('maps known industries and falls back to medium', () => {
    expect(industryVolatility('finance')).toBe('low');
    expect(industryVolatility('retail')).toBe('high');
    expect(industryVolatility('Professional Services')).toBe('medium'); // normalised
    expect(industryVolatility('quantum-basket-weaving')).toBe('medium'); // unknown → fallback
  });
});

describe('title matching + synonyms', () => {
  it('matches exact titles', () => {
    expect(bestTitleMatch('Product Manager')?.id).toBe('kb-product-manager');
    expect(bestTitleMatch('Financial Analyst')?.id).toBe('kb-financial-analyst');
  });
  it('resolves common abbreviations via the synonym map', () => {
    expect(bestTitleMatch('PM')?.id).toBe('kb-product-manager');
    expect(bestTitleMatch('SWE')?.id).toBe('kb-software-engineer');
  });
  it('tolerates modifiers around the title', () => {
    expect(bestTitleMatch('Senior Software Engineer')?.id).toBe('kb-software-engineer');
  });
  it('returns null for out-of-corpus roles', () => {
    expect(bestTitleMatch('Marine Biologist')).toBeNull();
  });
});

describe('retrieval', () => {
  it('is deterministic', () => {
    const a = retrieve(p3, 5).entries.map((e) => e.entry.id);
    const b = retrieve(p3, 5).entries.map((e) => e.entry.id);
    expect(a).toEqual(b);
  });

  it('guarantees inclusion of current and target role entries for the switcher persona', () => {
    const r = retrieve(p3, 5);
    const ids = r.entries.map((e) => e.entry.id);
    expect(ids).toContain('kb-financial-analyst'); // current role
    expect(ids).toContain('kb-product-manager');   // target role
    expect(r.currentRoleMatched).toBe(true);
    expect(r.targetRoleMatched).toBe(true);
    expect(r.coverageNote).toBeUndefined();
    expect(r.entries.length).toBeLessThanOrEqual(5);
  });

  it('every returned entry carries match reasons or a guarantee flag', () => {
    const r = retrieve(p3, 5);
    for (const e of r.entries) {
      expect(e.guaranteed || e.matchReasons.length > 0).toBe(true);
    }
  });

  it('handles an out-of-corpus role gracefully with a coverage note', () => {
    const p = { ...p3, currentRole: 'Marine Biologist', industry: 'healthcare', skills: ['field research'], goals: { ...p3.goals, targetRole: 'Astronaut' } };
    const r = retrieve(p, 5);
    expect(r.currentRoleMatched).toBe(false);
    expect(r.targetRoleMatched).toBe(false);
    expect(r.coverageNote).toBeTruthy();
    expect(r.entries.length).toBeGreaterThan(0); // still returns nearest matches
  });
});
