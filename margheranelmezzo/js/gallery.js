// Galleria: search (title + author), type filter, sort, grid/list view.
// The current choices live in the URL (?q=&tipo=&ordina=&vista=) so a filtered view can be shared or bookmarked.
(() => {
const { loadWorks, cardHTML, onLang, t, esc, symbol, TYPES, workHref, authorOf, thumbImg } = window.MNM;

const $ = id => document.getElementById(id);
const els = { q: $('q'), sort: $('sort'), sortM: $('sort-m'), sortTxt: $('sort-txt'), chips: $('chips'), count: $('count'), results: $('results'),
  filtersBtn: $('filters-btn'), filtersN: $('filters-n'), panel: $('filters-panel') };
const phone = matchMedia('(max-width: 760px)');
const viewBtns = document.querySelectorAll('.seg [data-view]');

const params = new URLSearchParams(location.search);
const state = {
  q: params.get('q') || '',
  type: TYPES.includes(params.get('tipo')) ? params.get('tipo') : 'all',
  sort: ['new', 'old', 'author', 'title'].includes(params.get('ordina')) ? params.get('ordina') : 'new',
  view: params.get('vista') === 'list' ? 'list' : 'grid'
};
let works = [];

function saveState() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.type !== 'all') p.set('tipo', state.type);
  if (state.sort !== 'new') p.set('ordina', state.sort);
  if (state.view !== 'grid') p.set('vista', state.view);
  const lang = new URLSearchParams(location.search).get('lang');
  if (lang) p.set('lang', lang);
  const qs = p.toString();
  try { history.replaceState(null, '', qs ? `?${qs}` : location.pathname); } catch (e) { /* opened from a file */ }
}

// Sort orders; titles and authors are compared alphabetically in the current language.
function sorter(kind) {
  const coll = new Intl.Collator(document.documentElement.lang, { sensitivity: 'base' });
  return {
    new: (a, b) => (b.yearNum ?? -1) - (a.yearNum ?? -1),
    old: (a, b) => (a.yearNum ?? 9999) - (b.yearNum ?? 9999),
    author: (a, b) => coll.compare(authorOf(a), authorOf(b)),
    title: (a, b) => coll.compare(a.title, b.title)
  }[kind];
}

