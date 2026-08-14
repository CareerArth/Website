import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { KbEntry, Profile, RetrievalResult, RetrievedEntry } from '../types.js';

const here = dirname(fileURLToPath(import.meta.url));
const kbDir = join(here, '..', '..', 'context', 'kb');

// ---------- Corpus ----------

let corpusCache: KbEntry[] | null = null;
let industriesCache: { industries: Record<string, 'low' | 'medium' | 'high'>; fallback: 'low' | 'medium' | 'high' } | null = null;

export function loadCorpus(): KbEntry[] {
  if (!corpusCache) {
    const raw = JSON.parse(readFileSync(join(kbDir, 'roles.json'), 'utf8'));
    corpusCache = raw.entries as KbEntry[];
  }
  return corpusCache;
}

export function industryVolatility(industry: string): 'low' | 'medium' | 'high' {
  if (!industriesCache) {
    industriesCache = JSON.parse(readFileSync(join(kbDir, '_industries.json'), 'utf8'));
  }
  const key = industry.trim().toLowerCase().replace(/\s+/g, '-');
  return industriesCache!.industries[key] ?? industriesCache!.fallback;
}

// ---------- Tokenization + synonyms ----------

const SYNONYMS: Record<string, string> = {
  'pm': 'product manager',
  'apm': 'product manager',
  'dev': 'software engineer',
  'developer': 'software engineer',
  'swe': 'software engineer',
  'programmer': 'software engineer',
  'em': 'engineering manager',
  'ds': 'data scientist',
  'ux': 'ux designer',
  'ui': 'ux designer',
  'csm': 'customer success manager',
  'fp&a': 'fpa',
  'seo specialist': 'digital marketing',
  'growth': 'digital marketing',
  'ops': 'operations',
  'cs': 'customer success',
};

export function tokenize(text: string): string[] {
  let t = text.toLowerCase();
  for (const [abbr, full] of Object.entries(SYNONYMS)) {
    t = t.replace(new RegExp(`\\b${abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), full);
  }
  return t
    .replace(/[^a-z0-9\s&/-]/g, ' ')
    .split(/[\s/&-]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

const STOP = new Set(['the', 'and', 'of', 'in', 'to', 'a', 'an', 'for', 'with', 'on', 'at', 'or', 'my', 'is']);

// ---------- Scoring ----------

interface IndexedEntry {
  entry: KbEntry;
  titleTokens: Set<string>;
  skillTokens: Set<string>;
  bodyTokens: Set<string>;
}

function buildIndex(corpus: KbEntry[]): IndexedEntry[] {
  return corpus.map((entry) => ({
    entry,
    titleTokens: new Set(tokenize(entry.title)),
    skillTokens: new Set(entry.coreSkills.flatMap(tokenize)),
    bodyTokens: new Set([
      ...tokenize(entry.summary),
      ...entry.transitionsFrom.flatMap((t) => tokenize(t.note)),
      ...tokenize(entry.industry),
    ]),
  }));
}

/** Roughly how title-similar a query string is to an entry title (for guaranteed inclusion). */
function titleMatchStrength(query: string, entry: KbEntry): number {
  const q = new Set(tokenize(query));
  const t = tokenize(entry.title);
  if (t.length === 0 || q.size === 0) return 0;
  const hits = t.filter((tok) => q.has(tok)).length;
  return hits / t.length;
}

export function bestTitleMatch(query: string | undefined, corpus: KbEntry[] = loadCorpus()): KbEntry | null {
  if (!query) return null;
  let best: KbEntry | null = null;
  let bestScore = 0;
  for (const entry of corpus) {
    const s = titleMatchStrength(query, entry);
    if (s > bestScore) { bestScore = s; best = entry; }
  }
  return bestScore >= 0.5 ? best : null; // majority of title tokens must match
}

export function retrieve(profile: Profile, k = 5, corpus: KbEntry[] = loadCorpus()): RetrievalResult {
  const index = buildIndex(corpus);
  const n = corpus.length;

  // document frequency per token across all fields
  const df = new Map<string, number>();
  for (const ie of index) {
    const all = new Set([...ie.titleTokens, ...ie.skillTokens, ...ie.bodyTokens]);
    for (const tok of all) df.set(tok, (df.get(tok) ?? 0) + 1);
  }
  const idf = (tok: string) => Math.log(1 + n / (1 + (df.get(tok) ?? 0)));

  const queryParts: { tokens: string[]; label: string }[] = [
    { tokens: tokenize(profile.currentRole), label: `current role "${profile.currentRole}"` },
    { tokens: profile.goals.targetRole ? tokenize(profile.goals.targetRole) : [], label: `target role "${profile.goals.targetRole ?? ''}"` },
    { tokens: profile.goals.targetIndustry ? tokenize(profile.goals.targetIndustry) : [], label: 'target industry' },
    { tokens: tokenize(profile.industry), label: 'current industry' },
    { tokens: profile.skills.flatMap(tokenize), label: 'skills' },
  ];

  const scored: RetrievedEntry[] = index.map((ie) => {
    let score = 0;
    const reasons: string[] = [];
    for (const part of queryParts) {
      let partScore = 0;
      const hits: string[] = [];
      for (const tok of new Set(part.tokens)) {
        const w = idf(tok);
        if (ie.titleTokens.has(tok)) { partScore += 3 * w; hits.push(tok); }
        else if (ie.skillTokens.has(tok)) { partScore += 2 * w; hits.push(tok); }
        else if (ie.bodyTokens.has(tok)) { partScore += 1 * w; hits.push(tok); }
      }
      if (partScore > 0) {
        score += partScore;
        reasons.push(`${part.label} → ${hits.slice(0, 4).join(', ')}`);
      }
    }
    return { entry: ie.entry, score: Math.round(score * 100) / 100, matchReasons: reasons, guaranteed: false };
  });

  scored.sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));

  // Guaranteed inclusion of current-role and target-role entries
  const currentEntry = bestTitleMatch(profile.currentRole, corpus);
  const targetEntry = bestTitleMatch(profile.goals.targetRole, corpus);
  const mustInclude = [currentEntry, targetEntry].filter((e): e is KbEntry => !!e);

  let top = scored.slice(0, k);
  for (const must of mustInclude) {
    if (!top.some((r) => r.entry.id === must.id)) {
      const item = scored.find((r) => r.entry.id === must.id)!;
      item.guaranteed = true;
      top = [...top.slice(0, k - 1), item];
    } else {
      top.find((r) => r.entry.id === must.id)!.guaranteed = true;
    }
  }

  const coverageNotes: string[] = [];
  if (!currentEntry) {
    coverageNotes.push(`Your current role ("${profile.currentRole}") is not directly represented in our role library yet; the analysis grounds itself in the closest matches by skills and industry.`);
  }
  if (profile.goals.targetRole && !targetEntry) {
    coverageNotes.push(`Your target role ("${profile.goals.targetRole}") is not directly represented in our role library yet; path recommendations rely on adjacent roles and your stated skills.`);
  }

  return {
    entries: top,
    currentRoleMatched: !!currentEntry,
    targetRoleMatched: profile.goals.targetRole ? !!targetEntry : true,
    coverageNote: coverageNotes.length ? coverageNotes.join(' ') : undefined,
  };
}
