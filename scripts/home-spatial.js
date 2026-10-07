/* Homepage decorative CSS planes; hero and opt-in worlds own their renderers. */
(() => {
  'use strict';
  const homepage = document.querySelector('.homepage-spatial');
  if (!homepage) return;
  const source = homepage.querySelector('[data-hero-sculpture] svg');
  const stages = [...homepage.querySelectorAll('[data-spatial-stage]')];

  function linework(className) {
    if (!source) return null;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', source.getAttribute('viewBox'));
    svg.setAttribute('class', `spatial-linework ${className}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    // Use the exact production contours, with no animation classes or duplicated IDs.
    source.querySelectorAll('path').forEach((original) => {
      const path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d', original.getAttribute('d'));
      svg.append(path);
    });
    return svg;
  }
  homepage.querySelectorAll('[data-spatial-mark]').forEach((image) => {
    const svg = linework('');
    if (svg) image.replaceWith(svg);
  });
  homepage.querySelectorAll('.spatial-card').forEach((card) => {
    const svg = linework('spatial-card-mark');
    if (svg) card.prepend(svg);
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const desktop = matchMedia('(min-width: 75rem) and (hover: hover) and (pointer: fine)');
  const limited = navigator.connection?.saveData || navigator.deviceMemory <= 4 || navigator.hardwareConcurrency <= 4;
  const visible = new Set();
  let observer, listening = false, frame = 0;
  const canMove = () => desktop.matches && !reduced.matches && !forced.matches && !limited;
  function draw() {
    frame = 0;
    if (!canMove() || document.hidden || document.body.classList.contains('nav-is-open')) return;
    const height = innerHeight;
    // Batch geometry reads before writes; update only the visible decorative stages.
    const positions = [...visible].map((stage) => {
      const rect = stage.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / (height / 2 + rect.height / 2)));
      return [stage, `${(progress * 12).toFixed(2)}px`];
    });
    positions.forEach(([stage, shift]) => stage.style.setProperty('--spatial-shift', shift));
  }
  function queue() {
    if (!frame && !document.hidden && visible.size) frame = requestAnimationFrame(draw);
  }
  function sync() {
    const enabled = canMove() && 'IntersectionObserver' in window;
    if (enabled === listening) return;
    listening = enabled;
    if (enabled) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) visible.add(target);
          else visible.delete(target);
        });
        queue();
      });
      stages.forEach((stage) => observer.observe(stage));
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue, { passive: true });
      document.addEventListener('visibilitychange', visibility);
      window.addEventListener('pageshow', queue);
      window.addEventListener('pagehide', cancel);
    } else {
      observer?.disconnect();
      visible.clear();
      cancel();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pageshow', queue);
      window.removeEventListener('pagehide', cancel);
      stages.forEach((stage) => stage.style.removeProperty('--spatial-shift'));
    }
  }
  function cancel() { cancelAnimationFrame(frame); frame = 0; }
  function visibility() { if (document.hidden) cancel(); else queue(); }
  [reduced, forced, desktop].forEach((query) => query.addEventListener('change', sync));
  sync();
})();
