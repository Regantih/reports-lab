// Shared helpers for the lab tools: persistence, formatters, optional Ask-Tutor.
// All persistence is localStorage-only. The optional Ask-Tutor only sends the
// literal question text the user types (never the model inputs).

window.PEVC = (function () {
  const KEY_PREFIX = 'pevc:';

  function save(slot, data) {
    try { localStorage.setItem(KEY_PREFIX + slot, JSON.stringify(data)); return true; }
    catch (e) { console.warn('save failed', e); return false; }
  }
  function load(slot, fallback) {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + slot);
      return raw ? JSON.parse(raw) : (fallback ?? null);
    } catch (e) { return fallback ?? null; }
  }
  function clear(slot) {
    try { localStorage.removeItem(KEY_PREFIX + slot); return true; }
    catch { return false; }
  }

  // Persist all [data-persist] inputs/textareas/selects under a slot key.
  function bindPersistence(rootEl, slot) {
    const items = rootEl.querySelectorAll('[data-persist]');
    const cur = load(slot, {}) || {};
    items.forEach((el) => {
      const k = el.getAttribute('data-persist');
      if (!k) return;
      if (cur[k] !== undefined) {
        if (el.type === 'checkbox') el.checked = !!cur[k];
        else el.value = cur[k];
      }
      const handler = () => {
        const all = load(slot, {}) || {};
        all[k] = (el.type === 'checkbox') ? el.checked : el.value;
        save(slot, all);
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
  }

  function fmtCurrency(x, opts) {
    if (!isFinite(x)) return '—';
    const o = opts || {};
    const abs = Math.abs(x);
    let s;
    if (abs >= 1e9) s = (x / 1e9).toFixed(2) + 'B';
    else if (abs >= 1e6) s = (x / 1e6).toFixed(2) + 'M';
    else if (abs >= 1e3) s = (x / 1e3).toFixed(1) + 'K';
    else s = x.toFixed(0);
    return (o.symbol || '$') + s;
  }
  function fmtPct(x, digits) {
    if (!isFinite(x)) return '—';
    return (x * 100).toFixed(digits ?? 1) + '%';
  }
  function fmtMult(x, digits) {
    if (!isFinite(x)) return '—';
    return x.toFixed(digits ?? 2) + '×';
  }
  function num(v, fallback) {
    const n = parseFloat(v);
    return isFinite(n) ? n : (fallback ?? 0);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); ta.remove(); resolve();
      } catch (e) { reject(e); }
    });
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
  }

  // Optional Ask-Tutor — same free CORS-friendly endpoint as the rest of the site.
  // Only the literal question is sent; we do NOT include the user's tool inputs.
  async function askTutor(question, opts) {
    const url = (opts && opts.api) || 'https://text.pollinations.ai/openai';
    const sys = (opts && opts.system) ||
      'You are a terse, senior PE/VC analyst. Answer in 4-8 sentences. No marketing. ' +
      'Where appropriate, name the formula or ratio you are using. ' +
      'If the question is too vague to answer, say so and ask the single best clarifying question.';
    const body = {
      model: 'openai',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: question }
      ],
      stream: false
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('tutor: ' + res.status);
    const data = await res.json();
    return (data?.choices?.[0]?.message?.content
      || data?.choices?.[0]?.message?.reasoning_content
      || '').trim();
  }

  return { save, load, clear, bindPersistence, fmtCurrency, fmtPct, fmtMult, num, copyText, downloadFile, askTutor };
})();
