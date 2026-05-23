// Find Me · i18n engine
// Each page defines window.pageTranslations and calls initI18n() on load.

const I18N_SPEED = 3; // ms per character — fast typewriter feel

function _strip(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}

function _typeEl(el, html) {
  return new Promise(resolve => {
    const text = _strip(html);
    el.textContent = '';
    if (!text.length) { el.innerHTML = html; resolve(); return; }
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(timer); el.innerHTML = html; resolve(); }
    }, I18N_SPEED);
  });
}

function applyLang(lang, animate) {
  const t = window.pageTranslations?.[lang];
  if (!t) return Promise.resolve();

  localStorage.setItem('findme-lang', lang);
  document.documentElement.lang = lang;

  const ANIM = new Set(['H1', 'H2', 'P']);
  const promises = [];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t[el.dataset.i18n];
    if (val === undefined) return;

    if (animate && ANIM.has(el.tagName)) {
      promises.push(_typeEl(el, val));
    } else if (animate) {
      el.style.transition = 'opacity 0.15s';
      el.style.opacity = '0';
      setTimeout(() => { el.innerHTML = val; el.style.opacity = '1'; }, 90);
    } else {
      el.innerHTML = val;
    }
  });

  // Update toggle button
  const btn = document.getElementById('langToggle');
  if (btn) btn.innerHTML = lang === 'en' ? '🇬🇷&thinsp;ΕΛ' : '🇬🇧&thinsp;EN';

  return Promise.all(promises);
}

function initI18n() {
  const saved = localStorage.getItem('findme-lang') || 'en';
  applyLang(saved, false);
  document.getElementById('langToggle')
    ?.addEventListener('click', () => {
      const next = (localStorage.getItem('findme-lang') || 'en') === 'en' ? 'el' : 'en';
      applyLang(next, true);
    });
}
