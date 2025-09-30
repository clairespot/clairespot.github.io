/* =========================================================
   0) Utilities
========================================================= */

// Prefix a relative URL with ../ as needed based on current depth
function withDepthPrefix(href) {
  const parts = location.pathname.split('/').filter(Boolean);
  const depth = Math.max(parts.length - 1, 0); // assume last segment is a file
  const prefix = depth ? '../'.repeat(depth) : '';
  return prefix + href;
}

// Make the footer dropdown links (PROJECTS/FIELDS) work from any depth
function rewriteFooterProjectLinks(rootEl = document) {
  const anchors = rootEl.querySelectorAll('.footer-menu a');
  anchors.forEach(a => {
    const href = a.getAttribute('href') || '';
    // Only rewrite if it's not absolute (http/https), not root-relative (/), and not a hash
    if (!/^https?:\/\//i.test(href) && !href.startsWith('/') && !href.startsWith('#')) {
      a.setAttribute('href', withDepthPrefix(href));
    }
  });
}

// Helpers for home inner scroller + hash routing
function getHomeScroller() {
  return document.querySelector('.home-scroll');
}
function onHome() {
  return document.body.classList.contains('home-page');
}

/* =========================================================
   1) Scroll restoration + fade-ins
========================================================= */

// Disable browser's automatic scroll restoration (important for back button)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

/* =========================================================
   2) Inject footer.html (handles /PROJECTS/ path) + fix links
========================================================= */

const footerPath = window.location.pathname.startsWith('/PROJECTS/')
  ? '../footer.html'
  : 'footer.html';

fetch(footerPath)
  .then(res => {
    if (!res.ok) throw new Error(`Failed to fetch footer: ${res.status}`);
    return res.text();
  })
  .then(html => {
    const footer = document.getElementById('footer-container');
    if (!footer) return;

    footer.innerHTML = html;

    // Fix dropdown link paths to work from any depth
    rewriteFooterProjectLinks(footer);

    // Update header/footer height vars AFTER footer renders, then handle scroll
    requestAnimationFrame(() => {
      if (typeof updateChromeHeights === 'function') updateChromeHeights();
      // Outer scroll reset (safe)
      window.scrollTo(0, 0);

      // If we're on the home page with a hash like #skills, retry the inner scroll
      if (onHome() && location.hash) scheduleHashScroll('auto');
    });
  })
  .catch(err => console.error(err));

/* =========================================================
   3) Load top-banner.html + scroll behavior
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('top-banner-container');
  if (!container) return;

  fetch('top-banner.html')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;

      requestAnimationFrame(() => {
        const banner = container.querySelector('.top-banner');
        if (!banner) return;

        banner.classList.remove('show'); // Start hidden

        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

          if (currentScroll < lastScrollTop) {
            // Scrolling up — show banner
            banner.classList.add('show');

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              banner.classList.remove('show');
            }, 1500);
          } else {
            // Scrolling down — hide
            banner.classList.remove('show');
          }

          lastScrollTop = Math.max(currentScroll, 0);
        });
      });
    })
    .catch(err => console.error('Error loading or parsing top-banner.html:', err));
});


/* =========================================================
   4) Home inner-scroller hash routing + logo behavior
   (Fixes #skills deep-link jumping back to hero)
========================================================= */

// Scroll a hash target (e.g. #skills) into the inner scroller on Home
function scrollHashIntoHomeScroller(behavior = 'auto') {
  if (!onHome()) return false;
  const scroller = getHomeScroller();
  if (!scroller) return false;

  const raw = location.hash || '';
  if (!raw) return false;

  // Special cases: #top / #home go to scroller top
  if (raw === '#top' || raw === '#home') {
    scroller.scrollTo({ top: 0, behavior });
    return true;
  }

  let target = null;
  try {
    target = document.querySelector(decodeURIComponent(raw));
  } catch (_) {
    // ignore bad selectors
  }
  if (!target) return false;

  const rect = target.getBoundingClientRect();
  const srect = scroller.getBoundingClientRect();
  const top = rect.top - srect.top + scroller.scrollTop;

  scroller.scrollTo({ top, behavior });
  return true;
}

