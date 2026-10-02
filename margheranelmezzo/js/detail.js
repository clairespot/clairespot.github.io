// Work page: detail.html?opera=<slug>
// Fixed media frame (photo viewer + lightbox, video, audio, text), info aside, share, surprise, previous/next.
(() => {
const { loadWorks, onLang, t, esc, symbol, workHref, authorOf, youtubeId, thumbImg, descOf } = window.MNM;

const root = document.getElementById('work');
const wanted = new URLSearchParams(location.search).get('opera');
if (!wanted) location.replace('search.html');

let works = [];
let work = null;
let idx = 0; // current photo in a series
const textCache = {};

/* ---------- Media ---------- */
function embedSrc(src) {
  const yt = youtubeId(src);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt}`;
  const sp = /open\.spotify\.com\/(?!embed)(track|album|playlist|episode|show|artist)\/(\w+)/.exec(src);
  if (sp) return `https://open.spotify.com/embed/${sp[1]}/${sp[2]}`;
  if (/soundcloud\.com\//.test(src) && !/w\.soundcloud\.com/.test(src)) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(src)}&visual=false`;
  return src;
}
const isRemote = src => /^https?:\/\//.test(src);
// Works in another language (e.g. "lang": "en" in archive.js) are marked so screen readers pronounce them correctly.
const langAttr = w => (w.lang ? ` lang="${esc(w.lang)}"` : '');

function photoAlt(i) {
  if (work.alts[i]) return work.alts[i]; // AltText Poetry, when there is one
  return work.srcs.length > 1 ? `${work.title} – ${t('detail.photoN')(i + 1, work.srcs.length)}` : work.title;
}

function mediaHTML() {
  const w = work;
  const src = w.srcs[0] || '';
  if (w.isImage || (w.type === 'Other' && w.thumb && !src)) {
    const multi = w.srcs.length > 1;
    const img = `<img class="stage__img" id="stage-img" src="${esc(w.srcs[idx] || w.thumb)}" alt="${esc(photoAlt(idx))}" tabindex="0" role="button" `
      + `aria-haspopup="dialog" title="${esc(t('detail.zoomHint'))}">`;
    const ctl = multi
      ? `<button type="button" class="arrow arrow--prev ctl" data-step="-1" aria-label="${esc(t('detail.prevImg'))}">←</button>`
        + `<button type="button" class="arrow arrow--next ctl" data-step="1" aria-label="${esc(t('detail.nextImg'))}">→</button>`
        + `<span class="counter ctl" id="counter" aria-live="polite">${idx + 1} / ${w.srcs.length}</span>`
      : '';
    const thumbs = multi
      ? `<div class="thumbs" role="group" aria-label="${esc(t('detail.allPhotos'))}">`
        + w.srcs.map((s, i) => `<button type="button" data-photo="${i}" aria-label="${esc(t('detail.photoN')(i + 1, w.srcs.length))}"${i === idx ? ' aria-current="true"' : ''}>`
          + `${thumbImg(s, 'alt="" loading="lazy" decoding="async"')}</button>`).join('')
        + '</div>'
      : '';
    return `<div class="viewer"><div class="stage" id="stage">${img}${ctl}</div>${thumbs}</div>`;
  }
  if (w.type === 'Video') {
    if (isRemote(src)) {
      return `<div class="media-dark"><iframe src="${esc(embedSrc(src))}" title="${esc(w.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>`;
    }
    return `<div class="media-dark"><video controls preload="metadata" playsinline src="${esc(src)}"${w.thumb ? ` poster="${esc(w.thumb)}"` : ''}>${esc(t('detail.videoFallback'))}</video></div>`;
  }
  if (w.type === 'Audio') {
    const player = isRemote(src)
      ? `<iframe src="${esc(embedSrc(src))}" title="${esc(w.title)}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
      : `<audio controls preload="metadata" src="${esc(src)}"></audio>`;
    const sp = /open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode|show)\/(\w+)/.exec(src);
    const full = sp ? `<a class="media-audio__more" href="https://open.spotify.com/${sp[1]}/${sp[2]}" target="_blank" rel="noopener">${esc(t('detail.listenFull'))} <span aria-hidden="true">↗</span></a>` : '';
    return `<div class="media-audio"><div class="media-audio__head"><span class="disc" aria-hidden="true">♪</span>`
      + `<span class="media-audio__title"${langAttr(w)}>${esc(w.title)}</span></div>${player}${full}</div>`;
  }
  if (w.type === 'Text') {
    return `<article class="media-text" tabindex="0" aria-labelledby="work-title"><span class="media-text__mark" aria-hidden="true">¶</span>`
      + `<p class="media-text__title" aria-hidden="true"${langAttr(w)}>${esc(w.title)}</p>`
      + `<div class="media-text__body" id="text-body"${langAttr(w)}>${esc(w.text || (textCache[src] ?? ''))}</div></article>`;
  }
  return `<article class="media-text"><span class="media-text__mark" aria-hidden="true">+</span><p class="media-text__title" aria-hidden="true">${esc(w.title)}</p>`
    + (isRemote(src) ? `<p><a href="${esc(src)}" target="_blank" rel="noopener">${esc(src)}</a></p>` : '') + '</article>';
}

function loadText() {
  const src = work.srcs[0];
  if (work.type !== 'Text' || work.text || !src || src in textCache) return;
  fetch(src)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(txt => { textCache[src] = txt.trim(); })
    .catch(() => { textCache[src] = t('detail.textError'); })
    .finally(() => { const el = document.getElementById('text-body'); if (el) el.textContent = textCache[src]; });
}

/* ---------- Page ---------- */
function pnHTML(cls) {
  const n = works.length;
  const prev = works[(work.i - 1 + n) % n], next = works[(work.i + 1) % n];
  return `<nav class="pn ${cls}" aria-label="${esc(t('detail.moreNav'))}">`
    + `<a class="pn-card" href="${workHref(prev)}" rel="prev"><span class="pn-card__k">← ${esc(t('detail.prevWork'))}</span><span class="pn-card__t">${esc(prev.title)}</span></a>`
    + `<a class="pn-card pn-card--next" href="${workHref(next)}" rel="next"><span class="pn-card__k">${esc(t('detail.nextWork'))} →</span><span class="pn-card__t">${esc(next.title)}</span></a></nav>`;
}

function render() {
  if (!work) {
    document.title = `${t('detail.notFoundTitle')} · Marghera nel Mezzo`;
    root.innerHTML = `<div class="notfound"><h1>${esc(t('detail.notFoundTitle'))}</h1><p>${esc(t('detail.notFoundBody'))}</p>`
      + `<a class="pill pill--ink" href="search.html">${esc(t('detail.back'))} →</a></div>`;
    return;
  }
  const w = work;
  const label = t('common.type')[w.type];
  document.title = `${w.title} · Marghera nel Mezzo`;

  const by = `${esc(t('detail.by'))} <strong>${esc(authorOf(w))}</strong>`
    + (w.year ? ` · ${esc(w.year)}` : '')
    + (w.place ? `<span class="sep-place"> · </span><span class="place"><span aria-hidden="true">⌖</span> <span class="sr-only">${esc(t('detail.place'))}: </span>${esc(w.place)}</span>` : '');

  root.innerHTML = `<div class="det">
    <div class="det__media">
      <div class="frame${w.type === 'Text' ? ' frame--text' : ''}">${mediaHTML()}</div>
      ${works.length > 1 ? pnHTML('pn--wide') : ''}
    </div>
    <aside class="det__info">
      <div class="det__head">
        <div class="det__titlerow">
          <h1 id="work-title"${langAttr(w)}>${esc(w.title)}</h1>
          <span class="det__sym sym" role="img" aria-label="${esc(label)}" title="${esc(label)}">${symbol(w.type, 38)}</span>
        </div>
        <p class="byline">${by}</p>
      </div>
      ${descOf(w) ? `<p class="desc">${esc(descOf(w))}</p>` : ''}
      ${w.bond ? `<dl class="facts"><div><dt>${esc(t('detail.bond'))}</dt><dd>${esc(w.bond)}</dd></div></dl>` : ''}
      <div class="det__btns">
        <button type="button" class="pill pill--white pill--hover-acc" id="share">↗ ${esc(t('detail.share'))}</button>
        ${works.length > 1 ? `<button type="button" class="pill pill--acc pill--hover-lift" id="surprise"><span aria-hidden="true">↻</span> ${esc(t('detail.random'))}</button>` : ''}
      </div>
      <a class="invite" href="upload.html"><span class="invite__plus" aria-hidden="true">+</span><span>${esc(t('detail.addQ'))} <strong>${esc(t('detail.addCta'))} →</strong></span></a>
    </aside>
  </div>
  ${works.length > 1 ? pnHTML('pn--narrow') : ''}`;

  loadText();
  bind();
}

/* ---------- Photo series ---------- */
function showPhoto(i) {
  const n = work.srcs.length;
  idx = (i + n) % n;
  const img = document.getElementById('stage-img');
  if (img) { img.src = work.srcs[idx]; img.alt = photoAlt(idx); }
  const counter = document.getElementById('counter');
  if (counter) counter.textContent = `${idx + 1} / ${n}`;
  root.querySelectorAll('.thumbs [data-photo]').forEach(b => {
    const on = Number(b.dataset.photo) === idx;
    if (on) {
      b.setAttribute('aria-current', 'true');
      const strip = b.parentElement, r = b.getBoundingClientRect(), sr = strip.getBoundingClientRect();
      strip.scrollBy({ left: (r.left + r.width / 2) - (sr.left + sr.width / 2), behavior: 'smooth' });
    } else b.removeAttribute('aria-current');
  });
  if (n > 1) new Image().src = work.srcs[(idx + 1) % n]; // warm up the next photo
  lightbox.sync();
}

function bind() {
  const stage = document.getElementById('stage');
  if (stage) {
    let swipe = null, swiped = false;
    stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') swipe = { x: e.clientX, y: e.clientY }; });
    stage.addEventListener('pointerup', e => {
      if (!swipe || work.srcs.length < 2) { swipe = null; return; }
      const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; showPhoto(idx + (dx < 0 ? 1 : -1)); }
    });
    stage.addEventListener('click', e => {
      if (swiped) { swiped = false; return; } // a swipe isn't a tap
      const step = e.target.closest('[data-step]');
      if (step) { showPhoto(idx + Number(step.dataset.step)); return; }
      stage.classList.add('is-on'); // tap on touch screens reveals the arrows
      if (e.target.id === 'stage-img') lightbox.open(e.target);
    });
    stage.addEventListener('keydown', e => {
      if (e.target.id === 'stage-img' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); lightbox.open(e.target); }
    });
  }
  root.querySelector('.thumbs')?.addEventListener('click', e => {
    const b = e.target.closest('[data-photo]');
    if (b) showPhoto(Number(b.dataset.photo));
  });

  const share = document.getElementById('share');
  share.addEventListener('click', async () => {
    const url = location.href;
    if (navigator.share) {
      try { await navigator.share({ title: work.title, url }); } catch (e) { /* cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      const tmp = Object.assign(document.createElement('input'), { value: url });
      document.body.append(tmp); tmp.select(); document.execCommand('copy'); tmp.remove();
    }
    share.textContent = t('detail.copied');
    setTimeout(() => { share.textContent = `↗ ${t('detail.share')}`; }, 3000);
  });

  document.getElementById('surprise')?.addEventListener('click', () => {
    let j;
    do { j = Math.floor(Math.random() * works.length); } while (j === work.i && works.length > 1);
    location.href = workHref(works[j]);
  });
}

document.addEventListener('keydown', e => {
  if (!work || work.srcs.length < 2 || !work.isImage) return;
  if (e.target.closest?.('input, textarea, select, iframe, video, audio')) return;
  if (e.key === 'ArrowRight') showPhoto(idx + 1);
  if (e.key === 'ArrowLeft') showPhoto(idx - 1);
});

/* ---------- Lightbox: zoom (click, +/−, pinch), arrows for series, Esc closes ---------- */
const lightbox = (() => {
  let dlg, img, cap, opener;
  let z = 1, ox = 50, oy = 50;
  const pts = new Map();
  let pinch = null, drag = null, moved = false, pinched = false;

  const apply = () => {
    img.style.transformOrigin = `${ox}% ${oy}%`;
    img.style.transform = `scale(${z})`;
    img.classList.toggle('is-zoomed', z > 1);
  };
  const setZoom = v => { z = Math.min(4, Math.max(1, v)); if (z === 1) { ox = 50; oy = 50; } apply(); };
  const clamp = v => Math.min(100, Math.max(0, v));
  const at = (x, y) => {
    const r = img.getBoundingClientRect();
    return [clamp((x - r.left) / r.width * 100), clamp((y - r.top) / r.height * 100)];
  };

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML = `<div class="lightbox__bar"><span class="lightbox__cap" id="lb-cap"></span><div class="lightbox__tools">
        <button type="button" class="lb-btn" data-z="-1" aria-label="">−</button>
        <button type="button" class="lb-btn" data-z="1" aria-label="">+</button>
        <button type="button" class="lb-btn lb-btn--close" data-close aria-label="" autofocus>✕</button>
      </div></div>
      <div class="lightbox__stage"><img class="lightbox__img" alt="" draggable="false">
        <button type="button" class="lb-arrow lb-arrow--prev" data-step="-1" aria-label="">←</button>
        <button type="button" class="lb-arrow lb-arrow--next" data-step="1" aria-label="">→</button>
      </div>`;
    document.body.append(dlg);
    img = dlg.querySelector('img');
    cap = dlg.querySelector('#lb-cap');

    dlg.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.z) setZoom(z + Number(b.dataset.z));
      if (b.dataset.step) showPhoto(idx + Number(b.dataset.step));
      if ('close' in b.dataset) dlg.close();
    });
    dlg.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      setZoom(1);
      opener?.focus();
    });

    img.addEventListener('click', e => {
      if (moved) { moved = false; return; }
      if (z > 1) { setZoom(1); return; }
      [ox, oy] = at(e.clientX, e.clientY);
      setZoom(2.5);
    });
    img.addEventListener('mousemove', e => {
      if (z > 1 && !drag) { [ox, oy] = at(e.clientX, e.clientY); apply(); }
    });
    img.addEventListener('pointerdown', e => {
      if (!pts.size) { moved = false; pinched = false; } // a new gesture starts
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      img.setPointerCapture(e.pointerId);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z };
        [ox, oy] = at((a.x + b.x) / 2, (a.y + b.y) / 2);
        img.classList.add('is-pinching');
        moved = true;
        pinched = true;
      } else if (e.pointerType !== 'mouse') {
        drag = { x: e.clientX, y: e.clientY, ox, oy };
      }
    });
    img.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size === 2) {
        const [a, b] = [...pts.values()];
        z = Math.min(4, Math.max(1, pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
        apply();
      } else if (drag && z > 1) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        ox = clamp(drag.ox - dx / (z - 1) / img.offsetWidth * 100);
        oy = clamp(drag.oy - dy / (z - 1) / img.offsetHeight * 100);
        apply();
      }
    });
    const end = e => {
      const start = drag;
      pts.delete(e.pointerId);
      if (pts.size < 2 && pinch) { pinch = null; img.classList.remove('is-pinching'); if (z < 1.05) setZoom(1); }
      if (!pts.size) {
        // swipe left/right (at normal size) to change photo
        if (start && !pinched && z === 1 && work.srcs.length > 1) {
          const dx = e.clientX - start.x, dy = e.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { moved = true; showPhoto(idx + (dx < 0 ? 1 : -1)); }
        }
        drag = null;
      }
    };
    img.addEventListener('pointerup', end);
    img.addEventListener('pointercancel', end);
  }

  function sync() {
    if (!dlg?.open) return;
    const multi = work.srcs.length > 1;
    img.src = work.srcs[idx] || work.thumb;
    img.alt = photoAlt(idx);
    cap.textContent = work.title + (multi ? ` · ${idx + 1} / ${work.srcs.length}` : '');
    dlg.querySelectorAll('[data-step]').forEach(b => { b.hidden = !multi; });
    setZoom(1);
  }

  function labels() {
    if (!dlg) return;
    dlg.setAttribute('aria-label', t('detail.zoomLabel'));
    dlg.querySelector('[data-z="-1"]').setAttribute('aria-label', t('detail.zoomOut'));
    dlg.querySelector('[data-z="1"]').setAttribute('aria-label', t('detail.zoomIn'));
    dlg.querySelector('[data-close]').setAttribute('aria-label', t('detail.close'));
    dlg.querySelector('.lb-arrow--prev').setAttribute('aria-label', t('detail.prevImg'));
    dlg.querySelector('.lb-arrow--next').setAttribute('aria-label', t('detail.nextImg'));
  }

  return {
    open(from) {
      if (!dlg) build();
      opener = from;
      labels();
      dlg.showModal();
      dlg.querySelector('[data-close]').focus();
      document.documentElement.style.overflow = 'hidden';
      sync();
    },
    sync,
    labels
  };
})();

onLang(() => { render(); lightbox.labels(); });

loadWorks()
  .then(all => {
    works = all;
    work = works.find(w => w.slug === wanted) || null;
    if (work) document.querySelectorAll('.aa').forEach(a => { a.href = `testo-opera.html?opera=${encodeURIComponent(work.slug)}`; });
    render();
  })
  .catch(() => { root.innerHTML = `<p>${esc(t('common.loadError'))}</p>`; });
})();
