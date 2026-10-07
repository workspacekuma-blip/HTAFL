/* DOM photography planes: no WebGL, audio or continuous render loop. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 75rem) and (hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-scenes]').forEach(scene => {
    const tabs = [...scene.querySelectorAll('[data-scene]')];
    const stage = scene.querySelector('.scene-stage');
    let timer;
    const activate = (key, write = true) => {
      if (!tabs.some(tab => tab.dataset.scene === key)) key = 'create';
      tabs.forEach(tab => {
        const active = tab.dataset.scene === key;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active) stage.setAttribute('aria-labelledby', tab.id);
      });
      stage.querySelectorAll('[data-world]').forEach(node => node.toggleAttribute('data-world-visible', node.dataset.world === key));
      clearTimeout(timer); stage.classList.remove('is-changing');
      if (!reduced.matches) {
        void stage.offsetWidth; stage.classList.add('is-changing');
        timer = setTimeout(() => stage.classList.remove('is-changing'), 550);
      }
      if (write) {
        const url = new URL(location.href); url.searchParams.set('world', key);
        try { history.replaceState(null, '', url); } catch { /* File previews retain tab interaction. */ }
      }
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab.dataset.scene));
      tab.addEventListener('keydown', event => {
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : -1;
        if (index < 0) return;
        event.preventDefault(); tabs[index].focus(); activate(tabs[index].dataset.scene);
      });
    });
    activate(new URL(location.href).searchParams.get('world'), false);
    window.addEventListener('popstate', () => activate(new URL(location.href).searchParams.get('world'), false));
  });
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;
  const reveal = node => node.classList.remove('reveal-pending');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { reveal(entry.target); revealObserver.unobserve(entry.target); }
    }), {threshold: 0.04});
    reveals.forEach(node => { node.classList.add('reveal-ready', 'reveal-pending'); revealObserver.observe(node); });
  }
  const planes = [...document.querySelectorAll('[data-depth]')];
  let frame = 0, pointer = {x: 0, y: 0};
  const enabled = () => !reduced.matches && desktop.matches && !document.hidden;
  const reset = () => planes.forEach(node => node.style.removeProperty('transform'));
  const render = () => {
    frame = 0;
    if (!enabled()) { reset(); return; }
    planes.forEach(node => {
      const rect = node.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight || !node.getClientRects().length) return;
      const amount = Number(node.dataset.depth);
      const separation = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight));
      node.style.transform = `translate3d(${pointer.x * amount * 10}px,${pointer.y * amount * 6 + separation * amount * 12}px,0) rotateY(${pointer.x * amount * 1.2}deg)`;
    });
  };
  const schedule = () => { if (enabled() && !frame) frame = requestAnimationFrame(render); };
  document.querySelectorAll('.hero-atelier,.scene-stage').forEach(plane => {
    plane.addEventListener('pointermove', event => {
      if (!enabled()) return;
      const r = plane.getBoundingClientRect();
      pointer = {x: (event.clientX - r.left) / r.width * 2 - 1, y: (event.clientY - r.top) / r.height * 2 - 1}; schedule();
    }, {passive: true});
    plane.addEventListener('pointerleave', () => { pointer = {x: 0, y: 0}; schedule(); });
  });
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  const motionChange = () => {
    cancelAnimationFrame(frame); frame = 0; reset();
    if (reduced.matches) { revealObserver?.disconnect(); reveals.forEach(reveal); }
    schedule();
  };
  reduced.addEventListener('change', motionChange);
  desktop.addEventListener('change', motionChange);
  document.addEventListener('visibilitychange', motionChange);
  // Decorative banner depth and reading feedback; no continuous animation loop.
  const openings=[...document.querySelectorAll('.page-opening')];
  const header=document.querySelector('site-header');
  const forced=matchMedia('(forced-colors: active)');
  let atmosphereFrame=0,openingTarget=null,openingPointer={x:0,y:0};
  const atmosphereEnabled=()=>!reduced.matches && !forced.matches && !document.hidden;
  const paintAtmosphere=()=>{
    atmosphereFrame=0;
    if(!atmosphereEnabled())return;
    const travel=document.documentElement.scrollHeight-innerHeight;
    header?.style.setProperty('--reading-progress',String(travel>0?Math.max(0,Math.min(1,scrollY/travel)):0));
    if(openingTarget && desktop.matches){
      openingTarget.style.setProperty('--atmosphere-x',`${openingPointer.x*6}px`);
      openingTarget.style.setProperty('--atmosphere-y',`${openingPointer.y*4}px`);
    }
  };
  const scheduleAtmosphere=()=>{if(atmosphereEnabled() && !atmosphereFrame)atmosphereFrame=requestAnimationFrame(paintAtmosphere);};
  const resetAtmosphere=()=>{
    cancelAnimationFrame(atmosphereFrame);atmosphereFrame=0;openingTarget=null;
    openings.forEach(node=>{node.style.removeProperty('--atmosphere-x');node.style.removeProperty('--atmosphere-y');});
    header?.style.removeProperty('--reading-progress');scheduleAtmosphere();
  };
  openings.forEach(node=>{
    node.addEventListener('pointermove',event=>{
      if(!atmosphereEnabled() || !desktop.matches)return;
      const r=node.getBoundingClientRect();
      openingTarget=node;openingPointer={x:Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1)),y:Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1))};scheduleAtmosphere();
    },{passive:true});
    node.addEventListener('pointerleave',()=>{openingTarget=node;openingPointer={x:0,y:0};scheduleAtmosphere();},{passive:true});
  });
  window.addEventListener('scroll',scheduleAtmosphere,{passive:true});
  window.addEventListener('resize',scheduleAtmosphere,{passive:true});
  if(header && 'ResizeObserver' in window)new ResizeObserver(scheduleAtmosphere).observe(document.body);
  reduced.addEventListener('change',resetAtmosphere);forced.addEventListener('change',resetAtmosphere);
  desktop.addEventListener('change',resetAtmosphere);document.addEventListener('visibilitychange',resetAtmosphere);
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(atmosphereFrame);atmosphereFrame=0;});
  window.addEventListener('pageshow',scheduleAtmosphere);
  scheduleAtmosphere();

  // One on-demand frame for pointer depth, including dynamically filtered cards.
  let cardFrame=0,activeCard=null,cardPointer={x:0,y:0};
  const cardEnabled=()=>enabled() && !forced.matches;
  const clearCard=()=>{
    cancelAnimationFrame(cardFrame);cardFrame=0;
    activeCard?.style.removeProperty('--card-tilt-x');
    activeCard?.style.removeProperty('--card-tilt-y');activeCard=null;
  };
  const resetCards=()=>{clearCard();document.documentElement.classList.toggle('has-pointer-depth',cardEnabled());};
  document.addEventListener('pointermove',event=>{
    if(!cardEnabled() || event.pointerType!=='mouse')return;
    const card=event.target.closest('.world-link,.resource-card');
    if(!card || card.matches(':focus-within')){clearCard();return;}
    if(card!==activeCard){clearCard();activeCard=card;}
    const r=card.getBoundingClientRect();
    cardPointer={x:Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1)),y:Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1))};
    if(!cardFrame)cardFrame=requestAnimationFrame(()=>{
      cardFrame=0;
      if(!cardEnabled() || !activeCard?.isConnected){clearCard();return;}
      activeCard.style.setProperty('--card-tilt-x',`${-cardPointer.y*1.5}deg`);
      activeCard.style.setProperty('--card-tilt-y',`${cardPointer.x*2}deg`);
    });
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(activeCard && !activeCard.contains(event.relatedTarget))clearCard();},{passive:true});
  document.addEventListener('focusin',clearCard);
  document.addEventListener('visibilitychange',resetCards);
  window.addEventListener('pagehide',clearCard);
  window.addEventListener('pageshow',resetCards);
  reduced.addEventListener('change',resetCards);desktop.addEventListener('change',resetCards);forced.addEventListener('change',resetCards);
  resetCards();

  const dialog = document.querySelector('[data-media-dialog]');
  if (dialog && typeof dialog.showModal === 'function') {
    let photos=[];
    let invoker,index=0;
    const gallery=document.createElement('div');gallery.className='cluster media-gallery-controls';
    const previous=document.createElement('button'),next=document.createElement('button'),status=document.createElement('p');
    previous.type=next.type='button';previous.className=next.className='button button--secondary';
    previous.textContent='Previous photograph';next.textContent='Next photograph';
    status.className='type-small';status.dataset.mediaStatus='';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
    gallery.append(previous,next);gallery.hidden=photos.length<2;
    dialog.querySelector('[data-media-image]').after(status,gallery);
    const showPhoto=position=>{
      index=(position+photos.length)%photos.length;
      const button=photos[index],photo=button.querySelector('img');
      const enlarged=dialog.querySelector('[data-media-image]');
      enlarged.src=photo.src;enlarged.alt=photo.alt;
      const community=button.dataset.photoKind==='community';
      const credit=community?`${button.dataset.photoTitle} — By ${button.dataset.photoCredit}`:button.closest('figure')?.querySelector('figcaption')?.textContent || '';
      dialog.querySelector('#media-title').textContent=community?'Community work':'Process, in detail.';
      const note=dialog.querySelector('[data-media-note]');
      if(note)note.textContent=community?'Shared with the creator’s permission after HTAFL review.':'Illustrative process photography, not an HTAFL community submission.';
      status.textContent=`${community?'Work':'Photograph'} ${index+1} of ${photos.length}${credit?'. '+credit:'.'}`;
    };
    previous.addEventListener('click',()=>showPhoto(index-1));next.addEventListener('click',()=>showPhoto(index+1));
    dialog.addEventListener('keydown',event=>{
      if(photos.length<2 || event.altKey || event.ctrlKey || event.metaKey)return;
      if(event.key==='ArrowLeft' || event.key==='ArrowRight'){event.preventDefault();showPhoto(index+(event.key==='ArrowRight'?1:-1));}
    });
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-photo-view]');
      if (!button) return;
      const photo = button.querySelector('img');
      if (!photo) return;
      invoker = button;
      photos=[...document.querySelectorAll('[data-photo-view]')].filter(node=>(node.dataset.photoKind || 'illustrative')===(button.dataset.photoKind || 'illustrative'));
      gallery.hidden=photos.length<2;
      showPhoto(photos.indexOf(button));
      document.body.classList.add('media-is-open');
      dialog.showModal(); dialog.querySelector('[data-media-close]').focus();
    });
    dialog.querySelector('[data-media-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('media-is-open');
      dialog.querySelector('[data-media-image]').removeAttribute('src');
      invoker?.focus({preventScroll: true});
    });
  }
})();
