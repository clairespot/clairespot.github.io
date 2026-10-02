// Il progetto: a single row of six works from the gallery, each linking to its page.
(() => {
const { loadWorks, onLang, esc, workHref, authorOf, thumbImg } = window.MNM;

// Chosen by slug; change this list to feature different works.
const FEATURED = ['piazzale-radaelli', 'marghera-notturna', 'marghera-nel-mezzo', 'scorcio-sulla-chiesa-di-san-michele-arcangelo', '30175-de-marghera', 'particolare-di-abitazione'];
const row = document.getElementById('pj-works');
let picks = [];

function render() {
  row.innerHTML = picks.map(w => `<a class="pj-work" href="${workHref(w)}">`
    + thumbImg(w.thumb, `alt="${esc(`${w.title}, ${authorOf(w)}`)}" loading="lazy" decoding="async"`)
    + `<span><strong>${esc(w.title)}</strong><small>${esc([authorOf(w), w.year].filter(Boolean).join(' · '))}</small></span></a>`).join('');
}

onLang(render);
loadWorks().then(all => {
  picks = FEATURED.map(s => all.find(w => w.slug === s)).filter(w => w && w.thumb);
  render();
}).catch(() => { row.hidden = true; });
})();
