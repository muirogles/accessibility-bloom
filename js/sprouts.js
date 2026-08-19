/**
 * BROTES — los textos florecen al entrar en el viewport.
 * Mejora progresiva: sin JS todo es visible; con reduced-motion, sin animación.
 */
export function initSprouts(selector = '.sprouted') {
  const els = [...document.querySelectorAll(selector)];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }
  document.body.dataset.animate = 'true';
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}
