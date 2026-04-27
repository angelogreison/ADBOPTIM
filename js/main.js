document.addEventListener('DOMContentLoaded', () => {
  
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW Registered'))
        .catch(err => console.log('SW Error:', err));
    });
  }

  /* =========================================================================
     1. STICKY NAVBAR & MOBILE MENU
     ========================================================================= */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const stickyCta = document.getElementById('sticky-cta');
  const stickyCtaShowPoint = 600;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar.style.boxShadow = '0 4px 20px rgba(61,43,31,0.08)';
        } else {
          navbar.style.boxShadow = 'none';
        }
        
        // Sticky CTA logic
        if (stickyCta) {
          if (window.scrollY > stickyCtaShowPoint) {
            stickyCta.classList.add('visible');
          } else {
            stickyCta.classList.remove('visible');
          }
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* =========================================================================
     2. URGENCY MARQUEE DUPLICATION (Infinite Loop)
     ========================================================================= */
  const marqueeContent = document.getElementById('marquee-content');
  if (marqueeContent) {
    // Clone contents to ensure seamless loop
    const clone = marqueeContent.innerHTML;
    marqueeContent.innerHTML += clone;
  }

  /* =========================================================================
     3. VISUAL CALENDAR SCHEDULE & FILTERS (REPLACED BY js/schedule.js)
     ========================================================================= */

  /* =========================================================================
     5. TESTIMONIALS AUTO-CAROUSEL
     ========================================================================= */
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track) {
    const slides = Array.from(track.children);

    // create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = i === 0 ? 'dot active' : 'dot';
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');
    let currentIndex = 0;

    function goToSlide(index) {
      dots.forEach(d => d.classList.remove('active'));
      currentIndex = index % slides.length;
      dots[currentIndex].classList.add('active');
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Auto advance every 5s
    setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  /* =========================================================================
     6. FAQ ACCORDION
     ========================================================================= */
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const activeHeader = document.querySelector('.accordion-header.active');

      // Close currently active
      if (activeHeader && activeHeader !== header) {
        activeHeader.classList.remove('active');
        activeHeader.nextElementSibling.style.maxHeight = null;
      }

      // Toggle clicked
      header.classList.toggle('active');
      const body = header.nextElementSibling;
      if (header.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = null;
      }
    });
  });

  /* =========================================================================
     7. FORM PREVENT SPAM (Newsletter)
     ========================================================================= */
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      const btn = nlForm.querySelector('button');
      btn.innerText = '¡Listo!';
      btn.classList.replace('bg-terracotta-solid', 'bg-sage-solid');
      input.value = '';
      setTimeout(() => {
        btn.innerText = 'Suscribirse';
        btn.classList.replace('bg-sage-solid', 'bg-terracotta-solid');
      }, 3000);
    });
  }

});
