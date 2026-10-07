(() => {
  const admin=document.querySelector('#admin-setup'),adminStatus=document.querySelector('#admin-setup-status');
  let adminPending=false;
  admin.addEventListener('submit',async event=>{
    event.preventDefault();if(adminPending)return;
    adminPending=true;const controls=[...admin.elements];const values=Object.fromEntries(new FormData(admin));
    controls.forEach(control=>control.disabled=true);admin.setAttribute('aria-busy','true');adminStatus.textContent='Saving private reviewer access…';
    let successful=false;
    try{
      const response=await fetch('/configure-admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
      const result=await response.json();adminStatus.textContent=result.message;successful=response.ok;
    }catch{adminStatus.textContent='The local setup connection failed. Relaunch setup and try again.';}
    finally{
      admin.elements.password.value='';admin.elements.confirmation.value='';values.password='';values.confirmation='';
      controls.forEach(control=>control.disabled=successful);adminPending=false;admin.removeAttribute('aria-busy');adminStatus.tabIndex=-1;adminStatus.focus();
    }
  });
  const form=document.querySelector('#email-setup'),input=form.elements.password,button=form.querySelector('button'),status=document.querySelector('#setup-status');
  let pending=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(pending)return;
    pending=true;button.disabled=true;input.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Checking encrypted mail.com connection…';
    let successful=false;
    try{
      const response=await fetch('/configure',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:input.value})});
      const result=await response.json();status.textContent=result.message;
      successful=response.ok;
      if(successful)input.removeAttribute('aria-invalid');else input.setAttribute('aria-invalid','true');
    }catch{status.textContent='The local setup connection failed. Relaunch email setup and try again.';}
    finally{
      input.value='';pending=false;form.removeAttribute('aria-busy');input.disabled=successful;button.disabled=successful;
      status.tabIndex=-1;status.focus();if(!successful)input.focus();
    }
  });
})();
