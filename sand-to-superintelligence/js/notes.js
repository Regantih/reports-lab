/**
 * notes.js — Margin note system (Phase 2C)
 * Typed notes: Question / Analogy / Stuck-on / Got-it
 * Persisted to localStorage, anchored to stable paragraph IDs.
 */
(function () {
  'use strict';

  // ── Constants ────────────────────────────────────────────────────────────
  const NOTE_TYPES = [
    { id: 'question', label: '❓ Question',  icon: '❓' },
    { id: 'analogy',  label: '💡 Analogy',   icon: '💡' },
    { id: 'stuck',    label: '😤 Stuck-on',  icon: '😤' },
    { id: 'got-it',   label: '✅ Got-it',    icon: '✅' },
  ];

  const TYPE_ICONS = {
    question: '❓',
    analogy:  '💡',
    stuck:    '😤',
    'got-it': '✅',
  };

  // ── State ─────────────────────────────────────────────────────────────────
  let slug = null;
  let notes = [];          // array of note objects
  let panelParaId = null;  // which paragraph is open in the panel
  let panelNoteId = null;  // note id being edited (null = new)
  let debounceTimer = null;
  let reattachTarget = null;  // note id waiting for reattach click

  // ── DOM refs ──────────────────────────────────────────────────────────────
  let panel, backdrop, textarea, typeLabels, saveBtn, deleteBtn, statusEl, snippetEl;

  // ── Storage helpers ───────────────────────────────────────────────────────
  function storageKey() {
    return `fsts.notes.${slug}`;
  }

  function loadNotes() {
    try {
      return JSON.parse(localStorage.getItem(storageKey()) || '[]');
    } catch (_) {
      return [];
    }
  }

  function saveNotes() {
    localStorage.setItem(storageKey(), JSON.stringify(notes));
    updateNoteCount();
  }

  function updateNoteCount() {
    const main = document.querySelector('main[data-learn-root]');
    if (main) main.setAttribute('data-note-count', notes.length);
  }

  function generateId() {
    return 'n_' + Date.now();
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    const main = document.querySelector('main[data-learn-root]');
    if (!main) return; // not a chapter page

    slug = main.getAttribute('data-learn-root');
    if (!slug) return;

    notes = loadNotes();

    buildPanel();
    buildBackdrop();
    attachGutterButtons();
    renderAllMarkers();
    renderOrphans();
    updateNoteCount();
  }

  // ── Panel construction ─────────────────────────────────────────────────────
  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'note-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Margin note');
    panel.setAttribute('aria-hidden', 'true');

    const typeRadios = NOTE_TYPES.map(t =>
      `<label class="note-type--${t.id}" data-type="${t.id}">` +
      `<input type="radio" name="note-type" value="${t.id}">` +
      `<span>${t.label}</span></label>`
    ).join('');

    panel.innerHTML = `
      <div class="note-panel__head">
        <span class="note-panel__title">Margin note</span>
        <button class="note-panel__close" type="button" aria-label="Close note panel">×</button>
      </div>
      <div class="note-panel__para-snippet"></div>
      <form class="note-panel__form" autocomplete="off">
        <div>
          <div class="note-panel__type-label">Type</div>
          <div class="note-panel__type">${typeRadios}</div>
        </div>
        <textarea class="note-panel__textarea" placeholder="Write your note here…" rows="6"></textarea>
      </form>
      <div class="note-panel__actions">
        <div style="display:flex;gap:var(--space-3);align-items:center;">
          <button class="note-panel__save" type="button">Save</button>
          <button class="note-panel__delete" type="button" hidden>Delete</button>
        </div>
        <span class="note-panel__status"></span>
      </div>`;

    document.body.appendChild(panel);

    snippetEl  = panel.querySelector('.note-panel__para-snippet');
    textarea   = panel.querySelector('.note-panel__textarea');
    typeLabels = panel.querySelectorAll('.note-panel__type label');
    saveBtn    = panel.querySelector('.note-panel__save');
    deleteBtn  = panel.querySelector('.note-panel__delete');
    statusEl   = panel.querySelector('.note-panel__status');

    // Close button
    panel.querySelector('.note-panel__close').addEventListener('click', closePanel);

    // Type radio buttons → sync active styling
    typeLabels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      radio.addEventListener('change', () => syncTypeStyles());
      label.addEventListener('click', () => {
        radio.checked = true;
        syncTypeStyles();
      });
    });

    // Textarea → debounced auto-save
    textarea.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(autoSave, 600);
    });

    saveBtn.addEventListener('click', saveCurrentNote);
    deleteBtn.addEventListener('click', deleteCurrentNote);

    // Keyboard: Escape closes
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePanel();
    });
  }

  function buildBackdrop() {
    backdrop = document.createElement('div');
    backdrop.className = 'note-panel-backdrop';
    backdrop.addEventListener('click', closePanel);
    document.body.appendChild(backdrop);
  }

  // ── Gutter buttons ─────────────────────────────────────────────────────────
  function attachGutterButtons() {
    const prose = document.querySelector('.prose');
    if (!prose) return;

    prose.querySelectorAll('p[id^="p-"]').forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'note-gutter';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Add margin note');
      btn.textContent = '✎';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPanel(p.id);
      });
      p.appendChild(btn);
    });
  }

  // ── Marker rendering ───────────────────────────────────────────────────────
  function renderAllMarkers() {
    // Remove existing markers
    document.querySelectorAll('.note-marker').forEach(m => m.remove());

    notes.forEach(note => {
      const para = document.getElementById(note.paraId);
      if (!para) return; // orphan — handled separately

      const marker = document.createElement('button');
      marker.className = `note-marker note-marker--${note.type}`;
      marker.type = 'button';
      marker.setAttribute('aria-label', `${note.type} note: ${note.body.slice(0, 50)}`);
      marker.textContent = TYPE_ICONS[note.type] || '📝';
      marker.dataset.noteId = note.id;
      marker.style.position = 'absolute';
      marker.style.top = '2px';

      // Position relative to the paragraph
      para.style.position = 'relative';
      para.appendChild(marker);

      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        openPanel(note.paraId, note.id);
      });
    });
  }

  // ── Panel open/close ───────────────────────────────────────────────────────
  function openPanel(paraId, noteId = null) {
    panelParaId = paraId;
    panelNoteId = noteId;

    // Para snippet
    const para = document.getElementById(paraId);
    if (para) {
      const text = para.innerText.slice(0, 80).trim();
      snippetEl.textContent = text + (para.innerText.length > 80 ? '…' : '');
    }

    // Populate form from existing note (edit) or blank (new)
    const existing = noteId ? notes.find(n => n.id === noteId) : null;
    textarea.value = existing ? existing.body : '';

    const defaultType = existing ? existing.type : 'question';
    const radio = panel.querySelector(`input[value="${defaultType}"]`);
    if (radio) radio.checked = true;
    syncTypeStyles();

    saveBtn.disabled = false;
    deleteBtn.hidden = !existing;

    showPanel();
    setTimeout(() => textarea.focus(), 300);
  }

  function showPanel() {
    panel.classList.add('note-panel--open');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('note-panel-backdrop--visible');
  }

  function closePanel() {
    clearTimeout(debounceTimer);
    panel.classList.remove('note-panel--open');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('note-panel-backdrop--visible');
    panelParaId = null;
    panelNoteId = null;
    hideStatus();
  }

  // ── Save / delete ──────────────────────────────────────────────────────────
  function getSelectedType() {
    const checked = panel.querySelector('input[name="note-type"]:checked');
    return checked ? checked.value : 'question';
  }

  function saveCurrentNote() {
    const body = textarea.value.trim();
    if (!body) {
      showStatus('Nothing to save.');
      return;
    }
    const type = getSelectedType();
    const ts = Date.now();

    if (panelNoteId) {
      // Edit existing
      const idx = notes.findIndex(n => n.id === panelNoteId);
      if (idx !== -1) {
        notes[idx] = { ...notes[idx], type, body, ts };
      }
    } else {
      // New note
      const newNote = {
        id: generateId(),
        paraId: panelParaId,
        type,
        body,
        ts,
      };
      notes.push(newNote);
      panelNoteId = newNote.id;
      deleteBtn.hidden = false;
    }

    saveNotes();
    renderAllMarkers();
    renderOrphans();
    showStatus('Saved ✓');
  }

  function autoSave() {
    if (!panelParaId) return;
    const body = textarea.value.trim();
    if (!body) return;
    saveCurrentNote();
  }

  function deleteCurrentNote() {
    if (!panelNoteId) return;
    notes = notes.filter(n => n.id !== panelNoteId);
    saveNotes();
    renderAllMarkers();
    renderOrphans();
    closePanel();
  }

  // ── Type style sync ────────────────────────────────────────────────────────
  function syncTypeStyles() {
    const selected = getSelectedType();
    typeLabels.forEach(label => {
      const t = label.dataset.type;
      const isActive = t === selected;
      label.classList.toggle('note-type--active', isActive);
      // also ensure the color class is on the label itself for CSS targeting
      NOTE_TYPES.forEach(nt => label.classList.toggle(`note-type--active.note-type--${nt.id}`, false));
    });
  }

  // ── Status flash ──────────────────────────────────────────────────────────
  function showStatus(msg) {
    statusEl.textContent = msg;
    statusEl.classList.add('note-panel__status--visible');
    setTimeout(hideStatus, 2000);
  }

  function hideStatus() {
    statusEl.classList.remove('note-panel__status--visible');
  }

  // ── Orphan recovery ────────────────────────────────────────────────────────
  function renderOrphans() {
    // Remove old orphan section
    const old = document.querySelector('.note-orphans');
    if (old) old.remove();

    const prose = document.querySelector('.prose');
    if (!prose) return;

    const orphaned = notes.filter(n => !document.getElementById(n.paraId));
    if (!orphaned.length) return;

    const section = document.createElement('section');
    section.className = 'note-orphans';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'note-orphans__toggle';
    toggleBtn.innerHTML = `
      <span>📌 ${orphaned.length} orphaned note${orphaned.length > 1 ? 's' : ''} — paragraph no longer found</span>
      <span class="note-orphans__caret">▾</span>`;

    const body = document.createElement('div');
    body.className = 'note-orphans__body';
    body.hidden = true;

    orphaned.forEach(note => {
      const item = document.createElement('div');
      item.className = 'note-orphans__item';

      const typeLabel = NOTE_TYPES.find(t => t.id === note.type) || NOTE_TYPES[0];
      item.innerHTML = `
        <div class="note-orphans__item-meta">
          <span class="note-orphans__type-chip">${typeLabel.label}</span>
          <span class="note-orphans__snippet">${escHtml(note.paraId)}</span>
        </div>
        <p class="note-orphans__body-text">${escHtml(note.body)}</p>
        <button class="note-orphans__reattach" type="button" data-note-id="${note.id}">🔗 Reattach</button>`;

      body.appendChild(item);
    });

    section.appendChild(toggleBtn);
    section.appendChild(body);

    // Toggle open/close
    toggleBtn.addEventListener('click', () => {
      body.hidden = !body.hidden;
      section.toggleAttribute('open', !body.hidden);
    });

    // Reattach buttons
    body.querySelectorAll('.note-orphans__reattach').forEach(btn => {
      btn.addEventListener('click', () => startReattach(btn.dataset.noteId, btn));
    });

    prose.appendChild(section);
  }

  function startReattach(noteId, btn) {
    // Cancel any existing reattach
    if (reattachTarget) {
      cancelReattach();
    }

    reattachTarget = noteId;
    btn.classList.add('note-orphans__reattach--active');
    btn.textContent = '🖱 Click a paragraph to reattach…';

    // Highlight all paragraphs
    const prose = document.querySelector('.prose');
    prose.querySelectorAll('p[id^="p-"]').forEach(p => {
      p.style.outline = '2px dashed var(--color-accent-copper)';
      p.style.cursor = 'crosshair';
      p.addEventListener('click', handleReattachClick, { once: true });
    });

    // Escape cancels
    document.addEventListener('keydown', handleReattachEscape);
  }

  function handleReattachClick(e) {
    const para = e.currentTarget;
    const noteId = reattachTarget;
    const idx = notes.findIndex(n => n.id === noteId);
    if (idx !== -1) {
      notes[idx].paraId = para.id;
      saveNotes();
      renderAllMarkers();
      renderOrphans();
    }
    cleanupReattachListeners();
    reattachTarget = null;
  }

  function handleReattachEscape(e) {
    if (e.key === 'Escape') cancelReattach();
  }

  function cancelReattach() {
    cleanupReattachListeners();
    reattachTarget = null;
  }

  function cleanupReattachListeners() {
    const prose = document.querySelector('.prose');
    if (prose) {
      prose.querySelectorAll('p[id^="p-"]').forEach(p => {
        p.style.outline = '';
        p.style.cursor = '';
        p.removeEventListener('click', handleReattachClick);
      });
    }
    document.removeEventListener('keydown', handleReattachEscape);
  }

  // ── Utility ────────────────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
