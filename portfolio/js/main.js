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

/* ---------- GSAP scroll animations ---------- */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger && !prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
    .to('.hero .reveal', { opacity: 1, y: 0, stagger: 0.15 })
    .to('.hero__art.reveal-right', { opacity: 1, x: 0 }, '-=0.7');

  // Generic reveal / reveal-left / reveal-right for the rest of the page
  gsap.utils.toArray('.reveal:not(.hero .reveal)').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.reveal-left:not(.hero__art)').forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('.reveal-right:not(.hero__art)').forEach((el) => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Staggered grids / lists
  gsap.utils.toArray('.reveal-stagger').forEach((group) => {
    gsap.to(group.children, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 85%' }
    });
  });

  // Parallax blobs
  gsap.utils.toArray('.blob').forEach((blob) => {
    const speed = parseFloat(blob.dataset.speed) || 0.2;
    gsap.to(blob, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: { trigger: blob.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Navbar reveal already visible; refresh on load
  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  // No GSAP / reduced motion: make everything visible immediately
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none';
  });
  document.querySelectorAll('.reveal-stagger').forEach(group => {
    [...group.children].forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; });
  });
}