// Retry scrolling to hash a few times to survive late layout (footer/header load)
function scheduleHashScroll(behavior = 'auto') {
  if (!onHome() || !location.hash) return;
  let attempts = 0;
  const max = 14; // ~14 rAFs ~ 230ms+ depending on frame rate

  const tick = () => {
    attempts++;
    const ok = scrollHashIntoHomeScroller(behavior);
    if (!ok && attempts < max) {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

// Handle hash links dynamically (e.g., clicking “Skills” in footer)
window.addEventListener('hashchange', () => {
  if (onHome()) scheduleHashScroll('smooth');
});

// On load: if we arrive at index.html#skills, ensure we land there even if
// another onload elsewhere set scroller.scrollTop = 0
window.addEventListener('load', () => {
  if (!onHome()) return;

  if (location.hash) {
    // run after everything else that might have reset the scroller
    setTimeout(() => scheduleHashScroll('auto'), 0);
  } else {
    // No hash -> start at hero (top of inner scroller)
    const scroller = getHomeScroller();
    if (scroller) scroller.scrollTop = 0;
  }
});

// Intercept clicks on the fixed top-right logo: if we’re already on Home,
// don’t reload; just scroll inner scroller to top.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a.cp-logo');
  if (!a) return;

  // Is that link pointing to Home?
  const toHome = /(^|\/)index\.html(#.*)?$/.test(a.getAttribute('href') || '') || a.pathname.endsWith('/index.html');
  if (!toHome) return;

  if (onHome()) {
    e.preventDefault();
    const scroller = getHomeScroller();
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
    // Clear any hash to avoid future auto-scrolls
    history.replaceState(null, '', a.href.split('#')[0]);
  }
});


/* =========================================================
   5) Move .collaborators into .content on mobile (selected pages)
========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  const pageClasses = [
    'changemakers-making-an-impact',
    'changemakers-relaunch',
    'changemaking',
    'compassionate-assessment',
    'consultancy',
    'evaluation',
    'ExEd',
    'lectures',
    'marghera',
    'postcards',
    'wall-project',
    'EDI-making-connections',
  ];

  if (!pageClasses.some(cls => document.body.classList.contains(cls))) return;

  const sidebar = document.querySelector('.sidebar');
  const collaborators = document.querySelector('.sidebar .collaborators');
  const content = document.querySelector('.content');

  if (!sidebar || !collaborators || !content) return;

  // Ensure anchor exists inside .content
  let anchor = document.getElementById('collaborators-anchor');
  if (!anchor || !content.contains(anchor)) {
    if (!anchor) {
      anchor = document.createElement('div');
      anchor.id = 'collaborators-anchor';
    }
    content.appendChild(anchor);
  }

  function moveToContent() {
    if (collaborators.parentElement !== content) anchor.after(collaborators);
  }
  function moveToSidebar() {
    if (collaborators.parentElement !== sidebar) sidebar.appendChild(collaborators);
  }

  const mq = window.matchMedia('(max-width: 768px)');
  function applyLayout() { mq.matches ? moveToContent() : moveToSidebar(); }

  applyLayout();
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', applyLayout);
  else if (typeof mq.addListener === 'function') mq.addListener(applyLayout);

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(applyLayout, 120);
  });
});

/* =========================================================
   6) Site-wide lightbox for images inside .content (not links)
========================================================= */

(function () {
  'use strict';

  var overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML =
    '<div class="lb-dialog" tabindex="-1">' +
      '<img class="lb-img" alt="Full-size image">' +
      '<div class="lb-caption"></div>' +
    '</div>' +
    '<button class="lb-close" type="button" aria-label="Close (Esc)">×</button>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector('.lb-img');
    var capEl = overlay.querySelector('.lb-caption');
    var dlgEl = overlay.querySelector('.lb-dialog');
    var btnClose = overlay.querySelector('.lb-close');
    var lastActive = null;

    function openWith(img) {
      lastActive = document.activeElement;
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.alt || '';
      var fig = img.closest('figure');
      var figcap = fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent.trim() : '';
      capEl.textContent = img.getAttribute('data-lb-caption') || figcap || img.alt || '';
      overlay.classList.add('is-open');
      document.body.classList.add('lb-open');
      dlgEl.focus();
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      imgEl.removeAttribute('src');
      if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
    }

    document.addEventListener('click', function (e) {
      var img = e.target.closest('.content img:not(.no-lightbox)');
      if (!img) return;
      if (img.closest('a')) return; // let linked images navigate
      openWith(img);
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === btnClose) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    document.querySelectorAll('.content img:not(.no-lightbox)').forEach(function (img) {
      if (!img.closest('a')) img.classList.add('lb-eligible');
    });
  });
})();

/* =========================================================
   7) Accurate header/footer sizing (robust)
========================================================= */

(function () {
  const r = document.documentElement;
  let headerEl = null;
  let footerEl = null;
  let headerRO = null;
  let footerRO = null;

  function setVar(name, px) {
    if (px > 0) r.style.setProperty(name, Math.round(px) + 'px');
  }

  function measureHeights() {
    if (!headerEl) headerEl = document.querySelector('.chiara-wrapper .header');
    if (headerEl) setVar('--header-h', headerEl.getBoundingClientRect().height);

    const fm = document.querySelector('.footer-menu');
    if (fm) footerEl = fm;
    if (footerEl) setVar('--footer-h', footerEl.getBoundingClientRect().height);
  }

  function observeTargets() {
    if (window.ResizeObserver && headerEl) {
      if (headerRO) headerRO.disconnect();
      headerRO = new ResizeObserver(measureHeights);
      headerRO.observe(headerEl);
    }

    const tryFooterObserver = () => {
      const fm = document.querySelector('.footer-menu');
      if (!fm) return;
      if (footerRO) footerRO.disconnect();
      footerEl = fm;
      footerRO = new ResizeObserver(measureHeights);
      footerRO.observe(footerEl);
      measureHeights();
    };

    tryFooterObserver();
    const mo = new MutationObserver(() => tryFooterObserver());
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function initHeightObservers() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        headerEl = document.querySelector('.chiara-wrapper .header');
        measureHeights();
        observeTargets();

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => requestAnimationFrame(measureHeights));
        }
        window.addEventListener('load', () => requestAnimationFrame(measureHeights));
        window.addEventListener('resize', () => requestAnimationFrame(measureHeights));
        window.addEventListener('orientationchange', () => setTimeout(measureHeights, 250));

        // Expose for footer fetch callback
        window.updateChromeHeights = measureHeights;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initHeightObservers);
})();

