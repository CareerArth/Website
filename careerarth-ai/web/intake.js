/* CareerArth AI — intake wizard (vanilla JS, no build step) */

/* Item wording + scoring key: CA_BADS_Summer_2026_D2.xlsx (Professor Tushar Jaruhar).
   Third tuple element = reverse-scored (Strongly Agree stored as low, not high).
   T3 and H2 are phrased negatively like the reverse items but are keyed forward in the
   source sheet — implemented literally as given; see docs/09 for the flagged question
   to confirm with the professor before relying on it for anything grade-affecting. */
const QUESTIONS = {
  A: {
    label: 'Alignment', intro: 'How well your current skills and effort line up with where the market is going.',
    items: [
      ['A1', 'Relevant opportunities rarely come to you unless you actively apply or reach out yourself.', false],
      ['A2', 'Your current skills are well aligned with what employers in your market actively demand today.', false],
      ['A3', 'You are actively building skills that are likely to become more valuable over the next few years.', false],
      ['A4', 'Your current role helps you perform today, but it is not meaningfully building capabilities that will remain valuable in future roles or career moves.', true],
      ['A5', 'The industry you work in is likely to create meaningful long-term growth and opportunity over the next decade.', false],
    ],
  },
  R: {
    label: 'Risk Exposure', intro: 'How exposed you would be if your current role or income were disrupted.',
    items: [
      ['R1', 'If you had to leave your current role, you could realistically secure a comparable or better opportunity within the next six months.', false],
      ['R2', 'The core work you do is unlikely to be significantly reduced, replaced, or devalued by automation or AI in the near future.', false],
      ['R3', 'A job loss, career break, or transition would put you under immediate financial pressure.', true],
      ['R4', 'Your monthly expenses and financial responsibilities do not force you to stay in your current role. If needed, you could leave and take a temporary pay cut or transition role without significant financial strain.', false],
      ['R5', 'Your career choices are heavily restricted by location, family responsibilities, health, or other personal constraints.', true],
    ],
  },
  T: {
    label: 'Trajectory', intro: 'Whether your scope, visibility, and momentum are expanding or stalling.',
    items: [
      ['T1', 'Over the past few years, your role has expanded in scope, complexity, or decision-making authority.', false],
      ['T2', 'Your work is visible to senior leaders or key decision-makers.', false],
      ['T3', 'Real opportunities for promotion, expanded responsibility, or better roles have become infrequent for you.', false],
      ['T4', 'Looking back over the past few years, your career has not moved forward in a clear or meaningful way.', true],
      ['T5', 'You are trusted with work or decisions where the stakes, visibility, or business impact are high.', false],
    ],
  },
  H: {
    label: 'Human Capital', intro: 'The strength of your expertise, network, and visible proof of your value.',
    items: [
      ['H1', 'Your expertise is strong enough to help you command above-average compensation for someone with similar experience in your field.', false],
      ['H2', 'Your LinkedIn, resume, or professional profile does not clearly communicate the skills, strengths, and achievements that distinguish you.', false],
      ['H3', 'You have relationships with people who could realistically help you access new roles, clients, or career opportunities.', false],
      ['H4', 'It would be difficult for others to quickly verify your achievements through credible evidence such as recommendations, endorsements, strong work proof, or visible accomplishments.', true],
      ['H5', 'The work you do depends on judgment, expertise, or problem-solving that would be difficult to replace with automation or AI.', false],
    ],
  },
};
const LIKERT = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

const INDUSTRIES = ['technology','finance','marketing','professional-services','healthcare','education','government','manufacturing','logistics','telecom','energy','retail','media','hospitality','real-estate','nonprofit','other'];
const CONCERNS = [
  ['stagnation', "I feel stuck / plateaued"],
  ['misalignment', "My work doesn't match my ambitions"],
  ['industry-shift', 'My industry is changing under me'],
  ['layoff-risk', "I'm worried about job security"],
  ['growth', 'I want to grow faster'],
  ['transition', "I'm considering a role or industry change"],
  ['other', 'Something else'],
];

