// Builds the site's HTML pages: shared <head>, header, CTA band and footer around each page body (pages/*.html),
// plus the text-only pages. Run from the margheranelmezzo folder:  node _build/gen.mjs .
// (Folders starting with _ are not published by GitHub Pages.)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
if (!out) throw new Error('output dir required');

const SITE = 'https://clairespot.com/margheranelmezzo/';

const camera = (w, sw = 3) => {
  const h = Math.round(w * 34 / 40);
  return `<svg width="${w}" height="${h}" viewBox="0 0 40 34" fill="none" aria-hidden="true" focusable="false"><rect x="10" y="2" width="12" height="7" rx="2" fill="currentColor"/><rect x="2" y="6" width="36" height="26" rx="5" fill="currentColor"/><circle cx="20" cy="19" r="8" fill="none" stroke-width="${sw}" style="stroke:var(--lens,#fff)"/></svg>`;
};

const symbolStrip = `<div class="strip-icons">
          <span class="sym" role="img" aria-label="Foto" title="Foto" data-i18n-attr="aria-label:common.symbols.0;title:common.symbols.0">${camera(36, 4)}</span>
          <span class="sym" role="img" aria-label="Video" title="Video" data-i18n-attr="aria-label:common.symbols.1;title:common.symbols.1">▶</span>
          <span class="sym" role="img" aria-label="Musica" title="Musica" data-i18n-attr="aria-label:common.symbols.2;title:common.symbols.2">♪</span>
          <span class="sym" role="img" aria-label="Testo" title="Testo" data-i18n-attr="aria-label:common.symbols.3;title:common.symbols.3">¶</span>
          <span class="sym" role="img" aria-label="Disegno" title="Disegno" data-i18n-attr="aria-label:common.symbols.4;title:common.symbols.4">✎</span>
        </div>`;

const UP_TYPES = [
  ['Photo', 'Foto', 'Una o più fotografie', camera(40)],
  ['Video', 'Video', 'Un file o un link YouTube', '▶'],
  ['Audio', 'Musica o audio', 'Un file o un link Spotify', '♪'],
  ['Text', 'Testo', 'Racconto, poesia, ricordo', '¶'],
  ['Illustration', 'Disegno', 'Disegni, dipinti, grafiche', '✎'],
  ['Other', 'Altro', 'Qualcosa di diverso', '+']
];
const typeCards = UP_TYPES.map(([k, label, hint, glyph]) => `<button type="button" class="type-card" data-type="${k}">
          <span class="sym" aria-hidden="true">${glyph}</span>
          <span class="type-card__txt">
            <span class="type-card__label" data-i18n="upload.types.${k}.0">${label}</span>
            <span class="type-card__hint" data-i18n="upload.types.${k}.1">${hint}</span>
          </span>
        </button>`).join('\n        ');

const IG = ['https://www.instagram.com/p/CwQHymSqCnN/', 'https://www.instagram.com/p/CvFuYPorfCj/', 'https://www.instagram.com/p/CxqSlijKL11/', 'https://www.instagram.com/p/C0JH1FQqrR5/'];
const ACTS = [
  ['01', 'Questionario', 'Il passo che ha coinvolto più persone: 128 risposte a domande come “C’è un luogo in cui ti senti parte della comunità di Marghera?” e “C’è un posto a Marghera in cui non sei mai andato ma che vorresti visitare?”'],
  ['02', 'Interviste', 'Con Laura Boato, StorieStorte e ViviAmo Marghera: da queste conversazioni sono emerse le prime dualità, come memoria e speranza, iniziative dall’alto e dal basso.'],
  ['03', 'Passeggiate di ricerca', 'Da via Fratelli Bandiera alla chiesetta della Rana e ritorno, lungo il confine tra industria e residenza: attività partecipative per raccogliere testimonianze, poi un buffet in giardino.'],
  ['04', 'Mappature collettive', 'Dai temi e luoghi più citati nel questionario, residenti, expat ed esperti di comunità hanno creato le coppie luogo–tema per i portali.']
];
const activityCards = ACTS.map(([n, title, text], i) => `<li>
      <a class="act-card" href="${IG[i]}" target="_blank" rel="noopener">
        <span class="act-card__n">${n}</span>
        <span class="act-card__t" data-i18n="progetto.steps.${i}.1">${title}</span>
        <span class="act-card__p" data-i18n="progetto.steps.${i}.2">${text}</span>
        <span class="act-card__cta"><span data-i18n="progetto.seeIg">Guarda su Instagram</span> <span aria-hidden="true">↗</span><span class="sr-only" data-i18n="progetto.newTab">(si apre in una nuova scheda)</span></span>
      </a>
    </li>`).join('\n    ');

