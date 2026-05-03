// Tiny shared helper: theme toggle + persistence + reveal animation.
(function () {
  const stored = (() => { try { return localStorage.getItem('pe-vc-theme'); } catch { return null; } })();
  if (stored === 'dark' || stored === 'light') {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  function syncToggleIcon(btn) {
    if (!btn) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = dark
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"/></svg>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('[data-theme-toggle]');
    syncToggleIcon(btn);
    if (btn) {
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('pe-vc-theme', next); } catch {}
        syncToggleIcon(btn);
      });
    }
    // simple reveal
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -8% 0px' })
      : null;
    if (io) document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    else document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  });
})();
