import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { runDiagnostic, ValidationError } from './pipeline.js';
import { loadRun, saveRun, listRuns, logEvent, type EventType } from './store.js';
import { metricsSummary } from './metrics.js';
import type { Review, Run } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));
const webDir = join(here, '..', 'web');
const personasDir = join(here, '..', 'demo', 'personas');
const PORT = Number(process.env.PORT ?? 4747);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function send(res: ServerResponse, status: number, body: string | Buffer, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}
const json = (res: ServerResponse, status: number, data: unknown) => send(res, status, JSON.stringify(data));

function serveFile(res: ServerResponse, file: string) {
  const full = join(webDir, file);
  if (!existsSync(full)) return send(res, 404, 'Not found', 'text/plain');
  send(res, 200, readFileSync(full), MIME[extname(full)] ?? 'application/octet-stream');
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

/** crude char-diff: how much of the text changed between original and edit */
function charDiff(a: string, b: string): number {
  if (a === b) return 0;
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  return Math.max(a.length, b.length) - p - s;
}

const CLIENT_EVENTS: EventType[] = ['intake_started', 'intake_step_completed', 'intake_completed', 'report_viewed', 'consultation_interest'];

/** Strip fields the customer/consultant UI doesn't need; keep everything for review view. */
function runForClient(run: Run, view: 'customer' | 'review') {
  const base = {
    id: run.id,
    createdAt: run.createdAt,
    firstName: run.profile.fullName.split(' ')[0],
    fullName: run.profile.fullName,
    stage: run.stage,
    scores: run.scores,
    report: run.report,
    status: run.status,
    generator: run.generator,
    review: run.review
      ? { overall: run.review.overall, editedOverallDiagnosis: run.review.editedOverallDiagnosis, editedNextDecision: run.review.editedNextDecision, decisions: run.review.decisions, confidence: run.review.confidence }
      : undefined,
    sources: run.retrieval.entries.map((r) => ({ id: r.entry.id, title: r.entry.title, source: r.entry.source, outlook: r.entry.outlook })),
    coverageNote: run.retrieval.coverageNote,
  };
  if (view === 'review') {
    return { ...base, profile: run.profile, retrieval: run.retrieval, lint: run.lint, usage: run.usage, model: run.model, fullReview: run.review };
  }
  return base;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    // ---------- pages ----------
    if (req.method === 'GET' && (path === '/' || path === '/intake')) return serveFile(res, 'intake.html');
    if (req.method === 'GET' && /^\/report\/[\w-]+$/.test(path)) return serveFile(res, 'report.html');
    if (req.method === 'GET' && /^\/review\/[\w-]+$/.test(path)) return serveFile(res, 'review.html');
    if (req.method === 'GET' && path === '/runs') return serveFile(res, 'runs.html');
    if (req.method === 'GET' && path.startsWith('/web/')) return serveFile(res, path.slice(5));

    // ---------- API ----------
    if (req.method === 'GET' && path === '/api/personas') {
      if (!existsSync(personasDir)) return json(res, 200, []);
      const personas = readdirSync(personasDir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(readFileSync(join(personasDir, f), 'utf8')));
      return json(res, 200, personas);
    }

    if (req.method === 'POST' && path === '/api/diagnostic') {
      const body = await readBody(req);
      const run = await runDiagnostic(body);
      return json(res, 201, { id: run.id, lintOk: run.lint.ok });
    }

    if (req.method === 'GET' && path === '/api/runs') {
      const runs = listRuns().map((r) => ({
        id: r.id, createdAt: r.createdAt, fullName: r.profile.fullName,
        overall: r.scores.overall, band: r.scores.overallBand, status: r.status,
        generator: r.generator, isSynthetic: r.profile.isSynthetic, lintOk: r.lint.ok,
      }));
      return json(res, 200, runs);
    }

    const runMatch = path.match(/^\/api\/runs\/([\w-]+)(\/(review|feedback))?$/);
    if (runMatch) {
      const run = loadRun(runMatch[1]);
      if (!run) return json(res, 404, { error: 'Run not found' });

      if (req.method === 'GET' && !runMatch[3]) {
        const view = url.searchParams.get('view') === 'review' ? 'review' : 'customer';
        return json(res, 200, runForClient(run, view));
      }

      if (req.method === 'POST' && runMatch[3] === 'review') {
        const b = (await readBody(req)) as Partial<Review> & { editedOverallDiagnosis?: string; editedNextDecision?: string };
        const confidence = Number(b.confidence);
        const minutes = Number(b.minutes);
        if (!Number.isFinite(confidence) || confidence < 1 || confidence > 5) return json(res, 400, { error: 'confidence must be 1–5' });
        if (!Number.isFinite(minutes) || minutes < 0) return json(res, 400, { error: 'minutes must be ≥ 0' });
        if (b.overall !== 'approved' && b.overall !== 'needs-revision') return json(res, 400, { error: 'overall must be approved | needs-revision' });

        let editedChars = 0;
        if (b.editedOverallDiagnosis !== undefined) editedChars += charDiff(run.report.overallDiagnosis, b.editedOverallDiagnosis);
        if (b.editedNextDecision !== undefined) editedChars += charDiff(run.report.nextDecision, b.editedNextDecision);

        run.review = {
          reviewer: (b.reviewer as string) || 'consultant',
          decisions: Array.isArray(b.decisions) ? b.decisions : [],
          editedOverallDiagnosis: b.editedOverallDiagnosis !== run.report.overallDiagnosis ? b.editedOverallDiagnosis : undefined,
          editedNextDecision: b.editedNextDecision !== run.report.nextDecision ? b.editedNextDecision : undefined,
          confidence, minutes,
          notes: (b.notes as string) || undefined,
          overall: b.overall,
          editedChars,
          submittedAt: new Date().toISOString(),
        };
        run.status = 'reviewed';
        saveRun(run);
        logEvent('review_submitted', run.id, { overall: b.overall, confidence, minutes, editedChars });
        return json(res, 200, { ok: true });
      }

      if (req.method === 'POST' && runMatch[3] === 'feedback') {
        const b = (await readBody(req)) as { rating?: number };
        const rating = Number(b.rating);
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) return json(res, 400, { error: 'rating must be 1–5' });
        run.feedback = [...(run.feedback ?? []), { rating, at: new Date().toISOString() }];
        saveRun(run);
        logEvent('usefulness_rating', run.id, { rating });
        return json(res, 200, { ok: true });
      }
    }

    if (req.method === 'POST' && path === '/api/events') {
      const b = (await readBody(req)) as { type?: EventType; runId?: string; meta?: Record<string, unknown> };
      if (!b.type || !CLIENT_EVENTS.includes(b.type)) return json(res, 400, { error: 'unknown event type' });
      logEvent(b.type, b.runId, b.meta);
      return json(res, 200, { ok: true });
    }

    if (req.method === 'GET' && path === '/api/metrics') {
      return json(res, 200, metricsSummary());
    }

    return send(res, 404, 'Not found', 'text/plain');
  } catch (err) {
    if (err instanceof ValidationError) return json(res, 422, { error: err.message });
    if (err instanceof SyntaxError) return json(res, 400, { error: 'Invalid JSON body' });
    console.error(err);
    return json(res, 500, { error: err instanceof Error ? err.message : 'Internal error' });
  }
});

server.listen(PORT, () => {
  const mode = process.env.ANTHROPIC_API_KEY ? 'Claude generation (claude-opus-5)' : 'MOCK generation (set ANTHROPIC_API_KEY for real analysis)';
  console.log(`\nCareerArth AI MVP → http://localhost:${PORT}`);
  console.log(`  Intake:   http://localhost:${PORT}/`);
  console.log(`  Runs:     http://localhost:${PORT}/runs`);
  console.log(`  Metrics:  http://localhost:${PORT}/api/metrics`);
  console.log(`  Mode:     ${mode}\n`);
});