const NAV = [['gallery', 'search.html', 'navGallery', 'Galleria'], ['project', 'progetto.html', 'navProject', 'Progetto'], ['research', 'ricerca.html', 'navResearch', 'Ricerca'], ['contact', 'contatti.html', 'navContact', 'Contatti']];
const navLinks = current => NAV.map(([id, href, key, label]) =>
  `<a href="${href}"${id === current ? ' aria-current="page"' : ''} data-i18n="common.${key}">${label}</a>`);

const header = (current, textHref = 'testo.html') => `<a class="skip" href="#main" data-i18n="common.skip">Vai al contenuto</a>
<header class="site-header">
  <div class="site-header__row">
    <a class="brand" href="index.html" aria-label="Marghera nel Mezzo">
      <img src="IMAGES/web/logo.svg" alt="" width="48" height="48">
      <span class="brand__name">Marghera nel Mezzo</span>
    </a>
    <nav class="nav" aria-label="Menu principale" data-i18n-attr="aria-label:common.mainNav">
      ${navLinks(current).join('\n      ')}
    </nav>
    <div class="lang-seg" role="group" aria-label="Lingua / Language">
      <button type="button" data-lang="it" lang="it" aria-pressed="true">IT</button>
      <button type="button" data-lang="en" lang="en" aria-pressed="false">EN</button>
    </div>
    <button type="button" class="lang-btn" lang="en" aria-label="Switch to English">EN</button>
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-mobile" aria-label="Menu" data-i18n-attr="aria-label:common.menu">☰</button>
    <a class="aa" href="${textHref}" aria-label="Solo testo" title="Solo testo" data-i18n-attr="aria-label:common.textOnly;title:common.textOnly">Aa</a>
  </div>
  <nav id="menu-mobile" class="menu-mobile" hidden aria-label="Menu principale" data-i18n-attr="aria-label:common.mainNav">
    ${navLinks(current).join('\n    ')}
    <a class="menu-mobile__extra" href="upload.html" data-i18n="common.addTitle">Aggiungi la tua opera</a>
  </nav>
</header>`;

const cta = `<section class="cta-band">
  <div class="cta-band__inner">
    <h2 data-i18n="common.ctaTitle">Hai una foto, un disegno, una canzone o un racconto su Marghera?</h2>
    <a class="btn-ink-lg" href="upload.html">+ <span data-i18n="common.addTitle">Aggiungi la tua opera</span></a>
  </div>
</section>`;

const footer = `<footer class="site-footer">
  <div class="site-footer__inner">
    <nav aria-label="Link utili" data-i18n-attr="aria-label:common.footerNav">
      <a href="progetto.html" data-i18n="common.navProject">Progetto</a>
      <a href="ricerca.html" data-i18n="common.navResearch">Ricerca</a>
      <a href="ringraziamenti.html" data-i18n="common.thanks">Ringraziamenti</a>
      <a href="contatti.html" data-i18n="common.navContact">Contatti</a>
      <a href="privacy.html" data-i18n="common.privacy">Privacy</a>
      <a href="https://instagram.com/margheranelmezzo" target="_blank" rel="noopener">Instagram</a>
      <a href="https://facebook.com/margheranelmezzo" target="_blank" rel="noopener">Facebook</a>
    </nav>
    <span class="site-footer__place">Marghera nel Mezzo · Venezia</span>
  </div>
</footer>`;