/* =========================================================
   8) Inject fixed top-right brand cluster (Aa + logo) + includes
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ------ Build depth prefix for assets linking back to site root
  const parts = window.location.pathname.split('/').filter(Boolean);
  const depth = Math.max(parts.length - 1, 0);
  const prefix = depth ? '../'.repeat(depth) : '';

  const homeHref = prefix + 'index.html';
  const logoSrc  = prefix + 'IMAGES/logo_cp.svg';

  // If the brand wrapper isn't there, build it
  let brand = document.querySelector('.cp-brand');
  if (!brand) {
    brand = document.createElement('div');
    brand.className = 'cp-brand';
    document.body.appendChild(brand);
  }

  // --- Aa text-only toggle (left of logo) ---
  // Compute current file name and target
  (function injectTextToggle(){
    if (document.querySelector('.cp-text-toggle')) return;

    // Determine the file in this folder (e.g., 'postcards.html')
    let path = window.location.pathname;
    let segs = path.split('/');
    let file = segs.pop() || 'index.html';
    if (!file.includes('.')) file = 'index.html';

    const isTextOnly = /-text-only(\.html?)$/i.test(file);
    const targetFile = isTextOnly
      ? file.replace(/-text-only(\.html?)$/i, '$1')        // back to visual
      : file.replace(/(\.html?)$/i, '-text-only$1');       // to text-only

    const a = document.createElement('a');
    a.className = 'cp-text-toggle';
    a.href = targetFile;            // relative in the same folder
    a.setAttribute('role', 'button');
    a.setAttribute('aria-label', isTextOnly ? 'Switch to visual version' : 'Switch to text-only version');
    a.title = isTextOnly ? 'Visual' : 'Text-only';

    // Use “Aa” (best practice for readability options)
    a.innerHTML = `
      <span aria-hidden="true">Aa</span>
      <span class="sr-only">${isTextOnly ? 'Switch to visual version' : 'Switch to text-only version'}</span>
    `;

    brand.appendChild(a);
  })();

  // --- Logo to the right ---
  if (!document.querySelector('a.cp-logo')) {
    const a = document.createElement('a');
    a.className = 'cp-logo';
    a.href = homeHref;
    a.setAttribute('aria-label', 'Go to Home');

    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = 'Chiara Portinari logo';

    a.appendChild(img);
    brand.appendChild(a);
  }

  // --- Simple HTML partial includes (unchanged) ---
  document.querySelectorAll('[data-include]').forEach(el => {
    const url = el.getAttribute('data-include');
    fetch(url)
      .then(r => r.text())
      .then(html => {
        el.outerHTML = html;
        // If your app has this helper, keep it:
        if (typeof rewriteFooterProjectLinks === 'function') {
          rewriteFooterProjectLinks(document);
        }
      })
      .catch(err => console.error('Include failed:', url, err));
  });
});

/* =========================================================
   9) Footer dropdown interactions
   (supports both wrapped .dropdown and button+menu markup)
========================================================= */

