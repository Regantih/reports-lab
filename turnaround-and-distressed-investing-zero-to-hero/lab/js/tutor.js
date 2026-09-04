/* Lab tutor — same engine as the report, prompted for the models. */
(function () {
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
    const SYSTEM_PROMPT = "You are the in-lab tutor for the restructuring lab in 'Turnaround and Distressed Investing'. " +
      "The reader is using one of four working models: (1) a waterfall and recovery solver that allocates enterprise value down a " +
      "priority stack and identifies the fulcrum security; (2) an uptier exchange solver preloaded with Serta's June 2020 transaction " +
      "($200mm new money first-out, ~$1.2bn of first and second lien exchanged for ~$875mm second-out, an exchange ratio near 73 cents); " +
      "(3) a 13-week cash flow model with a DIP cumulative-receipts variance covenant; and (4) a liquidation analysis builder for the " +
      "best-interests test under section 1129(a)(7). " +
      "Your job is to explain what a number in one of these tables means, what a practitioner would look for, and why it matters. " +
      "Be concrete and quantitative. Explain terms like fulcrum security, deficiency claim, adequate protection, cramdown, trough liquidity, " +
      "variance covenant, going-concern premium, exchange ratio, and pro rata sharing in plain language first, then with precision. " +
      "If asked to interpret a specific figure, walk the arithmetic. Keep answers to 3-6 sentences unless depth is requested. " +
      "On liability management, be accurate: the Fifth Circuit held on 31 December 2024 that Serta's uptier was not an 'open market purchase'; " +
      "the New York Appellate Division upheld a similar uptier in Mitel the same day on different contract language; outcomes turn on the words " +
      "in the credit agreement, not the shape of the transaction. Never refuse a reasonable practitioner question. No markdown headers.";
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
      append('assistant', 'Ask me about any number on this page — what it means, what to look for, and why it matters. For example: “what is the fulcrum security?”, “why does a deficiency claim dilute unsecured recoveries?”, or “what does a 73 cent exchange ratio tell me?”');
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

    window.__RX_TUTOR__ = { open, close };
  }
})();
