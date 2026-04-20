(function initAnnouncementBar() {
  'use strict';

  var bar = document.getElementById('announcement-bar');
  if (!bar) return;

  var slides    = bar.querySelectorAll('.announcement-bar__slide');
  var dots      = bar.querySelectorAll('.announcement-bar__dot');
  var prevBtn   = bar.querySelector('.announcement-bar__arrow--prev');
  var nextBtn   = bar.querySelector('.announcement-bar__arrow--next');
  var total     = slides.length;
  var current   = 0;
  var autoplay  = bar.dataset.autoplay === 'true';
  var speed     = parseInt(bar.dataset.speed, 10) || 5000;
  var timer     = null;

  if (total <= 1) return;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    if (dots[current]) {
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
    }

    current = (index + total) % total;

    slides[current].classList.add('is-active');
    slides[current].setAttribute('aria-hidden', 'false');
    if (dots[current]) {
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (!autoplay) return;
    timer = setInterval(next, speed);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  /* Bind arrows */
  if (nextBtn) nextBtn.addEventListener('click', function () { stopAutoplay(); next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { stopAutoplay(); prev(); startAutoplay(); });

  /* Bind dots */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      stopAutoplay();
      goTo(parseInt(this.dataset.index, 10));
      startAutoplay();
    });
  });

  /* Pause on hover */
  bar.addEventListener('mouseenter', stopAutoplay);
  bar.addEventListener('mouseleave', startAutoplay);

  /* Keyboard */
  bar.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { stopAutoplay(); prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { stopAutoplay(); next(); startAutoplay(); }
  });

  startAutoplay();
})();