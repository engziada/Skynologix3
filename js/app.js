/* ===== SKYNOLOGIX APP.JS ===== */
(function () {
  'use strict';

  /* --- Theme Provider --- */
  const THEME_KEY = 'skynologix-theme';

  function getStoredTheme() {
    const s = localStorage.getItem(THEME_KEY);
    return s === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update logo sources
    document.querySelectorAll('.theme-logo').forEach(function (img) {
      img.src = theme === 'dark' ? img.dataset.dark : img.dataset.light;
    });

    // Update theme toggle icon
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      moonIcon.style.display = theme === 'light' ? 'block' : 'none';
    }
  }

  function toggleTheme() {
    const current = getStoredTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* --- Navbar Scroll --- */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function checkScroll() {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* --- Mobile Menu --- */
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      // Toggle hamburger / X icon
      const iconMenu = document.getElementById('icon-menu');
      const iconX = document.getElementById('icon-x');
      if (iconMenu && iconX) {
        iconMenu.style.display = isOpen ? 'none' : 'block';
        iconX.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        var iconMenu = document.getElementById('icon-menu');
        var iconX = document.getElementById('icon-x');
        if (iconMenu && iconX) {
          iconMenu.style.display = 'block';
          iconX.style.display = 'none';
        }
      });
    });
  }

  /* --- Active Nav Link --- */
  function initActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-menu a:not(.mobile-cta)').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop() || 'index.html';
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* --- Scroll Progress Indicator --- */
  function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  /* --- Cursor Following Glow --- */
  function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    const hero = document.querySelector('.hero');
    if (!cursorGlow || !hero) return;

    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isInHero = false;
    let rafId = null;

    function animate() {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      currentX += dx * 0.1;
      currentY += dy * 0.1;
      cursorGlow.style.left = currentX + 'px';
      cursorGlow.style.top = currentY + 'px';
      rafId = requestAnimationFrame(animate);
    }

    hero.addEventListener('mouseenter', function () {
      isInHero = true;
      cursorGlow.style.opacity = '1';
      if (!rafId) animate();
    });

    hero.addEventListener('mouseleave', function () {
      isInHero = false;
      cursorGlow.style.opacity = '0';
    });

    hero.addEventListener('mousemove', function (e) {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    animate();
  }

  /* --- Reveal on Scroll (Intersection Observer) --- */
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Check if this is a stats section and animate counters
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => animateCounter(stat));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /* --- Animated Stats Counter --- */
  function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      element.textContent = current + suffix;
      if (step >= steps) {
        clearInterval(timer);
        element.textContent = target + suffix;
      }
    }, duration / steps);
  }

  /* --- Typing Effect --- */
  function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    if (!typingElements.length) return;

    typingElements.forEach(element => {
      const phrases = JSON.parse(element.dataset.typing || '[]');
      const delay = parseInt(element.dataset.typingDelay, 10) || 3000;
      const cursor = element.querySelector('.typing-cursor');
      
      if (!phrases.length) return;

      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typeSpeed = 100;

      function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
          element.childNodes[0].textContent = currentPhrase.substring(0, charIndex - 1);
          charIndex--;
          typeSpeed = 50;
        } else {
          element.childNodes[0].textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
          typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
          isDeleting = true;
          typeSpeed = delay;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(type, typeSpeed);
      }

      // Start typing after initial delay
      setTimeout(type, 2000);
    });
  }

  /* --- Exit Intent Modal --- */
  function initExitIntentModal() {
    const modal = document.getElementById('exit-modal');
    const closeBtn = document.getElementById('exit-modal-close');
    if (!modal) return;

    let hasShown = false;
    let hasInteracted = false;

    // Track user interaction
    document.addEventListener('mousedown', () => hasInteracted = true);
    document.addEventListener('keydown', () => hasInteracted = true);
    document.addEventListener('scroll', () => hasInteracted = true, { passive: true });

    // Exit intent: detect when mouse leaves viewport from top
    document.addEventListener('mouseleave', function (e) {
      if (e.clientY < 0 && !hasShown && hasInteracted) {
        modal.classList.add('active');
        hasShown = true;
      }
    });

    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Close on backdrop click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getStoredTheme());
    initNavbarScroll();
    initMobileMenu();
    initActiveLinks();
    initScrollProgress();
    initCursorGlow();
    initRevealAnimations();
    initTypingEffect();
    initExitIntentModal();

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }
  });
})();
