/* ============================================================
   0. YOUTUBE MUSIC PLAYER (Arka Plan Şarkısı)
   ============================================================ */
let ytPlayer;
let isMusicPlaying = false;

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player-container', {
    height: '10',
    width: '10',
    videoId: 'hxaey0AUofQ', // Kullanıcının seçtiği şarkı
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'loop': 1,
      'playlist': 'hxaey0AUofQ',
      'playsinline': 1
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const musicBtn = document.getElementById('music-btn');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');

  function startMusic() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
      ytPlayer.playVideo();
      isMusicPlaying = true;
      updateMusicBtnState();
    } else {
      setTimeout(() => {
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
          ytPlayer.playVideo();
          isMusicPlaying = true;
          updateMusicBtnState();
        }
      }, 1000);
    }
  }

  function updateMusicBtnState() {
    if (!musicBtn) return;
    musicBtn.style.display = 'flex';
    if (isMusicPlaying) {
      musicBtn.classList.add('music-playing');
      if (iconSoundOn) iconSoundOn.style.display = 'block';
      if (iconSoundOff) iconSoundOff.style.display = 'none';
    } else {
      musicBtn.classList.remove('music-playing');
      if (iconSoundOn) iconSoundOn.style.display = 'none';
      if (iconSoundOff) iconSoundOff.style.display = 'block';
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;
      if (isMusicPlaying) {
        ytPlayer.pauseVideo();
        isMusicPlaying = false;
      } else {
        ytPlayer.playVideo();
        isMusicPlaying = true;
      }
      updateMusicBtnState();
    });
  }

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
    
    // Mühür tıklandığında müzik çalmaya başlar (Kullanıcı etkileşimi şartı sağlanmış olur)
    startMusic();
    
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

  // Hide scroll hint smoothly when user starts scrolling
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    scrollContainer.addEventListener('scroll', () => {
      const scrollY = scrollContainer.scrollTop;
      const newOpacity = Math.max(0, 1 - scrollY / 100);
      scrollHint.style.opacity = newOpacity;
      scrollHint.style.transform = `translateX(-50%) translateY(${scrollY * 0.2}px)`;
      if (newOpacity === 0) {
        scrollHint.style.pointerEvents = 'none';
      } else {
        scrollHint.style.pointerEvents = 'auto';
      }
    }, { passive: true });
  }

  /* ============================================================
     4. RSVP FORM SUBMIT (Google Sheets Entegrasyonu)
     ============================================================ */
  // NOT: Google Sheet'e kaydetmek için aşağıya Apps Script Web App URL'nizi yapıştırın:
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyA8JPfFEdnTDc88uG9N-9eIalo52gsdKCljkZ0sUDtV3LMxvCHPZzUn4H3QgVdyh0j5w/exec"; 

  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = rsvpForm.querySelector('button');
      btn.innerText = "GÖNDERİLİYOR...";
      btn.style.opacity = "0.7";
      
      const name = document.getElementById('rsvp-name') ? document.getElementById('rsvp-name').value.trim() : "";
      const guests = document.getElementById('rsvp-guests') ? document.getElementById('rsvp-guests').value : "2 Kişi";
      const attendanceEl = rsvpForm.querySelector('input[name="attendance"]:checked');
      const attendance = attendanceEl ? (attendanceEl.value === 'yes' ? 'Katılacağım' : 'Katılamayacağım') : '';

      const payload = {
        name: name,
        guests: guests,
        attendance: attendance,
        timestamp: new Date().toLocaleString('tr-TR')
      };

      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("http")) {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).catch(err => console.error('Sheet logging error:', err));
      } else {
        console.log("RSVP Kaydı (Google Script URL girilmedi):", payload);
      }
      
      setTimeout(() => {
        btn.innerText = "TEŞEKKÜRLER";
        btn.style.background = "var(--color-gold-dark)";
        btn.style.opacity = "1";
        
        setTimeout(() => {
          rsvpForm.reset();
          btn.innerText = "GÖNDER";
          btn.style.background = "";
        }, 3000);
      }, 1000);
    });
  }
});
