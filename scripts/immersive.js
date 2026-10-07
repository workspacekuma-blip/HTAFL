/* One shared native-WebGL room shell for every HTAFL route. Content remains HTML. */
(() => {
  'use strict';
  const base=new URL('../',document.currentScript.src),url=path=>new URL(path,base).href;
  const original=document.getElementById('main');
  if(!original||typeof HTMLDialogElement==='undefined'||!HTMLDialogElement.prototype.showModal)return;
  const namespace=window.HTAFLWorld={};
  namespace.worlds=[
    {name:'Overcome',slug:'overcome',idea:'Practice',x:-12,title:'Build resilience through practice.',href:'resources/index.html',link:'Explore Resources',objects:[
      {id:11,name:'Move',point:[-13.9,.65,2.5],message:'Small actions can become momentum.'},
      {id:12,name:'Reflect',point:[-13.1,1.1,.7],message:'Resilience is practiced.'},
      {id:13,name:'Reset',point:[-12.3,1.55,-1.1],message:'You can begin again.'},
      {id:14,name:'Practice',point:[-11.5,2,-2.9],message:"Resilience isn't a mood. It's a practice."},
      {id:15,name:'Try again',point:[-10.7,2.45,-4.7],message:'Progress over perfection.'},
      {id:16,name:'Progress',point:[-9.9,2.9,-6.5],message:'Keep moving.'},
    ]},
    {name:'Create',slug:'create',idea:'Expression',x:0,title:'Turn expression into possibility.',href:'create/index.html',link:'Explore Create',objects:[
      {id:1,name:'Art',point:[-2.5,3.2,-2.8],message:"You don't need permission to create."},
      {id:2,name:'Fashion',point:[2.6,3.6,-6.4],message:'Your style can tell a story before you find the words.'},
      {id:3,name:'Upcycle',point:[-3.6,1.9,2.6],message:'Make something your own.'},
      {id:4,name:'Photography',point:[2.4,2.5,1.3],message:'See the everyday differently.'},
      {id:5,name:'Design',point:[-1.2,1.2,.1],message:'Turn expression into possibility.'},
      {id:6,name:'Self-expression',point:[-4.7,4.6,-7.6],message:"Progress doesn't require perfection."},
    ]},
    {name:'Connect',slug:'connect',idea:'Belonging',x:12,title:"You shouldn't have to grow alone.",href:'community/index.html',link:'Explore Community',objects:[
      {id:21,name:'Community',point:[11.8,1.2,-1.7],message:'Different stories. Shared strength.'},
      {id:22,name:'Collaborate',point:[9,3.4,-5.3],message:"You don't have to grow alone."},
      {id:23,name:'Share',point:[15.1,3.8,-7.3],message:'Your work. Your choice.'},
      {id:24,name:'Support',point:[8.9,.9,1.3],message:'Kindness is part of the foundation.'},
      {id:25,name:'Participate',point:[15.1,1.4,-2.8],message:'A place where beginners belong.'},
    ]},
  ];
  const rooms=namespace.worlds;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),forced=matchMedia('(forced-colors: active)');
  const compact=matchMedia('(max-width: 47.999rem), (pointer: coarse)');
  const limited=!!(navigator.connection?.saveData||navigator.deviceMemory<=4||navigator.hardwareConcurrency<=4);
  const path=location.pathname.replace(/index\.html$/,'');
  const home=path===base.pathname;
  const routeRoom=path.includes('/create/')?1:/(community|get-involved)\/$/.test(path)?2:0;
  const routeTitle=home?'HTAFL':path.includes('/get-involved/')?'Get Involved':path.includes('/how-it-works/')?'How It Works':path.includes('/resources/')?'Resources':path.includes('/community/')?'Community':path.includes('/create/')?'Create':'About HTAFL';
  const routeURL=location.href,routeDocumentTitle=document.title;
  // Lock relative content assets/links to their original route during room History changes.
  if(!document.querySelector('base')){const element=document.createElement('base');element.href=routeURL;document.head.prepend(element);}
  const content=document.createElement('dialog');content.className='room-panel room-content-panel';content.setAttribute('aria-labelledby','room-content-title');
  content.innerHTML='<div class="room-panel-bar"><h2 id="room-content-title" class="type-h3"></h2><button class="button button--secondary" type="button" data-close-panel>Back to room</button></div><div class="room-article"></div>';
  content.querySelector('h2').textContent=routeTitle;
  const article=content.querySelector('.room-article');
  while(original.firstChild)article.append(original.firstChild);
  article.querySelector('[data-room-fallback]')?.remove();
  const footer=document.querySelector('site-footer');if(footer)article.append(footer);
  const root=document.createElement('main');root.id='main';root.tabIndex=-1;root.className='room-stage';root.dataset.mode='welcome';root.dataset.renderer='pending';root.setAttribute('aria-label','Explore the HTAFL rooms');
  root.innerHTML=`<div class="room-visual" data-room-visual><div class="room-static" aria-hidden="true"><div></div><div></div><div></div><img src="${url('assets/htafl-mark.svg')}" width="64" height="64" alt=""></div><div class="room-hotspots" data-room-hotspots role="group" aria-label="Room objects"></div></div>
    <div class="room-welcome stack"><p class="type-label">Enter the HTAFL world</p><h1 class="room-welcome-title">Create.<br>Overcome.<br>Connect.</h1><div class="cluster"><button class="button button--primary" type="button" data-room-enter>Enter Overcome</button></div></div>
    <div class="room-intro stack" hidden><p class="type-label" data-room-idea></p><h1 id="room-heading" tabindex="-1"></h1><p class="type-body-lg" data-room-title></p></div>
    <div class="room-controls"><div class="cluster"><button class="button button--secondary" type="button" data-room-objects hidden>Explore objects</button><a class="button button--primary" data-room-content href="${url('resources/index.html')}" hidden>Explore Resources</a><button class="button button--text" data-room-outside type="button" hidden>Return to entrance</button></div><nav class="cluster room-info-links" aria-label="HTAFL information"><a href="${url('about/index.html')}">About HTAFL</a><a href="${url('how-it-works/index.html')}">How It Works</a>${home?'<button class="button button--text" type="button" data-room-reading>Read HTAFL</button>':'<button class="button button--text" type="button" data-room-reading>Read '+routeTitle+'</button>'}</nav></div>
    <p class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-room-status></p>`;
  original.replaceWith(root);document.body.append(content);
  const idea=document.createElement('dialog');idea.className='room-panel room-idea-panel';idea.setAttribute('aria-labelledby','room-idea-title');
  idea.innerHTML='<div class="room-panel-bar"><p class="type-label" data-idea-label></p><button class="button button--secondary" type="button" data-close-panel>Back to room</button></div><div class="stack room-idea-content"><h2 id="room-idea-title" class="type-h2" tabindex="-1"></h2><div data-idea-choices class="stack"></div><div class="cluster"><a class="button button--primary" data-idea-link hidden></a><button class="button button--text" type="button" data-idea-back hidden>Explore another object</button></div></div>';
  document.body.append(idea);document.body.classList.add('room-ready');
  const visual=root.querySelector('[data-room-visual]'),hotspots=root.querySelector('[data-room-hotspots]');
  const q=name=>root.querySelector(`[data-room-${name}]`);
  let entered=false,index=routeRoom,scene,loading=false,failed=false,visible=true,away=false,resources,returnFocus;
  const params=new URL(location.href).searchParams,requested=rooms.findIndex(r=>r.slug===params.get('room'));
  if(requested>=0)index=requested;
  const canDraw=()=>visible&&!away&&!document.hidden&&!forced.matches&&!content.open&&!idea.open&&!document.body.classList.contains('nav-is-open');
  function sync(){if(scene){if(canDraw())scene.resume();else scene.pause();}}
  const contentTarget=hash=>{if(!hash||hash==='#')return null;let id;try{id=decodeURIComponent(hash.slice(1));}catch{return null;}return article.querySelector('#'+CSS.escape(id));};
  function project(map){
    if(!entered||compact.matches)return;
    const bounds=visual.getBoundingClientRect(),occupied=[];
    const overlays=[root.querySelector('.room-intro'),root.querySelector('.room-controls')].map(element=>element.getBoundingClientRect());
    rooms[index].objects.forEach((object,i)=>{const p=map(object.point),button=hotspots.children[i];if(!button)return;const x=p.x/100*visual.clientWidth,y=p.y/100*visual.clientHeight;
      const covered=overlays.some(r=>x+bounds.left+24>r.left&&x+bounds.left-24<r.right&&y+bounds.top+24>r.top&&y+bounds.top-24<r.bottom);
      button.hidden=!p.visible||covered||x<24||x>visual.clientWidth-24||y<24||y>visual.clientHeight-24||occupied.some(point=>Math.abs(point[0]-x)<48&&Math.abs(point[1]-y)<48);
      if(!button.hidden)occupied.push([x,y]);button.style.left=`${p.x}%`;button.style.top=`${p.y}%`;
    });
  }
  function load(path){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url(path);const timeout=setTimeout(()=>{script.remove();reject(new Error('Room helper timeout'));},10000);script.onload=()=>{clearTimeout(timeout);resolve()};script.onerror=()=>{clearTimeout(timeout);script.remove();reject(new Error('Room helper failed'))};document.head.append(script);});}
  function fallback(){failed=true;scene?.dispose();scene=null;root.dataset.renderer='2d';q('status').textContent='The reading view is ready. Every room and idea is available.';}
  async function ensureScene(){
    if(scene||loading||failed||away)return;
    if(forced.matches){fallback();return;}
    loading=true;
    try{
      resources||=(async()=>{await load('immersive/worlds.js');await load('immersive/scene.js');})();
      const mark=(async()=>{if(base.protocol==='file:')return null;try{const response=await fetch(url('assets/htafl-mark.svg'));if(!response.ok)return null;const doc=new DOMParser().parseFromString(await response.text(),'image/svg+xml');if(doc.querySelector('parsererror'))return null;const svg=document.importNode(doc.documentElement,true);svg.removeAttribute('role');svg.removeAttribute('aria-labelledby');svg.setAttribute('aria-hidden','true');svg.classList.add('room-mark-source');root.append(svg);return svg;}catch{return null;}})();
      const [,source]=await Promise.all([resources,mark]);if(away)return;
      scene=new namespace.Scene(visual,source,{mobile:()=>compact.matches,limited,reduced:()=>reduced.matches,project,failure:fallback});
      root.dataset.renderer='webgl';scene.setPreview(!entered);if(entered){if(content.open||idea.open){scene.staticView(index);root.dataset.camera='settled';}else scene.go(index,()=>{root.dataset.camera='settled';});}sync();
    }catch{fallback();}finally{loading=false;}
  }
  function updateURL(){const target=new URL('index.html',base);target.searchParams.set('room',rooms[index].slug);try{history.pushState({room:rooms[index].slug},'',target);}catch{/* File previews keep working without History support. */}}
  function choose(destination,write=false,focus=false){
    index=destination;entered=true;root.dataset.mode='room';root.dataset.room=rooms[index].slug;
    root.querySelector('.room-welcome').hidden=true;root.querySelector('.room-intro').hidden=false;
    q('idea').textContent=rooms[index].idea;q('title').textContent=rooms[index].title;
    const heading=document.getElementById('room-heading');heading.textContent=rooms[index].name+'.';
    q('content').textContent=rooms[index].link;q('content').href=url(rooms[index].href);
    for(const name of ['objects','content','outside'])q(name).hidden=false;
    document.querySelectorAll('[data-room-link]').forEach(a=>{if(a.dataset.roomLink===rooms[index].slug)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    hotspots.setAttribute('aria-label',rooms[index].name+' objects');hotspots.replaceChildren(...rooms[index].objects.map(object=>{
      const button=document.createElement('button');button.type='button';button.hidden=true;button.className='button room-hotspot';button.setAttribute('aria-label',object.name);button.setAttribute('aria-haspopup','dialog');
      const pin=document.createElement('span');pin.className='room-hotspot-pin';pin.setAttribute('aria-hidden','true');
      const label=document.createElement('span');label.className='room-hotspot-label';label.textContent=object.name;button.append(pin,label);
      button.addEventListener('click',()=>openIdea(object,button));button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')scene?.select(object.id);});button.addEventListener('pointerleave',()=>scene?.select(0));button.addEventListener('focus',()=>scene?.select(object.id));button.addEventListener('blur',()=>scene?.select(0));return button;
    }));
    const settled=()=>{root.dataset.camera='settled';q('status').textContent=rooms[index].name+'. '+rooms[index].idea+'. Choose an object to explore.';};
    if(scene){scene.setPreview(false);root.dataset.camera='moving';scene.go(index,settled);}else settled();
    const bounds=visual.getBoundingClientRect();visible=bounds.bottom>0&&bounds.top<innerHeight;sync();ensureScene();
    if(write)updateURL();if(focus)heading.focus({preventScroll:true});
    document.title=rooms[index].name+' — HTAFL · Create. Overcome. Connect.';
  }
  function openPanel(panel,trigger){returnFocus=trigger||(root.contains(document.activeElement)?document.activeElement:q('objects'));if(!panel.open)panel.showModal();sync();}
  function closePanel(panel){panel.close();if(panel===content)document.title=rooms[index].name+' — HTAFL · Create. Overcome. Connect.';scene?.select(0);const target=returnFocus?.isConnected&&returnFocus.getClientRects().length?returnFocus:q('objects');target?.focus({preventScroll:true});sync();}
  function openReading(trigger,target){if(!entered)choose(index,false);openPanel(content,trigger);document.title=routeDocumentTitle;const destination=target&&contentTarget('#'+target);if(destination){if(!destination.matches('a[href],button,input,select,textarea,[tabindex]'))destination.tabIndex=-1;destination.scrollIntoView({block:'start',behavior:'instant'});destination.focus({preventScroll:true});}}
  function openIdea(object,trigger){
    const label=idea.querySelector('[data-idea-label]'),title=idea.querySelector('h2'),choices=idea.querySelector('[data-idea-choices]'),link=idea.querySelector('[data-idea-link]');
    label.textContent=rooms[index].name+' / '+object.name;title.textContent=object.message;choices.replaceChildren();link.hidden=false;link.textContent=object.id===25?'Explore ways to get involved':rooms[index].link;link.href=url(object.id===25?'get-involved/index.html':rooms[index].href);idea.querySelector('[data-idea-back]').hidden=false;scene?.select(object.id);openPanel(idea,trigger);title.focus({preventScroll:true});
  }
  function chooser(trigger=q('objects')){
    idea.querySelector('[data-idea-label]').textContent=rooms[index].name;idea.querySelector('h2').textContent='Explore the room.';idea.querySelector('[data-idea-link]').hidden=true;idea.querySelector('[data-idea-back]').hidden=true;
    idea.querySelector('[data-idea-choices]').replaceChildren(...rooms[index].objects.map(object=>{const b=document.createElement('button');b.type='button';b.className='button button--secondary';b.textContent=object.name;b.addEventListener('click',()=>openIdea(object,returnFocus));return b;}));openPanel(idea,trigger);idea.querySelector('h2').focus({preventScroll:true});
  }
  for(const panel of [content,idea]){
    panel.querySelector('[data-close-panel]').addEventListener('click',()=>closePanel(panel));
    panel.addEventListener('cancel',e=>{e.preventDefault();closePanel(panel);});
    panel.addEventListener('click',e=>{if(e.target!==panel)return;const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePanel(panel);});
  }
  q('enter').addEventListener('click',()=>choose(0,true,true));q('objects').addEventListener('click',()=>chooser());idea.querySelector('[data-idea-back]').addEventListener('click',()=>chooser(returnFocus));
  root.querySelectorAll('[data-room-reading]').forEach(b=>b.addEventListener('click',()=>openReading(b)));
  function entrance(write=false,focus=false){entered=false;root.dataset.mode='welcome';delete root.dataset.room;root.querySelector('.room-welcome').hidden=false;root.querySelector('.room-intro').hidden=true;hotspots.replaceChildren();for(const name of ['objects','content','outside'])q(name).hidden=true;document.querySelectorAll('[data-room-link]').forEach(a=>a.removeAttribute('aria-current'));scene?.setPreview(true);scene?.go(-1);if(focus)q('enter').focus({preventScroll:true});if(write)try{history.pushState(null,'',new URL('index.html',base));}catch{}document.title='HTAFL — Create. Overcome. Connect.';q('status').textContent='HTAFL entrance. Choose Overcome, Create or Connect.';sync();}
  q('outside').addEventListener('click',()=>entrance(true,true));
  document.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const anchor=event.target.closest('a[href]');if(!anchor)return;
    if(anchor.dataset.roomLink){const next=rooms.findIndex(r=>r.slug===anchor.dataset.roomLink);if(next<0)return;event.preventDefault();const menu=document.querySelector('.site-menu');if(menu?.open)menu.close();if(content.open)closePanel(content);if(idea.open)closePanel(idea);choose(next,true,true);return;}
    const target=new URL(anchor.href);
    if(target.origin!==location.origin)return;
    if(target.hash==='#main'){if(content.open){event.preventDefault();closePanel(content);document.getElementById('room-heading').focus({preventScroll:true});}return;}
    if(target.pathname===new URL(routeURL).pathname&&target.hash&&contentTarget(target.hash)){event.preventDefault();openReading(anchor,target.hash.slice(1));}
  });
  addEventListener('popstate',()=>{const slug=new URL(location.href).searchParams.get('room');const next=rooms.findIndex(r=>r.slug===slug);if(content.open)closePanel(content);if(idea.open)closePanel(idea);if(next>=0){choose(next,false);}else if(location.pathname.replace(/index\.html$/,'')!==new URL(routeURL).pathname.replace(/index\.html$/,'')){location.reload();}else if(!home){choose(routeRoom,false);openReading(q('objects'));}else entrance(false,true);});
  const resize=()=>{const header=document.querySelector('site-header');root.style.setProperty('--room-header-height',`${Math.ceil(header?.getBoundingClientRect().height||80)}px`);scene?.invalidate();sync();};
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();if(visible)ensureScene();}).observe(visual);else ensureScene();
  if('ResizeObserver'in window){const observer=new ResizeObserver(resize);observer.observe(visual);const header=document.querySelector('site-header');if(header)observer.observe(header);}
  addEventListener('resize',resize,{passive:true});document.fonts?.ready.then(resize);
  let density;const watchDPR=()=>{density?.removeEventListener('change',watchDPR);density=matchMedia(`(resolution: ${devicePixelRatio||1}dppx)`);density.addEventListener('change',watchDPR);resize();};watchDPR();
  compact.addEventListener('change',()=>{if(scene){scene.mobile=compact.matches;scene.go(entered?index:-1,()=>{root.dataset.camera='settled';});}resize();});
  reduced.addEventListener('change',()=>scene?.motionChange());forced.addEventListener('change',()=>{if(forced.matches)fallback();});
  document.addEventListener('visibilitychange',sync);new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  visual.addEventListener('pointermove',event=>{if(!scene||compact.matches||reduced.matches||event.pointerType!=='mouse'||!canDraw())return;const r=visual.getBoundingClientRect();scene.point((event.clientX-r.left)/r.width*2-1,(event.clientY-r.top)/r.height*2-1);},{passive:true});visual.addEventListener('pointerleave',()=>scene?.point(0,0));
  addEventListener('pagehide',e=>{away=true;sync();if(!e.persisted){scene?.dispose();scene=null;}});addEventListener('pageshow',()=>{away=false;resize();ensureScene();});
  if(!home||requested>=0||location.hash&&contentTarget(location.hash)){choose(index,false);if(!home||location.hash&&contentTarget(location.hash))openReading(null,location.hash.slice(1));}
  resize();ensureScene();
})();
