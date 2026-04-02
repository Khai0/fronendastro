/**
 * header.js — 1001 Optometry Header Interactions
 * Enqueue in theme.liquid (before </body>):
 *   {{ 'header.js' | asset_url | script_tag }}
 *
 * Uses a DOMContentLoaded guard so it's safe to load async/defer.
 */
(function () {
  'use strict';

  function initHeader() {
    /* ── Desktop: Dropdown menus ── */
    var dropdownTriggers = document.querySelectorAll('.site-nav__link--dropdown');

    dropdownTriggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.site-nav__item');
        var isOpen = item.classList.contains('site-nav__item--open');

        // Close all open dropdowns
        document.querySelectorAll('.site-nav__item--open').forEach(function (el) {
          el.classList.remove('site-nav__item--open');
          el.querySelector('.site-nav__link--dropdown').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('site-nav__item--open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          var item = btn.closest('.site-nav__item');
          item.classList.remove('site-nav__item--open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-nav__item')) {
        document.querySelectorAll('.site-nav__item--open').forEach(function (el) {
          el.classList.remove('site-nav__item--open');
          var trigger = el.querySelector('.site-nav__link--dropdown');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });

    /* ── Mobile Nav ── */
    var hamburger    = document.querySelector('.site-header__hamburger');
    var mobileNav    = document.querySelector('.mobile-nav');
    var mobileOverlay = document.querySelector('.mobile-nav__overlay');
    var mobileClose  = document.querySelector('.mobile-nav__close');

    if (!hamburger || !mobileNav) return; // safety guard

    function openMobileNav() {
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMobileNav);
    if (mobileClose)   mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMobileNav();
        hamburger.focus();
      }
    });

    /* ── Mobile: Accordion sub-menus ── */
    var accordionBtns = document.querySelectorAll('.mobile-nav__link--accordion');

    accordionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var subList = btn.nextElementSibling;
        var isOpen  = btn.getAttribute('aria-expanded') === 'true';

        // Close all other accordions
        accordionBtns.forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var otherSub = other.nextElementSibling;
            if (otherSub) otherSub.classList.remove('is-open');
          }
        });

        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (subList) subList.classList.toggle('is-open', !isOpen);
      });
    });
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();