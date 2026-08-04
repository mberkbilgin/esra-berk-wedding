document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     1. INTRO SLIDING DOORS
     ============================================================ */
  const doors = document.getElementById('intro-doors');
  const sealBtn = document.getElementById('seal-btn');
  const scrollContainer = document.getElementById('main-scroll');
  let isOpened = false;

  function openDoors() {
    if (isOpened) return;
    isOpened = true;
    
    // Add opening class to slide doors and fade seal
    doors.classList.add('opening');
    
    // Initialize scroll observer when content is revealed
    setTimeout(initScrollReveal, 1000);
    
    // Remove doors from DOM after animation completes to save memory/events
    setTimeout(() => {
      doors.style.display = 'none';
    }, 2000);
  }

  ['click', 'touchend'].forEach(evt => {
    sealBtn.addEventListener(evt, (e) => {
      e.preventDefault();
      openDoors();
    }, { passive: false });
    doors.addEventListener(evt, (e) => {
      openDoors();
    }, { passive: true });
  });

  /* ============================================================
     2. COUNTDOWN TIMERS
     ============================================================ */
  const WEDDING_DATE = new Date('2026-09-12T19:00:00+03:00').getTime();
  
  // Main Countdown Elements
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  
  // Memory Box Countdown Element
  const memCdText = document.getElementById('memory-cd-text');

  function updateCountdowns() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance < 0) {
      if(cdDays) cdDays.innerText = "00";
      if(cdHours) cdHours.innerText = "00";
      if(cdMinutes) cdMinutes.innerText = "00";
      if(cdSeconds) cdSeconds.innerText = "00";
      if(memCdText) memCdText.innerText = "Etkinlik başladı, fotoğrafları görebilirsiniz.";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if(cdDays) cdDays.innerText = String(d).padStart(2, '0');
    if(cdHours) cdHours.innerText = String(h).padStart(2, '0');
    if(cdMinutes) cdMinutes.innerText = String(m).padStart(2, '0');
    if(cdSeconds) cdSeconds.innerText = String(s).padStart(2, '0');

    if(memCdText) {
      memCdText.innerText = `${d} gün ${h} saat ${m} dakika kaldı`;
    }
  }
  
  updateCountdowns();
  setInterval(updateCountdowns, 1000);

  /* ============================================================
     3. SCROLL REVEAL & HINT
     ============================================================ */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: observer.unobserve(entry.target); 
          // If unobserved, they stay visible. If kept, they can fade in/out on scroll.
          // For luxury feel, we usually just reveal once.
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: scrollContainer, // Observe relative to the scroll container
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Hide scroll hint when user starts scrolling
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    scrollContainer.addEventListener('scroll', () => {
      if (scrollContainer.scrollTop > 50) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
      }
    }, { passive: true, once: true });
  }

  /* ============================================================
     4. RSVP FORM SUBMIT
     ============================================================ */
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = rsvpForm.querySelector('button');
      btn.innerText = "GÖNDERİLİYOR...";
      btn.style.opacity = "0.7";
      
      setTimeout(() => {
        btn.innerText = "TEŞEKKÜRLER";
        btn.style.background = "var(--color-gold-dark)";
        btn.style.opacity = "1";
        
        // Reset form after a delay
        setTimeout(() => {
          rsvpForm.reset();
          btn.innerText = "GÖNDER";
          btn.style.background = "";
        }, 3000);
      }, 1000);
    });
  }
});
