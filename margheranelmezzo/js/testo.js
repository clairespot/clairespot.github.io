// Text-only pages (testo*.html), styled by the shared clairespot.com text-only stylesheet (../style.css).
// Every page: the "English / Italiano" link. Galleria: all works as a plain list, grouped by type.
// Opera (testo-opera.html?opera=<slug>): one work in words, with its full text, AltText Poetry and listen/watch links.
(() => {
const { loadWorks, onLang, setLang, getLang, t, esc, authorOf, youtubeId, TYPES, descOf } = window.MNM;

const page = document.body.dataset.textPage;
const toggle = document.getElementById('lang-toggle');
const textHref = w => `testo-opera.html?opera=${encodeURIComponent(w.slug)}`;

/* ---------- Language link (switches in place; also works as a plain link) ---------- */
function syncToggle() {
  const other = getLang() === 'it' ? 'en' : 'it';
  const url = new URL(location.href);
  url.searchParams.set('lang', other);
  toggle.textContent = t('testo.toggle');
  toggle.lang = other;
  toggle.href = url.pathname.split('/').pop() + url.search;
}
toggle.addEventListener('click', e => {
  e.preventDefault();
  setLang(getLang() === 'it' ? 'en' : 'it');
  const url = new URL(location.href);
  url.searchParams.delete('lang');
  try { history.replaceState(null, '', url.pathname.split('/').pop() + url.search + url.hash); } catch (err) { /* opened from a file */ }
});
onLang(syncToggle);
syncToggle();

function mediaLink(w) {
  const src = w.srcs[0] || '';
  const yt = youtubeId(src);
  if (yt) return `<a href="https://www.youtube.com/watch?v=${yt}" target="_blank" rel="noopener">${esc(t('testo.watchYT'))}</a>`;
  const sp = /open\.spotify\.com\/(?:embed\/)?(\w+)\/(\w+)/.exec(src);
  if (sp) return `<a href="https://open.spotify.com/${sp[1]}/${sp[2]}" target="_blank" rel="noopener">${esc(t('testo.listen'))}</a>`;
  if ((w.type === 'Video' || w.type === 'Audio') && src) return `<a href="${esc(src)}" target="_blank" rel="noopener">${esc(t('testo.watchFile'))}</a>`;
  return '';
}

/* ---------- Galleria: every work, grouped by type ---------- */
function renderGallery(works) {
  const list = document.getElementById('works');
  const count = document.getElementById('count');
  const render = () => {
    count.textContent = t('gallery.count')(works.length);
    list.innerHTML = [...TYPES, 'Other'].map(type => {
      const group = works.filter(w => w.type === type);
      if (!group.length) return '';
      return `<h2>${esc(t('common.types')[type])} (${group.length})</h2><ul>`
        + group.map(w => `<li><a href="${textHref(w)}">${esc(w.title)}</a> — ${esc([authorOf(w), w.year].filter(Boolean).join(', '))}</li>`).join('')
        + '</ul>';
    }).join('');
  };
  onLang(render);
  render();
}

/* ---------- Opera: one work in words ---------- */
function renderWork(works) {
  const root = document.getElementById('work');
  const slug = new URLSearchParams(location.search).get('opera');
  const i = works.findIndex(w => w.slug === slug);
  const w = works[i];
  if (w) document.getElementById('full-site').href = `detail.html?opera=${encodeURIComponent(w.slug)}`;

  const render = () => {
    if (!w) {
      document.title = `${t('detail.notFoundTitle')} · ${t('testo.titles.opera')}`;
      root.innerHTML = `<h1>${esc(t('detail.notFoundTitle'))}</h1><p>${esc(t('detail.notFoundBody'))}</p>`;
      return;
    }
    document.title = `${w.title} · ${t('testo.titles.opera')}`;
    const n = works.length;
    const prev = works[(i - 1 + n) % n], next = works[(i + 1) % n];
    const meta = [`${t('testo.by')} ${authorOf(w)}`, w.year, w.count ? t('testo.series')(w.count) : ''].filter(Boolean).join(' · ');
    const alts = w.alts || [];
    const poems = !alts.length ? ''
      : alts.length === 1 ? `<h2>${esc(t('testo.altPoetry'))}</h2><p class="poem">${esc(alts[0])}</p>`
      : `<h2>${esc(t('testo.altPoetry'))}</h2><ol>${alts.map(a => `<li><p class="poem">${esc(a)}</p></li>`).join('')}</ol>`;
    const extra = mediaLink(w);
    const lang = w.lang ? ` lang="${esc(w.lang)}"` : '';
    root.innerHTML = `<p class="identity-label">${esc(t('common.type')[w.type])}</p>`
      + `<h1${lang}>${esc(w.title)}</h1><p class="meta">${esc(meta)}</p>`
      + (w.place ? `<p>${esc(t('testo.place'))}: ${esc(w.place)}</p>` : '')
      + (descOf(w) ? `<p>${esc(descOf(w))}</p>` : '')
      + (w.bond ? `<p>${esc(t('testo.bond'))}: ${esc(w.bond)}</p>` : '')
      + (w.type === 'Text' && w.text ? `<p class="poem"${lang}>${esc(w.text)}</p>` : '')
      + poems
      + `<ul>${extra ? `<li>${extra}</li>` : ''}<li><a href="detail.html?opera=${encodeURIComponent(w.slug)}">${esc(t('testo.viewWork'))}</a></li></ul>`
      + `<h2>${esc(t('detail.moreNav'))}</h2><ul>`
      + `<li>${esc(t('detail.prevWork'))}: <a href="${textHref(prev)}">${esc(prev.title)}</a></li>`
      + `<li>${esc(t('detail.nextWork'))}: <a href="${textHref(next)}">${esc(next.title)}</a></li></ul>`;
  };
  onLang(render);
  render();
}

if (page === 'galleria' || page === 'opera') {
  loadWorks()
    .then(works => (page === 'galleria' ? renderGallery(works) : renderWork(works)))
    .catch(() => {
      const el = document.getElementById(page === 'galleria' ? 'works' : 'work');
      el.innerHTML = `<p>${esc(t('common.loadError'))}</p>`;
    });
}
})();