const head = ({ file, key, title, desc }) => `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title data-i18n="${key}">${title}</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Marghera nel Mezzo">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}IMAGES/web/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#141210">
<link rel="icon" type="image/png" sizes="192x192" href="IMAGES/web/logo-192.png">
<link rel="icon" type="image/svg+xml" href="IMAGES/web/logo.svg">
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="style.css">
</head>`;

const PAGES = [
  { file: 'index.html', text: 'testo.html', key: 'home.docTitle', title: 'Marghera nel Mezzo · Una galleria d’arte comunitaria', desc: 'Una galleria d’arte comunitaria: foto, video, musica, testi e disegni di Marghera (Venezia), raccontata da chi la vive. Guarda le opere o aggiungi la tua.', cta: true, script: 'home' },
  { file: 'search.html', text: 'testo-galleria.html', key: 'gallery.docTitle', title: 'Galleria · Marghera nel Mezzo', desc: 'Tutte le opere di Marghera nel Mezzo: foto, video, musica, testi e disegni. Cerca, filtra per tipo o ordina per anno.', current: 'gallery', script: 'gallery' },
  { file: 'detail.html', text: 'testo-galleria.html', key: 'detail.docTitle', title: 'Opera · Marghera nel Mezzo', desc: 'Un’opera della galleria d’arte comunitaria Marghera nel Mezzo.', script: 'detail' },
  { file: 'upload.html', text: 'testo-aggiungi.html', key: 'upload.docTitle', title: 'Aggiungi la tua opera · Marghera nel Mezzo', desc: 'Aggiungi una foto, un video, una canzone, un racconto o un disegno su Marghera. È gratis e aperto a tutti.', script: 'upload' },
  { file: 'progetto.html', text: 'testo-progetto.html', key: 'progetto.docTitle', title: 'Progetto · Marghera nel Mezzo', desc: 'Marghera nel Mezzo è un progetto di ricerca partecipativa e co-design sul quartiere di Marghera, Venezia.', current: 'project', cta: true, script: 'progetto' },
  { file: 'contatti.html', text: 'testo-contatti.html', key: 'contatti.docTitle', title: 'Contatti · Marghera nel Mezzo', desc: 'Scrivi a Marghera nel Mezzo: email, Instagram, Facebook e WhatsApp.', current: 'contact', script: 'contatti' },
  { file: 'ricerca.html', text: 'testo-ricerca.html', current: 'research', key: 'ricerca.docTitle', title: 'Ricerca · Marghera nel Mezzo', desc: 'La ricerca dietro Marghera nel Mezzo: questionario, interviste, passeggiate di ricerca e mappature collettive.', script: 'site' },
  { file: 'privacy.html', text: 'testo-privacy.html', key: 'privacy.docTitle', title: 'Privacy · Marghera nel Mezzo', desc: 'Come Marghera nel Mezzo tratta i dati di chi visita il sito e di chi aggiunge un’opera.', script: 'site' },
  { file: 'ringraziamenti.html', text: 'testo-ringraziamenti.html', key: 'thanks.docTitle', title: 'Ringraziamenti · Marghera nel Mezzo', desc: 'Grazie a tutte le persone che hanno reso possibile Marghera nel Mezzo.', script: 'site' }
];

for (const p of PAGES) {
  const body = readFileSync(join(here, 'pages', p.file), 'utf8')
    .replaceAll('{{symbolStrip}}', symbolStrip)
    .replaceAll('{{typeCards}}', typeCards)
    .replaceAll('{{activityCards}}', activityCards)
    .trimEnd();
  const html = `${head(p)}
<body>
<div class="page">
${header(p.current, p.text)}

<main id="main" tabindex="-1">
${body}
${p.cta ? '\n' + cta : ''}
</main>

${footer}
</div>
<script src="archive.js" defer></script>
<script src="js/strings.js" defer></script>
<script src="js/site.js" defer></script>
${p.script === 'site' ? '' : `<script src="js/${p.script}.js" defer></script>\n`}
</body>
</html>
`;
  writeFileSync(join(out, p.file), html);
  console.log('wrote', p.file);
}

