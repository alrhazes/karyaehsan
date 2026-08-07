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
      link.classList.add('text-kesb-blue', 'font-semibold');
      link.classList.remove('text-gray-300');
    }
  });

  const contactForm = document.querySelector('form');
  if (contactForm && window.location.pathname.includes('contact')) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message. Please email us directly at enquiry@karyaehsan.my for a faster response.');
    });
  }

  // Jumbotron carousel
  const jumbotron = document.getElementById('hero-jumbotron');
  if (jumbotron) {
    const slides = jumbotron.querySelectorAll('.jumbotron-slide');
    const captions = jumbotron.querySelectorAll('.jumbotron-caption');
    const dots = jumbotron.querySelectorAll('.jumbotron-dot');
    let current = 0;
    let interval;

    function goToSlide(index) {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      captions.forEach((c, i) => c.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.target, 10));
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
      });
    });

    interval = setInterval(nextSlide, 5000);
  }
});
