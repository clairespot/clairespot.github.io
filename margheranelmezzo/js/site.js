// Shared by every page: language, header, the works archive and small helpers.
(() => {
const T = window.MNM_T;

const LANG_KEY = 'mnm-lang';
const listeners = [];

function readLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'it' || q === 'en') { saveLang(q); return q; }
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s === 'it' || s === 'en') return s;
  } catch (e) { /* storage blocked */ }
  return 'it';
}
function saveLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* storage blocked */ }
}

let lang = readLang();
const getLang = () => lang;

// t('home.h1'), t('upload.next.0') — falls back to Italian if a key is missing in English.
function t(key) {
  const walk = obj => key.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  const v = walk(T[lang]);
  return v === undefined ? walk(T.it) : v;
}

function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  });
  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      const v = t(key);
      if (attr && typeof v === 'string') el.setAttribute(attr, v);
    });
  });
  root.querySelectorAll('[data-lang-block]').forEach(el => { el.hidden = el.dataset.langBlock !== lang; });
}

function setLang(l) {
  if (l === lang) return;
  lang = l;
  saveLang(l);
  document.documentElement.lang = l;
  applyI18n();
  syncHeader();
  listeners.forEach(fn => fn(l));
}
const onLang = fn => listeners.push(fn);

/* ---------- Header ---------- */
function syncHeader() {
  document.querySelectorAll('.lang-seg [data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  const lb = document.querySelector('.lang-btn');
  if (lb) {
    lb.textContent = t('common.otherLang');
    lb.setAttribute('lang', t('common.otherLangCode'));
    lb.setAttribute('aria-label', t('common.switchLang'));
  }
}

function initHeader() {
  document.querySelectorAll('.lang-seg [data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  document.querySelector('.lang-btn')?.addEventListener('click', () => setLang(lang === 'it' ? 'en' : 'it'));

  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu-mobile');
  if (!btn || !menu) return;
  const setOpen = open => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? '✕' : '☰';
  };
  btn.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  // Tapping anywhere outside the menu card closes it.
  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
  });
  matchMedia('(max-width: 760px)').addEventListener('change', e => { if (!e.matches) setOpen(false); });
}

/* ---------- Works archive ---------- */
const TYPES = ['Photo', 'Video', 'Audio', 'Text', 'Illustration'];
const GLYPH = { Photo: '', Illustration: '✎', Audio: '♪', Video: '▶', Text: '¶', Other: '+' };

const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function youtubeId(src) {
  const m = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(src || '');
  return m ? m[1] : '';
}

function normalize(w, i) {
  const rawTitle = String(w.title || '').trim();
  const srcs = (Array.isArray(w.src) ? w.src : [w.src]).filter(Boolean);
  const type = TYPES.includes(w.type) ? w.type : 'Other';
  const year = w.year == null ? '' : String(w.year).trim();
  const isImage = type === 'Photo' || type === 'Illustration';
  const yt = youtubeId(srcs[0]);
  const y4 = /\d{4}/.exec(year);
  const o = {
    ...w,
    i, type, year, srcs, isImage,
    rawTitle,
    thumb: w.thumb || (isImage ? srcs[0] : (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : '')),
    ytAuto: !w.thumb && !isImage && !!yt, // YouTube's automatic preview has black bands top and bottom
    count: isImage && srcs.length > 1 ? srcs.length : 0,
    yearNum: y4 ? Number(y4[0]) : null,
    text: String(w.text || '').trim(),
    alts: (Array.isArray(w.alt) ? w.alt : [w.alt]).map(a => String(a || '').trim()).filter(Boolean), // AltText Poetry
    description: String(w.description || '').trim(),
    description_en: String(w.description_en || '').trim(),
    place: String(w.place || '').trim(),
    bond: String(w.bond || '').trim()
  };
  // A work without a title is shown as "Senza titolo" / "Untitled", in the visitor's language.
  Object.defineProperty(o, 'title', { get: () => rawTitle || t('common.untitled'), enumerable: true });
  return o;
}

// Each work's link (detail.html?opera=…) comes from its "id" if it has one, otherwise from its title.
// Two works with the same title get "-2", "-3"…; a work without a title is called "opera".
function withSlugs(list) {
  const seen = new Set();
  list.forEach(w => {
    const base = slug(w.id || w.rawTitle) || 'senza-titolo';
    let s = base;
    for (let k = 2; seen.has(s); k++) s = `${base}-${k}`;
    seen.add(s);
    w.slug = s;
  });
  return list;
}

// The works are listed in archive.js, loaded by each page before this file.
let worksPromise;
function loadWorks() {
  worksPromise ||= Array.isArray(window.ARCHIVE)
    ? spotifyCovers(withSlugs(window.ARCHIVE.map(normalize)))
    : Promise.reject(new Error('archive.js not loaded'));
  return worksPromise;
}

