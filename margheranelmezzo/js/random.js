// random.html: jump to a random work (kept so old links to the "Sorprendimi" page still work).
(() => {
const { loadWorks, workHref } = window.MNM;

loadWorks()
  .then(all => { location.replace(workHref(all[Math.floor(Math.random() * all.length)])); })
  .catch(() => { location.replace('search.html'); });
})();
