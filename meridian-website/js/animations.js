/**
 * Meridian — scroll animation engine.
 * Vanilla JS (IntersectionObserver + rAF), no external dependencies.
 * Respects prefers-reduced-motion throughout.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* 1. Scroll progress indicator                                        */
  /* ------------------------------------------------------------------ */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress__bar');
    if (!bar) return;
    function update() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* 2. Sticky nav — background swaps once user scrolls past hero        */
  /* ------------------------------------------------------------------ */
  function initNavScrollState() {
    var nav = document.querySelector('.navbar');
    if (!nav || nav.classList.contains('navbar--on-light')) return;
    function update() {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------ */
  /* 3. Scroll Reveal / Fade / Slide / Zoom / Blur / Stagger             */
  /*    — driven by data-reveal attributes via IntersectionObserver      */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-blur, .stagger, .line-reveal, .route-line'
    );
    if (!targets.length) return;

    if (reduceMotion) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Count-up stat numbers when they enter the viewport               */
  /* ------------------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function animateCount(el) {
      var to = el.getAttribute('data-count-to');
      var suffix = el.getAttribute('data-count-suffix') || '';
      var target = parseFloat(to);
      if (reduceMotion || isNaN(target)) {
        el.textContent = to + suffix;
        return;
      }
      var duration = 1100;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Parallax — hero jet + media layers move slower than scroll        */
  /* ------------------------------------------------------------------ */
  function initParallax() {
    if (reduceMotion) return;
    var layers = document.querySelectorAll('[data-parallax-speed]');
    if (!layers.length) return;

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.2;
        var rect = el.getBoundingClientRect();
        var centerOffset = rect.top + rect.height / 2 - vh / 2;
        var translate = centerOffset * speed * -1;
        el.style.transform = 'translateY(' + translate.toFixed(1) + 'px)';
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* 6. Hero entrance — mirrors the stagger authored in the Figma file   */
  /*    (NavBar -> Headline -> Search, fade + translateY, ease-out)      */
  /* ------------------------------------------------------------------ */
  function initHeroEntrance() {
    var hero = document.querySelector('[data-hero-entrance]');
    if (!hero) return;
    var items = hero.querySelectorAll('[data-entrance]');
    if (reduceMotion) {
      items.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    items.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-entrance'), 10) || 0;
      el.style.opacity = 0;
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)';
      window.setTimeout(function () {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, delay);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. Tabs (Individuals / Business) — Smart-Animate-style crossfade     */
  /* ------------------------------------------------------------------ */
  function initTabs() {
    var groups = document.querySelectorAll('[data-tab-group]');
    groups.forEach(function (group) {
      var tabs = group.querySelectorAll('[data-tab]');
      var panels = document.querySelectorAll('[data-tab-panel][data-tab-group-target="' + group.getAttribute('data-tab-group') + '"]');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('is-active'); });
          tab.classList.add('is-active');
          var target = tab.getAttribute('data-tab');
          panels.forEach(function (panel) {
            var match = panel.getAttribute('data-tab-panel') === target;
            panel.style.transition = 'opacity 320ms ease-out';
            if (match) {
              panel.hidden = false;
              requestAnimationFrame(function () { panel.style.opacity = 1; });
            } else {
              panel.style.opacity = 0;
              window.setTimeout(function () { panel.hidden = true; }, 320);
            }
          });
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. FAQ accordion                                                     */
  /* ------------------------------------------------------------------ */
  function initAccordion() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-item__q');
      var answer = item.querySelector('.faq-item__a');
      if (!btn || !answer) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var a = other.querySelector('.faq-item__a');
          if (a) a.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initNavScrollState();
    initReveal();
    initCounters();
    initParallax();
    initHeroEntrance();
    initTabs();
    initAccordion();
  });
})();
