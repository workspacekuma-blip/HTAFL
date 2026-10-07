/* Optional, page-local progress. Original instructions work without JavaScript. */
(() => {
  document.querySelectorAll('[data-practice-steps]').forEach((list,listIndex)=>{
    const steps=[...list.children].filter(node=>node.tagName==='LI');
    if(!steps.length)return;
    const status=document.createElement('p');status.className='type-small practice-status';
    status.dataset.practiceStatus='';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
    const reset=document.createElement('button');reset.type='button';reset.textContent='Reset checklist';reset.className='button button--secondary';reset.hidden=true;
    const controls=[];
    const update=()=>{
      const count=controls.filter(input=>input.checked).length;
      status.textContent=`${count} of ${controls.length} steps checked. Progress stays on this page only.`;
      reset.hidden=count===0;
      controls.forEach(input=>input.closest('li').classList.toggle('is-checked',input.checked));
    };
    steps.forEach((item,index)=>{
      const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');
      input.type='checkbox';input.id=`practice-${listIndex}-${index}`;input.dataset.practiceStep='';input.autocomplete='off';
      label.htmlFor=input.id;text.textContent=item.textContent;label.append(input,text);item.replaceChildren(label);
      controls.push(input);input.addEventListener('change',update);
    });
    list.classList.add('practice-checklist');list.after(status,reset);
    reset.addEventListener('click',()=>{controls.forEach(input=>{input.checked=false;});update();controls[0].focus({preventScroll:true});});
    update();
    // The back/forward cache can restore DOM values; clear rather than retain progress.
    window.addEventListener('pageshow',event=>{if(event.persisted){controls.forEach(input=>{input.checked=false;});update();}});
  });
})();
