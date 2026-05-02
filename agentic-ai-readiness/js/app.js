/* From Sand to Superintelligence — v3 client app.
   Theme, progress, reveals, sticky header, TOC, reading position,
   search, sidenotes, audio narration, AI tutor, bookmarks, last-read. */
(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js-on');

  // =====================================================================
  // 1. THEME
  // =====================================================================
  const THEME_KEY = 'age.theme';
  const toggle = document.querySelector('[data-theme-toggle]');
  let currentTheme = localStorage.getItem(THEME_KEY) ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', currentTheme);
  const setIcon = () => {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML = currentTheme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.6M12 19.2v2.6M3.4 12H6M18 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.5 14.2A8.4 8.4 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7z"/></svg>';
  };
  setIcon();
  toggle && toggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', currentTheme);
    localStorage.setItem(THEME_KEY, currentTheme);
    setIcon();
  });

  // =====================================================================
  // 2. PROGRESS BAR + READING POSITION
  // =====================================================================
  const fill = document.querySelector('[data-progress-fill]');
  const slug = document.body.getAttribute('data-chapter-slug') || '';
  const POS_KEY = 'age.position.' + slug;
  const READ_KEY = 'age.read'; // JSON: { slug: pct, ... }
  const LASTKEY = 'age.last';

  const getRead = () => {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || '{}'); }
    catch (e) { return {}; }
  };
  const setRead = (m) => localStorage.setItem(READ_KEY, JSON.stringify(m));

  let lastSavedAt = 0;
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
    if (fill) fill.style.width = pct + '%';
    if (slug && Date.now() - lastSavedAt > 800) {
      lastSavedAt = Date.now();
      const r = getRead();
      r[slug] = Math.max(r[slug] || 0, pct);
      setRead(r);
      localStorage.setItem(POS_KEY, String(scrolled));
      localStorage.setItem(LASTKEY, slug);
    }
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // Restore reading position when arriving at a chapter
  if (slug && !location.hash) {
    const saved = parseInt(localStorage.getItem(POS_KEY) || '0', 10);
    if (saved > 100) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    }
  }

  // =====================================================================
  // 3. STICKY HEADER STATE
  // =====================================================================
  const header = document.querySelector('[data-header]');
  const updateHeader = () => {
    if (!header) return;
    header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // =====================================================================
  // 4. SCROLL REVEALS
  // =====================================================================
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // =====================================================================
  // 5. TOC ACTIVE LINK
  // =====================================================================
  const tocLinks = document.querySelectorAll('.ch-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tocLinks.forEach((a) => {
      const id = a.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (target) map.set(target, a);
    });
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const a = map.get(entry.target);
        if (!a) return;
        if (entry.isIntersecting) {
          tocLinks.forEach((x) => x.parentElement.removeAttribute('data-active'));
          a.parentElement.setAttribute('data-active', 'true');
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    map.forEach((_, target) => io2.observe(target));
  }

  // =====================================================================
  // 6. SIDENOTES — wrap first occurrence of each defined term in .prose
  // =====================================================================
  if (window.__SIDENOTES__ && document.querySelector('.prose')) {
    const proses = document.querySelectorAll('.prose');
    const used = new Set();
    const terms = Object.keys(window.__SIDENOTES__).sort((a, b) => b.length - a.length);
    proses.forEach((prose) => {
      // Walk text nodes; skip inside <a>, <code>, <pre>, headings
      const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          let p = n.parentNode;
          while (p && p !== prose) {
            const tag = p.nodeName;
            if (tag === 'A' || tag === 'CODE' || tag === 'PRE' || tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'BLOCKQUOTE' || (p.classList && p.classList.contains('aside'))) return NodeFilter.FILTER_REJECT;
            p = p.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((textNode) => {
        let txt = textNode.nodeValue;
        for (const term of terms) {
          if (used.has(term)) continue;
          const re = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
          const m = re.exec(txt);
          if (m) {
            const before = txt.slice(0, m.index);
            const matched = m[0];
            const after = txt.slice(m.index + matched.length);
            const span = document.createElement('span');
            span.className = 'sidenote';
            span.setAttribute('tabindex', '0');
            span.setAttribute('data-term', term);
            span.innerHTML = matched + '<span class="sidenote__bubble" role="tooltip">' +
              '<span class="sidenote__title">' + term + '</span>' +
              '<span class="sidenote__body">' + window.__SIDENOTES__[term] + '</span>' +
              '</span>';
            const parent = textNode.parentNode;
            if (before) parent.insertBefore(document.createTextNode(before), textNode);
            parent.insertBefore(span, textNode);
            if (after) {
              textNode.nodeValue = after;
              txt = after;
            } else {
              parent.removeChild(textNode);
              break;
            }
            used.add(term);
          }
        }
      });
    });
  }

  // =====================================================================
  // 7. SEARCH OVERLAY
  // =====================================================================
  const searchBtn = document.querySelector('[data-search-open]');
  const searchEl = document.querySelector('[data-search]');
  if (searchBtn && searchEl) {
    const input = searchEl.querySelector('[data-search-input]');
    const results = searchEl.querySelector('[data-search-results]');
    const closeBtn = searchEl.querySelector('[data-search-close]');
    const baseUrl = searchEl.getAttribute('data-base') || '';
    let index = null;
    let opening = false;

    const open = async () => {
      if (opening) return; opening = true;
      searchEl.setAttribute('aria-hidden', 'false');
      document.body.setAttribute('data-modal-open', 'true');
      setTimeout(() => input && input.focus(), 50);
      if (!index) {
        try {
          const res = await fetch(baseUrl + 'search-index.json');
          index = await res.json();
        } catch (e) { index = []; }
      }
      opening = false;
    };
    const close = () => {
      searchEl.setAttribute('aria-hidden', 'true');
      document.body.removeAttribute('data-modal-open');
    };
    searchBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    searchEl.addEventListener('click', (e) => { if (e.target === searchEl) close(); });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape' && searchEl.getAttribute('aria-hidden') === 'false') close();
    });

    const render = (query) => {
      if (!index) return;
      const q = query.trim().toLowerCase();
      if (!q || q.length < 2) { results.innerHTML = '<div class="search__hint">Type at least 2 characters. Try “EUV”, “warp”, “cache line”.</div>'; return; }
      const tokens = q.split(/\s+/);
      const scored = [];
      for (const r of index) {
        const haystack = (r.title + ' ' + (r.subtitle || '') + ' ' + r.text).toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (!haystack.includes(t)) { score = 0; break; }
          const inTitle = r.title.toLowerCase().includes(t);
          score += inTitle ? 10 : 1;
          // count occurrences (cap)
          const occ = (haystack.match(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          score += Math.min(occ, 5);
        }
        if (score > 0) scored.push({ r, score });
      }
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, 25);
      if (!top.length) { results.innerHTML = '<div class="search__hint">No matches.</div>'; return; }
      results.innerHTML = top.map(({ r }) => {
        const txt = r.text;
        const idx = txt.toLowerCase().indexOf(tokens[0]);
        let excerpt = '';
        if (idx >= 0) {
          const start = Math.max(0, idx - 50);
          const end = Math.min(txt.length, idx + 200);
          excerpt = (start > 0 ? '… ' : '') + txt.slice(start, end) + (end < txt.length ? ' …' : '');
          // Highlight tokens
          for (const t of tokens) {
            const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            excerpt = excerpt.replace(re, '<mark>$1</mark>');
          }
        } else {
          excerpt = (r.subtitle || '');
        }
        return '<a class="search__result" href="' + baseUrl + r.url + '">' +
          '<div class="search__num">' + r.num + '</div>' +
          '<div><div class="search__title">' + r.title + '</div>' +
          '<div class="search__excerpt">' + excerpt + '</div></div></a>';
      }).join('');
    };
    let renderTimer = null;
    input && input.addEventListener('input', (e) => {
      clearTimeout(renderTimer);
      renderTimer = setTimeout(() => render(e.target.value), 80);
    });
  }

  // =====================================================================
  // 8. AUDIO NARRATION (browser SpeechSynthesis)
  // =====================================================================
  const audioBtn = document.querySelector('[data-audio-toggle]');
  if (audioBtn && 'speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const state = { playing: false, paused: false, utter: null, queue: [], idx: 0 };
    const setLabel = () => {
      audioBtn.innerHTML = state.playing && !state.paused
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg> <span>Pause</span>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg> <span>Listen</span>';
    };
    setLabel();
    const collectChunks = () => {
      const els = document.querySelectorAll('.prose > p, .prose > h2, .prose > h3, .prose > blockquote, .ch-header__title, .ch-header__dek');
      const out = [];
      els.forEach((el) => {
        const t = el.textContent.trim();
        if (t && t.length > 4) out.push(t);
      });
      return out;
    };
    const playNext = () => {
      if (state.idx >= state.queue.length) { state.playing = false; setLabel(); return; }
      const u = new SpeechSynthesisUtterance(state.queue[state.idx]);
      u.rate = 1.0; u.pitch = 1.0;
      // Prefer a calm English voice if available
      const voices = synth.getVoices();
      const pref = voices.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Karen|Daniel|Allison/i.test(v.name)) ||
                   voices.find(v => /en[-_](US|GB)/i.test(v.lang)) || voices[0];
      if (pref) u.voice = pref;
      u.onend = () => { state.idx++; if (state.playing) playNext(); };
      state.utter = u;
      synth.speak(u);
    };
    audioBtn.addEventListener('click', () => {
      if (!state.playing) {
        state.queue = collectChunks();
        state.idx = 0;
        state.playing = true;
        setLabel();
        // Force voices to load
        if (synth.getVoices().length === 0) {
          synth.onvoiceschanged = playNext;
        } else playNext();
      } else if (state.paused) {
        synth.resume(); state.paused = false; setLabel();
      } else {
        synth.pause(); state.paused = true; setLabel();
      }
    });
    window.addEventListener('beforeunload', () => synth.cancel());
  } else if (audioBtn) {
    audioBtn.style.display = 'none';
  }

  // =====================================================================
  // 9. BOOKMARKS
  // =====================================================================
  const BMK_KEY = 'age.bookmarks';
  const getBmks = () => { try { return JSON.parse(localStorage.getItem(BMK_KEY) || '[]'); } catch (e) { return []; } };
  const setBmks = (a) => localStorage.setItem(BMK_KEY, JSON.stringify(a));
  const bmkBtn = document.querySelector('[data-bookmark]');
  if (bmkBtn && slug) {
    const refresh = () => {
      const bmks = getBmks();
      const on = bmks.includes(slug);
      bmkBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      bmkBtn.innerHTML = on
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v18l-6-4-6 4z"/></svg> <span>Saved</span>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12v18l-6-4-6 4z"/></svg> <span>Bookmark</span>';
    };
    refresh();
    bmkBtn.addEventListener('click', () => {
      let bmks = getBmks();
      if (bmks.includes(slug)) bmks = bmks.filter(s => s !== slug);
      else bmks.push(slug);
      setBmks(bmks); refresh();
    });
  }

  // =====================================================================
  // 10. COVER: continue-reading + chapter progress dots
  // =====================================================================
  const continueEl = document.querySelector('[data-continue]');
  if (continueEl) {
    const last = localStorage.getItem(LASTKEY);
    const read = getRead();
    if (last) {
      const meta = (window.__CHAPTERS_META__ || []).find(m => m.slug === last);
      if (meta) {
        const pct = Math.round(read[last] || 0);
        continueEl.innerHTML = '<a class="continue-card" href="chapters/' + last + '.html">' +
          '<div class="continue-card__eyebrow">Continue reading · ' + pct + '%</div>' +
          '<div class="continue-card__title">Chapter ' + meta.num + ' · ' + meta.title + '</div>' +
          '<div class="continue-card__sub">' + (meta.subtitle || '') + '</div>' +
          '</a>';
      }
    } else {
      continueEl.style.display = 'none';
    }
  }
  // Decorate lens cards with read percentages
  const read = getRead();
  document.querySelectorAll('.lens-card').forEach((card) => {
    const href = card.getAttribute('href') || '';
    const m = href.match(/chapters\/([^.]+)\.html/);
    if (m) {
      const pct = Math.round(read[m[1]] || 0);
      if (pct >= 90) card.setAttribute('data-read-status', 'done');
      else if (pct > 5) card.setAttribute('data-read-status', 'reading');
      if (pct > 5) {
        const ind = document.createElement('div');
        ind.className = 'lens-card__progress';
        ind.innerHTML = '<div class="lens-card__progress-fill" style="width:' + pct + '%"></div>';
        card.appendChild(ind);
      }
    }
  });

  // =====================================================================
  // 11. AI TUTOR (chat widget)
  // =====================================================================
  const tutorBtn = document.querySelector('[data-tutor-open]');
  const tutorEl = document.querySelector('[data-tutor]');
  if (tutorBtn && tutorEl) {
    const log = tutorEl.querySelector('[data-tutor-log]');
    const form = tutorEl.querySelector('[data-tutor-form]');
    const input = tutorEl.querySelector('[data-tutor-input]');
    const closeBtn = tutorEl.querySelector('[data-tutor-close]');
    const apiUrl = tutorEl.getAttribute('data-api') || 'https://text.pollinations.ai/openai';
    const chapterCtx = {
      chapterTitle: document.body.getAttribute('data-chapter-title') || '',
      chapterSlug: document.body.getAttribute('data-chapter-slug') || '',
    };
    const SYSTEM_PROMPT = "You are the in-book tutor for 'The Agentic Enterprise' " +
      "— a long-form executive field guide on agentic AI readiness. Topics include: agentic " +
      "AI architectures (single agent, multi-agent, swarms), orchestration frameworks, the " +
      "NIST AI RMF, EU AI Act, ISO/IEC 42001, OWASP Agentic AI Threats, MITRE ATLAS, OECD AI " +
      "Principles, Gartner/McKinsey/Deloitte maturity models, governance, use case selection, " +
      "integration with enterprise systems (SAP, Salesforce, ServiceNow), data readiness, " +
      "observability, evals, identity for agents, and roadmap design. Answer clearly and " +
      "concisely (3–6 sentences unless asked for depth). Plain language first, then precision. " +
      "Prefer concrete examples and named frameworks. If a question is outside scope, still " +
      "answer briefly but tie it back to enterprise readiness. Never refuse a reasonable " +
      "professional question. Do not use markdown headers; short paragraphs are fine.";
    const open = () => { tutorEl.setAttribute('aria-hidden', 'false'); document.body.setAttribute('data-modal-open', 'true'); setTimeout(() => input && input.focus(), 50); };
    const close = () => { tutorEl.setAttribute('aria-hidden', 'true'); document.body.removeAttribute('data-modal-open'); };
    tutorBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    tutorEl.addEventListener('click', (e) => { if (e.target === tutorEl) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tutorEl.getAttribute('aria-hidden') === 'false') close(); });

    const append = (role, text, isHtml) => {
      const wrap = document.createElement('div');
      wrap.className = 'tutor__msg tutor__msg--' + role;
      const lbl = document.createElement('div'); lbl.className = 'tutor__msg-role'; lbl.textContent = role === 'user' ? 'You' : 'Tutor';
      const body = document.createElement('div'); body.className = 'tutor__msg-body';
      if (isHtml) body.innerHTML = text; else body.textContent = text;
      wrap.appendChild(lbl); wrap.appendChild(body);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
      return body;
    };

    if (!log.children.length) {
      append('assistant', 'Hi — I\'m your tutor for The Agentic Enterprise. Ask me anything: how the NIST AI RMF applies to agentic AI, what an evals stack looks like, why the EU AI Act treats high-risk systems differently. I\'ll keep it short and clear.');
    }

    const history = [];
    // Pollinations only exposes one anonymous model right now, so retries
    // just hit the same endpoint again — transient 5xx / network blips clear
    // on the second or third try. We still keep this as a list in case more
    // free providers come online later.
    const ENDPOINTS = [
      { url: apiUrl, model: 'openai', label: 'primary' },
      { url: apiUrl, model: 'openai', label: 'retry' },
      { url: apiUrl, model: 'openai', label: 'retry' },
    ];

    const renderTyping = (el) => {
      el.innerHTML = '<span class="tutor__typing"><span></span><span></span><span></span></span>';
    };

    const renderError = (el, question, attemptIdx) => {
      const base = document.body.getAttribute('data-base') || '';
      const next = ENDPOINTS[(attemptIdx + 1) % ENDPOINTS.length];
      const wrap = document.createElement('div');
      wrap.className = 'tutor__error';
      const msg = document.createElement('em');
      msg.textContent = 'The tutor service didn\u2019t respond. You can retry, or use ';
      const searchHint = document.createElement('strong');
      searchHint.textContent = 'search (\u2318/Ctrl + K)';
      const gloss = document.createElement('a');
      gloss.href = base + 'chapters/glossary.html';
      gloss.textContent = 'glossary';
      msg.appendChild(searchHint);
      msg.appendChild(document.createTextNode(' or the '));
      msg.appendChild(gloss);
      msg.appendChild(document.createTextNode('.'));
      wrap.appendChild(msg);

      const actions = document.createElement('div');
      actions.className = 'tutor__error-actions';

      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'tutor__retry';
      retryBtn.textContent = 'Retry';
      retryBtn.addEventListener('click', () => {
        renderTyping(el);
        askTutor(question, el, attemptIdx + 1);
      });
      actions.appendChild(retryBtn);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'tutor__retry tutor__retry--ghost';
      editBtn.textContent = 'Edit question';
      editBtn.addEventListener('click', () => {
        input.value = question;
        input.focus();
        input.select && input.select();
        // Drop the failed turn from history so a fresh submit doesn\u2019t double-up.
        if (history.length && history[history.length - 1].role === 'user' && history[history.length - 1].content === question) {
          history.pop();
        }
        // Remove the user bubble and this error bubble so the log stays clean.
        const errorMsg = el.closest('.tutor__msg');
        const userMsg = errorMsg && errorMsg.previousElementSibling;
        if (userMsg && userMsg.classList.contains('tutor__msg--user')) userMsg.remove();
        if (errorMsg) errorMsg.remove();
      });
      actions.appendChild(editBtn);

      wrap.appendChild(actions);
      el.innerHTML = '';
      el.appendChild(wrap);
    };

    async function askTutor(question, placeholder, attemptIdx) {
      attemptIdx = attemptIdx || 0;
      const endpoint = ENDPOINTS[Math.min(attemptIdx, ENDPOINTS.length - 1)];
      const ctxNote = chapterCtx.chapterTitle
        ? `The reader is currently on the chapter: "${chapterCtx.chapterTitle}". Lean on that context when relevant.`
        : 'The reader is on the report index or front matter.';
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT + '\n\n' + ctxNote },
        ...history,
      ];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: endpoint.model, messages, referrer: 'agentic-ai-readiness' }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('http ' + res.status);
        const data = await res.json();
        let answer = '';
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
          answer = data.choices[0].message.content || '';
        } else if (typeof data === 'string') {
          answer = data;
        } else if (data && (data.reply || data.answer)) {
          answer = data.reply || data.answer;
        }
        answer = (answer || '').trim() || 'Sorry, I couldn\'t generate a response. Try rephrasing the question.';
        placeholder.textContent = answer;
        history.push({ role: 'assistant', content: answer });
      } catch (err) {
        renderError(placeholder, question, attemptIdx);
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      input.value = '';
      append('user', q);
      history.push({ role: 'user', content: q });
      const placeholder = append('assistant', '');
      renderTyping(placeholder);
      askTutor(q, placeholder, 0);
    });
  }
})();
