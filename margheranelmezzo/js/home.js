// Home: "Dalla galleria" — six works in one row, a fresh random pick on each visit and on "Mescola".
(() => {
const { loadWorks, cardHTML, shuffle, onLang, t, esc } = window.MNM;

const list = document.getElementById('preview');
let works = [];
let pick = [];

function render() {
  list.innerHTML = pick.map(w => `<li>${cardHTML(w, { large: true })}</li>`).join('');
}

document.getElementById('shuffle').addEventListener('click', () => {
  pick = shuffle(works).slice(0, 6);
  render();
});
onLang(render);

loadWorks()
  .then(all => {
    works = all;
    pick = shuffle(works).slice(0, 6);
    render();
  })
  .catch(() => { list.innerHTML = `<li><p>${esc(t('common.loadError'))}</p></li>`; });
})();
