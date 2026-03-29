/* ============================================================
   Nritya Samarpanam — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar hamburger ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Active nav link ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll hint ───────────────────────────────────────────── */
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    setTimeout(() => scrollHint.classList.add('visible'), 2800);
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) scrollHint.classList.add('hidden');
    }, { passive: true });
  }

  /* ── AOS init ──────────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 60,
      easing: 'ease-out-quart',
    });
  }

  /* ── Gallery filter (gallery.html) ────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.gallery-item').forEach(item => {
          if (filter === 'all' || item.dataset.dancer === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Countdown timer ───────────────────────────────────────── */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const eventDate = new Date('2026-04-18T14:00:00');
    function updateCountdown() {
      const now  = new Date();
      const diff = eventDate - now;
      if (diff <= 0) {
        countdownEl.textContent = 'The performance has begun!';
        return;
      }
      const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs  = Math.floor((diff % (1000 * 60)) / 1000);
      document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
      document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
      document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ── Contact form ──────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('formSuccess');
      if (successMsg) {
        contactForm.reset();
        successMsg.style.display = 'block';
        setTimeout(() => successMsg.style.display = 'none', 5000);
      }
    });
  }

});


/* ── Music Player (index.html only) ───────────────────────────── */
function initMusicPlayer() {
  const audio     = document.getElementById('bgMusic');
  const musicBtn  = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const prompt    = document.getElementById('musicPrompt');

  if (!audio || !musicBtn) return;

  // Hide the click-to-play prompt permanently
  if (prompt) prompt.style.display = 'none';

  let isPlaying = false;

  function setPlaying(state) {
    isPlaying = state;
    musicIcon.textContent = state ? '🔊' : '🔇';
    musicBtn.style.boxShadow = state
      ? '0 0 25px rgba(201,168,76,0.7)'
      : '0 0 20px rgba(201,168,76,0.4)';
  }

  audio.loop = false;

  // Keep within 2–55s window; fire on timeupdate and as a fallback on ended
  audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= 55) audio.currentTime = 2;
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 2;
    audio.play().catch(() => {});
  });

  // On iOS audio isn't seekable until after play() resolves — seek inside .then()
  function startPlay() {
    return audio.play().then(() => {
      audio.currentTime = 2;
    });
  }

  // Attempt autoplay
  startPlay()
    .then(() => setPlaying(true))
    .catch(() => {
      // Autoplay blocked — start on first user interaction
      setPlaying(false);
      function tryPlay() {
        startPlay().then(() => setPlaying(true)).catch(() => {});
        document.removeEventListener('click', tryPlay);
      }
      document.addEventListener('click', tryPlay);
    });

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      startPlay()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  });
}