/* ===================== Text-only pages =====================
   Same layout and stylesheet as clairespot.com's text-only pages (../style.css): a row of links,
   a short note with a link back to the full page, plain headings and lists. No images.
   Italian text is written into the page; English comes from js/strings.js when the language is switched. */

const outDir = out;
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(outDir, 'js/strings.js'), 'utf8'), ctx);
const IT = key => key.split('.').reduce((o, k) => (o == null ? o : o[k]), ctx.window.MNM_T.it);
const escH = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tx = (tag, key, attrs = '') => `<${tag} data-i18n="${key}"${attrs}>${escH(IT(key))}</${tag}>`;

// Links inside reused content point to the text-only versions
const TEXT_OF = { 'index.html': 'testo.html', 'search.html': 'testo-galleria.html', 'upload.html': 'testo-aggiungi.html',
  'progetto.html': 'testo-progetto.html', 'ricerca.html': 'testo-ricerca.html', 'contatti.html': 'testo-contatti.html',
  'ringraziamenti.html': 'testo-ringraziamenti.html', 'privacy.html': 'testo-privacy.html' };
const toText = html => html.replace(/href="([a-z]+\.html)"/g, (m, f) => (TEXT_OF[f] ? `href="${TEXT_OF[f]}"` : m));
// The Italian and English blocks of a page, without the visual styling classes
const langBlocks = file => {
  const src = readFileSync(join(here, 'pages', file), 'utf8');
  return [...src.matchAll(/<(article|div) class="read" (data-lang-block="(it|en)" lang="\3")( hidden)?>([\s\S]*?)<\/\1>\n(?=\s*(<article|<div class="read"|<\/div>))/g)]
    .map(m => `<div ${m[2]}${m[4] || ''}>${toText(m[5])
      .replace(/ class="(read-foot|lead|thanks-list|link-arrow)"/g, '')
      // the row of numbers becomes a plain list: "128 risposte al questionario"
      .replace(/<div class="facts-inline">([\s\S]*?)\n\s*<\/div>/, (x, inner) => `<ul>${inner.replace(/<div><strong>(.*?)<\/strong><span>(.*?)<\/span><\/div>/g, '<li><strong>$1</strong> $2</li>')}\n    </ul>`)
    }</div>`).join('\n');
};

const TEXT_NAV = [['testo.html', null, 'Home'], ['testo-galleria.html', 'common.navGallery'], ['testo-aggiungi.html', 'testo.navAdd'],
  ['testo-progetto.html', 'common.navProject'], ['testo-ricerca.html', 'common.navResearch'], ['testo-contatti.html', 'common.navContact']];

const textPage = ({ file, titleKey, visual, page, body }) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title data-i18n="${titleKey}">${escH(IT(titleKey))}</title>
<meta name="description" content="Marghera nel Mezzo in versione solo testo: senza immagini, contenuto completo.">
<link rel="icon" type="image/png" sizes="192x192" href="IMAGES/web/logo-192.png">
<link rel="icon" type="image/svg+xml" href="IMAGES/web/logo.svg">
<!-- Same text-only stylesheet as the rest of clairespot.com -->
<link rel="stylesheet" href="../style.css">
<style>.poem { white-space: pre-line; } [hidden] { display: none !important; }</style>
</head>
<body data-text-page="${page}">

<a class="skip-link" href="#main" data-i18n="common.skip">Vai al contenuto</a>

<header>
<nav class="text-nav" aria-label="Menu principale" data-i18n-attr="aria-label:common.mainNav">
${TEXT_NAV.map(([href, key, label]) => `<a href="${href}"${href === file ? ' aria-current="page"' : ''}${key ? ` data-i18n="${key}"` : ''}>${escH(label || IT(key))}</a>`).join(' &nbsp;|&nbsp; ')}
</nav>
<p class="site-note"><span data-i18n="testo.note">${escH(IT('testo.note'))}</span> <a href="${visual}" id="full-site" data-i18n="testo.fullSite">${escH(IT('testo.fullSite'))}</a>. &nbsp;·&nbsp; <a href="${file}?lang=en" id="lang-toggle" lang="en">English</a></p>
</header>