const state = {
  step: 0,
  data: {
    fullName: '', email: '', currentRole: '', industry: 'technology',
    yearsExperience: '', yearsInCurrentRole: '', promotionsLast5Years: 0,
    linkedInUrl: '', skills: [], goals: { targetRole: '', targetIndustry: '', horizonYears: 5, narrative: '' },
    constraints: [], concern: '', concernCategory: 'other',
    questionnaire: {}, consent: false, isSynthetic: false,
  },
};

const $ = (id) => document.getElementById(id);
const host = $('step-host');

const api = (path, body) => fetch(path, {
  method: body ? 'POST' : 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined,
}).then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || r.statusText); return j; });

const track = (type, meta) => api('/api/events', { type, meta }).catch(() => {});

/* ---------- steps ---------- */

const steps = [
  { title: 'About you', render: renderAbout, validate: validateAbout },
  { title: 'Where you’re headed', render: renderDirection, validate: validateDirection },
  { title: 'Your skills', render: renderSkills, validate: validateSkills },
  ...['A', 'R', 'T', 'H'].map((d, i) => ({
    title: `Diagnostic ${i + 1} of 4 — ${QUESTIONS[d].label}`,
    render: () => renderLikert(d), validate: () => validateLikert(d),
  })),
  { title: 'Almost done', render: renderConsent, validate: validateConsent },
];

function esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }

function renderAbout() {
  const d = state.data;
  host.innerHTML = `
    <h2>About you</h2>
    <p class="muted small">Only what the analysis needs — nothing else.</p>
    <div class="row">
      <div><label>First / full name</label><input type="text" id="f-name" value="${esc(d.fullName)}" placeholder="Priya Sharma"></div>
      <div><label>Email <span class="opt">(optional — to receive your report)</span></label><input type="email" id="f-email" value="${esc(d.email)}" placeholder="you@example.com"></div>
    </div>
    <div class="row">
      <div><label>Current role title</label><input type="text" id="f-role" value="${esc(d.currentRole)}" placeholder="e.g. Financial Analyst"></div>
      <div><label>Industry</label><select id="f-industry">${INDUSTRIES.map((i) => `<option ${i === d.industry ? 'selected' : ''}>${i}</option>`).join('')}</select></div>
    </div>
    <div class="row">
      <div><label>Years of experience (total)</label><input type="number" id="f-exp" min="0" max="60" step="0.5" value="${d.yearsExperience}"></div>
      <div><label>Years in current role</label><input type="number" id="f-tenure" min="0" max="60" step="0.5" value="${d.yearsInCurrentRole}"></div>
    </div>
    <div class="row">
      <div><label>Promotions / level changes in the last 5 years</label><select id="f-promos">${[0,1,2,3].map((n) => `<option value="${n}" ${n === +d.promotionsLast5Years ? 'selected' : ''}>${n === 3 ? '3+' : n}</option>`).join('')}</select></div>
      <div><label>LinkedIn URL <span class="opt">(optional)</span></label><input type="url" id="f-li" value="${esc(d.linkedInUrl)}" placeholder="https://linkedin.com/in/…"></div>
    </div>`;
}
function validateAbout() {
  const d = state.data;
  d.fullName = $('f-name').value.trim();
  d.email = $('f-email').value.trim();
  d.currentRole = $('f-role').value.trim();
  d.industry = $('f-industry').value;
  d.yearsExperience = parseFloat($('f-exp').value);
  d.yearsInCurrentRole = parseFloat($('f-tenure').value);
  d.promotionsLast5Years = parseInt($('f-promos').value, 10);
  d.linkedInUrl = $('f-li').value.trim();
  if (!d.fullName) return 'Please tell us your name.';
  if (!d.currentRole) return 'Please enter your current role title.';
  if (!Number.isFinite(d.yearsExperience)) return 'Please enter your total years of experience.';
  if (!Number.isFinite(d.yearsInCurrentRole)) return 'Please enter your years in current role.';
  if (d.yearsInCurrentRole > d.yearsExperience) return 'Years in current role can’t exceed total experience.';
  return null;
}

