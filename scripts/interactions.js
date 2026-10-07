/* Progressive motion: content and the completed connection line work without JS. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  let observer;
  if (!reduced.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        // Avoid moving a section while someone is interacting with its controls.
        if (reduced.matches || !target.animate || target.contains(document.activeElement)) return;
        const animation = target.animate([
          { opacity: 0.8, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 320, easing: getComputedStyle(document.documentElement).getPropertyValue('--ease-brand').trim() });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('main > section:not(:first-of-type)').forEach((section) => {
      const marked = section.querySelector('[data-reveal]');
      observer.observe(marked || section.querySelector('.container') || section);
    });
  }

  const line = document.querySelector('[data-connection-line]');
  let frame = 0;
  function drawLine() {
    frame = 0;
    if (!line) return;
    const progress = reduced.matches ? 1 : Math.max(0, Math.min(1,
      (innerHeight - line.getBoundingClientRect().top) / (innerHeight * 0.65)));
    line.querySelector('path').style.strokeDashoffset = String(1 - progress);
  }
  const queueDraw = () => { if (!frame) frame = requestAnimationFrame(drawLine); };
  if (line && !reduced.matches) {
    window.addEventListener('scroll', queueDraw, { passive: true });
    window.addEventListener('resize', queueDraw, { passive: true });
    drawLine();
  }
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer?.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    window.removeEventListener('scroll', queueDraw);
    window.removeEventListener('resize', queueDraw);
    cancelAnimationFrame(frame);
    drawLine();
  });
})();
