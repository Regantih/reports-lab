/* dashboard.js — personal study dashboard
   Reads localStorage state and renders heatmap, KPIs, drills due, stuck-on notes,
   and a single next-step nudge. */

(function () {
  'use strict';

  // --- Chapter manifest (kept in sync with build/template.py CHAPTERS) ---
  const CHAPTERS = [
    { num: '01', slug: '01-quartz', title: 'The Mineral' },
    { num: '02', slug: '02-fire-and-carbon', title: 'Fire and Carbon' },
    { num: '03', slug: '03-nine-nines', title: 'The Nine-Nines Problem' },
    { num: '04', slug: '04-czochralski', title: 'Growing a Perfect Crystal' },
    { num: '05', slug: '05-wafers', title: 'From Log to Mirror' },
    { num: '06', slug: '06-design', title: 'Designing the Impossible' },
    { num: '07', slug: '07-deposition', title: 'Painting with Atoms' },
    { num: '08', slug: '08-euv', title: 'Light at 13.5 Nanometers' },
    { num: '09', slug: '09-etch-and-implant', title: 'Carving and Doping' },
    { num: '10', slug: '10-interconnects', title: 'The Wiring Sky' },
    { num: '11', slug: '11-test-and-dice', title: 'Test and Dice' },
    { num: '12', slug: '12-cowos-hbm', title: 'CoWoS and the 2.5D Revolution' },
    { num: '13', slug: '13-vera-rubin-superchip', title: 'The Vera Rubin Superchip' },
    { num: '14', slug: '14-nvl72', title: 'The NVL72 Rack' },
    { num: '15', slug: '15-burn-in', title: 'Burn-In and Reliability' },
    { num: '16', slug: '16-ai-factory', title: 'The AI Factory' },
    { num: '17', slug: '17-electron-choice', title: "The Electron's Choice" },
    { num: '18', slug: '18-transistor-valve', title: 'The Transistor as a Valve' },
    { num: '19', slug: '19-switch-to-logic', title: 'From Switch to Logic' },
    { num: '20', slug: '20-adder-and-memory', title: 'Adders, Latches, Memory' },
    { num: '21', slug: '21-the-clock', title: 'The Clock' },
    { num: '22', slug: '22-fetch-decode-execute', title: 'Fetch, Decode, Execute' },
    { num: '23', slug: '23-isa', title: 'From Transistors to ISA' },
    { num: '24', slug: '24-memory-pyramid', title: "Memory's Pyramid" },
    { num: '25', slug: '25-boot', title: 'Boot' },
    { num: '26', slug: '26-os-conductor', title: 'The OS as Conductor' },
    { num: '27', slug: '27-compilers', title: 'The Translation Stack' },
    { num: '28', slug: '28-gpu-mind', title: "The GPU's Different Mind" },
    { num: '29', slug: '29-network-in-numbers', title: 'A Neural Network Lives in Numbers' },
    { num: '30', slug: '30-one-thought', title: 'A Thought, Token by Token' },
    { num: '31', slug: '31-second-wire', title: 'The Second Wire' },
    { num: '32', slug: '32-tokens-on-wire', title: 'Tokens on the Wire' },
    { num: '33', slug: '33-latency', title: 'Latency Is Cognition' },
    { num: '34', slug: '34-agents', title: 'Agents' },
    { num: '35', slug: '35-swarm', title: 'Swarm' },
    { num: '36', slug: '36-protocols', title: 'Protocols of Trust' },
    { num: '37', slug: '37-memory-commons', title: 'The Memory Commons' },
    { num: '38', slug: '38-browser-worker', title: 'The Browser Becomes the Worker' },
    { num: '39', slug: '39-markets-of-models', title: 'Markets of Models' },
    { num: '40', slug: '40-compounding', title: 'The Compounding' },
    { num: '41', slug: '41-value-reroutes', title: 'Where Value Reroutes' },
    { num: '42', slug: '42-loom', title: 'The Loom' },
  ];

  const DAY_MS = 24 * 60 * 60 * 1000;
  const STALE_DAYS = 14;

  // --- Safe localStorage readers ---
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (_e) {
      return fallback;
    }
  }

  function readLearn(slug) {
    return readJSON('fsts.learn.' + slug, {}) || {};
  }
  function readNotes(slug) {
    const v = readJSON('fsts.notes.' + slug, []);
    return Array.isArray(v) ? v : [];
  }
  function readSrs(slug) {
    return readJSON('fsts.srs.' + slug, {}) || {};
  }

  // --- Aggregations ---
  function buildState() {
    const now = Date.now();
    const items = CHAPTERS.map(function (ch) {
      const learn = readLearn(ch.slug);
      const ladder = (learn && learn.ladder) || {};
      const level = Number(ladder.self) || 0;
      const predict = (learn && learn.predict) || {};
      const last = Number(learn && learn.lastVisited) || 0;
      const daysSince = last ? Math.floor((now - last) / DAY_MS) : null;
      const stale = last > 0 && daysSince !== null && daysSince > STALE_DAYS;

      const notes = readNotes(ch.slug);
      const stuck = notes.filter(function (n) { return n && n.type === 'stuck'; });

      const srs = readSrs(ch.slug);
      const cards = (srs && Array.isArray(srs.cards)) ? srs.cards : [];
      const dueCards = cards.filter(function (c) {
        if (!c) return false;
        const due = Number(c.due);
        if (!due) return false;
        return due <= now;
      });

      return {
        ch: ch,
        level: level,
        last: last,
        daysSince: daysSince,
        stale: stale,
        predict: predict,
        notes: notes,
        stuck: stuck,
        cards: cards,
        dueCards: dueCards,
      };
    });

    // KPIs
    let started = 0, l3plus = 0, predMade = 0, predCorrect = 0, drillsDue = 0;
    items.forEach(function (it) {
      if (it.level >= 1) started++;
      if (it.level >= 3) l3plus++;
      const made = Number(it.predict && it.predict.made) || 0;
      const correct = Number(it.predict && it.predict.correct) || 0;
      predMade += made;
      predCorrect += correct;
      drillsDue += it.dueCards.length;
    });

    return {
      items: items,
      now: now,
      kpi: {
        started: started,
        l3plus: l3plus,
        predMade: predMade,
        predCorrect: predCorrect,
        drillsDue: drillsDue,
      },
    };
  }

  // --- Formatters ---
  function fmtRel(ms) {
    if (!ms) return 'never opened';
    const d = Math.floor((Date.now() - ms) / DAY_MS);
    if (d <= 0) return 'today';
    if (d === 1) return 'yesterday';
    if (d < 14) return d + ' days ago';
    if (d < 60) return Math.floor(d / 7) + ' weeks ago';
    return Math.floor(d / 30) + ' months ago';
  }
  function pct(num, den) {
    if (!den) return '—';
    return Math.round((num / den) * 100) + '%';
  }
  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // --- Render: heatmap ---
  function renderHeatmap(state, mount) {
    const html = state.items.map(function (it) {
      const ch = it.ch;
      const tipParts = [];
      tipParts.push('Ch ' + ch.num + ' · L' + it.level);
      tipParts.push(fmtRel(it.last));
      const tip = tipParts.join(' · ');
      const stale = it.stale ? ' dash-cell--stale' : '';
      return (
        '<a class="dash-cell' + stale + '" ' +
            'data-level="' + it.level + '" ' +
            'data-tip="' + escapeHTML(tip) + '" ' +
            'href="' + ch.slug + '.html" ' +
            'aria-label="Chapter ' + ch.num + ': ' + escapeHTML(ch.title) + ', level ' + it.level + '">' +
          '<div class="dash-cell__num">' + ch.num + '</div>' +
          '<div class="dash-cell__pip">L' + it.level + '</div>' +
          '<div class="dash-cell__title">' + escapeHTML(ch.title) + '</div>' +
        '</a>'
      );
    }).join('');
    mount.innerHTML = html;
  }

  // --- Render: KPIs ---
  function renderKpis(state, mount) {
    const k = state.kpi;
    const tiles = [
      { num: String(k.started), label: 'Chapters started' },
      { num: String(k.l3plus), label: 'Chapters at L3+' },
      {
        num: pct(k.predCorrect, k.predMade),
        label: 'Predict accuracy',
        sub: k.predMade ? (k.predCorrect + ' / ' + k.predMade) : null,
      },
      { num: String(k.drillsDue), label: 'Drills due today' },
    ];
    mount.innerHTML = tiles.map(function (t) {
      const sub = t.sub ? ' <em>' + escapeHTML(t.sub) + '</em>' : '';
      return (
        '<div class="dash-kpi">' +
          '<div class="dash-kpi__num">' + escapeHTML(t.num) + sub + '</div>' +
          '<div class="dash-kpi__label">' + escapeHTML(t.label) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  // --- Render: drills due list ---
  function renderDrills(state, mount) {
    const rows = state.items
      .filter(function (it) { return it.dueCards.length > 0; })
      .sort(function (a, b) { return b.dueCards.length - a.dueCards.length; });

    if (!rows.length) {
      mount.innerHTML =
        '<div class="dash-empty">No drills due — pick any chapter and review manually.</div>';
      return;
    }

    mount.innerHTML =
      '<div class="dash-list">' +
      rows.map(function (it) {
        const ch = it.ch;
        const n = it.dueCards.length;
        const href = ch.slug + '-drills.html';
        return (
          '<a class="dash-list__row" href="' + href + '">' +
            '<div class="dash-list__main">' +
              '<span class="dash-list__chap">Chapter ' + ch.num + '</span>' +
              '<span class="dash-list__title">' + escapeHTML(ch.title) + '</span>' +
            '</div>' +
            '<span class="dash-list__meta">' + n + ' due · Start review →</span>' +
          '</a>'
        );
      }).join('') +
      '</div>';
  }

  // --- Render: stuck-on list ---
  function renderStuck(state, mount) {
    const rows = [];
    state.items.forEach(function (it) {
      it.stuck.forEach(function (note) {
        rows.push({ it: it, note: note });
      });
    });
    rows.sort(function (a, b) {
      return Number(b.note.ts || 0) - Number(a.note.ts || 0);
    });

    if (!rows.length) {
      mount.innerHTML =
        '<div class="dash-empty">No stuck-on questions yet. Use the margin pen on any paragraph to flag one.</div>';
      return;
    }

    mount.innerHTML =
      '<div class="dash-list">' +
      rows.map(function (r) {
        const ch = r.it.ch;
        const body = String(r.note.body || '').slice(0, 80);
        const para = r.note.paraId ? ('#' + r.note.paraId) : '';
        const href = ch.slug + '.html' + para;
        return (
          '<a class="dash-list__row" href="' + href + '">' +
            '<div class="dash-list__main">' +
              '<span class="dash-list__chap">Chapter ' + ch.num + ' · ' + escapeHTML(ch.title) + '</span>' +
              '<span class="dash-list__snippet">' + escapeHTML(body || '(no text)') + '</span>' +
            '</div>' +
            '<span class="dash-list__meta">Open →</span>' +
          '</a>'
        );
      }).join('') +
      '</div>';
  }

  // --- Render: next-step nudge (first match wins) ---
  function chooseNudge(state) {
    // 1. Drills due
    const dueChapters = state.items.filter(function (it) { return it.dueCards.length > 0; });
    if (dueChapters.length > 0) {
      const total = dueChapters.reduce(function (a, it) { return a + it.dueCards.length; }, 0);
      const first = dueChapters[0];
      const link = '<a href="' + first.ch.slug + '-drills.html">Ch ' + first.ch.num +
                   ' — ' + escapeHTML(first.ch.title) + '</a>';
      return total + ' drill ' + (total === 1 ? 'card is' : 'cards are') +
             ' due across ' + dueChapters.length +
             (dueChapters.length === 1 ? ' chapter' : ' chapters') +
             '. Start with ' + link + '.';
    }

    // 2. Earlier L1 with later L3+
    const items = state.items;
    let l1Index = -1, l3Index = -1;
    for (let i = 0; i < items.length; i++) {
      if (l1Index === -1 && items[i].level === 1) l1Index = i;
    }
    for (let j = items.length - 1; j >= 0; j--) {
      if (items[j].level >= 3) { l3Index = j; break; }
    }
    if (l1Index !== -1 && l3Index !== -1 && l1Index < l3Index) {
      const earlier = items[l1Index].ch;
      const later = items[l3Index].ch;
      const link = '<a href="' + earlier.slug + '.html">Ch ' + earlier.num +
                   ' — ' + escapeHTML(earlier.title) + '</a>';
      return "You're at L1 on " + link +
             ' but L3 on Ch ' + later.num + ' — ' + escapeHTML(later.title) +
             '. The earlier chapter is a prerequisite — re-read it.';
    }

    // 3. Stale chapter (not visited in 14+ days, but has been visited at all)
    const stale = items
      .filter(function (it) { return it.last > 0 && it.daysSince !== null && it.daysSince > STALE_DAYS; })
      .sort(function (a, b) { return b.daysSince - a.daysSince; });
    if (stale.length) {
      const it = stale[0];
      const link = '<a href="' + it.ch.slug + '.html">Ch ' + it.ch.num +
                   ' — ' + escapeHTML(it.ch.title) + '</a>';
      return "You haven't opened " + link + ' in ' + it.daysSince + ' days — refresh it.';
    }

    // 4. Default
    return 'Pick any chapter — your map is balanced.';
  }

  function renderNudge(state, mount) {
    mount.innerHTML =
      '<div class="dash-nudge__label">Next step</div>' +
      '<div class="dash-nudge__body">' + chooseNudge(state) + '</div>';
  }

  // --- Boot ---
  function boot() {
    const state = buildState();

    const nudge = document.querySelector('[data-dash-nudge]');
    const kpis = document.querySelector('[data-dash-kpis]');
    const heat = document.querySelector('[data-dash-heatmap]');
    const drills = document.querySelector('[data-dash-drills]');
    const stuck = document.querySelector('[data-dash-stuck]');

    if (nudge) renderNudge(state, nudge);
    if (kpis) renderKpis(state, kpis);
    if (heat) renderHeatmap(state, heat);
    if (drills) renderDrills(state, drills);
    if (stuck) renderStuck(state, stuck);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