function renderDirection() {
  const d = state.data;
  host.innerHTML = `
    <h2>Where you’re headed</h2>
    <p class="muted small">A rough direction is enough — “not sure yet” is a valid answer.</p>
    <div class="row">
      <div><label>Target role <span class="opt">(optional)</span></label><input type="text" id="f-target" value="${esc(d.goals.targetRole)}" placeholder="e.g. Product Manager"></div>
      <div><label>Target industry <span class="opt">(optional)</span></label><input type="text" id="f-tind" value="${esc(d.goals.targetIndustry)}" placeholder="e.g. technology"></div>
    </div>
    <label>Over what horizon?</label>
    <select id="f-horizon">${[2,3,5,10].map((y) => `<option value="${y}" ${y === +d.goals.horizonYears ? 'selected' : ''}>${y} years</option>`).join('')}</select>
    <label>What best describes your main concern right now?</label>
    <select id="f-concern-cat">${CONCERNS.map(([v, l]) => `<option value="${v}" ${v === d.concernCategory ? 'selected' : ''}>${l}</option>`).join('')}</select>
    <label>In your own words <span class="opt">(optional, but it sharpens the analysis)</span></label>
    <textarea id="f-concern" rows="3" placeholder="What prompted you to take this diagnostic?">${esc(d.concern)}</textarea>
    <label>Constraints we should respect <span class="opt">(optional — location, family, finances, visa…)</span></label>
    <input type="text" id="f-constraints" value="${esc(d.constraints.join('; '))}" placeholder="e.g. can’t relocate; need stable income">`;
}
function validateDirection() {
  const d = state.data;
  d.goals.targetRole = $('f-target').value.trim();
  d.goals.targetIndustry = $('f-tind').value.trim();
  d.goals.horizonYears = parseInt($('f-horizon').value, 10);
  d.concernCategory = $('f-concern-cat').value;
  d.concern = $('f-concern').value.trim();
  d.constraints = $('f-constraints').value.split(';').map((s) => s.trim()).filter(Boolean);
  return null;
}

function renderSkills() {
  host.innerHTML = `
    <h2>Your working skills</h2>
    <p class="muted small">Add 3–8 skills you actually use — the analysis matches these against role requirements. Press Enter to add.</p>
    <label>Skills</label>
    <input type="text" id="f-skill-input" placeholder="e.g. financial modeling — press Enter">
    <div class="chips" id="chips"></div>`;
  const input = $('f-skill-input');
  const draw = () => {
    $('chips').innerHTML = state.data.skills.map((s, i) =>
      `<span class="chip">${esc(s)}<button data-i="${i}" aria-label="remove">×</button></span>`).join('');
    document.querySelectorAll('.chip button').forEach((b) =>
      b.addEventListener('click', () => { state.data.skills.splice(+b.dataset.i, 1); draw(); }));
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input.value.trim().replace(/,$/, '');
      if (v && state.data.skills.length < 15 && !state.data.skills.includes(v)) { state.data.skills.push(v); draw(); }
      input.value = '';
    }
  });
  draw();
}
function validateSkills() {
  const pending = $('f-skill-input').value.trim();
  if (pending && !state.data.skills.includes(pending) && state.data.skills.length < 15) state.data.skills.push(pending);
  if (state.data.skills.length < 1) return 'Please add at least one skill.';
  return null;
}

function renderLikert(dim) {
  const q = QUESTIONS[dim];
  host.innerHTML = `
    <h2>${q.label}</h2>
    <p class="muted small">${q.intro}</p>
    ${q.items.map(([id, text, reverse]) => {
      const stored = state.data.questionnaire[id];
      return `
      <div class="q" data-q="${id}" data-reverse="${reverse}">
        <p>${text}</p>
        <div class="likert">${LIKERT.map((label, v) =>
          `<button type="button" data-v="${v}" class="${stored === (reverse ? 4 - v : v) ? 'sel' : ''}">${label}</button>`).join('')}</div>
      </div>`;
    }).join('')}`;
  document.querySelectorAll('.q').forEach((qEl) => {
    const reverse = qEl.dataset.reverse === 'true';
    qEl.querySelectorAll('.likert button').forEach((b) => {
      b.addEventListener('click', () => {
        const v = +b.dataset.v;
        state.data.questionnaire[qEl.dataset.q] = reverse ? 4 - v : v;
        qEl.querySelectorAll('.likert button').forEach((x) => x.classList.toggle('sel', x === b));
      });
    });
  });
}
function validateLikert(dim) {
  const missing = QUESTIONS[dim].items.filter(([id]) => state.data.questionnaire[id] === undefined);
  return missing.length ? `Please answer all ${QUESTIONS[dim].label} questions (${missing.length} remaining).` : null;
}

