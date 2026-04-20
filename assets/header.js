document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger-btn');
    var closeBtn  = document.getElementById('mobile-menu-close');
    var menu      = document.getElementById('mobile-menu');
    var overlay   = document.getElementById('mobile-menu-overlay');

    if (!hamburger || !menu || !overlay) return;

    function openMenu() {
      menu.classList.add('is-open');
      overlay.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-open');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      overlay.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    /* Sub-menu accordion */
    document.querySelectorAll('.mobile-nav-item__toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = this.closest('.mobile-nav-item');
        var isOpen = item.classList.contains('is-open');
        /* close all */
        document.querySelectorAll('.mobile-nav-item.is-open').forEach(function (el) {
          el.classList.remove('is-open');
          var t = el.querySelector('.mobile-nav-item__toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    
  });