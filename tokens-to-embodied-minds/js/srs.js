/**
 * srs.js — SM-2 spaced-repetition for "From Sand to Superintelligence"
 *
 * Exposes:  window.__FSTS_SRS__ = { dueCards, openReview, stats, rate }
 * Storage:  localStorage["fsts.srs.<slug>"] = { cards: [...], lastSession: {...} }
 *
 * Card state: { id, due (ms timestamp), ease (default 2.5), interval (days), reps }
 *
 * SM-2 rating rules:
 *   Again: reps=0, interval=0, ease-=0.20 (min 1.3), due = now + 1 min
 *   Hard:  ease-=0.15 (min 1.3), interval=max(1, interval*1.2), due = now + interval days
 *   Good:  ease unchanged; interval=1(reps==0) | 6(reps==1) | round(interval*ease)(reps>1); reps+=1; due=now+interval days
 *   Easy:  ease+=0.15; same as Good but interval*=1.3; reps+=1; due=now+interval days
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Constants                                                           */
  /* ------------------------------------------------------------------ */
  const STORAGE_PREFIX = 'fsts.srs.';
  const MIN_EASE = 1.3;
  const DEFAULT_EASE = 2.5;
  const MS_PER_DAY = 86400 * 1000;
  const MS_PER_MIN = 60 * 1000;

  /* ------------------------------------------------------------------ */
  /* Inline drill data — built by reading __CHAPTERS_DRILLS__ if present  */
  /* We gather all chapter data from the embedded JSON in each drills page */
  /* via a lazy lookup in the DOM.                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Returns the drill pairs for a given slug by reading the DOM.
   * Each drills page has a <script id="srs-drills-{slug}"> tag with JSON.
   * Falls back to empty array if not present.
   *
   * @param {string} slug
   * @returns {Array<{q: string, a: string}>}
   */
  function getDrillData(slug) {
    // Prefer inline JSON (injected by build_site.py into each drills page)
    const el = document.getElementById('srs-drills-' + slug);
    if (el) {
      try { return JSON.parse(el.textContent); } catch (e) { /* ignore */ }
    }
    // Fallback: check window.__FSTS_DRILLS_ALL__ (could be set by a dashboard page)
    if (window.__FSTS_DRILLS_ALL__ && window.__FSTS_DRILLS_ALL__[slug]) {
      return window.__FSTS_DRILLS_ALL__[slug];
    }
    return [];
  }

  /* ------------------------------------------------------------------ */
  /* Storage helpers                                                     */
  /* ------------------------------------------------------------------ */

  function storageKey(slug) {
    return STORAGE_PREFIX + slug;
  }

  function loadState(slug) {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw) return JSON.parse(raw);
    } catch (e) { /* quota or parse error */ }
    return null;
  }

  function saveState(slug, state) {
    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(state));
    } catch (e) { /* quota exceeded — silently fail */ }
  }

  /**
   * Get or initialise the card-state array for a slug.
   * New cards (never seen) get due = epoch 0 so they are always due.
   */
  function getOrInitCards(slug) {
    const drills = getDrillData(slug);
    const stored = loadState(slug);
    const storedCards = (stored && stored.cards) ? stored.cards : [];

    // Build a map of existing state by id
    const byId = {};
    for (const c of storedCards) byId[c.id] = c;

    // Ensure one entry per drill (new entries start due immediately)
    const cards = drills.map((d, i) => {
      const id = 'card_' + i;
      return byId[id] || {
        id,
        due: 0,           // epoch 0 = always due
        ease: DEFAULT_EASE,
        interval: 0,
        reps: 0,
      };
    });

    return { cards, drills, stored };
  }

  /* ------------------------------------------------------------------ */
  /* SM-2 rating logic                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Apply SM-2 rating to a card state object (mutates and returns it).
   *
   * @param {object} card   - { id, due, ease, interval, reps }
   * @param {string} rating - "again" | "hard" | "good" | "easy"
   * @returns {object} updated card
   */
  function applyRating(card, rating) {
    const now = Date.now();

    switch (rating) {
      case 'again':
        card.reps = 0;
        card.interval = 0;
        card.ease = Math.max(MIN_EASE, card.ease - 0.20);
        card.due = now + MS_PER_MIN;           // relearn: 1 minute
        break;

      case 'hard':
        card.ease = Math.max(MIN_EASE, card.ease - 0.15);
        card.interval = Math.max(1, card.interval * 1.2);
        card.due = now + card.interval * MS_PER_DAY;
        // reps deliberately not incremented on Hard
        break;

      case 'good': {
        let newInterval;
        if (card.reps === 0)      newInterval = 1;
        else if (card.reps === 1) newInterval = 6;
        else                      newInterval = Math.round(card.interval * card.ease);
        card.interval = newInterval;
        card.reps += 1;
        // ease unchanged for Good
        card.due = now + card.interval * MS_PER_DAY;
        break;
      }

      case 'easy': {
        card.ease += 0.15;
        let newInterval;
        if (card.reps === 0)      newInterval = 1;
        else if (card.reps === 1) newInterval = 6;
        else                      newInterval = Math.round(card.interval * card.ease);
        // Easy: interval *= 1.3 on top of Good interval
        newInterval = Math.round(newInterval * 1.3);
        card.interval = newInterval;
        card.reps += 1;
        card.due = now + card.interval * MS_PER_DAY;
        break;
      }

      default:
        console.warn('[srs] Unknown rating:', rating);
    }

    return card;
  }

  /* ------------------------------------------------------------------ */
  /* Public API                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * dueCards(slug) → [{ id, q, a, state }]
   * Returns cards that are due now (due <= Date.now()) or have never been seen (due == 0).
   */
  function dueCards(slug) {
    const { cards, drills } = getOrInitCards(slug);
    const now = Date.now();
    return cards
      .filter(c => c.due <= now)
      .map((c, _i) => {
        const idx = parseInt(c.id.replace('card_', ''), 10);
        const drill = drills[idx] || {};
        return {
          id: c.id,
          q: drill.q || drill[0] || '',
          a: drill.a || drill[1] || '',
          state: { ...c },
        };
      });
  }

  /**
   * stats() → { totalDue, byChapter: { slug: count } }
   * Iterates all known fsts.srs.* keys in localStorage.
   */
  function stats() {
    const byChapter = {};
    let totalDue = 0;
    const now = Date.now();

    // Collect all srs keys
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
        const slug = key.slice(STORAGE_PREFIX.length);
        const state = loadState(slug);
        if (!state || !state.cards) continue;
        const due = state.cards.filter(c => c.due <= now).length;
        byChapter[slug] = due;
        totalDue += due;
      }
    } catch (e) { /* localStorage unavailable */ }

    // Also include slugs that have never been reviewed (stored state has 0 cards)
    // Those are handled lazily — they'll appear once openReview or dueCards is called
    return { totalDue, byChapter };
  }

  /* ------------------------------------------------------------------ */
  /* Review modal                                                        */
  /* ------------------------------------------------------------------ */

  let _session = null; // active session object

  /**
   * openReview(slug)
   * Opens the SRS review modal for a given chapter slug.
   * Builds queue of due cards, then shows the modal.
   */
  function openReview(slug) {
    const { cards, drills, stored } = getOrInitCards(slug);
    const now = Date.now();

    // Build queue: due cards (due <= now) in stable order
    const queue = cards
      .map((c, _) => {
        const idx = parseInt(c.id.replace('card_', ''), 10);
        const drill = drills[idx];
        if (!drill) return null;
        return {
          card: c,
          q: drill.q || drill[0] || '',
          a: drill.a || drill[1] || '',
        };
      })
      .filter(item => item && item.card.due <= now);

    if (queue.length === 0) {
      _showDoneModal(slug, 0, 0, {}, stored);
      return;
    }

    _session = {
      slug,
      queue,
      index: 0,
      startTime: Date.now(),
      tally: { again: 0, hard: 0, good: 0, easy: 0 },
      totalCards: queue.length,
      cards,        // full cards array (for saving)
      drills,
      stored,
    };

    _renderModal();
  }

  /* ------------------------------------------------------------------ */
  /* rate(rating) — called by button clicks / keyboard shortcuts         */
  /* ------------------------------------------------------------------ */

  function rate(rating) {
    if (!_session) return;

    const item = _session.queue[_session.index];
    if (!item) return;

    // Apply SM-2
    applyRating(item.card, rating);
    _session.tally[rating] = (_session.tally[rating] || 0) + 1;

    // Save updated card state
    const updated = _session.cards.map(c =>
      c.id === item.card.id ? { ...item.card } : c
    );
    _session.cards = updated;

    const reviewed = Object.values(_session.tally).reduce((a, b) => a + b, 0);
    const lastSession = {
      ts: Date.now(),
      reviewed,
      again: _session.tally.again,
      hard: _session.tally.hard,
      good: _session.tally.good,
      easy: _session.tally.easy,
    };

    saveState(_session.slug, {
      cards: updated,
      lastSession,
    });

    // Advance
    _session.index++;
    if (_session.index >= _session.queue.length) {
      // Session complete
      const elapsed = Math.round((Date.now() - _session.startTime) / 60000);
      _showDoneModal(
        _session.slug,
        _session.totalCards,
        elapsed,
        _session.tally,
        _session.stored,
      );
      _session = null;
    } else {
      _renderCard();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Modal DOM                                                           */
  /* ------------------------------------------------------------------ */

  function _getOrCreateOverlay() {
    let el = document.getElementById('srs-modal-overlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'srs-modal-overlay';
      el.className = 'srs-overlay';
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'Spaced repetition review');
      document.body.appendChild(el);
    }
    return el;
  }

  function _renderModal() {
    const overlay = _getOrCreateOverlay();
    overlay.innerHTML = _buildCardHtml();
    overlay.classList.add('srs-overlay--active');
    _attachCardListeners(overlay);
    _focusFirst(overlay);
    document.addEventListener('keydown', _handleKeydown);
  }

  function _buildCardHtml() {
    if (!_session) return '';
    const { index, totalCards, queue } = _session;
    const item = queue[index];
    const progress = index + 1;

    return `
<div class="srs-dialog">
  <div class="srs-dialog__head">
    <span class="srs-dialog__progress">${progress} / ${totalCards} due</span>
    <button type="button" class="srs-dialog__close" data-srs-close aria-label="Close review">×</button>
  </div>
  <div class="srs-dialog__body">
    <div class="srs-card">
      <div class="srs-card__front">${item.q}</div>
      <div class="srs-card__divider" data-srs-divider></div>
      <div class="srs-card__back" data-srs-back hidden>${item.a}</div>
    </div>
    <div class="srs-card__actions" data-srs-show-wrap>
      <button type="button" class="srs-show-btn" data-srs-show>Show answer <span class="srs-show-btn__hint">Space</span></button>
    </div>
    <div class="srs-rate-row" data-srs-rate-wrap hidden>
      <button type="button" class="srs-rate-btn srs-rate-btn--again" data-rating="again">
        <span class="srs-rate-btn__key">1</span> Again
      </button>
      <button type="button" class="srs-rate-btn srs-rate-btn--hard" data-rating="hard">
        <span class="srs-rate-btn__key">2</span> Hard
      </button>
      <button type="button" class="srs-rate-btn srs-rate-btn--good" data-rating="good">
        <span class="srs-rate-btn__key">3</span> Good
      </button>
      <button type="button" class="srs-rate-btn srs-rate-btn--easy" data-rating="easy">
        <span class="srs-rate-btn__key">4</span> Easy
      </button>
    </div>
  </div>
</div>`.trim();
  }

  function _renderCard() {
    const overlay = document.getElementById('srs-modal-overlay');
    if (!overlay) return;
    overlay.innerHTML = _buildCardHtml();
    _attachCardListeners(overlay);
    _focusFirst(overlay);
  }

  function _showDoneModal(slug, reviewed, elapsed, tally, stored) {
    const overlay = _getOrCreateOverlay();
    overlay.classList.add('srs-overlay--active');
    const elapsedStr = elapsed < 1 ? 'under a minute' : `${elapsed} minute${elapsed !== 1 ? 's' : ''}`;
    const tallyStr = reviewed > 0
      ? `Again ${tally.again || 0} · Hard ${tally.hard || 0} · Good ${tally.good || 0} · Easy ${tally.easy || 0}`
      : '';
    const heading = reviewed > 0
      ? `Done! Reviewed ${reviewed} card${reviewed !== 1 ? 's' : ''} in ${elapsedStr}.`
      : 'All caught up — no cards due right now.';

    overlay.innerHTML = `
<div class="srs-dialog">
  <div class="srs-dialog__head">
    <span class="srs-dialog__progress">Session complete</span>
    <button type="button" class="srs-dialog__close" data-srs-close aria-label="Close review">×</button>
  </div>
  <div class="srs-dialog__body srs-dialog__body--done">
    <div class="srs-done">
      <div class="srs-done__icon" aria-hidden="true">✓</div>
      <h2 class="srs-done__heading">${heading}</h2>
      ${tallyStr ? `<p class="srs-done__tally">${tallyStr}</p>` : ''}
      <button type="button" class="srs-close-btn" data-srs-close>Close</button>
    </div>
  </div>
</div>`.trim();

    overlay.querySelector('[data-srs-close]').addEventListener('click', _closeModal);
    overlay.querySelector('[data-srs-close]').focus();
    document.addEventListener('keydown', _handleKeydown);
  }

  function _attachCardListeners(overlay) {
    // Close button
    const closeBtn = overlay.querySelector('[data-srs-close]');
    if (closeBtn) closeBtn.addEventListener('click', _closeModal);

    // Show answer button
    const showBtn = overlay.querySelector('[data-srs-show]');
    if (showBtn) showBtn.addEventListener('click', _revealAnswer);

    // Rate buttons
    overlay.querySelectorAll('[data-rating]').forEach(btn => {
      btn.addEventListener('click', () => rate(btn.dataset.rating));
    });
  }

  function _revealAnswer() {
    const back = document.querySelector('[data-srs-back]');
    const divider = document.querySelector('[data-srs-divider]');
    const showWrap = document.querySelector('[data-srs-show-wrap]');
    const rateWrap = document.querySelector('[data-srs-rate-wrap]');

    if (back)      back.hidden = false;
    if (divider)   divider.classList.add('srs-card__divider--visible');
    if (showWrap)  showWrap.hidden = true;
    if (rateWrap) {
      rateWrap.hidden = false;
      // Focus first rate button
      const firstBtn = rateWrap.querySelector('button');
      if (firstBtn) firstBtn.focus();
    }
  }

  function _closeModal() {
    const overlay = document.getElementById('srs-modal-overlay');
    if (overlay) {
      overlay.classList.remove('srs-overlay--active');
      overlay.innerHTML = '';
    }
    document.removeEventListener('keydown', _handleKeydown);
    _session = null;
  }

  function _handleKeydown(e) {
    if (e.key === 'Escape') { _closeModal(); return; }

    const rateWrap = document.querySelector('[data-srs-rate-wrap]');
    const answerVisible = rateWrap && !rateWrap.hidden;

    if (!answerVisible) {
      // Space / Enter reveals answer
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        _revealAnswer();
      }
    } else {
      // 1/2/3/4 rate
      const map = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };
      if (map[e.key]) {
        e.preventDefault();
        rate(map[e.key]);
      }
    }
  }

  function _focusFirst(container) {
    const btn = container.querySelector('button');
    if (btn) btn.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Wire up "Review now" banner buttons (rendered server-side)          */
  /* Each button has data-srs-open="<slug>"                             */
  /* ------------------------------------------------------------------ */

  function _initBannerButtons() {
    document.querySelectorAll('[data-srs-open]').forEach(btn => {
      const slug = btn.dataset.srsOpen;
      if (!slug) return;

      // Update the due-count in the banner dynamically
      const { cards } = getOrInitCards(slug);
      const now = Date.now();
      const due = cards.filter(c => c.due <= now).length;

      const countEl = btn.closest('.srs-banner')?.querySelector('[data-srs-count]');
      if (countEl) countEl.textContent = due;

      // Hide banner if nothing due
      const banner = btn.closest('.srs-banner');
      if (banner && due === 0) {
        banner.hidden = true;
      }

      btn.addEventListener('click', () => openReview(slug));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Expose public API                                                   */
  /* ------------------------------------------------------------------ */

  window.__FSTS_SRS__ = { dueCards, openReview, stats, rate };

  /* Init once DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initBannerButtons);
  } else {
    _initBannerButtons();
  }

})();
