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
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === currentPage) {
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
});

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
