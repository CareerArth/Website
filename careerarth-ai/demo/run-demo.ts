/**
 * Runs all six synthetic personas through the full pipeline and prints a summary.
 * With ANTHROPIC_API_KEY set, uses Claude (claude-opus-5); otherwise the deterministic
 * mock generator (zero cost). Reports land in data/runs/ and are viewable at
 * /report/<id> and /review/<id> once the server is running.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { runDiagnostic } from '../src/pipeline.js';

const here = dirname(fileURLToPath(import.meta.url));
const personasDir = join(here, 'personas');

const mode = process.env.ANTHROPIC_API_KEY ? 'Claude (claude-opus-5)' : 'mock (no ANTHROPIC_API_KEY)';
console.log(`\nCareerArth AI demo — generator: ${mode}\n`);

let totalCost = 0;
for (const file of readdirSync(personasDir).filter((f) => f.endsWith('.json')).sort()) {
  const profile = JSON.parse(readFileSync(join(personasDir, file), 'utf8'));
  const run = await runDiagnostic(profile);
  const d = run.scores.dimensions;
  totalCost += run.usage?.estCostUsd ?? 0;
  console.log(
    `  ${run.id.padEnd(22)} A=${String(d.alignment.display).padStart(3)}  R=${String(d.riskExposure.display).padStart(3)}  ` +
    `T=${String(d.trajectory.display).padStart(3)}  H=${String(d.humanCapital.display).padStart(3)}  ` +
    `→ ${String(run.scores.overall).padStart(3)} ${run.scores.overallBand.padEnd(10)} ` +
    `lint:${run.lint.ok ? 'pass' : 'FAIL(' + run.lint.issues.length + ')'}` +
    (run.usage ? `  ~$${run.usage.estCostUsd}` : ''),
  );
  if (!run.lint.ok) run.lint.issues.slice(0, 5).forEach((i) => console.log(`      ⚠ ${i}`));
}

console.log(`\n  Reports: http://localhost:4747/runs${totalCost ? `  ·  total LLM cost ~$${Math.round(totalCost * 100) / 100}` : ''}\n`);
