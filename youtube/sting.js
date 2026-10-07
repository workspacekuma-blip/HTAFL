/* Explicit playback only: silent, one pass, exact static Five-Path Mark at rest. */
(() => {
  const button=document.querySelector('[data-play-sting]');
  if (!button) return;
  const art=button.closest('article').querySelector('svg');
  const status=button.closest('article').querySelector('[data-sting-status]');
  const timing=JSON.parse(document.getElementById('sting-timing').textContent);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let animations=[]; let timer;
  function stop() { clearTimeout(timer); animations.forEach(animation=>animation.cancel()); animations=[]; }
  function preference() {
    stop(); button.disabled=reduced.matches;
    status.textContent=reduced.matches?'Reduced motion: use the static lockup with a direct cut.':'';
  }
  button.addEventListener('click',()=>{
    stop(); if (reduced.matches) return;
    button.disabled=true; status.textContent='Playing a silent 2.4-second brand sting.';
    const reveals=['0 0 100% 0','0 0 0 100%','100% 0 0 0','100% 0 0 0','0 100% 0 0'];
    art.querySelectorAll('[data-sting-paths] path').forEach((part,i)=>{
      animations.push(part.animate([{opacity:0,clipPath:`inset(${reveals[i]}) fill-box`},{opacity:1,clipPath:'inset(0 0 0 0) fill-box'}],{duration:timing.pathRevealMs,delay:i*timing.pathRevealMs,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}));
    });
    [['wordmark',timing.wordmarkDelayMs],['tagline',timing.taglineDelayMs]].forEach(([name,delay])=>{
      animations.push(art.querySelector(`[data-sting-${name}]`).animate([{opacity:0},{opacity:1}],{duration:160,delay,fill:'backwards'}));
    });
    timer=setTimeout(()=>{stop();button.disabled=false;status.textContent='Sting complete. Use the static lockup for a still or reduced-motion version.';},timing.durationMs);
  });
  reduced.addEventListener('change',preference); preference();
  button.hidden=false;
})();
