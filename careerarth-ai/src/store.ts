import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import type { Run } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.CAREERARTH_DATA_DIR ?? join(here, '..', 'data');
const runsDir = join(dataDir, 'runs');
const eventsFile = join(dataDir, 'events.jsonl');

function ensureDirs() {
  if (!existsSync(runsDir)) mkdirSync(runsDir, { recursive: true });
}

export function newRunId(): string {
  return `run-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
}

export function saveRun(run: Run): void {
  ensureDirs();
  writeFileSync(join(runsDir, `${run.id}.json`), JSON.stringify(run, null, 2), 'utf8');
}

export function loadRun(id: string): Run | null {
  const safe = id.replace(/[^a-zA-Z0-9-]/g, '');
  const file = join(runsDir, `${safe}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8')) as Run;
}

export function listRuns(): Run[] {
  ensureDirs();
  return readdirSync(runsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(runsDir, f), 'utf8')) as Run)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---------- Instrumentation (business-relevant events, local JSONL) ----------

export type EventType =
  | 'intake_started'
  | 'intake_step_completed'
  | 'intake_completed'
  | 'report_generated'
  | 'report_viewed'
  | 'consultation_interest'
  | 'usefulness_rating'
  | 'review_submitted';

export interface AppEvent {
  type: EventType;
  at: string;
  runId?: string;
  meta?: Record<string, unknown>;
}

export function logEvent(type: EventType, runId?: string, meta?: Record<string, unknown>): void {
  ensureDirs();
  const event: AppEvent = { type, at: new Date().toISOString(), runId, meta };
  appendFileSync(eventsFile, JSON.stringify(event) + '\n', 'utf8');
}

export function readEvents(): AppEvent[] {
  if (!existsSync(eventsFile)) return [];
  return readFileSync(eventsFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as AppEvent);
}
