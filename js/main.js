const navLinks = document.querySelectorAll('.sidebar__link');
const hamburger = document.getElementById('hamburger');
const sidebarNav = document.getElementById('sidebarNav');

const sectionIds = [
  'why-inage',
  'gourmet',
  'beach',
  'walk',
  'magic',
  'onsen',
  'about-inage',
];

function updateActiveNav() {
  const scrollY = window.scrollY;
  const heroEnd = window.innerHeight * 0.75;

  if (scrollY < heroEnd) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#hero');
    });
    return;
  }

  const marker = window.innerHeight * 0.4;
  let current = 'why-inage';

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= marker) {
      current = id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('is-active', href === current);
  });
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  sidebarNav.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

sidebarNav.querySelectorAll('.sidebar__link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    sidebarNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav);
updateActiveNav();

/* ── Scroll reveal: fade text & media into view ── */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mediaSelector = [
    '.frame',
    '.bleed',
    '.beach-hero',
    '.stage-03',
    '.overlap-02',
    '.walk-04__pair',
  ].join(', ');

  const candidates = document.querySelectorAll(`
    main .section__label,
    main .copy,
    main .beach-hero,
    main .stage-03,
    main .caption-03,
    main .overlap-02,
    main .walk-04__pair,
    main .bleed,
    main .frame,
    main .facts-07 > div,
    main .footer
  `);

  const targets = [...candidates].filter((el) => {
    if (el.closest('.walk-04__pair') && !el.classList.contains('walk-04__pair')) {
      return false;
    }
    if (el.closest('.overlap-02') && !el.classList.contains('overlap-02')) {
      return false;
    }
    if (el.closest('.stage-03') && el.classList.contains('caption-03')) {
      return false;
    }
    return true;
  });

  const sectionGroups = new Map();

  targets.forEach((el) => {
    const section = el.closest('.section') || el.closest('main');
    if (!sectionGroups.has(section)) sectionGroups.set(section, []);
    sectionGroups.get(section).push(el);
  });

  sectionGroups.forEach((group) => {
    group.forEach((el, index) => {
      el.classList.add('reveal');
      if (el.matches(mediaSelector)) {
        el.classList.add('reveal--media');
      }
      el.style.setProperty('--reveal-delay', `${Math.min(index * 0.08, 0.4)}s`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px',
    },
  );

  targets.forEach((el) => observer.observe(el));

  document.querySelectorAll('.hero__copy > *').forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${0.35 + index * 0.14}s`);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
  });
}

initScrollReveal();