(function () {
  function closeAll(exceptWrap, exceptMenu) {
    document.querySelectorAll('.footer-menu .dropdown.active').forEach(dd => {
      if (dd !== exceptWrap) {
        dd.classList.remove('active');
        const b = dd.querySelector('.dropbtn');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
    document.querySelectorAll('.footer-menu .dropdown-content').forEach(menu => {
      if (menu !== exceptMenu) {
        menu.classList.remove('is-open');
        menu.style.display = ''; // remove inline override
      }
    });
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.footer-menu .dropbtn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();

      const wrap = btn.closest('.dropdown');
      const menuId = btn.getAttribute('aria-controls');
      const menuEl = menuId ? document.getElementById(menuId)
                            : (wrap ? wrap.querySelector('.dropdown-content') : null);

      const isOpen = wrap ? wrap.classList.contains('active')
                          : (menuEl ? menuEl.classList.contains('is-open') : false);

      // Close others first
      closeAll(wrap, menuEl);

      const willOpen = !isOpen;

      if (wrap) wrap.classList.toggle('active', willOpen);
      if (menuEl) {
        menuEl.classList.toggle('is-open', willOpen);
        // Fallback for CSS that only uses display:none/block
        menuEl.style.display = willOpen ? 'block' : '';
      }
      btn.setAttribute('aria-expanded', String(willOpen));
      return;
    }

    if (!e.target.closest('.footer-menu .dropdown, .footer-menu .dropdown-content')) {
      closeAll();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();

/* =========================================================
   10) Sidebar Project Prev/Next (by group) — placement tuned
========================================================= */

(function () {
  const path = window.location.pathname;
  if (!/\/PROJECTS\//i.test(path)) return;

  const file = path.split('/').pop();

  const groups = {
    pedagogies: [
      { file: 'consultancy.html', label: 'PRACTICE' },
      { file: 'evaluation.html',  label: 'PRACTICE' },
      { file: 'lectures.html',    label: 'PRACTICE' },
    ],
    multiplicity: [
      { file: 'wall-project.html', label: 'PROJECT' },
      { file: 'marghera.html',     label: 'PROJECT' },
      { file: 'postcards.html',    label: 'PROJECT' },
      { file: 'changemaking.html', label: 'PROJECT' },
    ],
    events: [
      { file: 'changemakers-making-an-impact.html', label: 'EVENT' },
      { file: 'compassionate-assessment.html',      label: 'EVENT' },
      { file: 'ExEd.html',                          label: 'EVENT' },
      { file: 'EDI-making-connections.html',        label: 'EVENT' },
    ],
  };

  // Find current group + index
  let currentGroupKey = null;
  let currentIndex = -1;
  for (const [key, list] of Object.entries(groups)) {
    const idx = list.findIndex(p => p.file === file);
    if (idx !== -1) { currentGroupKey = key; currentIndex = idx; break; }
  }
  if (!currentGroupKey) return;

  const list = groups[currentGroupKey];
  const prev = list[(currentIndex - 1 + list.length) % list.length];
  const next = list[(currentIndex + 1) % list.length];

  // Build nav
  const nav = document.createElement('nav');
  nav.className = 'proj-switcher';
  nav.setAttribute('aria-label', 'Project navigation');
  nav.innerHTML = `
    <a class="proj-prev" href="${prev.file}" aria-label="Previous project: ${prev.label}">
      <span class="arr">←</span><span class="label">PRIOR ${prev.label}</span>
    </a>
    <a class="proj-next" href="${next.file}" aria-label="Next project: ${next.label}">
      <span class="label">NEXT ${next.label}</span><span class="arr">→</span>
    </a>
  `;

  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const mq = window.matchMedia('(max-width: 980px)');
  let backAndNav = sidebar.querySelector('.back-and-nav'); // created on mobile

  function q() {
    return {
      titleEl: sidebar.querySelector('.title'),
      collaborators: sidebar.querySelector('.collaborators'),
      backBtn: sidebar.querySelector('.back-button'),
    };
  }

  function insertAfter(parent, refNode, node) {
    if (!parent) return;
    const next = refNode ? refNode.nextSibling : null;
    if (next) parent.insertBefore(node, next);
    else parent.appendChild(node);
  }

  function placeNav() {
    const { titleEl, collaborators, backBtn } = q();

    // Detach nav before moving
    if (nav.parentNode) nav.parentNode.removeChild(nav);

    if (mq.matches) {
      // --- Mobile: put wrapper right after the title
      if (!backAndNav || !backAndNav.isConnected) {
        backAndNav = document.createElement('div');
        backAndNav.className = 'back-and-nav';
      }

      // Ensure wrapper sits right after the title (or at top if no title)
      if (titleEl && titleEl.parentElement === sidebar) {
        insertAfter(sidebar, titleEl, backAndNav);
      } else {
        // fallback: put at top
        sidebar.insertBefore(backAndNav, sidebar.firstChild || null);
      }

      // Move back button into wrapper (if it exists)
      if (backBtn) backAndNav.appendChild(backBtn);

      // Add nav into wrapper
      backAndNav.appendChild(nav);

    } else {
      // --- Desktop: remove wrapper if present, place nav BEFORE collaborators
      if (backAndNav && backAndNav.isConnected) {
        const btnInside = backAndNav.querySelector('.back-button');
        if (btnInside) {
          // Put back button just after title on desktop
          if (titleEl && titleEl.parentElement === sidebar) {
            insertAfter(sidebar, titleEl, btnInside);
          } else {
            sidebar.insertBefore(btnInside, sidebar.firstChild || null);
          }
        }
        backAndNav.remove();
        backAndNav = null;
      }

      if (collaborators && collaborators.parentElement === sidebar) {
        // Place nav BEFORE collaborators
        sidebar.insertBefore(nav, collaborators);
      } else if (titleEl && titleEl.parentElement === sidebar) {
        // If no collaborators, place right AFTER title
        insertAfter(sidebar, titleEl, nav);
      } else {
        // Fallback
        sidebar.appendChild(nav);
      }
    }
  }

  placeNav();
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', placeNav);
  else if (typeof mq.addListener === 'function') mq.addListener(placeNav);

  // Re-place on resize (lets Section 5 finish moving collaborators)
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(placeNav, 140);
  });
})();

/* =========================================================
   Hero scroll hint (pedagogies / multiplicity / events / home)
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const isSectioned =
    body.classList.contains('pedagogies-page') ||
    body.classList.contains('multiplicity-page') ||
    body.classList.contains('events-page') ||
    body.classList.contains('home-page');

  if (!isSectioned) return;

  // Prefer home hero first on the home page
  const hero =
    document.querySelector('.home-hero') ||
    document.querySelector('.hero-part, .combined-hero');

  if (!hero) return;

  // Create the hint
  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
    <span>Scroll</span>
  `;

  // Ensure hero can position children absolutely
  if (getComputedStyle(hero).position === 'static') {
    hero.style.position = 'relative';
  }

  hero.appendChild(hint);

  // Hide after a short delay OR a genuine user scroll/click.
  const scroller = document.querySelector('.home-scroll');
  let hidden = false;

  const hide = () => {
    if (hidden) return;
    hidden = true;
    hint.classList.add('is-hidden');
    detach();
  };

  // Only hide once the user actually scrolls a bit (ignore micro scrolls)
  const maybeHide = () => {
    const winY =
      window.pageYOffset || document.documentElement.scrollTop || 0;
    const contY = scroller ? scroller.scrollTop : 0;
    if (winY > 10 || contY > 10) hide();
  };

  const detach = () => {
    window.removeEventListener('scroll', maybeHide, true);
    if (scroller) scroller.removeEventListener('scroll', maybeHide, true);
    window.removeEventListener('click', hide, true);
  };

  // Listeners (capture=true to catch early)
  window.addEventListener('scroll', maybeHide, { once: false, passive: true, capture: true });
  if (scroller) scroller.addEventListener('scroll', maybeHide, { once: false, passive: true, capture: true });
  window.addEventListener('click', hide, { once: true, capture: true });

  // Failsafe: auto-hide after 3s so it doesn’t linger
  setTimeout(hide, 3000);
});

/* =========================================================
   11) Skills modal
========================================================= */
(function(){
  const grid = document.querySelector('.skills-grid');
  const overlay = document.querySelector('.skill-overlay');
  if (!grid || !overlay) return;

  const imgEl = overlay.querySelector('.skill-modal__img');
  const titleEl = overlay.querySelector('#skill-title');
  const descEl = overlay.querySelector('#skill-desc');
  const closeBtn = overlay.querySelector('.lb-close');

  function openModal({img, title, desc, alt}){
    imgEl.src = img;
    imgEl.alt = alt || title || '';
    titleEl.textContent = title || '';
    // allow HTML from <template> (bullet lists)
    descEl.innerHTML = desc || '';
    overlay.classList.add('is-open');
    document.body.classList.add('lb-open'); // no body scroll
    // move focus for a11y
    closeBtn && closeBtn.focus();
  }

  function closeModal(){
    overlay.classList.remove('is-open');
    document.body.classList.remove('lb-open');
    // clear image to let browser free memory
    imgEl.src = '';
    imgEl.alt = '';
  }

  // Open on card click (event delegation)
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.skill-card');
    if (!card) return;

    const title = card.dataset.title || '';
    const img   = card.dataset.img   || '';

    // Prefer template content if data-desc-tpl exists
    const tplSel = card.dataset.descTpl;
    const desc = tplSel
      ? (document.querySelector(tplSel)?.innerHTML || '')
      : (card.dataset.desc || '');

    openModal({ img, title, desc, alt: title });
  });

  // Close interactions
  closeBtn && closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    // click on dark backdrop closes; clicking inside content does not
    const dialog = overlay.querySelector('.skill-dialog');
    if (!dialog.contains(e.target)) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
})();

/* =============================
   12) Quotes slider (About)
============================= */
(function(){
  const sliders = document.querySelectorAll('.quotes-slider');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const slides = [...slider.querySelectorAll('.qs-slide')];
    if (!slides.length) return;

    let i = slides.findIndex(s => s.hasAttribute('data-active'));
    if (i < 0) i = 0;
    const prevBtn = slider.querySelector('.qs-prev');
    const nextBtn = slider.querySelector('.qs-next');

    function show(idx){
      slides[i].removeAttribute('data-active');
      i = (idx + slides.length) % slides.length;
      slides[i].setAttribute('data-active','');
      // Update aria-label numbers
      slides.forEach((s, n) => s.setAttribute('aria-label', `${n+1} of ${slides.length}`));
    }

    prevBtn?.addEventListener('click', () => show(i - 1));
    nextBtn?.addEventListener('click', () => show(i + 1));

    // Keyboard nav when slider is focused (or anywhere on page)
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
      if (e.key === 'ArrowRight'){ e.preventDefault(); show(i + 1); }
    });
    slider.tabIndex = 0; // make region focusable for arrow keys

    // Basic swipe (touch)
    let startX = null;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
    slider.addEventListener('touchend', (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
      startX = null;
    });
  });
})();


