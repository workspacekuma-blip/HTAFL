/* Progressive enhancement of public contribution instructions; no payment processing. */
(() => {
  const section=document.querySelector('[data-support-contributions]');
  if(!section || !navigator.clipboard?.writeText)return;
  const status=section.querySelector('[data-copy-status]');
  let timer;
  for(const button of section.querySelectorAll('[data-copy-target]')){
    const target=document.getElementById(button.dataset.copyTarget);
    if(!target?.textContent.trim())continue;
    button.hidden=false;
    let pending=false;
    button.addEventListener('click',async()=>{
      if(pending)return;
      pending=true;clearTimeout(timer);status.textContent='';button.setAttribute('aria-busy','true');
      let message;
      try{await navigator.clipboard.writeText(target.textContent.trim());message=target.id==='support-bank-account'?'Account number copied.':'Wallet address copied.';}
      catch{message='Copy is unavailable. Select and copy the displayed details manually.';}
      finally{pending=false;button.removeAttribute('aria-busy');}
      timer=setTimeout(()=>{status.textContent=message;},50);
    });
  }
})();
