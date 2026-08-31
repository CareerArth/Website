/* CareerArth AI — admin: edit ARTH scoring weights, bands, and modifiers.
   Writes context/scoring-config.json via POST /api/config; scoring reads the file
   fresh on every request, so saved changes apply on the next diagnostic run with no
   server restart. Unauthenticated, matching every other screen in this prototype. */

const app = document.getElementById('app');
const esc = (s) => { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; };
const api = (path, body) => fetch(path, {
  method: body ? 'POST' : 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined,
}).then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || r.statusText); return j; });

const DIM_LABELS = { alignment: 'Alignment', riskExposure: 'Risk Exposure', trajectory: 'Trajectory', humanCapital: 'Human Capital' };
const DIMS = ['alignment', 'riskExposure', 'trajectory', 'humanCapital'];

const fmt = (n) => Math.round(n * 1000) / 1000;
const sumLabel = (sum) => { const ok = Math.abs(sum - 1) < 0.001; return { text: `sum = ${fmt(sum)}${ok ? '' : ' (should be 1.0)'}`, color: ok ? '#3d6b4f' : '#9c3d2e' }; };

let cfg;

function render() {
  const dimSum = DIMS.reduce((s, d) => s + cfg.dimensionWeights[d], 0);
  app.innerHTML = `
  <div class="card">
    <div class="eyebrow">Admin · Prototype</div>
    <h1 style="font-size:24px;">ARTH scoring weights</h1>
    <p class="small muted" style="margin-top:6px;">Version ${esc(cfg.version)} · ${esc(cfg.methodologyNote)}</p>
    <p class="small" style="margin-top:10px; color:#9c3d2e;"><b>No login is required for this page</b> — anyone with this URL can change live scoring weights. Fine for a prototype/demo; add authentication before sharing this link beyond the team.</p>
    <p class="small muted" style="margin-top:8px;">Changes save to <code>context/scoring-config.json</code> and take effect on the next diagnostic run — no restart needed.</p>
  </div>

  <div class="card">
    <h2 style="font-size:18px;">Dimension weights</h2>
    <p class="small muted">How much each dimension counts toward the overall Arth Score. <span id="dim-sum" class="small"></span></p>
    <div class="row" style="flex-wrap:wrap; margin-top:10px;">
      ${DIMS.map((d) => `<div><label>${DIM_LABELS[d]}</label><input type="number" step="0.01" min="0" max="1" data-dimw="${d}" value="${cfg.dimensionWeights[d]}"></div>`).join('')}
    </div>
  </div>

  ${DIMS.map((d) => `
    <div class="card">
      <h2 style="font-size:18px;">${DIM_LABELS[d]} — item weights</h2>
      <p class="small muted">Weight of each questionnaire item within this dimension. <span id="item-sum-${d}" class="small"></span></p>
      <div class="row" style="flex-wrap:wrap; margin-top:10px;">
        ${Object.entries(cfg.itemWeights[d]).map(([id, w]) => `<div style="flex:0 0 90px;"><label>${esc(id)}</label><input type="number" step="0.01" min="0" max="1" data-itemw="${d}:${id}" value="${w}"></div>`).join('')}
      </div>
    </div>`).join('')}

  <div class="card">
    <h2 style="font-size:18px;">Modifiers</h2>
    <p class="small muted">Fixed point adjustments from profile facts. Trigger conditions are code, not editable here — only the size of the adjustment and whether it's on.</p>
    ${cfg.modifiers.map((m, i) => `
      <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap; padding:10px 0; border-bottom:1px solid var(--sand);">
        <div style="flex:2; min-width:220px;"><b class="small">${esc(m.id)}</b><br><span class="small muted">${DIM_LABELS[m.dimension]} · ${esc(m.when)}</span></div>
        <div><label class="small">Delta</label><input type="number" step="1" data-moddelta="${i}" value="${m.delta}" style="width:80px;"></div>
        <label class="small" style="display:flex; align-items:center; gap:6px; margin-top:18px;"><input type="checkbox" style="width:auto;" data-modactive="${i}" ${m.active ? 'checked' : ''}> Active</label>
      </div>`).join('')}
  </div>

  <div class="card">
    <h2 style="font-size:18px;">Bands</h2>
    <p class="small muted">Score ranges mapped to interpretation labels.</p>
    ${cfg.bands.map((b, i) => `
      <div class="row" style="align-items:flex-end; margin-top:8px;">
        <div style="flex:0 0 140px;"><label>Label</label><input type="text" value="${esc(b.label)}" disabled></div>
        <div><label>Min</label><input type="number" data-bandmin="${i}" value="${b.min}"></div>
        <div><label>Max</label><input type="number" data-bandmax="${i}" value="${b.max}"></div>
      </div>`).join('')}
  </div>

  <div class="card">
    <h2 style="font-size:18px;">Clamps</h2>
    <div class="row" style="margin-top:8px;">
      <div><label>Modifier clamp min</label><input type="number" data-mcmin value="${cfg.modifierClamp.min}"></div>
      <div><label>Modifier clamp max</label><input type="number" data-mcmax value="${cfg.modifierClamp.max}"></div>
      <div><label>Score clamp min</label><input type="number" data-scmin value="${cfg.scoreClamp.min}"></div>
      <div><label>Score clamp max</label><input type="number" data-scmax value="${cfg.scoreClamp.max}"></div>
    </div>
    <p class="small muted" style="margin-top:10px;">Answer scale (${cfg.answerScale.min}–${cfg.answerScale.max}) isn't editable here — it's tied to intake validation in code, so changing it needs a matching code change, not just a config edit.</p>
  </div>

  <div class="card">
    <div class="error-box" id="ad-error"></div>
    <button class="btn btn-primary" id="ad-save">Save changes</button>
    <button class="btn btn-ghost" id="ad-reload" style="margin-left:10px;">Reload from disk</button>
    <span class="small muted" id="ad-done" style="margin-left:12px;"></span>
  </div>`;

  const setSum = (id, sum) => { const el = document.getElementById(id); const { text, color } = sumLabel(sum); el.textContent = text; el.style.color = color; };
  const recompute = () => {
    setSum('dim-sum', DIMS.reduce((s, d) => s + (parseFloat(app.querySelector(`[data-dimw="${d}"]`).value) || 0), 0));
    DIMS.forEach((d) => {
      const ids = Object.keys(cfg.itemWeights[d]);
      const sum = ids.reduce((s, id) => s + (parseFloat(app.querySelector(`[data-itemw="${d}:${id}"]`).value) || 0), 0);
      setSum(`item-sum-${d}`, sum);
    });
  };
  recompute();
  app.querySelectorAll('input[type=number]').forEach((i) => i.addEventListener('input', recompute));

  document.getElementById('ad-reload').addEventListener('click', load);

  document.getElementById('ad-save').addEventListener('click', async () => {
    const next = JSON.parse(JSON.stringify(cfg));
    DIMS.forEach((d) => { next.dimensionWeights[d] = parseFloat(app.querySelector(`[data-dimw="${d}"]`).value); });
    DIMS.forEach((d) => {
      Object.keys(next.itemWeights[d]).forEach((id) => {
        next.itemWeights[d][id] = parseFloat(app.querySelector(`[data-itemw="${d}:${id}"]`).value);
      });
    });
    next.modifiers.forEach((m, i) => {
      m.delta = parseFloat(app.querySelector(`[data-moddelta="${i}"]`).value);
      m.active = app.querySelector(`[data-modactive="${i}"]`).checked;
    });
    next.bands.forEach((b, i) => {
      b.min = parseFloat(app.querySelector(`[data-bandmin="${i}"]`).value);
      b.max = parseFloat(app.querySelector(`[data-bandmax="${i}"]`).value);
    });
    next.modifierClamp.min = parseFloat(app.querySelector('[data-mcmin]').value);
    next.modifierClamp.max = parseFloat(app.querySelector('[data-mcmax]').value);
    next.scoreClamp.min = parseFloat(app.querySelector('[data-scmin]').value);
    next.scoreClamp.max = parseFloat(app.querySelector('[data-scmax]').value);

    const box = document.getElementById('ad-error'); box.style.display = 'none';
    try {
      const res = await api('/api/config', next);
      cfg = res.config;
      document.getElementById('ad-done').textContent = 'Saved — takes effect on the next diagnostic run.';
    } catch (e) {
      box.textContent = e.message; box.style.display = 'block';
    }
  });
}

function load() {
  app.innerHTML = `<div class="loading"><div class="spinner"></div><p class="muted">Loading config…</p></div>`;
  api('/api/config').then((c) => { cfg = c; render(); }).catch((e) => {
    app.innerHTML = `<div class="card"><h2>Could not load config</h2><p class="muted">${esc(e.message)}</p></div>`;
  });
}
load();