const fold = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function render() {
  const qq = fold(state.q.trim());
  const base = works.filter(w => !qq || fold(`${w.title} ${authorOf(w)}`).includes(qq));
  const items = base.filter(w => state.type === 'all' || w.type === state.type).sort(sorter(state.sort));

  // Type filters, with counts for the current search (in the page on computers, in the "Filtri" panel on phones).
  const filters = ['all', ...TYPES].map(k => ({
    k,
    label: k === 'all' ? t('gallery.all') : t('common.types')[k],
    n: k === 'all' ? base.length : base.filter(w => w.type === k).length
  }));
  els.chips.innerHTML = filters.map(f => `<button type="button" class="chip" data-type="${f.k}" aria-pressed="${state.type === f.k}">`
    + `<span class="sym" aria-hidden="true">${f.k === 'all' ? '' : symbol(f.k, 20, 4)}</span>`
    + `${esc(f.label)} <span class="chip__n">${f.n}</span></button>`).join('');
  els.sort.value = state.sort;
  els.sortM.value = state.sort;
  if (els.q.value !== state.q) els.q.value = state.q;
  viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));

  // The count also says which type is shown, since on phones the filters are tucked away.
  els.count.textContent = t('gallery.count')(items.length) + (state.type === 'all' ? '' : ` · ${t('common.types')[state.type]}`);
  // On phones the order follows, e.g. "14 opere · dal più recente ▾", and tapping it changes it.
  els.sortTxt.textContent = t('gallery.sortsShort')[state.sort];
  // Number of active filters on the "Filtri" button (on phones the panel only holds the types).
  const active = state.type !== 'all' ? 1 : 0;
  els.filtersN.hidden = !active;
  els.filtersN.textContent = active || '';

  if (!items.length) {
    els.results.innerHTML = `<div class="empty"><h2>${esc(t('gallery.emptyTitle'))}</h2><p>${esc(t('gallery.emptyBody'))}</p>`
      + `<button type="button" class="pill pill--ink" id="reset">${esc(t('gallery.reset'))}</button></div>`;
    $('reset').addEventListener('click', () => { state.q = ''; state.type = 'all'; update(); els.q.focus(); });
    return;
  }

  if (state.view === 'grid') {
    els.results.innerHTML = `<ul class="grid-works">${items.map(w => `<li>${cardHTML(w, { yearFallback: true })}</li>`).join('')}</ul>`;
    return;
  }

  const type1 = t('common.type');
  const rows = items.map(w => {
    const thumb = w.thumb
      ? thumbImg(w.thumb, 'alt="" loading="lazy" decoding="async"')
      : `<span class="mini-tile tile--${w.type}" aria-hidden="true">${symbol(w.type, 22)}</span>`;
    return `<tr><td>${thumb}</td><td><a href="${workHref(w)}">${esc(w.title)}</a></td>`
      + `<td>${esc(authorOf(w))}</td><td>${esc(w.year || '—')}</td><td>${esc(type1[w.type])}</td></tr>`;
  }).join('');
  els.results.innerHTML = `<div class="table-wrap"><table class="works-table"><thead><tr>`
    + `<th scope="col" style="width:76px"><span class="sr-only">${esc(t('gallery.colType'))}</span></th>`
    + `<th scope="col">${esc(t('gallery.colTitle'))}</th><th scope="col">${esc(t('gallery.colAuthor'))}</th>`
    + `<th scope="col" style="width:100px">${esc(t('gallery.colYear'))}</th><th scope="col" style="width:120px">${esc(t('gallery.colType'))}</th>`
    + `</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function update() { saveState(); render(); }

els.q.addEventListener('input', () => { state.q = els.q.value; update(); });
/* "Filtri" panel (phones only) */
function setPanel(open, { focusBtn = false } = {}) {
  els.panel.classList.toggle('is-open', open);
  els.filtersBtn.setAttribute('aria-expanded', String(open));
  if (focusBtn) els.filtersBtn.focus();
}
els.filtersBtn.addEventListener('click', () => {
  const open = !els.panel.classList.contains('is-open');
  setPanel(open);
  if (open) els.chips.querySelector('[aria-pressed="true"]')?.focus();
});
document.addEventListener('click', e => {
  if (els.panel.classList.contains('is-open') && !els.panel.contains(e.target) && !els.filtersBtn.contains(e.target)) setPanel(false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && els.panel.classList.contains('is-open')) setPanel(false, { focusBtn: true });
});
phone.addEventListener('change', () => { setPanel(false); setPlaceholder(); });

// A shorter search hint on phones, so it isn't cut off.
function setPlaceholder() { els.q.placeholder = t(phone.matches ? 'gallery.searchPhShort' : 'gallery.searchPh'); }
setPlaceholder();

els.sort.addEventListener('change', () => { state.sort = els.sort.value; update(); });
els.sortM.addEventListener('change', () => { state.sort = els.sortM.value; update(); });
els.chips.addEventListener('click', e => {
  const b = e.target.closest('[data-type]');
  if (!b) return;
  state.type = b.dataset.type;
  update();
  if (phone.matches) setPanel(false, { focusBtn: true }); // close the panel and show the results
  else els.chips.querySelector(`[data-type="${state.type}"]`)?.focus();
});
viewBtns.forEach(b => b.addEventListener('click', () => { state.view = b.dataset.view; update(); }));
onLang(() => { render(); setPlaceholder(); });

els.q.value = state.q;
loadWorks()
  .then(all => { works = all; render(); })
  .catch(() => { els.results.innerHTML = `<p>${esc(t('common.loadError'))}</p>`; });
})();
