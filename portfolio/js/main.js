document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Navbar scroll state ---------- */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Scrollspy ---------- */
const sections = document.querySelectorAll('section[id]');
const spyLinks = document.querySelectorAll('.nav-link');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      spyLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(sec => spyObserver.observe(sec));

/* ---------- Back to top ---------- */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Cursor glow ---------- */
const glow = document.querySelector('.cursor-glow');
let glowX = 0, glowY = 0, curX = 0, curY = 0;
window.addEventListener('mousemove', (e) => { glowX = e.clientX; glowY = e.clientY; });
(function raf() {
  curX += (glowX - curX) * 0.12;
  curY += (glowY - curY) * 0.12;
  glow.style.transform = `translate(${curX - 160}px, ${curY - 160}px)`;
  requestAnimationFrame(raf);
})();

/* ---------- Tilt effect on cards ---------- */
document.querySelectorAll('.project-card, .why-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---------- Projects slider ---------- */
(function () {
  const track = document.getElementById('projectTrack');
  const viewport = track && track.parentElement;
  const prevBtn = document.getElementById('projectPrev');
  const nextBtn = document.getElementById('projectNext');
  const dotsWrap = document.getElementById('projectDots');
  const sliderWrap = document.querySelector('.project-slider');
  if (!track || !viewport || !prevBtn || !nextBtn || !dotsWrap || !sliderWrap) return;

  const slides = Array.from(track.children);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let autoplayTimer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'project-dots__dot';
    dot.setAttribute('aria-label', `Go to project ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function trackGap() {
    return parseFloat(getComputedStyle(track).columnGap) || 20;
  }

  function offsetFor(i) {
    let offset = 0;
    for (let j = 0; j < i; j++) offset += slides[j].getBoundingClientRect().width + trackGap();
    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    return Math.min(offset, maxOffset);
  }

  function render() {
    track.style.transform = `translateX(-${offsetFor(index)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn.addEventListener('click', () => { goTo(index - 1); restartAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); restartAutoplay(); });
  window.addEventListener('resize', render);

  /* Drag / swipe */
  let isDown = false, startX = 0, currentX = 0, startOffset = 0;
  const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  function dragStart(e) {
    isDown = true;
    startX = currentX = pointerX(e);
    startOffset = offsetFor(index);
    track.classList.add('dragging');
    stopAutoplay();
  }
  function dragMove(e) {
    if (!isDown) return;
    currentX = pointerX(e);
    track.style.transform = `translateX(${-startOffset + (currentX - startX)}px)`;
  }
  function dragEnd() {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
    const dx = currentX - startX;
    if (dx < -60) goTo(index + 1);
    else if (dx > 60) goTo(index - 1);
    else render();
    restartAutoplay();
  }

  track.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
  track.addEventListener('touchstart', dragStart, { passive: true });
  track.addEventListener('touchmove', dragMove, { passive: true });
  track.addEventListener('touchend', dragEnd);

  function startAutoplay() {
    if (reduceMotion) return;
    autoplayTimer = setInterval(() => goTo(index + 1), 5000);
  }
  function stopAutoplay() { clearInterval(autoplayTimer); }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  sliderWrap.addEventListener('mouseenter', stopAutoplay);
  sliderWrap.addEventListener('mouseleave', startAutoplay);

  render();
  startAutoplay();
})();

/* ---------- GSAP scroll animations ---------- */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger && !prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance: name lines slide up out of their masks, then the rest fades in
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero__badges', { opacity: 1, y: 0, duration: 0.7 })
    .to('.hero__name.reveal-up', { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'expo.out' }, '-=0.3')
    .to('.hero__foot .reveal, .hero__divider, .hero__tags', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.5');

  // Generic reveal / reveal-left / reveal-right for the rest of the page
  gsap.utils.toArray('.reveal:not(.hero *)').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Staggered grids / lists
  gsap.utils.toArray('.reveal-stagger').forEach((group) => {
    gsap.to(group.children, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 85%' }
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  // No GSAP / reduced motion: make everything visible immediately
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .hero__badges, .hero__divider, .hero__tags').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none';
  });
  document.querySelectorAll('.hero__name.reveal-up').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none';
  });
  document.querySelectorAll('.reveal-stagger').forEach(group => {
    [...group.children].forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; });
  });
}
