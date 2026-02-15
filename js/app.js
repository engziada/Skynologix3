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

  /* --- Init --- */
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getStoredTheme());
    initNavbarScroll();
    initMobileMenu();
    initActiveLinks();

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }
  });
})();