<main id="main">
${body.trim()}
</main>

<footer>
Marghera nel Mezzo · Venezia &nbsp;·&nbsp; <a href="testo-ringraziamenti.html" data-i18n="common.thanks">${escH(IT('common.thanks'))}</a> &nbsp;·&nbsp; <a href="testo-privacy.html" data-i18n="common.privacy">Privacy</a>
</footer>

<script src="archive.js" defer></script>
<script src="js/strings.js" defer></script>
<script src="js/site.js" defer></script>
<script src="js/testo.js" defer></script>
</body>
</html>
`;

const igLinks = IG.map((href, i) => `
<h3>${tx('span', `progetto.steps.${i}.1`)}</h3>
${tx('p', `progetto.steps.${i}.2`)}
<p><a href="${href}" target="_blank" rel="noopener"><span data-i18n="progetto.seeIg">${escH(IT('progetto.seeIg'))}</span><span class="sr-only">: ${escH(IT(`progetto.steps.${i}.1`))}</span></a></p>`).join('\n');

const TEXT_PAGES = [
  { file: 'testo.html', titleKey: 'testo.titles.home', visual: 'index.html', page: 'home', body: `
${tx('p', 'home.kicker', ' class="identity-label"')}
${tx('h1', 'home.h1')}
${tx('p', 'home.lede', ' class="tagline"')}
<ul>
<li><a href="testo-galleria.html" data-i18n="home.seeTitle">${escH(IT('home.seeTitle'))}</a></li>
<li><a href="testo-aggiungi.html" data-i18n="common.addTitle">${escH(IT('common.addTitle'))}</a></li>
</ul>
${tx('h2', 'home.aboutTitle')}
${tx('p', 'home.about1')}
${tx('p', 'home.about2')}
<ul>
<li><a href="testo-progetto.html" data-i18n="home.aboutLink">${escH(IT('home.aboutLink'))}</a></li>
<li><a href="testo-ricerca.html" data-i18n="home.pressLink">${escH(IT('home.pressLink'))}</a></li>
</ul>` },

  { file: 'testo-galleria.html', titleKey: 'testo.titles.galleria', visual: 'search.html', page: 'galleria', body: `
${tx('h1', 'gallery.h1')}
${tx('p', 'testo.galLede', ' class="tagline"')}
<p class="meta" id="count" aria-live="polite"></p>
<div id="works"><noscript><p><a href="search.html">${escH(IT('testo.fullSite'))}</a></p></noscript></div>` },

  { file: 'testo-opera.html', titleKey: 'testo.titles.opera', visual: 'detail.html', page: 'opera', body: `
<div id="work"></div>
<p><a class="back-link" href="testo-galleria.html" data-i18n="testo.backToGallery">${escH(IT('testo.backToGallery'))}</a></p>` },

  { file: 'testo-aggiungi.html', titleKey: 'testo.titles.aggiungi', visual: 'upload.html', page: 'aggiungi', body: `
${tx('h1', 'upload.h1')}
${tx('p', 'upload.lede', ' class="tagline"')}
${tx('h2', 'testo.howSend')}
<ul>
<li><a href="https://tally.so/r/mBVjzK" target="_blank" rel="noopener" data-i18n="testo.formLink">${escH(IT('testo.formLink'))}</a> ${tx('span', 'testo.formNote')}</li>
<li>WhatsApp: <a href="https://wa.me/447599882486" target="_blank" rel="noopener">+44 7599 882486</a></li>
<li>Email: <a href="mailto:margheranelmezzo@gmail.com">margheranelmezzo@gmail.com</a></li>
</ul>
${tx('p', 'upload.altBody')}
${tx('p', 'upload.videoNote')}
${tx('h2', 'upload.nextTitle')}
<ol>
${[0, 1, 2].map(i => tx('li', `upload.next.${i}`)).join('\n')}
</ol>
${tx('h2', 'upload.privTitle')}
<ul>
${[0, 1, 2].map(i => tx('li', `upload.priv.${i}`)).join('\n')}
</ul>` },

  { file: 'testo-progetto.html', titleKey: 'testo.titles.progetto', visual: 'progetto.html', page: 'progetto', body: `
