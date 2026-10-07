/* Approved uploads only; the existing server enforces publication consent. */
(() => {
  const gallery=document.querySelector('[data-community-gallery]');
  if(!gallery)return;
  const section=gallery.closest('section'),status=section.querySelector('[data-gallery-status]'),empty=section.querySelector('[data-gallery-empty]');
  const limit=Math.max(1,Number(gallery.dataset.galleryLimit)||6);
  const more=document.createElement('button');more.type='button';more.className='button button--secondary';more.hidden=true;
  more.setAttribute('aria-controls',gallery.id);more.setAttribute('aria-expanded','false');gallery.after(more);
  let records=[],expanded=false;
  const render=()=>{
    const shown=expanded?records:records.slice(0,limit),fragment=document.createDocumentFragment();
    shown.forEach(entry=>{
      const item=document.createElement('li'),button=document.createElement('button'),image=document.createElement('img'),title=document.createElement('h3'),credit=document.createElement('p'),summary=document.createElement('p');
      item.className='stack';item.dataset.featuredWork='';button.type='button';button.className='photo-button';
      button.dataset.photoView='';button.dataset.photoKind='community';button.dataset.photoTitle=entry.title;button.dataset.photoCredit=entry.credit;
      button.setAttribute('aria-label',`View ${entry.title} by ${entry.credit}`);
      image.src=entry.image.src;image.alt=entry.image.alt || entry.title;
      image.width=Number.isInteger(entry.image.width)&&entry.image.width>0?entry.image.width:1280;
      image.height=Number.isInteger(entry.image.height)&&entry.image.height>0?entry.image.height:1280;
      image.loading='lazy';image.decoding='async';button.append(image);
      title.textContent=entry.title;credit.textContent=`By ${entry.credit}`;credit.className='gallery-credit';summary.textContent=entry.summary;
      item.append(button,title,credit,summary);fragment.append(item);
    });
    gallery.replaceChildren(fragment);gallery.hidden=!records.length;empty.hidden=!!records.length;
    more.hidden=records.length<=limit;more.textContent=expanded?'Show featured works':`View all ${records.length} works`;
    more.setAttribute('aria-expanded',String(expanded));
    status.textContent=records.length?`Showing ${shown.length} of ${records.length} consent-approved ${records.length===1?'work':'works'}.`:'No community works have been approved for publication yet.';
  };
  more.addEventListener('click',()=>{expanded=!expanded;render();});
  const load=async()=>{
    if(location.protocol==='file:'){status.textContent='Approved community work loads from the HTAFL server. This preview shows the invitation.';return;}
    const restoreFocus=status.contains(document.activeElement);
    status.textContent='Loading community work…';
    try {
      const response=await fetch('/api/community',{cache:'no-store'});if(!response.ok)throw Error();
      const {entries}=await response.json();if(!Array.isArray(entries))throw Error();
      const seen=new Set();
      records=entries.filter(entry=>{
        if(!entry || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(entry.id) || seen.has(entry.id) || entry.image?.src!==`/api/community/images/${entry.id}` || typeof entry.title!=='string' || !entry.title.trim() || typeof entry.credit!=='string' || typeof entry.summary!=='string')return false;
        seen.add(entry.id);return true;
      });
      expanded=false;render();
      if(restoreFocus && document.activeElement===document.body)(gallery.querySelector('button') || empty.querySelector('a'))?.focus({preventScroll:true});
    } catch {
      status.textContent='Community work could not load. You can still share your work below. ';
      const retry=document.createElement('button');retry.type='button';retry.className='button button--secondary';retry.textContent='Retry gallery';
      retry.addEventListener('click',()=>{retry.disabled=true;load();});status.append(retry);
      if(restoreFocus && document.activeElement===document.body)retry.focus({preventScroll:true});
    }
  };
  load();
})();
