/* CareerArth AI — customer-facing report renderer */

const runId = location.pathname.split('/').pop();
const app = document.getElementById('app');

const esc = (s) => { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; };
const api = (path, body) => fetch(path, {
  method: body ? 'POST' : 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined,
}).then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || r.statusText); return j; });

const DIM_META = {
  Alignment: 'Role ↔ ambition coherence',
  'Risk Exposure': 'Insulation from industry shifts',
  Trajectory: 'Momentum and optionality',
  'Human Capital': 'Network, brand, transferability',
};

function ring(score) {
  const r = 62, c = 2 * Math.PI * r, filled = (score / 100) * c;
  return `<div class="score-ring">
    <svg width="148" height="148"><circle cx="74" cy="74" r="${r}" fill="none" stroke="#E6E1D6" stroke-width="10"/>
    <circle cx="74" cy="74" r="${r}" fill="none" stroke="#B59654" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${filled} ${c - filled}"/></svg>
    <div class="num"><b>${score}</b><span>Arth Score</span></div></div>`;
}

const section = (eyebrow, title, inner) =>
  `<div class="card"><div class="eyebrow">${eyebrow}</div><h2 style="margin-bottom:10px;">${title}</h2>${inner}</div>`;

const items = (arr, fmt) => arr.map((x) => `<div class="item">${fmt(x)}</div>`).join('');

