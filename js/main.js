/* Artesana del Barro - main.js (optimizado) */

document.addEventListener('DOMContentLoaded', () => {

  // ── Service Worker ──────────────────────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    // Registrar después del load para no competir con recursos críticos
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .catch(err => console.warn('SW Error:', err));
    });
  }

  /* =========================================================================
     1. STICKY NAVBAR & MOBILE MENU
     ========================================================================= */
  const navbar      = document.getElementById('navbar');
  const menuToggle  = document.getElementById('menu-toggle');
  const mobileMenu  = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const stickyCta   = document.getElementById('sticky-cta');
  const STICKY_SHOW = 600;

  // Navbar shadow & sticky CTA — throttled con rAF
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      navbar.style.boxShadow = y > 20 ? '0 4px 20px rgba(61,43,31,0.08)' : 'none';
      if (stickyCta) {
        stickyCta.classList.toggle('visible', y > STICKY_SHOW);
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================================================
     2. MARQUEE DUPLICATION (Infinite Loop)
     ========================================================================= */
  const marqueeContent = document.getElementById('marquee-content');
  if (marqueeContent) {
    marqueeContent.innerHTML += marqueeContent.innerHTML;
  }

  /* =========================================================================
     3. TESTIMONIALS AUTO-CAROUSEL
     ========================================================================= */
  const track        = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoTimer;

    // Crear dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = i === 0 ? 'dot active' : 'dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      dots[currentIndex].classList.remove('active');
      dots[currentIndex].setAttribute('aria-selected', 'false');
      currentIndex = ((index % slides.length) + slides.length) % slides.length;
      dots[currentIndex].classList.add('active');
      dots[currentIndex].setAttribute('aria-selected', 'true');
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function resetTimer() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }

    resetTimer();

    // Pausar en hover / focus para accesibilidad
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', resetTimer);
  }

  /* =========================================================================
     4. FAQ ACCORDION
     ========================================================================= */
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isActive = header.classList.contains('active');

      // Cerrar todos
      accHeaders.forEach(h => {
        h.classList.remove('active');
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.style.maxHeight = null;
      });

      // Abrir el clickeado (si estaba cerrado)
      if (!isActive) {
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        const body = header.nextElementSibling;
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* =========================================================================
     5. NEWSLETTER FORM (anti-spam)
     ========================================================================= */
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      const btn   = nlForm.querySelector('button');
      btn.textContent = '¡Listo!';
      btn.classList.replace('bg-terracotta-solid', 'bg-sage-solid');
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Suscribirse';
        btn.classList.replace('bg-sage-solid', 'bg-terracotta-solid');
      }, 3000);
    });
  }

});
