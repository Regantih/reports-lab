/* The Agentic Enterprise — interactive scorecard.
   Loaded only on chapters/scorecard.html.
   Uses window.__SC_PAYLOAD__ for question metadata + roadmap library.
   Persists answers + snapshots to localStorage; encodes shareable state in URL hash.
*/
(function () {
  'use strict';
  if (!window.__SC_PAYLOAD__) return;
  const PAY = window.__SC_PAYLOAD__;
  const ANS_KEY = 'age.scorecard.answers';
  const HIST_KEY = 'age.scorecard.history';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- state ---------------------------------------------------------------
  let answers = readAnswers();
  applyHashIfPresent();
  hydrateInputs();
  render();

  // ---- input handling ------------------------------------------------------
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (!(t && t.matches('input[type=radio][data-pillar]'))) return;
    const qid = t.getAttribute('data-q');
    const v = parseInt(t.value, 10);
    if (!qid || !v) return;
    answers[qid] = v;
    writeAnswers(answers);
    updateHashFromAnswers();
    render();
  });

  // ---- buttons -------------------------------------------------------------
  const shareBtn = $('[data-sc-share]');
  const shareOut = $('[data-sc-share-output]');
  const snapBtn = $('[data-sc-snapshot]');
  const exportBtn = $('[data-sc-export]');
  const resetBtn = $('[data-sc-reset]');

  if (shareBtn) shareBtn.addEventListener('click', () => {
    const url = location.origin + location.pathname + '#a=' + encodeAnswers(answers);
    shareOut.hidden = false;
    shareOut.innerHTML =
      '<div class="sc-share__row"><input class="sc-share__input" readonly value="' + escapeAttr(url) + '">' +
      '<button class="sc-btn sc-btn--ghost" data-sc-copy>Copy</button></div>' +
      '<div class="sc-share__hint">Anyone with this link will see the same answers, radar, and roadmap. Snapshots stay on your device.</div>';
    const copyBtn = shareOut.querySelector('[data-sc-copy]');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(url).then(() => {
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
      });
    });
  });

  if (snapBtn) snapBtn.addEventListener('click', () => {
    const hist = readHist();
    const scores = computeScores(answers);
    hist.push({ at: Date.now(), scores: scores.byPillar, overall: scores.overall, answered: scores.answered });
    if (hist.length > 24) hist.shift();
    writeHist(hist);
    render();
  });

  if (exportBtn) exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({
      answered_at: new Date().toISOString(),
      answers,
      scores: computeScores(answers),
      history: readHist(),
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'agentic-readiness-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (!confirm('Clear all answers from this browser? Snapshots will be kept.')) return;
    answers = {};
    writeAnswers(answers);
    history.replaceState(null, '', location.pathname);
    $$('input[type=radio][data-pillar]').forEach(r => { r.checked = false; });
    render();
  });

  // ---- core ---------------------------------------------------------------
  function render() {
    const scores = computeScores(answers);
    // Top progress bar
    const overallFill = $('[data-sc-overall-fill]');
    if (overallFill) overallFill.style.width = (scores.answered / 40 * 100) + '%';
    const ans = $('[data-sc-answered]');
    if (ans) ans.textContent = String(scores.answered);

    // Per-pillar progress bars
    PAY.pillars.forEach(p => {
      const fill = document.querySelector('[data-pillar-fill="' + p.id + '"]');
      if (!fill) return;
      const filled = p.questions.filter(q => answers[q]).length;
      fill.style.width = (filled / p.questions.length * 100) + '%';
    });

    // Results panel
    const panel = $('[data-sc-results]');
    if (!panel) return;
    if (scores.answered < 4) { panel.hidden = true; return; }
    panel.hidden = false;

    // Overall
    $('[data-sc-overall]').textContent = scores.overall.toFixed(1);
    const tier = $('[data-sc-tier]');
    const lev = nearestLevel(scores.overall);
    tier.textContent = 'Level ' + lev.n + ' · ' + lev.name + ' — ' + lev.summary;
    tier.setAttribute('data-tone', lev.tone);

    // Radar
    drawRadar(scores.byPillar);

    // Bars
    drawBars(scores.byPillar);

    // Roadmap
    drawRoadmap(scores.byPillar);

    // History
    drawHistory();
  }

  function drawRadar(byPillar) {
    // Order: governance (top), orchestration (right-up), use (right-down),
    //        integration (bottom). We use a 6-vertex polygon for a fuller hex —
    //        repeating each pillar twice (mirrored) to keep the radar symmetric.
    const r = (v) => 28 * v;  // 1..5 -> 28..140
    const gov = r(byPillar.gov || 0);
    const orch = r(byPillar.orch || 0);
    const use = r(byPillar.use || 0);
    const integ = r(byPillar.int || 0);
    // Six vertices clockwise from top: gov, orch, use, integ, use(mirror), orch(mirror).
    const cos30 = 0.8660254;
    const sin30 = 0.5;
    const pts = [
      [0, -gov],
      [orch * cos30, -orch * sin30],
      [use * cos30, use * sin30],
      [0, integ],
      [-use * cos30, use * sin30],
      [-orch * cos30, -orch * sin30],
    ].map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');
    const shape = $('[data-sc-radar-shape]');
    if (shape) shape.setAttribute('points', pts);
  }

  function drawBars(byPillar) {
    const root = $('[data-sc-bars]');
    if (!root) return;
    const labels = { gov: 'Governance', orch: 'Orchestration', use: 'Use cases', int: 'Integration' };
    const tones = { gov: 'copper', orch: 'quartz', use: 'primary', int: 'euv' };
    root.innerHTML = ['gov', 'orch', 'use', 'int'].map(k => {
      const v = byPillar[k] || 0;
      const pct = (v / 5 * 100).toFixed(0);
      const lev = nearestLevel(v);
      return '<div class="sc-bar" data-tone="' + tones[k] + '">' +
        '<div class="sc-bar__head"><span class="sc-bar__name">' + labels[k] + '</span><span class="sc-bar__num">' + (v ? v.toFixed(1) : '—') + '</span></div>' +
        '<div class="sc-bar__track"><div class="sc-bar__fill" style="width:' + pct + '%"></div></div>' +
        '<div class="sc-bar__hint">' + (v ? lev.name + ' · ' + lev.summary : 'Awaiting answers') + '</div>' +
        '</div>';
    }).join('');
  }

  function drawRoadmap(byPillar) {
    const root = $('[data-sc-roadmap]');
    if (!root) return;
    // Pick the two weakest pillars (lowest score, but only if any answered).
    const ranked = ['gov', 'orch', 'use', 'int']
      .filter(k => byPillar[k])
      .sort((a, b) => byPillar[a] - byPillar[b]);
    if (!ranked.length) { root.innerHTML = '<p class="sc-empty">Answer a few more questions to generate your roadmap.</p>'; return; }
    const focus = ranked.slice(0, 2);
    const horizons = ['30d', '60d', '90d', '6mo', '12mo'];
    const labels = { '30d': 'First 30 days', '60d': 'Days 31–60', '90d': 'Days 61–90', '6mo': 'Next 6 months', '12mo': 'Next 12 months' };
    const pillarLabel = { gov: 'Governance', orch: 'Orchestration', use: 'Use cases', int: 'Integration' };

    const cols = horizons.map(h => {
      const items = [];
      focus.forEach(p => {
        (PAY.roadmap_actions[p] || []).filter(a => a.horizon === h).forEach(a => {
          items.push('<li><span class="sc-roadmap__pill">' + pillarLabel[p] + '</span> ' + escape(a.action) + '</li>');
        });
      });
      return '<div class="sc-roadmap__col"><div class="sc-roadmap__col-head">' + labels[h] + '</div><ul>' +
        (items.length ? items.join('') : '<li class="sc-empty">Hold; address earlier horizons first.</li>') + '</ul></div>';
    });
    const focusLabel = focus.map(p => pillarLabel[p]).join(' and ');
    root.innerHTML = '<p class="sc-roadmap__intro">Focused on your two weakest pillars: <strong>' + focusLabel + '</strong>. Re-score after each horizon to update the plan.</p>' +
      '<div class="sc-roadmap__cols">' + cols.join('') + '</div>';
  }

  function drawHistory() {
    const root = $('[data-sc-history]');
    if (!root) return;
    const hist = readHist();
    if (!hist.length) {
      root.innerHTML = '<p class="sc-empty">No snapshots yet. Click <em>Save snapshot</em> below to track progress.</p>';
      return;
    }
    const fmt = (t) => {
      const d = new Date(t);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const rows = hist.slice().reverse().map(h => {
      const v = h.overall != null ? h.overall.toFixed(2) : '—';
      const p = h.scores || {};
      return '<tr><td>' + fmt(h.at) + '</td><td>' + (h.answered || 0) + '/40</td>' +
        '<td>' + (p.gov ? p.gov.toFixed(1) : '—') + '</td>' +
        '<td>' + (p.orch ? p.orch.toFixed(1) : '—') + '</td>' +
        '<td>' + (p.use ? p.use.toFixed(1) : '—') + '</td>' +
        '<td>' + (p.int ? p.int.toFixed(1) : '—') + '</td>' +
        '<td><strong>' + v + '</strong></td></tr>';
    }).join('');
    root.innerHTML = '<table class="sc-history-table"><thead><tr><th>Date</th><th>Answered</th><th>Gov</th><th>Orch</th><th>Use</th><th>Int</th><th>Overall</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function computeScores(a) {
    const sums = {}; const counts = {};
    PAY.pillars.forEach(p => {
      sums[p.id] = 0; counts[p.id] = 0;
      p.questions.forEach(q => { if (a[q]) { sums[p.id] += a[q]; counts[p.id] += 1; } });
    });
    const byPillar = {};
    let total = 0; let answered = 0;
    PAY.pillars.forEach(p => {
      if (counts[p.id]) byPillar[p.id] = sums[p.id] / counts[p.id];
      else byPillar[p.id] = 0;
      total += sums[p.id];
      answered += counts[p.id];
    });
    const overall = answered ? total / answered : 0;
    return { byPillar, overall, answered };
  }

  function nearestLevel(v) {
    const n = Math.max(1, Math.min(5, Math.round(v)));
    return PAY.levels.find(l => l.n === n) || PAY.levels[0];
  }

  // ---- persistence -------------------------------------------------------
  function readAnswers() {
    try { return JSON.parse(localStorage.getItem(ANS_KEY) || '{}'); } catch (e) { return {}; }
  }
  function writeAnswers(a) { localStorage.setItem(ANS_KEY, JSON.stringify(a)); }
  function readHist() {
    try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch (e) { return []; }
  }
  function writeHist(h) { localStorage.setItem(HIST_KEY, JSON.stringify(h)); }

  // ---- URL hash encoding -------------------------------------------------
  // Encoding: list of question IDs is fixed by PAY.pillars ordering.
  // Each answer is 1..5 or 0 (unanswered). We pack 40 values × 3 bits = 120 bits = 15 bytes,
  // then base64url-encode. Compact, shareable, no server needed.
  function questionOrder() {
    const out = [];
    PAY.pillars.forEach(p => p.questions.forEach(q => out.push(q)));
    return out;
  }
  function encodeAnswers(a) {
    const order = questionOrder();
    const bits = [];
    order.forEach(q => {
      const v = a[q] || 0; // 0..5 fits in 3 bits
      for (let i = 2; i >= 0; i--) bits.push((v >> i) & 1);
    });
    // pack to bytes
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] || 0);
      bytes.push(b);
    }
    return base64url(bytes);
  }
  function decodeAnswers(s) {
    const bytes = unbase64url(s);
    if (!bytes) return null;
    const bits = [];
    bytes.forEach(b => { for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1); });
    const order = questionOrder();
    const out = {};
    order.forEach((q, idx) => {
      const off = idx * 3;
      const v = (bits[off] << 2) | (bits[off + 1] << 1) | bits[off + 2];
      if (v >= 1 && v <= 5) out[q] = v;
    });
    return out;
  }
  function base64url(bytes) {
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unbase64url(s) {
    try {
      let str = s.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) str += '=';
      const bin = atob(str);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    } catch (e) { return null; }
  }

  function applyHashIfPresent() {
    const h = location.hash || '';
    const m = h.match(/[#&]a=([A-Za-z0-9_-]+)/);
    if (!m) return;
    const decoded = decodeAnswers(m[1]);
    if (!decoded) return;
    answers = decoded;
    writeAnswers(answers);
  }
  function updateHashFromAnswers() {
    const enc = encodeAnswers(answers);
    history.replaceState(null, '', location.pathname + '#a=' + enc);
  }
  function hydrateInputs() {
    Object.keys(answers).forEach(qid => {
      const v = answers[qid];
      const el = document.querySelector('input[name="' + qid + '"][value="' + v + '"]');
      if (el) el.checked = true;
    });
  }

  // ---- helpers -----------------------------------------------------------
  function escape(s) { return String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])); }
  function escapeAttr(s) { return String(s).replace(/"/g, '&quot;'); }
})();
