import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { profileSchema } from '../src/types.js';

const valid = JSON.parse(readFileSync(new URL('../demo/personas/p1-plateaued.json', import.meta.url), 'utf8'));

describe('profile validation', () => {
  it('accepts a complete persona', () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing consent', () => {
    const r = profileSchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
  });

  it('rejects missing questionnaire answers', () => {
    const { A1, ...rest } = valid.questionnaire;
    expect(profileSchema.safeParse({ ...valid, questionnaire: rest }).success).toBe(false);
  });

  it('rejects out-of-range questionnaire answers', () => {
    expect(profileSchema.safeParse({ ...valid, questionnaire: { ...valid.questionnaire, A1: 5 } }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, questionnaire: { ...valid.questionnaire, A1: -1 } }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, questionnaire: { ...valid.questionnaire, A1: 2.5 } }).success).toBe(false);
  });

  it('rejects invalid email but accepts empty email', () => {
    expect(profileSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, email: '' }).success).toBe(true);
  });

  it('rejects yearsExperience outside 0–60', () => {
    expect(profileSchema.safeParse({ ...valid, yearsExperience: 61 }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, yearsExperience: -1 }).success).toBe(false);
  });

  it('requires at least one skill', () => {
    expect(profileSchema.safeParse({ ...valid, skills: [] }).success).toBe(false);
  });

  it('normalises empty optional strings to undefined', () => {
    const r = profileSchema.parse({ ...valid, linkedInUrl: '', email: '' });
    expect(r.linkedInUrl).toBeUndefined();
    expect(r.email).toBeUndefined();
  });
});
