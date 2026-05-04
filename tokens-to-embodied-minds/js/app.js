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
  const THEME_KEY = 'fsts.theme';
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
  const POS_KEY = 'fsts.position.' + slug;
  const READ_KEY = 'fsts.read'; // JSON: { slug: pct, ... }
  const LASTKEY = 'fsts.last';

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
  const BMK_KEY = 'fsts.bookmarks';
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
    const SYSTEM_PROMPT = "You are the in-book tutor for 'From Sand to Superintelligence' " +
      "— a long-form essay tracing computing from doped silicon up through transistors, logic, " +
      "clocks, memory, ISAs, OSes, networks, the web, GPUs, neural nets, transformers, LLMs, " +
      "agents, MCP/A2A, RAG, and the value chain of intelligence. Answer questions clearly and " +
      "concisely (3-6 sentences unless the user asks for depth). Use plain language first, then " +
      "add precision. Prefer concrete examples. If a question is outside the book's scope, still " +
      "answer briefly but note the connection back to the book. Never refuse a reasonable " +
      "technical question. Do not use markdown headers; short paragraphs are fine.";
    const open = () => { tutorEl.setAttribute('aria-hidden', 'false'); document.body.setAttribute('data-modal-open', 'true'); setTimeout(() => input && input.focus(), 50); };
    const close = () => { tutorEl.setAttribute('aria-hidden', 'true'); document.body.removeAttribute('data-modal-open'); };
    tutorBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    tutorEl.addEventListener('click', (e) => { if (e.target === tutorEl) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tutorEl.getAttribute('aria-hidden') === 'false') close(); });

    // Tiny safe markdown renderer for assistant turns. Escapes HTML first,
    // then promotes a small whitelist: **bold**, *italic*, `code`, blank-line
    // paragraphs, single-line breaks. We never inject raw HTML from the LLM.
    const escapeHtml = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const renderMd = (raw) => {
      let s = escapeHtml(String(raw || ''));
      // Strip leading markdown headers (we asked the model not to use them, but
      // some still slip through). Keep the text, drop the # marks.
      s = s.replace(/^\s*#{1,6}\s+/gm, '');
      // Inline code first so ** inside it is not interpreted.
      s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
      // Bold (**) before italic (*) so we do not eat the inner pair.
      s = s.replace(/\*\*([^*\n][^*]*?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/(^|[^*])\*([^*\n][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
      // Paragraphs on blank lines, single newlines as line breaks.
      const blocks = s.split(/\n{2,}/).map(b => '<p>' + b.replace(/\n/g, '<br>') + '</p>').join('');
      return blocks;
    };
    const setBody = (body, text) => {
      // Used for assistant turns and streaming updates. Renders markdown safely.
      body.innerHTML = renderMd(text);
    };

    const append = (role, text, isHtml) => {
      const wrap = document.createElement('div');
      wrap.className = 'tutor__msg tutor__msg--' + role;
      const lbl = document.createElement('div'); lbl.className = 'tutor__msg-role'; lbl.textContent = role === 'user' ? 'You' : 'Tutor';
      const body = document.createElement('div'); body.className = 'tutor__msg-body';
      if (isHtml) {
        body.innerHTML = text;
      } else if (role === 'assistant') {
        setBody(body, text);
      } else {
        body.textContent = text;
      }
      wrap.appendChild(lbl); wrap.appendChild(body);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
      return body;
    };

    if (!log.children.length) {
      append('assistant', 'Hi — I\'m your tutor for this book. Ask me anything: how a MOSFET works, why chips need clocks, what attention does in a transformer. I\'ll keep it short and clear.');
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

    // Pollinations occasionally injects ad/promo content into responses
    // ("Support Pollinations.AI", "\u{1F33C} Ad \u{1F33C}", etc.) and the gpt-oss-20b
    // model sometimes leaks reasoning-style preambles when reasoning_effort
    // isn't honoured. Sanitize the reply before showing it to the user.
    const AD_MARKERS = [
      /---\s*\n+\**\s*Support Pollinations[\s\S]*$/i,
      /\**\s*Support Pollinations\.AI[\s\S]*$/i,
      /\u{1F33C}\s*\**\s*Ad\s*\**\s*\u{1F33C}[\s\S]*$/iu,
      /\[Sponsored[\s\S]*$/i,
    ];
    const REASONING_PREFIXES = [
      // "They said X. So correct. Missing: ..." — raw scratchpad voice.
      // Strip up to a few sentences of self-talk before real content begins.
      /^(They|The user|User|We|I)\s+(said|wrote|answered|responded|need|should|must)[^.]*\.\s+/i,
      /^So\s+(I|we|the user)\s+(should|need|must|will)[^.]*\.\s+/i,
      /^So\s+(correct|right|wrong)[^.]*\.\s+/i,
      /^Got it[,.]\s+/i,
      /^Let me\s+(think|see|consider)[^.]*\.\s+/i,
      /^Missing:\s*[^.]*\.\s+/i,
    ];
    // Heuristic: a reply is "reasoning-trace" if it talks about the user in
    // third person or grades itself ("so correct", "missing: ..."). These are
    // fundamentally unfit for direct display — reject entirely so we retry.
    function looksLikeReasoningTrace(s) {
      const t = s.toLowerCase();
      // Phrases that only appear in scratchpad/grading notes, never in a
      // tutor's direct reply to the student.
      const tells = [
        /\bthey said\b/,
        /\bthe user (said|wrote|answered)/,
        /\bso (correct|right|wrong)\b/,
        /\bmissing:\s/,
        /\bso i should\b/,
        /\bwe should (mention|note|add)\b/,
      ];
      let hits = 0;
      for (const re of tells) if (re.test(t)) hits++;
      // Two or more tells = almost certainly a leaked reasoning trace.
      return hits >= 2;
    }
    function sanitizeTutorReply(raw) {
      let s = String(raw || '');
      // Strip Pollinations ad blocks anywhere they appear (usually trailing).
      for (const re of AD_MARKERS) s = s.replace(re, '');
      // Strip raw reasoning-trace prefixes — iterate so consecutive
      // self-talk sentences ("They said X. So I should explain. Missing: Y.")
      // all get stripped, not just the first one.
      let changed = true, guard = 0;
      while (changed && guard < 6) {
        changed = false; guard++;
        for (const re of REASONING_PREFIXES) {
          const next = s.replace(re, '');
          if (next !== s) { s = next; changed = true; }
        }
        s = s.replace(/^\s+/, '');
      }
      // Collapse runs of blank lines and stray hr lines.
      s = s.replace(/\n{3,}/g, '\n\n').replace(/^\s*---+\s*$/gm, '').trim();
      // If after sanitizing the reply still reads like a reasoning trace,
      // discard it — caller will treat as empty and trigger a retry.
      if (s && looksLikeReasoningTrace(s)) return '';
      return s;
    }

    const renderError = (el, question, attemptIdx, kind) => {
      const base = document.body.getAttribute('data-base') || '';
      const next = ENDPOINTS[(attemptIdx + 1) % ENDPOINTS.length];
      const wrap = document.createElement('div');
      wrap.className = 'tutor__error';
      const msg = document.createElement('em');
      // Lead text varies by failure kind so the user knows whether to retry
      // or rephrase. "empty" = service responded with no text; "refused" =
      // content filter; "network" = timeout/5xx/abort.
      let lead;
      if (kind === 'refused') {
        lead = 'The tutor declined to answer that. Try rephrasing, or use ';
      } else if (kind === 'empty') {
        lead = 'The tutor came back empty. Retry, edit your question, or use ';
      } else {
        lead = 'The tutor service didn\u2019t respond. You can retry, or use ';
      }
      msg.textContent = lead;
      const searchHint = document.createElement('strong');
      searchHint.textContent = 'search (\u2318/Ctrl + K)';
      const gloss = document.createElement('a');
      gloss.href = base + 'glossary.html';
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
        : 'The reader is on the book index or front matter.';
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT + '\n\n' + ctxNote },
        ...history,
      ];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: endpoint.model,
            messages,
            // Pollinations only exposes gpt-oss-20b (a reasoning model) on the
            // free tier. 'low' keeps content populated instead of going into
            // long reasoning_content traces that leak scratchpad voice.
            reasoning_effort: 'low',
            referrer: 'sand-to-superintelligence',
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('http ' + res.status);
        const data = await res.json();
        let answer = '';
        let finishReason = '';
        if (data && data.choices && data.choices[0]) {
          const choice = data.choices[0];
          finishReason = choice.finish_reason || '';
          // Only read message.content. NEVER fall back to reasoning_content —
          // it's third-person scratchpad ("they said\u2026 so correct") not a reply.
          if (choice.message) answer = choice.message.content || '';
        } else if (typeof data === 'string') {
          answer = data;
        } else if (data && (data.reply || data.answer)) {
          answer = data.reply || data.answer;
        }
        answer = sanitizeTutorReply(answer);
        if (!answer) {
          // Empty content — retry silently up to 2 times before surfacing.
          if (attemptIdx < ENDPOINTS.length - 1) {
            await new Promise(r => setTimeout(r, 600 * (attemptIdx + 1)));
            return askTutor(question, placeholder, attemptIdx + 1);
          }
          renderError(placeholder, question, attemptIdx, finishReason === 'content_filter' ? 'refused' : 'empty');
          return;
        }
        setBody(placeholder, answer);
        history.push({ role: 'assistant', content: answer });
      } catch (err) {
        renderError(placeholder, question, attemptIdx, 'network');
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

    // ----- Public API for Learn Mode (Quiz mode rides on this module) -----
    let quizSystemOverride = null;
    let quizBanner = null;
    let quizCallbacks = null; // { onVerdict: (level, rationale) => void }
    let quizVerdictSlot = null;
    const setQuizMode = (override, label, callbacks) => {
      quizSystemOverride = override;
      quizCallbacks = callbacks || null;
      // Reset the chat history so the quiz starts clean
      history.length = 0;
      log.innerHTML = '';
      // Render a banner inside the modal
      if (quizBanner) quizBanner.remove();
      quizBanner = document.createElement('div');
      quizBanner.className = 'tutor__quiz-banner';

      // Top row: label + actions (Rate me, Exit)
      const top = document.createElement('div');
      top.className = 'tutor__quiz-banner-top';
      const lab = document.createElement('span');
      lab.className = 'tutor__quiz-banner-label';
      lab.textContent = label || 'Quiz mode';
      const actions = document.createElement('div');
      actions.className = 'tutor__quiz-banner-actions';
      const rate = document.createElement('button');
      rate.type = 'button';
      rate.className = 'tutor__quiz-banner-rate';
      rate.textContent = 'Rate me';
      rate.title = 'End the quiz and get a calibrated L1\u2013L4 verdict';
      rate.addEventListener('click', () => {
        // Send a synthetic user turn asking for the verdict.
        const placeholder = append('assistant', '');
        renderTyping(placeholder);
        history.push({ role: 'user', content: 'Rate me now. End the quiz and give my L1\u2013L4 verdict in the required format.' });
        askTutor('Rate me now.', placeholder, 0);
      });
      const exit = document.createElement('button');
      exit.type = 'button';
      exit.className = 'tutor__quiz-banner-exit';
      exit.textContent = 'Exit quiz';
      exit.addEventListener('click', () => {
        quizSystemOverride = null;
        quizCallbacks = null;
        if (quizBanner) { quizBanner.remove(); quizBanner = null; }
        quizVerdictSlot = null;
        window.__FSTS_TUTOR_SYSTEM_OVERRIDE__ = null;
        history.length = 0;
        log.innerHTML = '';
        append('assistant', 'Back to normal tutor mode. Ask me anything.');
      });
      actions.appendChild(rate);
      actions.appendChild(exit);
      top.appendChild(lab);
      top.appendChild(actions);
      quizBanner.appendChild(top);

      // Verdict slot (initially hidden, populated when **VERDICT: Lx ...** is detected)
      quizVerdictSlot = document.createElement('div');
      quizVerdictSlot.className = 'tutor__quiz-verdict';
      quizVerdictSlot.hidden = true;
      quizBanner.appendChild(quizVerdictSlot);

      log.parentNode.insertBefore(quizBanner, log);
      window.__FSTS_TUTOR_SYSTEM_OVERRIDE__ = override;
    };

    // Verdict parser: looks for **VERDICT: L# Label** anywhere in an assistant turn.
    const VERDICT_RE = /VERDICT\s*:\s*L\s*([1-4])\s+([A-Za-z\-]+(?:\s+[A-Za-z\-]+)?)/i;
    const detectAndShowVerdict = (answer) => {
      if (!quizBanner || !quizVerdictSlot) return;
      const m = String(answer || '').match(VERDICT_RE);
      if (!m) return;
      const level = parseInt(m[1], 10);
      const label = m[2].trim();
      // Render the verdict chip with a Save button.
      quizVerdictSlot.hidden = false;
      quizVerdictSlot.innerHTML = '';
      const chip = document.createElement('div');
      chip.className = 'tutor__quiz-verdict-chip';
      chip.setAttribute('data-level', String(level));
      const dot = document.createElement('span');
      dot.className = 'tutor__quiz-verdict-dot';
      dot.textContent = 'L' + level;
      const text = document.createElement('span');
      text.className = 'tutor__quiz-verdict-text';
      text.textContent = label;
      chip.appendChild(dot);
      chip.appendChild(text);
      const save = document.createElement('button');
      save.type = 'button';
      save.className = 'tutor__quiz-verdict-save';
      save.textContent = 'Save as my level';
      save.addEventListener('click', () => {
        if (quizCallbacks && typeof quizCallbacks.onVerdict === 'function') {
          quizCallbacks.onVerdict(level, label);
        }
        save.textContent = 'Saved \u2713';
        save.disabled = true;
      });
      quizVerdictSlot.appendChild(chip);
      quizVerdictSlot.appendChild(save);
    };
    // Make askTutor read the override at call time:
    const _origAsk = askTutor;
    // (askTutor already references SYSTEM_PROMPT; the simplest hook is to
    //  rebuild the system message via a getter on window. We replace the
    //  function with one that swaps in the override when present.)
    // Track whether we have already tried a corrective shape-retry on the
    // current turn, to avoid infinite retries when the model repeatedly
    // omits the **Feedback:** block.
    let attemptRetriedForShape = false;
    // eslint-disable-next-line no-func-assign
    askTutor = async function(question, placeholder, attemptIdx) {
      attemptIdx = attemptIdx || 0;
      if (attemptIdx === 0) attemptRetriedForShape = false;
      const endpoint = ENDPOINTS[Math.min(attemptIdx, ENDPOINTS.length - 1)];
      const baseSystem = window.__FSTS_TUTOR_SYSTEM_OVERRIDE__ || SYSTEM_PROMPT;
      const ctxNote = chapterCtx.chapterTitle
        ? `The reader is currently on the chapter: "${chapterCtx.chapterTitle}". Lean on that context when relevant.`
        : 'The reader is on the book index or front matter.';
      const messages = [
        { role: 'system', content: baseSystem + '\n\n' + ctxNote },
        ...history,
      ];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: endpoint.model,
            messages,
            reasoning_effort: 'low',
            referrer: 'sand-to-superintelligence',
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('http ' + res.status);
        const data = await res.json();
        let answer = '';
        let finishReason = '';
        if (data && data.choices && data.choices[0]) {
          const choice = data.choices[0];
          finishReason = choice.finish_reason || '';
          if (choice.message) answer = choice.message.content || '';
        } else if (typeof data === 'string') {
          answer = data;
        } else if (data && (data.reply || data.answer)) {
          answer = data.reply || data.answer;
        }
        answer = sanitizeTutorReply(answer);
        if (!answer) {
          if (attemptIdx < ENDPOINTS.length - 1) {
            await new Promise(r => setTimeout(r, 600 * (attemptIdx + 1)));
            return askTutor(question, placeholder, attemptIdx + 1);
          }
          renderError(placeholder, question, attemptIdx, finishReason === 'content_filter' ? 'refused' : 'empty');
          return;
        }
        // Quiz-mode shape check: after the reader has given at least one
        // answer, every reply MUST contain a **Feedback:** block. The
        // gpt-oss-20b model occasionally drops the assessment and jumps
        // straight to the next question. If we detect that, force one
        // corrective retry with a system nudge before showing the reply.
        if (quizSystemOverride && !attemptRetriedForShape) {
          // history user-turn count; the seed pushes one synthetic
          // "Begin the quiz" turn, so the reader\u2019s first real answer makes it 2.
          const userTurns = history.filter(m => m.role === 'user').length;
          const looksLikeVerdict = /VERDICT\s*:\s*L\s*[1-4]/i.test(answer);
          const hasFeedback = /\*\*\s*Feedback\s*:/i.test(answer);
          if (userTurns >= 2 && !hasFeedback && !looksLikeVerdict) {
            attemptRetriedForShape = true;
            const corrective = {
              role: 'system',
              content: 'Your previous draft was missing the required **Feedback:** ' +
                'block. Rewrite your reply to start with **Feedback:** assessing ' +
                'the reader\u2019s last answer (Correct / Partly right / Not quite, ' +
                'in your own words, second person), THEN the next ' +
                '**Q\u2099 \u00b7 type:** question. Both blocks are mandatory.',
            };
            history.push(corrective);
            await new Promise(r => setTimeout(r, 300));
            const result = await askTutor(question, placeholder, attemptIdx);
            const idx = history.indexOf(corrective);
            if (idx >= 0) history.splice(idx, 1);
            return result;
          }
        }
        setBody(placeholder, answer);
        history.push({ role: 'assistant', content: answer });
        // If we are in quiz mode, scan for a verdict line.
        if (quizSystemOverride) detectAndShowVerdict(answer);
      } catch (err) {
        renderError(placeholder, question, attemptIdx, 'network');
      }
    };

    const seedTurn = (text) => {
      // Inject an initial assistant turn (the quiz's first question).
      const placeholder = append('assistant', '');
      renderTyping(placeholder);
      askTutor(text || 'Begin the quiz now. Ask the first question only \u2014 do not list all five upfront.', placeholder, 0);
      // We push the user-visible "Begin the quiz" as an internal user turn so
      // the model knows the conversation has started.
      history.push({ role: 'user', content: 'Begin the quiz. Ask one question at a time.' });
    };

    window.__FSTS_TUTOR__ = { open, close, setQuizMode, seedTurn };
  }
})();


// =====================================================================
// LEARN MODE  (Phase 0 — prototype on Ch 30 only)
// Activates only on pages with [data-learn-root]. State persists per slug.
// =====================================================================
(function () {
  const root = document.querySelector('[data-learn-root]');
  if (!root) return;
  const slug = root.getAttribute('data-learn-root');
  const KEY = 'fsts.learn.' + slug;

  // ----- State helpers -----
  function loadState() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore quota */ }
  }
  let state = loadState();
  if (!state.predict) state.predict = null;
  if (!state.retrieval) state.retrieval = {};
  if (!state.ladder) state.ladder = { self: null, checks: {} };
  if (!state.quiz) state.quiz = null;

  // ===== Predict-before-reveal =====
  const predictEl = document.querySelector('[data-predict]');
  if (predictEl) {
    const answerKey = predictEl.getAttribute('data-answer-key');
    const form = predictEl.querySelector('[data-predict-form]');
    const revealBtn = predictEl.querySelector('[data-predict-reveal]');
    const answerEl = predictEl.querySelector('[data-predict-answer]');
    const statusEl = predictEl.querySelector('[data-predict-status]');
    const rateBtns = predictEl.querySelectorAll('[data-rate]');

    // Restore prior selection + reveal state if any
    if (state.predict && state.predict.choice) {
      const radio = form.querySelector(`input[value="${state.predict.choice}"]`);
      if (radio) radio.checked = true;
      revealBtn.disabled = false;
      if (state.predict.revealed) {
        answerEl.hidden = false;
        statusEl.textContent = state.predict.choice === answerKey ? 'You picked the right OOM.' : 'See answer below.';
      }
      if (state.predict.rating) {
        const btn = predictEl.querySelector(`[data-rate="${state.predict.rating}"]`);
        if (btn) btn.setAttribute('aria-pressed', 'true');
      }
    }

    form.addEventListener('change', (e) => {
      const sel = form.querySelector('input:checked');
      if (sel) {
        revealBtn.disabled = false;
        state.predict = Object.assign({}, state.predict, { choice: sel.value, ts: Date.now() });
        saveState(state);
      }
    });
    revealBtn.addEventListener('click', () => {
      const sel = form.querySelector('input:checked');
      if (!sel) return;
      answerEl.hidden = false;
      statusEl.textContent = sel.value === answerKey ? 'You picked the right OOM.' : 'See answer below.';
      state.predict = Object.assign({}, state.predict, { revealed: true });
      saveState(state);
    });
    rateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rateBtns.forEach(b => b.removeAttribute('aria-pressed'));
        btn.setAttribute('aria-pressed', 'true');
        state.predict = Object.assign({}, state.predict, { rating: btn.getAttribute('data-rate') });
        saveState(state);
      });
    });
  }

  // ===== Retrieval prompts =====
  document.querySelectorAll('[data-retrieval-item]').forEach(item => {
    const id = item.getAttribute('data-id');
    const revealBtn = item.querySelector('[data-retrieval-reveal]');
    const answerEl = item.querySelector('[data-retrieval-answer]');
    const rateBtns = item.querySelectorAll('[data-rate]');
    const prior = state.retrieval[id];
    if (prior && prior.revealed) {
      answerEl.hidden = false;
      revealBtn.disabled = true;
    }
    if (prior && prior.rating) {
      const b = item.querySelector(`[data-rate="${prior.rating}"]`);
      if (b) b.setAttribute('aria-pressed', 'true');
    }
    revealBtn.addEventListener('click', () => {
      answerEl.hidden = false;
      revealBtn.disabled = true;
      state.retrieval[id] = Object.assign({}, state.retrieval[id], { revealed: true });
      saveState(state);
    });
    rateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rateBtns.forEach(b => b.removeAttribute('aria-pressed'));
        btn.setAttribute('aria-pressed', 'true');
        state.retrieval[id] = Object.assign({}, state.retrieval[id], { rating: btn.getAttribute('data-rate'), ts: Date.now() });
        saveState(state);
      });
    });
  });

  // ===== Maturity ladder =====
  // Hoisted setter so Quiz Mode (below) can update the ladder when the user
  // accepts an LLM verdict.
  let setLadderSelf = null;
  const ladderEl = document.querySelector('[data-ladder]');
  if (ladderEl) {
    const toggle = ladderEl.querySelector('[data-ladder-toggle]');
    const panel = ladderEl.querySelector('[data-ladder-panel]');
    const dots = ladderEl.querySelectorAll('[data-ladder-set]');
    const checks = ladderEl.querySelectorAll('[data-ladder-check]');

    function paintSelf(level) {
      dots.forEach(d => {
        const n = parseInt(d.getAttribute('data-ladder-set'), 10);
        if (n === level) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
    }
    function paintChecks() {
      checks.forEach(cb => {
        const n = cb.getAttribute('data-ladder-check');
        const passed = !!state.ladder.checks[n];
        cb.checked = passed;
        const row = cb.closest('.ladder__row');
        if (row) row.setAttribute('data-passed', passed ? 'true' : 'false');
      });
    }

    if (state.ladder.self) paintSelf(state.ladder.self);
    paintChecks();

    // Expose a setter for Quiz Mode\u2019s verdict-save action.
    setLadderSelf = (level) => {
      state.ladder.self = level;
      saveState(state);
      paintSelf(level);
      // Pop the panel open so the user sees the new level locked in.
      if (panel.hidden) {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    toggle.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    dots.forEach(d => {
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        const n = parseInt(d.getAttribute('data-ladder-set'), 10);
        state.ladder.self = (state.ladder.self === n) ? null : n;
        saveState(state);
        paintSelf(state.ladder.self);
      });
    });
    checks.forEach(cb => {
      cb.addEventListener('change', () => {
        const n = cb.getAttribute('data-ladder-check');
        state.ladder.checks[n] = !!cb.checked;
        saveState(state);
        paintChecks();
      });
    });
  }

  // ===== Quiz Mode (rides on existing tutor) =====
  const quizBtn = document.querySelector('[data-quiz-open]');
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      const tutor = window.__FSTS_TUTOR__;
      if (!tutor || !tutor.setQuizMode) {
        // Tutor module did not initialise (no [data-tutor] on page). Fail soft.
        alert('Tutor is not available on this page.');
        return;
      }
      const chapterTitle = document.body.getAttribute('data-chapter-title') || 'this chapter';
      const slug = document.querySelector('[data-learn-root]');
      const slugId = slug ? slug.getAttribute('data-learn-root') : '';

      // Per-chapter anchors keep the LLM tethered to what the chapter actually
      // covers. Without this, models hallucinate \u201cprimary figure referenced\u201d
      // style questions that have nothing to do with the content.
      const ANCHORS = {
        '30-one-thought':
          'CHAPTER ANCHORS \u2014 the chapter walks one prompt through one inference on a frontier model. ' +
          'The spine is: tokenize (tiktoken / SentencePiece) \u2192 embedding lookup (vocab \u00d7 hidden_dim, ' +
          'e.g. ~100k \u00d7 ~16k) \u2192 ~80 transformer blocks, each: LayerNorm \u2192 Q/K/V projections \u2192 ' +
          'QK\u1d40 attention \u2192 softmax \u2192 weighted sum of V \u2192 output projection \u2192 MLP \u2192 residual ' +
          '\u2192 unembedding (hidden_dim \u00d7 vocab) \u2192 logits \u2192 softmax \u2192 sample (argmax / top-k / ' +
          'top-p / temperature). KV caching stores past K and V so only the new token does a fresh forward ' +
          'pass instead of recomputing the prefix. Numerical anchors: ~10\u00b9\u2075 multiplications per ' +
          'generated token, ~50 ms wall time per token, ~1 J energy per token on a frontier system. ' +
          'Author quote: \u201ca quadrillion multiplications happen in roughly the time it takes you to blink.\u201d ' +
          'Steel-man territory: beam search vs sampling, MoE routing efficiency, speculative decoding, ' +
          'KV-cache compression. STAY ON THESE TOPICS. Do not invent characters, authors, or anecdotes ' +
          'that are not part of this content.',
      };
      const anchorBlock = ANCHORS[slugId] || '';

      const QUIZ_PROMPT =
        'You are quizzing the reader on the chapter "' + chapterTitle + '" from ' +
        '\u201cFrom Sand to Superintelligence\u201d.\n\n' +
        anchorBlock + (anchorBlock ? '\n\n' : '') +
        'EVERY REPLY (after the reader\u2019s first answer) MUST USE THIS EXACT TEMPLATE:\n\n' +
        '**Feedback:** <verdict on the answer in 1\u20132 sentences. Start with \u201cCorrect\u201d, ' +
        '\u201cPartly right\u201d, or \u201cNot quite\u201d. State the right answer in your own words ' +
        'and name what they got right or missed. Speak to them as \u201cyou\u201d.>\n\n' +
        '**Q\u2099 \u00b7 <type>:** <next question>\n\n' +
        'where <type> is one of: factual, numerical, conceptual, synthetic, steel-man.\n' +
        'Both blocks are mandatory. A reply with only the next question is a failure. ' +
        'A reply with only feedback is also a failure (unless the reader asked to be rated).\n\n' +
        'RULES:\n' +
        '\u2022 Ask ONE question at a time. The reader controls when the quiz ends \u2014 ' +
        'they will say \u201crate me\u201d or \u201cgive my level\u201d when they want a verdict. ' +
        'Until then, keep asking another question after each answer. Do NOT cap at any number.\n' +
        '\u2022 Every question must be answerable from the chapter content above. Do NOT ask ' +
        'about people, dates, or anecdotes unless they appear in the anchors.\n' +
        '\u2022 Rotate question types. Do not repeat the same type twice in a row. ' +
        'Increase difficulty as the conversation goes.\n' +
        '\u2022 Be calibrated, not encouraging. No \u201cgreat job\u201d, no smileys. If they are wrong, ' +
        'say so plainly and explain.\n' +
        '\u2022 When the reader asks for a rating (\u201crate me\u201d, \u201cmy level\u201d, \u201chow did I do\u201d, ' +
        '\u201cend the quiz\u201d, etc.), STOP asking new questions and give exactly this format: ' +
        'a one-line verdict on its own line: **VERDICT: L1 Curious** (or L2 Practitioner / ' +
        'L3 Expert / L4 Research-grade), then a 3-sentence rationale citing specific things ' +
        'they said or missed. The verdict line must be exactly that format \u2014 it is parsed ' +
        'by the UI to offer them a save action. Do not give a verdict before they ask.\n' +
        '\u2022 No markdown headers (#). Bold only the **Feedback:** label, the **Q\u2099 \u00b7 type:** label, ' +
        'and the **VERDICT:** line. Keep prose tight.\n' +
        '\u2022 VOICE: speak directly to the reader in second person ("you"). NEVER write ' +
        'in third person about them ("they said\u2026", "the user wrote\u2026"). NEVER write ' +
        'self-talk or grading notes ("so correct", "missing: \u2026", "so I should\u2026"). ' +
        'These read as raw scratchpad and break the experience. If you catch yourself, ' +
        'rewrite as a direct reply to the reader.\n\n' +
        'EXAMPLE \u2014 reader answered \u201cautoregressive loop\u201d to a question about the submodule ' +
        'that performs the weighted sum of value vectors:\n\n' +
        '**Feedback:** Not quite. The autoregressive loop is the outer process that feeds each ' +
        'predicted token back as input; the submodule you\u2019re looking for is the attention ' +
        'head\u2019s weighted-sum step inside the self-attention block. You correctly sensed it ' +
        'lives at the token-mixing stage, but the name is attention (specifically the value ' +
        'aggregation), not the loop wrapping it.\n\n' +
        '**Q\u2082 \u00b7 numerical:** Roughly how many multiply-accumulate operations does a ' +
        'frontier transformer perform per generated token?';
      tutor.open();
      tutor.setQuizMode(
        QUIZ_PROMPT,
        'Quiz mode \u00b7 ask for a verdict whenever you\u2019re ready',
        {
          onVerdict: (level, label) => {
            // Persist the verdict alongside the ladder state.
            state.quiz = { level: level, label: label, ts: Date.now() };
            if (typeof setLadderSelf === 'function') setLadderSelf(level);
            else { state.ladder.self = level; saveState(state); }
            saveState(state);
          },
        }
      );
      // Seed the conversation so the model asks Q1.
      tutor.seedTurn();
    });
  }
})();
