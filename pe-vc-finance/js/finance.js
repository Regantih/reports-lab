/* =========================================
   Reports Lab · PE/VC Finance Solver — shared math + UI utils
   No external deps. Browser-side only.
   ========================================= */
(function (global) {
  'use strict';

  const fin = {};

  // ---------- numbers / formatting ----------
  fin.fmt = function (n, opts) {
    opts = opts || {};
    if (n === null || n === undefined || !isFinite(n)) return '—';
    const d = opts.decimals != null ? opts.decimals : 2;
    const sign = n < 0 ? '-' : '';
    const v = Math.abs(n);
    const formatted = v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    return sign + (opts.prefix || '') + formatted + (opts.suffix || '');
  };
  fin.money = function (n, decimals) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    const d = decimals != null ? decimals : 1;
    const sign = n < 0 ? '-' : '';
    const v = Math.abs(n);
    if (v >= 1e9) return sign + '$' + (v / 1e9).toFixed(d) + 'B';
    if (v >= 1e6) return sign + '$' + (v / 1e6).toFixed(d) + 'M';
    if (v >= 1e3) return sign + '$' + (v / 1e3).toFixed(d) + 'K';
    return sign + '$' + v.toFixed(d);
  };
  fin.pct = function (n, d) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return (n * 100).toFixed(d != null ? d : 1) + '%';
  };
  fin.x = function (n, d) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return n.toFixed(d != null ? d : 2) + 'x';
  };
  fin.parse = function (v, fallback) {
    if (typeof v === 'number') return v;
    if (v == null) return fallback != null ? fallback : 0;
    const n = parseFloat(String(v).replace(/[$,\s%x]/g, ''));
    return isFinite(n) ? n : (fallback != null ? fallback : 0);
  };

  // ---------- core finance math ----------

  // IRR via Newton + bisection fallback. cashflows[0] is t=0 (negative for outflow).
  fin.irr = function (cashflows, guess) {
    if (!cashflows || cashflows.length < 2) return NaN;
    const npv = (rate) => cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);
    const dnpv = (rate) => cashflows.reduce((acc, cf, t) => acc - t * cf / Math.pow(1 + rate, t + 1), 0);

    // Bisection bracket
    let low = -0.999, high = 10;
    let nLow = npv(low), nHigh = npv(high);
    if (nLow * nHigh > 0) {
      // try to widen
      for (let h = 10; h <= 1e6; h *= 2) {
        nHigh = npv(h);
        if (nLow * nHigh <= 0) { high = h; break; }
      }
      if (nLow * nHigh > 0) return NaN;
    }
    // Newton with safety
    let rate = guess != null ? guess : 0.1;
    for (let i = 0; i < 80; i++) {
      const f = npv(rate);
      const fp = dnpv(rate);
      if (Math.abs(f) < 1e-9) return rate;
      if (Math.abs(fp) < 1e-12) break;
      const next = rate - f / fp;
      if (!isFinite(next) || next < low || next > high) break;
      rate = next;
    }
    // Fall back to bisection
    for (let i = 0; i < 200; i++) {
      const mid = (low + high) / 2;
      const m = npv(mid);
      if (Math.abs(m) < 1e-9) return mid;
      if (nLow * m < 0) { high = mid; nHigh = m; } else { low = mid; nLow = m; }
    }
    return (low + high) / 2;
  };

  // CAGR / annualized return between two values across `years` years
  fin.cagr = function (start, end, years) {
    if (start <= 0 || years <= 0) return NaN;
    return Math.pow(end / start, 1 / years) - 1;
  };

  // ---------- DOM helpers ----------
  fin.$ = (sel, el) => (el || document).querySelector(sel);
  fin.$$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  fin.bind = function (form, handler) {
    const recompute = () => { try { handler(); } catch (e) { console.error(e); } };
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input', recompute);
      el.addEventListener('change', recompute);
    });
    recompute();
    return recompute;
  };

  fin.bar = function (label, value, max, kind, valueLabel) {
    const pct = max > 0 ? Math.min(100, (Math.max(0, value) / max) * 100) : 0;
    const fillClass = kind === 'brass' ? 'bar__fill--brass'
      : kind === 'plasma' ? 'bar__fill--plasma'
      : kind === 'good' ? 'bar__fill--good' : '';
    return `<div class="bar">
      <div class="bar__label">${label}</div>
      <div class="bar__track"><div class="bar__fill ${fillClass}" style="width:${pct}%"></div></div>
      <div class="bar__value">${valueLabel != null ? valueLabel : fin.money(value)}</div>
    </div>`;
  };

  // ---------- reveal observer ----------
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const reveals = document.querySelectorAll('.reveal');
      if (!reveals.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      reveals.forEach((el) => io.observe(el));
    });
  }

  global.Fin = fin;
})(typeof window !== 'undefined' ? window : globalThis);
