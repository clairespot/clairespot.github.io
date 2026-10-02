// Aggiungi: 1 choose the type → 2 the Tally form (receives the files) → 3 thank-you.
// The chosen type is passed to Tally as ?tipo=… (add a hidden field called "tipo" in Tally to store it).
(() => {
const { getLang, onLang, t, symbol } = window.MNM;

const TALLY_FORM = 'mBVjzK';
const TYPES = ['Photo', 'Video', 'Audio', 'Text', 'Illustration', 'Other'];
// The value sent to Tally's "tipo" field: always these Italian words, in either language, to match the Tally options.
const TIPO = { Photo: 'Foto', Video: 'Video', Audio: 'Audio', Text: 'Testo', Illustration: 'Disegno', Other: 'Altro' };

const $ = id => document.getElementById(id);
const sections = { type: $('step-type'), form: $('step-form'), sent: $('step-sent') };
const stepsEl = $('steps');
let type = null;

function setStep(step, { focus = true } = {}) {
  Object.entries(sections).forEach(([k, el]) => { el.hidden = k !== step; });
  const current = { type: 0, form: 1, sent: 2 }[step];
  stepsEl.querySelectorAll('li').forEach((li, i) => {
    li.toggleAttribute('aria-current', i === current);
    if (i === current) li.setAttribute('aria-current', 'step');
    li.classList.toggle('is-done', i < current);
    li.querySelector('.steps__mark').textContent = i < current ? '✓' : String(i + 1);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (focus) {
    const target = step === 'type' ? $('type-q') : step === 'form' ? $('change') : sections.sent;
    if (target.id === 'type-q') target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

function renderChosen() {
  if (!type) return;
  $('chosen').innerHTML = `<span class="sym" aria-hidden="true">${symbol(type, 24)}</span><span>${t(`upload.types.${type}.0`)}</span>`;
}

function loadTally() {
  const wrap = $('tally');
  const params = new URLSearchParams({
    alignLeft: '1', hideTitle: '1', transparentBackground: '1', dynamicHeight: '1',
    tipo: TIPO[type], lingua: getLang()
  });
  // A short message until the form appears (it comes from Tally and can take a few seconds)
  wrap.innerHTML = `<p class="tally-loading">${t('upload.loading')}</p>`;
  const frame = document.createElement('iframe');
  // (an empty frame also reports "loaded" at first: wait until it has Tally's address)
  frame.addEventListener('load', () => { if (frame.getAttribute('src')) wrap.querySelector('.tally-loading')?.remove(); });
  frame.dataset.tallySrc = `https://tally.so/embed/${TALLY_FORM}?${params}`;
  frame.title = t('upload.formTitle');
  frame.width = '100%';
  frame.height = '900';
  frame.loading = 'lazy';
  wrap.append(frame);

  const load = () => {
    if (window.Tally) window.Tally.loadEmbeds();
    else frame.src = frame.dataset.tallySrc;
  };
  if (window.Tally) load();
  else if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
    const s = document.createElement('script');
    s.src = 'https://tally.so/widgets/embed.js';
    s.onload = load;
    s.onerror = load;
    document.body.append(s);
  } else load();
}

// Videos are often bigger than the form's 10 MB limit: suggest a link or WhatsApp instead.
function showVideoNote() { $('video-note').hidden = type !== 'Video'; }

function choose(k) {
  type = k;
  renderChosen();
  showVideoNote();
  loadTally();
  setStep('form');
}

document.querySelectorAll('.type-card').forEach(b => b.addEventListener('click', () => choose(b.dataset.type)));
$('change').addEventListener('click', () => setStep('type'));
$('again').addEventListener('click', () => { type = null; $('tally').innerHTML = ''; setStep('type'); });

// Tally tells the page when the form has been sent.
window.addEventListener('message', e => {
  if (!/^https:\/\/([\w-]+\.)*tally\.so$/.test(e.origin)) return;
  let data = e.data;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (err) { return; } }
  if (data && data.event === 'Tally.FormSubmitted') setStep('sent');
});

onLang(renderChosen);

// upload.html?tipo=Photo jumps straight to the form.
const pre = new URLSearchParams(location.search).get('tipo');
if (TYPES.includes(pre)) {
  type = pre;
  renderChosen();
  showVideoNote();
  loadTally();
  setStep('form', { focus: false });
}
})();
