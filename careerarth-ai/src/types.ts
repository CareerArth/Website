import { z } from 'zod';

// ---------- Intake profile (MVP schema — simplified from Stage 1, see docs/08) ----------

export const questionnaireKeys = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'R1', 'R2', 'R3', 'R4', 'R5',
  'T1', 'T2', 'T3', 'T4', 'T5',
  'H1', 'H2', 'H3', 'H4', 'H5',
] as const;

export type QuestionnaireKey = (typeof questionnaireKeys)[number];

const answer = z.number().int().min(0).max(4);

export const questionnaireSchema = z.object(
  Object.fromEntries(questionnaireKeys.map((k) => [k, answer])) as Record<QuestionnaireKey, typeof answer>,
);

export const concernCategories = [
  'stagnation', 'misalignment', 'industry-shift', 'layoff-risk', 'growth', 'transition', 'other',
] as const;

export const profileSchema = z.object({
  id: z.string().min(1).optional(),
  fullName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
  currentRole: z.string().min(1),
  industry: z.string().min(1),
  yearsExperience: z.number().min(0).max(60),
  yearsInCurrentRole: z.number().min(0).max(60),
  promotionsLast5Years: z.number().int().min(0).max(10).default(0),
  linkedInUrl: z.string().url().optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
  skills: z.array(z.string().min(1)).min(1).max(15),
  goals: z.object({
    targetRole: z.string().optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    targetIndustry: z.string().optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    horizonYears: z.number().int().min(1).max(30).default(5),
    narrative: z.string().max(2000).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
  }),
  constraints: z.array(z.string()).default([]),
  concern: z.string().max(2000).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
  concernCategory: z.enum(concernCategories).default('other'),
  questionnaire: questionnaireSchema,
  consent: z.literal(true),
  isSynthetic: z.boolean().default(false),
});

export type Profile = z.infer<typeof profileSchema>;

export type CareerStage = 'early' | 'establishing' | 'mid' | 'senior';

export function careerStage(yearsExperience: number): CareerStage {
  if (yearsExperience <= 3) return 'early';
  if (yearsExperience <= 8) return 'establishing';
  if (yearsExperience <= 15) return 'mid';
  return 'senior';
}

// ---------- Scores ----------

export type Dimension = 'alignment' | 'riskExposure' | 'trajectory' | 'humanCapital';

export interface DimensionScore {
  base: number;            // unrounded, pre-modifier
  modifiers: { id: string; delta: number }[];
  score: number;           // unrounded, post-modifier, clamped
  display: number;         // rounded for display
  band: string;
}

export interface ArthScores {
  dimensions: Record<Dimension, DimensionScore>;
  overall: number;         // rounded
  overallBand: string;
  methodologyNote: string; // heuristic disclaimer, carried into every report
}

// ---------- Knowledge base ----------

export interface KbEntry {
  id: string;
  title: string;
  onetCode: string;
  industry: string;
  summary: string;
  coreSkills: string[];
  adjacentRoles: string[];
  transitionsFrom: { role: string; difficulty: 'low' | 'moderate' | 'high'; note: string }[];
  outlook: { category: 'growing' | 'stable' | 'declining'; note: string; asOf: string };
  volatility: 'low' | 'medium' | 'high';
  source: { name: string; url: string; retrieved: string };
}

export interface RetrievedEntry {
  entry: KbEntry;
  score: number;
  matchReasons: string[];
  guaranteed: boolean;
}

export interface RetrievalResult {
  entries: RetrievedEntry[];
  currentRoleMatched: boolean;
  targetRoleMatched: boolean;
  coverageNote?: string; // set when the user's role/target is outside KB coverage
}

// ---------- Report (structured, customer-facing) ----------

const evidence = z.array(z.string()).default([]);

export const reportSchema = z.object({
  overallDiagnosis: z.string(),
  dimensionInsights: z.array(z.object({
    dimension: z.string(),
    headline: z.string(),
    explanation: z.string(),
    evidence,
  })),
  strengths: z.array(z.object({ title: z.string(), detail: z.string(), evidence })),
  risks: z.array(z.object({ title: z.string(), detail: z.string(), severity: z.string(), evidence })),
  tensions: z.array(z.object({ title: z.string(), detail: z.string(), evidence })),
  careerPaths: z.array(z.object({
    title: z.string(),
    kbId: z.string(),
    fitRationale: z.string(),
    keyTradeoff: z.string(),
    timeframe: z.string(),
    firstSteps: z.array(z.string()),
    evidence,
  })),
  pathComparison: z.array(z.object({
    pathTitle: z.string(),
    effort: z.string(),
    risk: z.string(),
    upside: z.string(),
    note: z.string(),
  })),
  skillGaps: z.array(z.object({ skill: z.string(), why: z.string(), howToClose: z.string(), evidence })),
  ninetyDayPlan: z.array(z.object({ phase: z.string(), focus: z.string(), actions: z.array(z.string()) })),
  nextDecision: z.string(),
  discussWithConsultant: z.array(z.string()),
  missingInfo: z.array(z.string()),
});

export type Report = z.infer<typeof reportSchema>;

// ---------- Run (one full diagnostic) ----------

export interface ReviewDecision {
  section: string;
  decision: 'approved' | 'flagged' | 'rejected';
  note?: string;
}

export interface Review {
  reviewer: string;
  decisions: ReviewDecision[];
  editedOverallDiagnosis?: string;
  editedNextDecision?: string;
  confidence: number;        // 1–5
  minutes: number;
  notes?: string;
  overall: 'approved' | 'needs-revision';
  editedChars: number;       // size of text edits, for the edit-amount metric
  submittedAt: string;
}

export interface EvidenceLint {
  ok: boolean;
  checked: number;
  issues: string[];
}

export interface Run {
  id: string;
  createdAt: string;
  profile: Profile;
  stage: CareerStage;
  scores: ArthScores;
  retrieval: RetrievalResult;
  report: Report;
  generator: 'claude' | 'mock';
  model?: string;
  usage?: { inputTokens: number; outputTokens: number; estCostUsd: number };
  lint: EvidenceLint;
  status: 'draft' | 'reviewed';
  review?: Review;
  feedback?: { rating: number; at: string }[];
}
