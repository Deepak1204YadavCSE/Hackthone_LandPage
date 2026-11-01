/* ===============================================================
   BuildSprint 2026: Code for Everyday India
   script.js – Vanilla JS Interactions & Accessibility
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* 1. Motion Preference Check */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = prefersReduced.matches ? 'auto' : 'smooth';

  /* 2. Skip to Main Content Target Focus */
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', () => {
      const main = document.getElementById('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
  }

  /* 3. Mobile Navigation Menu Toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when any nav link or button is clicked
    navMenu.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (target) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      }
    });

    // Escape key closes mobile menu & returns focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        navToggle.focus();
      }
    });
  }

  /* 4. Active Navigation Link on Scroll */
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* 5. Smooth Scroll Triggers (Buttons & Links) */
  document.querySelectorAll('[data-scroll-to]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = trigger.getAttribute('data-scroll-to');
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: scrollBehavior });
      }
    });
  });

  /* 6. Live Countdown Timer (12 Dec 2026, 09:00 AM IST) */
  function updateCountdown() {
    // 12 Dec 2026 09:00:00 GMT+0530
    const targetDate = new Date('2026-12-12T09:00:00+05:30').getTime();
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (timeRemaining <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* 7. Schedule Day 1 / Day 2 Tabs */
  const tabs = document.querySelectorAll('.tabs .tab');
  const panels = document.querySelectorAll('.tab-panels .panel');

  function activateTab(index, shouldFocus = true) {
    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      if (panels[i]) {
        panels[i].classList.toggle('active', isSelected);
        if (isSelected) {
          panels[i].removeAttribute('hidden');
        } else {
          panels[i].setAttribute('hidden', '');
        }
      }
    });
    if (shouldFocus && tabs[index]) {
      tabs[index].focus();
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(i, false));
    tab.addEventListener('keydown', (e) => {
      let nextIndex = null;
      if (e.key === 'ArrowRight') {
        nextIndex = (i + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (i - 1 + tabs.length) % tabs.length;
      }
      if (nextIndex !== null) {
        e.preventDefault();
        activateTab(nextIndex, true);
      }
    });
  });

  /* 8. FAQ Accordion Toggle */
  const faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      const faqItem = btn.closest('.faq-item');

      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (targetPanel) {
        if (!isExpanded) {
          targetPanel.removeAttribute('hidden');
        } else {
          targetPanel.setAttribute('hidden', '');
        }
      }
      if (faqItem) {
        faqItem.classList.toggle('is-open', !isExpanded);
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* 9. Tracks: "Choose this track" auto-fill & scroll */
  document.querySelectorAll('.choose-track').forEach(btn => {
    btn.addEventListener('click', () => {
      const trackCard = btn.closest('.track-card');
      if (!trackCard) return;
      const trackSlug = trackCard.getAttribute('data-track');
      const trackSelect = document.getElementById('reg-track');
      const registerSection = document.getElementById('register');
      const nameInput = document.getElementById('reg-name');

      if (trackSelect && trackSlug) {
        trackSelect.value = trackSlug;
      }

      if (registerSection) {
        registerSection.scrollIntoView({ behavior: scrollBehavior });
      }

      if (nameInput) {
        setTimeout(() => nameInput.focus(), 300);
      }
    });
  });

  /* 9. Registration Form Validation */
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const collegeInput = document.getElementById('reg-college');
      const trackSelect = document.getElementById('reg-track');

      const errName = document.getElementById('err-name');
      const errEmail = document.getElementById('err-email');
      const errCollege = document.getElementById('err-college');
      const errTrack = document.getElementById('err-track');
      const successBox = document.getElementById('form-success');

      let isValid = true;

      // Validate Name (min 2 chars)
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        errName.textContent = 'Please enter your full name (at least 2 characters).';
        isValid = false;
      } else {
        errName.textContent = '';
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        errEmail.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        errEmail.textContent = '';
      }

      // Validate College/Org
      if (!collegeInput.value.trim() || collegeInput.value.trim().length < 2) {
        errCollege.textContent = 'Please enter your college or organization name.';
        isValid = false;
      } else {
        errCollege.textContent = '';
      }

      // Validate Track Selection
      if (!trackSelect.value) {
        errTrack.textContent = 'Please select a hackathon track.';
        isValid = false;
      } else {
        errTrack.textContent = '';
      }

      // Result Handling
      if (isValid) {
        successBox.textContent = `✓ Registration submitted successfully for ${nameInput.value.trim()}! (Demo submission — you're all set for BuildSprint 2026).`;
        successBox.classList.add('visible');
        registerForm.reset();
        if (trackSelect) trackSelect.selectedIndex = 0;
      } else {
        successBox.textContent = '';
        successBox.classList.remove('visible');
      }
    });
  }
});