// Music from Spotify without a "thumb": use the cover Spotify publishes for the track.
// If Spotify doesn't answer within 2.5 seconds, the card simply stays a music tile.
function spotifyCovers(list) {
  const todo = list.filter(w => !w.thumb && /open\.spotify\.com\//.test(w.srcs[0] || ''));
  return Promise.all(todo.map(w => {
    const page = w.srcs[0].replace('/embed/', '/').split('?')[0];
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 2500);
    return fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(page)}`, { signal: ctl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && d.thumbnail_url) w.thumb = d.thumbnail_url; })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
  })).then(() => list);
}

const workHref = w => `detail.html?opera=${encodeURIComponent(w.slug)}`;

// Cards and thumbnails use the small copies in thumbs/ (same path as the original).
// If a small copy doesn't exist yet, the picture falls back to the original by itself.
const thumbSrc = src => (!src || /^https?:/.test(src) ? src : `thumbs/${src}`);
const thumbImg = (src, attrs = '') => `<img src="${esc(thumbSrc(src))}"${src && !/^https?:/.test(src) ? ` data-full="${esc(src)}"` : ''} ${attrs}>`;
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName === 'IMG' && img.dataset.full && !img.dataset.fellBack) { img.dataset.fellBack = '1'; img.src = img.dataset.full; }
}, true);

// The description in the current language (English when there is one, otherwise the original).
const descOf = w => (lang === 'en' && w.description_en ? w.description_en : w.description);
const authorOf = w => (w.credit === 'anonymous' || !w.author ? t('common.anon') : w.author);

// Type symbol: a glyph, or the camera drawing for photos. The lens takes the colour of --lens.
function symbol(type, size = 34, stroke = 3) {
  if (type !== 'Photo') return esc(GLYPH[type] ?? '+');
  const w = Math.round(size), h = Math.round(size * 34 / 40);
  return `<svg width="${w}" height="${h}" viewBox="0 0 40 34" fill="none" aria-hidden="true" focusable="false">`
    + '<rect x="10" y="2" width="12" height="7" rx="2" fill="currentColor"/><rect x="2" y="6" width="36" height="26" rx="5" fill="currentColor"/>'
    + `<circle cx="20" cy="19" r="8" fill="none" stroke-width="${stroke}" style="stroke:var(--lens,#fff)"/></svg>`;
}

function cardHTML(w, { large = false, yearFallback = false } = {}) {
  const label = t('common.type')[w.type];
  const year = w.year || (yearFallback ? t('common.noYear') : '');
  const meta = [authorOf(w), year].filter(Boolean).join(' · ') + (w.count ? ` · ${w.count} ${t('common.photos')}` : '');
  const pos = /^(left|right|top|bottom|center)( (left|right|top|bottom|center))?$/.test(w.thumbPosition || '') ? w.thumbPosition : '';
  const media = w.thumb
    ? thumbImg(w.thumb, `class="work-card__img${w.ytAuto ? ' work-card__img--yt' : ''}" alt="" loading="lazy" decoding="async"${pos ? ` style="object-position:${pos}"` : ''}`)
      + `<span class="work-card__sym sym" role="img" aria-label="${esc(label)}" title="${esc(label)}">${symbol(w.type, large ? 40 : 34)}</span>`
      + (w.count && !large ? `<span class="work-card__count" aria-hidden="true">1/${w.count}</span>` : '')
    : `<span class="work-card__tile tile--${w.type}"><span class="ttl" aria-hidden="true">${esc(w.title)}</span></span>`
      + `<span class="work-card__sym work-card__sym--tile sym" role="img" aria-label="${esc(label)}" title="${esc(label)}">${symbol(w.type, large ? 40 : 34)}</span>`;
  return `<a class="work-card${large ? ' work-card--lg' : ''}" href="${workHref(w)}">`
    + `<span class="work-card__media">${media}</span>`
    + `<span class="work-card__text"><span class="work-card__title">${esc(w.title)}</span><span class="work-card__meta">${esc(meta)}</span></span></a>`;
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Links ---------- */
// Links to other websites and to files (PDF, video, audio, images) open in a new tab,
// so the gallery stays open. Email and phone links are left alone (they open an app).
const FILE_LINK = /\.(pdf|mp4|mov|webm|mp3|m4a|wav|ogg|jpe?g|png|gif|txt|zip|docx?)([?#]|$)/i;
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || a.target) return;
  const url = new URL(a.getAttribute('href'), location.href);
  const external = /^https?:$/.test(url.protocol) && url.origin !== location.origin;
  if (external || FILE_LINK.test(url.pathname)) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
});

/* ---------- Boot ---------- */
document.documentElement.lang = lang;
applyI18n();
syncHeader();
initHeader();

window.MNM = { getLang, t, applyI18n, setLang, onLang, TYPES, slug, esc, youtubeId, loadWorks, workHref, authorOf, symbol, cardHTML, shuffle, thumbSrc, thumbImg, descOf };
})();