${tx('p', 'progetto.kicker', ' class="identity-label"')}
${tx('h1', 'progetto.h1')}
${tx('p', 'progetto.lede1', ' class="tagline"')}
${tx('p', 'progetto.lede2')}
${tx('h2', 'progetto.whyTitle')}
${tx('blockquote', 'progetto.whyText')}
${tx('h2', 'progetto.howTitle')}
${tx('p', 'progetto.howText')}
<ul>
${[0, 1, 2, 3].map(i => `<li>${tx('strong', `progetto.facts.${i}.0`)} ${tx('span', `progetto.facts.${i}.1`)}</li>`).join('\n')}
</ul>
${igLinks}
${tx('h2', 'progetto.galTitle')}
${tx('p', 'progetto.galText')}
${tx('p', 'progetto.galText2')}
<ul>
<li><a href="testo-galleria.html" data-i18n="progetto.galCta">${escH(IT('progetto.galCta'))}</a></li>
<li><a href="testo-ricerca.html" data-i18n="progetto.pressLink">${escH(IT('progetto.pressLink'))}</a></li>
<li><a href="testo-aggiungi.html" data-i18n="common.addTitle">${escH(IT('common.addTitle'))}</a></li>
</ul>` },

  { file: 'testo-ricerca.html', titleKey: 'testo.titles.ricerca', visual: 'ricerca.html', page: 'ricerca', body: `
${tx('h1', 'ricerca.h1')}
${tx('p', 'ricerca.lede', ' class="tagline"')}
${langBlocks('ricerca.html')}` },

  { file: 'testo-contatti.html', titleKey: 'testo.titles.contatti', visual: 'contatti.html', page: 'contatti', body: `
${tx('h1', 'contatti.h1')}
${tx('p', 'contatti.lede', ' class="tagline"')}
${tx('h2', 'contatti.emailLabel')}
<p><a href="mailto:margheranelmezzo@gmail.com">margheranelmezzo@gmail.com</a></p>
${tx('p', 'contatti.emailText')}
${tx('h2', 'testo.social')}
<ul>
<li>Instagram: <a href="https://instagram.com/margheranelmezzo" target="_blank" rel="noopener">@margheranelmezzo</a></li>
<li>Facebook: <a href="https://facebook.com/margheranelmezzo" target="_blank" rel="noopener">@margheranelmezzo</a></li>
<li>WhatsApp: <a href="https://wa.me/447599882486" target="_blank" rel="noopener">+44 7599 882486</a> — ${tx('span', 'contatti.waSub')} ${tx('span', 'contatti.waNote')}</li>
</ul>
<p>${tx('span', 'contatti.addQ')} <a href="testo-aggiungi.html" data-i18n="contatti.addLink">${escH(IT('contatti.addLink'))}</a></p>
<p>${tx('span', 'contatti.pressQ')} <a href="testo-ricerca.html" data-i18n="contatti.pressLink">${escH(IT('contatti.pressLink'))}</a></p>` },

  { file: 'testo-privacy.html', titleKey: 'testo.titles.privacy', visual: 'privacy.html', page: 'privacy', body: `
${tx('h1', 'privacy.h1')}
${tx('p', 'privacy.lede', ' class="tagline"')}
${langBlocks('privacy.html')}` },

  { file: 'testo-ringraziamenti.html', titleKey: 'testo.titles.grazie', visual: 'ringraziamenti.html', page: 'grazie', body: `
${tx('h1', 'thanks.h1')}
${tx('p', 'thanks.lede', ' class="tagline"')}
${langBlocks('ringraziamenti.html')}` }
];

for (const tp of TEXT_PAGES) {
  writeFileSync(join(outDir, tp.file), textPage(tp));
  console.log('wrote', tp.file);
}