function render(run) {
  const r = run.report;
  const diagnosis = run.review?.editedOverallDiagnosis ?? r.overallDiagnosis;
  const nextDecision = run.review?.editedNextDecision ?? r.nextDecision;
  const dims = run.scores.dimensions;
  const dimOrder = [['alignment','Alignment'],['riskExposure','Risk Exposure'],['trajectory','Trajectory'],['humanCapital','Human Capital']];

  app.innerHTML = `
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
      <div>
        <div class="eyebrow">Career Diagnostic</div>
        <h1 style="font-size:28px;">${esc(run.firstName)}, here is where your career stands.</h1>
      </div>
      <span class="badge ${run.status === 'reviewed' ? 'badge-reviewed' : 'badge-draft'}">
        ${run.status === 'reviewed' ? '✓ Consultant reviewed' : 'Draft — pending consultant review'}</span>
    </div>
    <div class="hero-score" style="margin-top:22px;">
      ${ring(run.scores.overall)}
      <div style="flex:1; min-width:260px;">
        <span class="band band-${run.scores.overallBand}">${run.scores.overallBand}</span>
        <p style="margin-top:10px; font-size:15.5px;">${esc(diagnosis)}</p>
      </div>
    </div>
    <div class="dims" style="margin-top:24px;">
      ${dimOrder.map(([k, label]) => `
        <div class="dim">
          <h3>${label}</h3>
          <span class="val">${dims[k].display}</span>
          <div class="bar"><div style="width:${dims[k].display}%"></div></div>
          <span class="band band-${dims[k].band}">${dims[k].band}</span>
          <p class="small muted" style="margin-top:6px;">${DIM_META[label]}</p>
        </div>`).join('')}
    </div>
  </div>

  ${section('Reading the numbers', 'What each dimension is telling you',
    items(r.dimensionInsights, (d) => `<h3>${esc(d.dimension)} — ${esc(d.headline)}</h3><p>${esc(d.explanation)}</p>`))}

  ${section('Working for you', 'Key strengths',
    items(r.strengths, (s) => `<h3>${esc(s.title)}</h3><p>${esc(s.detail)}</p>`))}

  ${section('Working against you', 'Major risks',
    items(r.risks, (x) => `<h3>${esc(x.title)} <span class="band band-${x.severity === 'high' ? 'Critical' : x.severity === 'medium' ? 'Vulnerable' : 'Watch'}">${esc(x.severity)}</span></h3><p>${esc(x.detail)}</p>`))}

  ${r.tensions.length ? section('Worth sitting with', 'Tensions in your situation',
    items(r.tensions, (t) => `<h3>${esc(t.title)}</h3><p>${esc(t.detail)}</p>`)) : ''}

  ${section('Your options', 'Realistic paths from here', `
    <div class="paths">
      ${r.careerPaths.map((p, i) => `
        <div class="path ${i === 0 ? 'first' : ''}">
          <div class="tf">${esc(p.timeframe)}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.fitRationale)}</p>
          <p><b>Trade-off:</b> ${esc(p.keyTradeoff)}</p>
          <b class="small">First steps</b>
          <ul>${p.firstSteps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>`).join('')}
    </div>
    ${r.pathComparison.length ? `
    <div class="table-scroll"><table class="compare">
      <tr><th>Path</th><th>Effort</th><th>Risk</th><th>Upside</th><th>Note</th></tr>
      ${r.pathComparison.map((c) => `<tr><td><b>${esc(c.pathTitle)}</b></td><td>${esc(c.effort)}</td><td>${esc(c.risk)}</td><td>${esc(c.upside)}</td><td>${esc(c.note)}</td></tr>`).join('')}
    </table></div>` : ''}`)}

  ${section('Capability gaps', 'What stands between you and the target',
    items(r.skillGaps, (g) => `<h3>${esc(g.skill)}</h3><p>${esc(g.why)}</p><p class="small" style="color:#8a6d2f;"><b>How to close it:</b> ${esc(g.howToClose)}</p>`))}

  ${section('Your next 90 days', 'A plan built around your weakest dimension',
    r.ninetyDayPlan.map((p) => `
      <div class="plan-phase"><div class="ph">${esc(p.phase)}</div>
      <div><b>${esc(p.focus)}</b><ul>${p.actions.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div></div>`).join(''))}

  ${section('The decision in front of you', 'Recommended next decision',
    `<p style="font-size:15.5px;">${esc(nextDecision)}</p>`)}

  ${section('Where a human helps', 'Bring these to a consultation', `
    <ul style="margin-left:18px; font-size:14.5px;">${r.discussWithConsultant.map((d) => `<li style="margin:6px 0;">${esc(d)}</li>`).join('')}</ul>
    ${r.missingInfo.length ? `<p class="small muted" style="margin-top:12px;"><b>What this analysis couldn't see:</b> ${r.missingInfo.map(esc).join(' · ')}</p>` : ''}`)}

  <div class="cta-band">
    <h2>Talk this through with a CareerArth consultant</h2>
    <p>The diagnostic finds the pattern. A consultant helps you act on it — and pressure-tests what self-assessment can't.</p>
    <button class="btn btn-gold" id="cta-consult">I'm interested in a consultation</button>
    <p class="small" id="cta-done" style="display:none; color:#F7F3E8; margin-top:10px;">Noted — thank you. We'll follow up.</p>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div><b>Was this analysis useful?</b><div class="stars" id="stars" style="margin-left:8px;">${[1,2,3,4,5].map((n) => `<button data-n="${n}">★</button>`).join('')}</div></div>
      <span class="small muted" id="stars-done"></span>
    </div>
    <details class="sources">
      <summary>Sources behind this analysis</summary>
      <ul>
        ${run.sources.map((s) => `<li><b>${esc(s.title)}</b> — ${esc(s.source.name)} (<a href="${esc(s.source.url)}" target="_blank" rel="noopener">${esc(s.source.url.replace('https://', ''))}</a>), retrieved ${esc(s.source.retrieved)}. Outlook: ${esc(s.outlook.category)}.</li>`).join('')}
        <li>Your structured intake responses and 20-item ARTH questionnaire.</li>
      </ul>
    </details>
    <p class="disclaimer">ARTH scores are produced by CareerArth's fixed heuristic rubric — the AI never calculates or adjusts them. Weights and thresholds are working heuristics, not empirically validated instruments. This analysis is based on self-reported information and is not a guarantee of any career outcome.${run.status !== 'reviewed' ? ' This draft has not yet been reviewed by a consultant.' : ''}</p>
  </div>`;

  document.getElementById('cta-consult').addEventListener('click', () => {
    api('/api/events', { type: 'consultation_interest', runId }).catch(() => {});
    document.getElementById('cta-consult').style.display = 'none';
    document.getElementById('cta-done').style.display = 'block';
  });
  document.querySelectorAll('#stars button').forEach((b) => {
    b.addEventListener('click', async () => {
      const n = +b.dataset.n;
      document.querySelectorAll('#stars button').forEach((x) => x.classList.toggle('on', +x.dataset.n <= n));
      await api(`/api/runs/${runId}/feedback`, { rating: n }).catch(() => {});
      document.getElementById('stars-done').textContent = 'Thanks — recorded.';
    });
  });
}

api(`/api/runs/${runId}`).then((run) => {
  render(run);
  api('/api/events', { type: 'report_viewed', runId }).catch(() => {});
}).catch((e) => {
  app.innerHTML = `<div class="card"><h2>Report not found</h2><p class="muted">${esc(e.message)}</p><p><a href="/">Take the diagnostic →</a></p></div>`;
});