(function() {
  const el = document.getElementById('textOnlyToggle');
  if (!el) return;

  // Current filename (keeps folder context)
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  const isTextOnly = file.includes('-text-only');
  const counterpart = (name) => {
    if (isTextOnly) return name.replace('-text-only', '');
    const i = name.lastIndexOf('.html');
    return i === -1 ? (name + '-text-only') : (name.slice(0, i) + '-text-only' + name.slice(i));
  };

  const target = counterpart(file);
  const href = path.replace(file, target);
  el.href = href;

  // Accessible labels swap depending on the page type
  const toText = !isTextOnly;
  el.setAttribute('aria-label', toText ? 'Switch to text-only version' : 'Switch to visual version');
  el.setAttribute('title',      toText ? 'Switch to text-only version' : 'Switch to visual version');

  // Add rel="alternate" for discoverability
  const alt = document.createElement('link');
  alt.rel = 'alternate';
  alt.href = href;
  alt.title = toText ? 'Text-only version' : 'Visual version';
  document.head.appendChild(alt);
})();

// Footer BFCache + sticky-hover/focus cleanup
(function () {
  // Only run on pages that actually have the footer
  const footer = document.querySelector('.footer-menu');
  if (!footer) return;

  // When coming back via Back/Forward cache, blur restored focus and close dropdowns
  window.addEventListener('pageshow', () => {
    if (document.activeElement && document.activeElement.closest('.footer-menu')) {
      document.activeElement.blur();
    }
    document.querySelectorAll('.footer-menu .dropdown.active')
      .forEach(d => d.classList.remove('active'));
  });

  // Close dropdown when clicking/tapping outside it
  document.addEventListener('pointerdown', (e) => {
    const open = document.querySelector('.footer-menu .dropdown.active');
    if (open && !open.contains(e.target)) open.classList.remove('active');
  });
})();


document.addEventListener('pointerup', (e) => {
  const btn = e.target.closest('.qs-nav');
  if (!btn) return;
  // Pointer events don't fire for keyboard, so this won't affect keyboard users
  btn.blur();
});
