/* Private Equity and Venture Capital — client app.
   Theme, progress, reveals, sticky header, TOC, reading position,
   search, audio narration with voice picker, AI tutor, bookmarks. */
(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js-on');

  const SLUG_PREFIX = 'pevc';
  const THEME_KEY = SLUG_PREFIX + '.theme';
  const VOICE_KEY = SLUG_PREFIX + '.voice';
  const RATE_KEY  = SLUG_PREFIX + '.rate';
  const POS_KEY_PREFIX  = SLUG_PREFIX + '.position.';
  const READ_KEY = SLUG_PREFIX + '.read';
  const LASTKEY  = SLUG_PREFIX + '.last';
  const BMK_KEY  = SLUG_PREFIX + '.bookmarks';

  // 1. THEME
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

  // 2. PROGRESS BAR + READING POSITION
  const fill = document.querySelector('[data-progress-fill]');
  const slug = document.body.getAttribute('data-chapter-slug') || '';
  const POS_KEY = POS_KEY_PREFIX + slug;
  const getRead = () => { try { return JSON.parse(localStorage.getItem(READ_KEY) || '{}'); } catch (e) { return {}; } };
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
  if (slug && !location.hash) {
    const saved = parseInt(localStorage.getItem(POS_KEY) || '0', 10);
    if (saved > 100) requestAnimationFrame(() => window.scrollTo(0, saved));
  }

  // 3. STICKY HEADER STATE
  const header = document.querySelector('[data-header]');
  const updateHeader = () => { if (header) header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false'); };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // 4. SCROLL REVEALS
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // 5. TOC ACTIVE LINK
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

  // 6. SEARCH OVERLAY
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
        try { const res = await fetch(baseUrl + 'search-index.json'); index = await res.json(); }
        catch (e) { index = []; }
      }
      opening = false;
    };
    const close = () => { searchEl.setAttribute('aria-hidden', 'true'); document.body.removeAttribute('data-modal-open'); };
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
      if (!q || q.length < 2) { results.innerHTML = '<div class="search__hint">Type at least 2 characters. Try “waterfall”, “term sheet”, “IRR”.</div>'; return; }
      const tokens = q.split(/\s+/);
      const scored = [];
      for (const r of index) {
        const haystack = (r.title + ' ' + (r.subtitle || '') + ' ' + r.text).toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (!haystack.includes(t)) { score = 0; break; }
          const inTitle = r.title.toLowerCase().includes(t);
          score += inTitle ? 10 : 1;
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
          for (const t of tokens) {
            const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            excerpt = excerpt.replace(re, '<mark>$1</mark>');
          }
        } else { excerpt = (r.subtitle || ''); }
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

  // 7. AUDIO NARRATION with VOICE PICKER (popover)
  const audioWrap = document.querySelector('[data-audio-wrap]');
  if (audioWrap && 'speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const audioBtn = audioWrap.querySelector('[data-audio-toggle]');
    const popover = audioWrap.querySelector('[data-audio-popover]');
    const voicesEl = audioWrap.querySelector('[data-audio-voices]');
    const rateEl = audioWrap.querySelector('[data-audio-rate]');
    const rateVal = audioWrap.querySelector('[data-audio-rate-val]');
    const closeEl = audioWrap.querySelector('[data-audio-close]');
    const sampleEl = audioWrap.querySelector('[data-audio-sample]');
    const startEl = audioWrap.querySelector('[data-audio-start]');
    const hintEl  = audioWrap.querySelector('[data-audio-hint]');
    const state = { playing: false, paused: false, queue: [], idx: 0, voiceURI: localStorage.getItem(VOICE_KEY) || null, rate: parseFloat(localStorage.getItem(RATE_KEY) || '1') };
    if (rateEl) { rateEl.value = state.rate; rateVal.textContent = state.rate.toFixed(2) + '×'; }

    const setBtnLabel = () => {
      audioBtn.innerHTML = state.playing && !state.paused
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg> <span>Pause</span>'
        : (state.paused
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg> <span>Resume</span>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg> <span>Listen</span>');
    };
    setBtnLabel();

    const classifyVoice = (v) => {
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      const female = /(female|woman|samantha|karen|allison|tessa|moira|fiona|veena|rishi|nicky|kate|serena|susan|victoria|zira|hazel|catherine|joanna|salli|kimberly|amy|emma|aria|jenny)/;
      const male = /(male|man|daniel|fred|alex|tom|aaron|oliver|david|mark|ryan|guy|ravi|matthew|joey|justin|brian|connor)/;
      if (female.test(n)) return 'female';
      if (male.test(n)) return 'male';
      return 'neutral';
    };

    const renderVoiceList = () => {
      if (!voicesEl) return;
      const voices = synth.getVoices().filter(v => /^en[-_]/i.test(v.lang || ''));
      if (!voices.length) {
        voicesEl.innerHTML = '<div class="audio-popover__empty">No English voices found in this browser. Speech may still work; try clicking Hear a sample.</div>';
        return;
      }
      const groups = { female: [], male: [], neutral: [] };
      voices.forEach(v => groups[classifyVoice(v)].push(v));
      const order = ['female', 'male', 'neutral'];
      const labels = { female: 'Female', male: 'Male', neutral: 'Neutral' };
      let html = '';
      const selectedURI = state.voiceURI || (voices[0] && voices[0].voiceURI);
      for (const k of order) {
        if (!groups[k].length) continue;
        html += '<div class="audio-popover__title" style="margin:8px 0 4px;">' + labels[k] + '</div>';
        for (const v of groups[k]) {
          const checked = (v.voiceURI === selectedURI);
          html += '<button type="button" class="audio-voice" role="radio" aria-checked="' + (checked ? 'true' : 'false') + '" data-voice-uri="' + encodeURIComponent(v.voiceURI) + '">' +
            '<span class="audio-voice__dot"></span>' +
            '<span class="audio-voice__label">' +
              '<span class="audio-voice__name">' + escapeHtml(v.name) + '</span>' +
              '<span class="audio-voice__detail">' + escapeHtml(v.lang) + (v.localService ? '' : ' · cloud') + '</span>' +
            '</span></button>';
        }
      }
      voicesEl.innerHTML = html;
      voicesEl.querySelectorAll('.audio-voice').forEach(b => {
        b.addEventListener('click', () => {
          const uri = decodeURIComponent(b.getAttribute('data-voice-uri'));
          state.voiceURI = uri;
          localStorage.setItem(VOICE_KEY, uri);
          voicesEl.querySelectorAll('.audio-voice').forEach(x => x.setAttribute('aria-checked', 'false'));
          b.setAttribute('aria-checked', 'true');
        });
      });
    };

    const escapeHtml = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

    const ensureVoices = () => {
      if (synth.getVoices().length) renderVoiceList();
      else synth.onvoiceschanged = renderVoiceList;
    };

    const collectChunks = () => {
      const els = document.querySelectorAll('.prose > p, .prose > h2, .prose > h3, .prose > blockquote, .ch-header__title, .ch-header__dek');
      const out = [];
      els.forEach((el) => { const t = el.textContent.trim(); if (t && t.length > 4) out.push(t); });
      return out;
    };
    const findVoice = () => {
      const voices = synth.getVoices();
      if (state.voiceURI) {
        const v = voices.find(x => x.voiceURI === state.voiceURI);
        if (v) return v;
      }
      return voices.find(v => /en[-_](US|GB)/i.test(v.lang || '')) || voices[0];
    };
    const playNext = () => {
      if (state.idx >= state.queue.length) { state.playing = false; setBtnLabel(); return; }
      const u = new SpeechSynthesisUtterance(state.queue[state.idx]);
      u.rate = state.rate; u.pitch = 1.0;
      const v = findVoice();
      if (v) u.voice = v;
      u.onend = () => { state.idx++; if (state.playing) playNext(); };
      synth.speak(u);
    };
    const startPlayback = () => {
      state.queue = collectChunks();
      state.idx = 0;
      state.playing = true;
      setBtnLabel();
      if (synth.getVoices().length === 0) synth.onvoiceschanged = playNext;
      else playNext();
    };

    audioBtn.addEventListener('click', (e) => {
      // First click: open popover. Subsequent clicks while playing: pause/resume.
      if (!state.playing && !state.paused) {
        const isOpen = !popover.hasAttribute('hidden');
        if (isOpen) popover.setAttribute('hidden', ''); else { popover.removeAttribute('hidden'); ensureVoices(); }
        audioBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        return;
      }
      if (state.playing && !state.paused) { synth.pause(); state.paused = true; setBtnLabel(); }
      else if (state.paused) { synth.resume(); state.paused = false; setBtnLabel(); }
    });
    closeEl && closeEl.addEventListener('click', () => { popover.setAttribute('hidden',''); audioBtn.setAttribute('aria-expanded','false'); });
    document.addEventListener('click', (e) => {
      if (popover.hasAttribute('hidden')) return;
      if (!audioWrap.contains(e.target)) { popover.setAttribute('hidden',''); audioBtn.setAttribute('aria-expanded','false'); }
    });

    rateEl && rateEl.addEventListener('input', () => {
      state.rate = parseFloat(rateEl.value);
      rateVal.textContent = state.rate.toFixed(2) + '×';
      localStorage.setItem(RATE_KEY, String(state.rate));
    });

    sampleEl && sampleEl.addEventListener('click', () => {
      synth.cancel();
      const u = new SpeechSynthesisUtterance('This is what your selected narrator sounds like at the current speed.');
      u.rate = state.rate;
      const v = findVoice();
      if (v) u.voice = v;
      hintEl.textContent = v ? 'Sample: ' + v.name : 'Using browser default voice.';
      synth.speak(u);
    });

    startEl && startEl.addEventListener('click', () => {
      popover.setAttribute('hidden','');
      audioBtn.setAttribute('aria-expanded','false');
      synth.cancel();
      startPlayback();
    });

    window.addEventListener('beforeunload', () => synth.cancel());
  } else if (audioWrap) {
    audioWrap.style.display = 'none';
  }

  // 8. BOOKMARKS
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
      if (bmks.includes(slug)) bmks = bmks.filter(s => s !== slug); else bmks.push(slug);
      setBmks(bmks); refresh();
    });
  }

  // 9. COVER: continue reading
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
    } else { continueEl.style.display = 'none'; }
  }
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

  // 10. AI TUTOR
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
    const SYSTEM_PROMPT = "You are the in-book tutor for 'Private Equity and Venture Capital: A Complete Professional Guide' " +
      "— a long-form report covering fund structure, LPAs, fund economics (management fees, carried interest, " +
      "American/European waterfalls), GP/LP dynamics, fundraising, deal sourcing, commercial and financial due " +
      "diligence (incl. quality of earnings), valuation (comparables, precedent, DCF, LBO, VC method), term sheets, " +
      "preferred stock and liquidation preferences, anti-dilution, cap tables, governance, value creation, exits " +
      "(strategic, S2S, IPO, dividend recap), secondaries and continuation vehicles, sector investing, market cycles, " +
      "regulation (Investment Advisers Act, NVCA, ILPA), and IC memo craft. " +
      "Answer questions clearly and concisely (3–6 sentences unless the user asks for depth). " +
      "Use plain language first, then add precision. Prefer concrete examples — a $200M fund, a 2x preference, " +
      "a 6% hurdle, a 20% carry. If a question is outside the book’s scope, still answer briefly but note the " +
      "connection back to the book. Never refuse a reasonable practitioner question. Do not use markdown headers; " +
      "short paragraphs are fine.";
    const open = () => { tutorEl.setAttribute('aria-hidden', 'false'); document.body.setAttribute('data-modal-open', 'true'); setTimeout(() => input && input.focus(), 50); };
    const close = () => { tutorEl.setAttribute('aria-hidden', 'true'); document.body.removeAttribute('data-modal-open'); };
    tutorBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    tutorEl.addEventListener('click', (e) => { if (e.target === tutorEl) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tutorEl.getAttribute('aria-hidden') === 'false') close(); });

    const escapeHtml = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    const renderMd = (raw) => {
      let s = escapeHtml(String(raw || ''));
      s = s.replace(/^\s*#{1,6}\s+/gm, '');
      s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
      s = s.replace(/\*\*([^*\n][^*]*?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/(^|[^*])\*([^*\n][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
      const blocks = s.split(/\n{2,}/).map(b => '<p>' + b.replace(/\n/g, '<br>') + '</p>').join('');
      return blocks;
    };
    const setBody = (body, text) => { body.innerHTML = renderMd(text); };
    const append = (role, text) => {
      const wrap = document.createElement('div');
      wrap.className = 'tutor__msg tutor__msg--' + role;
      const lbl = document.createElement('div'); lbl.className = 'tutor__msg-role'; lbl.textContent = role === 'user' ? 'You' : 'Tutor';
      const body = document.createElement('div'); body.className = 'tutor__msg-body';
      if (role === 'assistant') setBody(body, text); else body.textContent = text;
      wrap.appendChild(lbl); wrap.appendChild(body);
      log.appendChild(wrap); log.scrollTop = log.scrollHeight;
      return body;
    };
    if (!log.children.length) {
      append('assistant', 'Hi — I’m your tutor for this report. Ask me anything about fund structure, term sheets, waterfalls, LBOs, secondaries — anything PE/VC. I’ll keep it short and clear.');
    }
    const history = [];
    const ENDPOINTS = [
      { url: apiUrl, model: 'openai', label: 'primary' },
      { url: apiUrl, model: 'openai', label: 'retry' },
      { url: apiUrl, model: 'openai', label: 'retry' },
    ];
    const renderTyping = (el) => { el.innerHTML = '<span class="tutor__typing"><span></span><span></span><span></span></span>'; };

    const AD_MARKERS = [
      /---\s*\n+\**\s*Support Pollinations[\s\S]*$/i,
      /\**\s*Support Pollinations\.AI[\s\S]*$/i,
      /\u{1F33C}\s*\**\s*Ad\s*\**\s*\u{1F33C}[\s\S]*$/iu,
      /\[Sponsored[\s\S]*$/i,
    ];
    const REASONING_PREFIXES = [
      /^(They|The user|User|We|I)\s+(said|wrote|answered|responded|need|should|must)[^.]*\.\s+/i,
      /^So\s+(I|we|the user)\s+(should|need|must|will)[^.]*\.\s+/i,
      /^So\s+(correct|right|wrong)[^.]*\.\s+/i,
      /^Got it[,.]\s+/i,
      /^Let me\s+(think|see|consider)[^.]*\.\s+/i,
      /^Missing:\s*[^.]*\.\s+/i,
    ];
    function looksLikeReasoningTrace(s) {
      const t = s.toLowerCase();
      const tells = [/\bthey said\b/, /\bthe user (said|wrote|answered)/, /\bso (correct|right|wrong)\b/, /\bmissing:\s/, /\bso i should\b/, /\bwe should (mention|note|add)\b/];
      let hits = 0;
      for (const re of tells) if (re.test(t)) hits++;
      return hits >= 2;
    }
    function sanitizeTutorReply(raw) {
      let s = String(raw || '');
      for (const re of AD_MARKERS) s = s.replace(re, '');
      let changed = true, guard = 0;
      while (changed && guard < 6) {
        changed = false; guard++;
        for (const re of REASONING_PREFIXES) {
          const next = s.replace(re, '');
          if (next !== s) { s = next; changed = true; }
        }
        s = s.replace(/^\s+/, '');
      }
      s = s.replace(/\n{3,}/g, '\n\n').replace(/^\s*---+\s*$/gm, '').trim();
      if (s && looksLikeReasoningTrace(s)) return '';
      return s;
    }

    const renderError = (el, question, attemptIdx, kind) => {
      const base = document.body.getAttribute('data-base') || '';
      const wrap = document.createElement('div');
      wrap.className = 'tutor__error';
      const msg = document.createElement('em');
      let lead;
      if (kind === 'refused') lead = 'The tutor declined to answer that. Try rephrasing, or use ';
      else if (kind === 'empty') lead = 'The tutor came back empty. Retry, edit your question, or use ';
      else lead = 'The tutor service didn’t respond. You can retry, or use ';
      msg.textContent = lead;
      const searchHint = document.createElement('strong'); searchHint.textContent = 'search (⌘/Ctrl + K)';
      const gloss = document.createElement('a'); gloss.href = base + 'glossary.html'; gloss.textContent = 'glossary';
      msg.appendChild(searchHint); msg.appendChild(document.createTextNode(' or the ')); msg.appendChild(gloss); msg.appendChild(document.createTextNode('.'));
      wrap.appendChild(msg);
      const actions = document.createElement('div'); actions.className = 'tutor__error-actions';
      const retryBtn = document.createElement('button'); retryBtn.type='button'; retryBtn.className='tutor__retry'; retryBtn.textContent='Retry';
      retryBtn.addEventListener('click', () => { renderTyping(el); askTutor(question, el, attemptIdx + 1); });
      actions.appendChild(retryBtn);
      const editBtn = document.createElement('button'); editBtn.type='button'; editBtn.className='tutor__retry tutor__retry--ghost'; editBtn.textContent='Edit question';
      editBtn.addEventListener('click', () => {
        input.value = question; input.focus(); input.select && input.select();
        if (history.length && history[history.length - 1].role === 'user' && history[history.length - 1].content === question) history.pop();
        const errorMsg = el.closest('.tutor__msg');
        const userMsg = errorMsg && errorMsg.previousElementSibling;
        if (userMsg && userMsg.classList.contains('tutor__msg--user')) userMsg.remove();
        if (errorMsg) errorMsg.remove();
      });
      actions.appendChild(editBtn);
      wrap.appendChild(actions);
      el.innerHTML = ''; el.appendChild(wrap);
    };

    async function askTutor(question, placeholder, attemptIdx) {
      attemptIdx = attemptIdx || 0;
      const endpoint = ENDPOINTS[Math.min(attemptIdx, ENDPOINTS.length - 1)];
      const ctxNote = chapterCtx.chapterTitle
        ? `The reader is currently on the chapter: "${chapterCtx.chapterTitle}". Lean on that context when relevant.`
        : 'The reader is on the report cover or front matter.';
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
          body: JSON.stringify({
            model: endpoint.model,
            messages,
            reasoning_effort: 'low',
            referrer: 'private-equity-venture-capital-complete-professional-guide',
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
        } else if (typeof data === 'string') answer = data;
        else if (data && (data.reply || data.answer)) answer = data.reply || data.answer;
        answer = sanitizeTutorReply(answer);
        if (!answer) {
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

    window.__PEVC_TUTOR__ = { open, close };
  }
})();