function renderConsent() {
  host.innerHTML = `
    <h2>Almost done</h2>
    <p class="muted small" style="margin-bottom:14px;">Your answers are used only to produce your diagnostic. This is a research prototype: scores come from a heuristic rubric, the analysis is AI-drafted, and a human consultant reviews it before it's treated as final.</p>
    <label style="display:flex; gap:10px; align-items:flex-start; font-weight:400; cursor:pointer;">
      <input type="checkbox" id="f-consent" style="width:auto; margin-top:4px;" ${state.data.consent ? 'checked' : ''}>
      <span>I consent to my responses being processed (including by an AI model) to generate my career diagnostic.</span>
    </label>`;
}
function validateConsent() {
  state.data.consent = $('f-consent').checked;
  return state.data.consent ? null : 'Consent is required to generate your diagnostic.';
}

/* ---------- wizard mechanics ---------- */

function show() {
  $('progress-bar').style.width = `${Math.round((state.step / steps.length) * 100)}%`;
  $('error-box').style.display = 'none';
  steps[state.step].render();
  $('btn-back').style.visibility = state.step === 0 ? 'hidden' : 'visible';
  $('btn-next').textContent = state.step === steps.length - 1 ? 'Generate my diagnostic' : 'Continue';
  window.scrollTo({ top: 0 });
}

$('btn-back').addEventListener('click', () => { if (state.step > 0) { state.step--; show(); } });

$('btn-next').addEventListener('click', async () => {
  const err = steps[state.step].validate();
  if (err) { const box = $('error-box'); box.textContent = err; box.style.display = 'block'; return; }
  track('intake_step_completed', { step: state.step, title: steps[state.step].title });
  if (state.step < steps.length - 1) { state.step++; show(); return; }

  // submit
  track('intake_completed', { isSynthetic: state.data.isSynthetic });
  document.querySelector('.shell').style.display = 'none';
  $('loading').style.display = 'block';
  try {
    const payload = JSON.parse(JSON.stringify(state.data));
    payload.yearsExperience = +payload.yearsExperience;
    payload.yearsInCurrentRole = +payload.yearsInCurrentRole;
    const { id } = await api('/api/diagnostic', payload);
    location.href = `/report/${id}`;
  } catch (e) {
    document.querySelector('.shell').style.display = 'block';
    $('loading').style.display = 'none';
    const box = $('error-box'); box.textContent = `Could not generate your diagnostic: ${e.message}`; box.style.display = 'block';
  }
});

/* ---------- personas ---------- */

api('/api/personas').then((personas) => {
  const sel = $('persona-select');
  personas.forEach((p, i) => {
    const o = document.createElement('option');
    o.value = String(i); o.textContent = `${p.id ?? p.fullName} — ${p.currentRole}`;
    sel.appendChild(o);
  });
  sel.addEventListener('change', () => {
    if (sel.value === '') return;
    const p = JSON.parse(JSON.stringify(personas[+sel.value]));
    delete p.id; // let the server mint a fresh run id
    Object.assign(state.data, {
      ...state.data, ...p,
      goals: { ...state.data.goals, ...(p.goals ?? {}) },
      questionnaire: { ...(p.questionnaire ?? {}) },
      email: p.email ?? '', linkedInUrl: p.linkedInUrl ?? '',
      constraints: p.constraints ?? [], isSynthetic: true, consent: false,
    });
    state.step = 0; show();
  });
}).catch(() => {});

track('intake_started');
show();
