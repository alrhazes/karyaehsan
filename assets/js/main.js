document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navAliases = {
    'telecommunications.html': 'services.html',
    'fiber-optic.html': 'services.html',
  };
  const activeNav = navAliases[currentPage] || currentPage;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === activeNav) {
      link.classList.add('text-white', 'font-semibold');
      link.classList.remove('text-white/80');
    }
  });

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim() || 'Website enquiry';
      const message = document.getElementById('message').value.trim();
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href = `mailto:enquiry@karyaehsan.my?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  initJumbotron();
  initLightbox();
  initPageContentEnter();
  initReveal();
  initCounters();
});

function initPageContentEnter() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const hero = document.querySelector('body > section.page-hero, body > section.jumbotron');
  if (!hero) return;

  const sections = [];
  let next = hero.nextElementSibling;
  while (next && sections.length < 2) {
    if (next.tagName === 'SECTION') sections.push(next);
    next = next.nextElementSibling;
  }
  if (!sections.length) return;

  let delayCursor = 0.55;

  sections.forEach((section, sectionIndex) => {
    // Homepage key facts: keep scroll-reveal + running number instead of page-enter
    if (section.querySelector('[data-count]')) return;

    // Keep entrance for near-viewport blocks; second section can sit a bit lower
    const rect = section.getBoundingClientRect();
    const limit = sectionIndex === 0 ? 0.92 : 1.35;
    if (rect.top > window.innerHeight * limit) return;

    section.setAttribute('data-page-enter-section', '');

    const container = section.querySelector(':scope > .max-w-screen-xl');
    if (!container) return;

    let targets = [...container.children].filter((el) => el.tagName !== 'SCRIPT');
    if (!targets.length) return;

    // Prefer staggering grid/card children when the section has a single wrapper
    if (targets.length === 1) {
      const wrap = targets[0];
      const kids = [...wrap.children].filter((el) => el.tagName !== 'SCRIPT');
      if (kids.length > 1 && kids.length <= 8) targets = kids;
    }

    // Extra beat between first and second content blocks
    if (sectionIndex > 0) delayCursor += 0.2;

    targets.forEach((el, i) => {
      el.classList.add('page-enter');
      el.style.animationDelay = `${delayCursor + i * 0.12}s`;
    });
    delayCursor += targets.length * 0.12 + 0.15;

    // Avoid conflicting with scroll-reveal opacity rules
    section.querySelectorAll('[data-reveal], .reveal').forEach((el) => {
      el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-scale');
      el.removeAttribute('data-reveal');
      el.removeAttribute('data-reveal-delay');
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatValue(value, suffix) {
    return `${Math.round(value)}${suffix}`;
  }

  function animateCounter(el) {
    const target = Number(el.getAttribute('data-count'));
    if (!Number.isFinite(target)) return;

    const suffix = el.getAttribute('data-count-suffix') || '';
    const duration = Number(el.getAttribute('data-count-duration')) || 1200;

    if (reduceMotion) {
      el.textContent = formatValue(target, suffix);
      return;
    }

    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic so it settles cleanly on the final value
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatValue(target * eased, suffix);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatValue(target, suffix);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}
function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Page heroes use dedicated CSS entrance — skip scroll-reveal there
  // First content after hero may use page-enter instead
  document.querySelectorAll('body > section:not(.jumbotron):not(.page-hero)').forEach((section) => {
    if (section.hasAttribute('data-page-enter-section')) return;
    if (section.querySelector('[data-reveal]')) return;
    const container = section.querySelector(':scope > .max-w-screen-xl');
    if (!container) return;

    const kids = [...container.children].filter((el) => el.tagName !== 'SCRIPT');
    if (!kids.length) return;

    if (kids.length === 1) {
      kids[0].classList.add('reveal');
      kids[0].setAttribute('data-reveal', '');
      return;
    }

    container.setAttribute('data-reveal-stagger', '');
    kids.forEach((el) => {
      el.classList.add('reveal');
      el.setAttribute('data-reveal', '');
    });
  });

  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  const immediate = [];

  targets.forEach((el) => {
    if (el.closest('[data-page-enter-section]')) return;

    const delay = el.getAttribute('data-reveal-delay');
    if (delay != null) {
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    } else if (el.parentElement?.hasAttribute('data-reveal-stagger')) {
      const siblings = [...el.parentElement.querySelectorAll(':scope > [data-reveal]')];
      el.style.setProperty('--reveal-delay', `${siblings.indexOf(el) * 90}ms`);
    }

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (alreadyInView) immediate.push(el);
    else observer.observe(el);
  });

  requestAnimationFrame(() => {
    document.documentElement.classList.add('js-reveal');
    requestAnimationFrame(() => {
      immediate.forEach((el) => el.classList.add('is-visible'));
    });
  });
}
function initJumbotron() {
  const jumbotron = document.getElementById('hero-jumbotron');
  if (!jumbotron) return;

  const slides = jumbotron.querySelectorAll('.jumbotron-slide');
  const captions = jumbotron.querySelectorAll('.jumbotron-caption');
  const dots = jumbotron.querySelectorAll('.jumbotron-dot');
  const pauseBtn = jumbotron.querySelector('#jumbotron-pause');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let interval;
  let paused = reduceMotion;

  function goToSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    captions.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function start() {
    stop();
    if (!paused) interval = setInterval(nextSlide, 5000);
  }

  function stop() {
    clearInterval(interval);
  }

  function setPaused(value) {
    paused = value;
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', String(paused));
      pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      pauseBtn.querySelector('.jumbotron-pause-icon')?.classList.toggle('hidden', paused);
      pauseBtn.querySelector('.jumbotron-play-icon')?.classList.toggle('hidden', !paused);
    }
    if (paused) stop();
    else start();
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.target, 10));
      if (!paused) start();
    });
  });

  pauseBtn?.addEventListener('click', () => setPaused(!paused));

  if (reduceMotion) setPaused(true);
  else start();
}

function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close image">&times;</button>
    <img alt="">
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      open(trigger.getAttribute('data-lightbox'), trigger.getAttribute('data-alt') || '');
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
}
