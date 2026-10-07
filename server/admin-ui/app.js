(() => {
  const login=document.querySelector('#login-view'),review=document.querySelector('#review-view'),form=document.querySelector('#login-form'),notice=document.querySelector('#setup-notice'),status=document.querySelector('#admin-status'),logout=document.querySelector('#sign-out'),queue=document.querySelector('#queue'),filter=document.querySelector('#review-filter'),search=document.querySelector('#review-search'),dialog=document.querySelector('#confirm-dialog');
  let csrf='',entries=[],pending=false,returnFocus;
  const announce=message=>{status.textContent=message;};
  const showLogin=()=>{csrf='';entries=[];queue.replaceChildren();document.querySelector('#health').replaceChildren();document.querySelector('#queue-count').textContent='';search.value='';filter.value='pending';review.hidden=true;login.hidden=false;logout.hidden=true;};
  async function request(path,method='GET',body) {
    const response=await fetch(`/admin/api/${path}`,{method,headers:{...(method==='POST'?{'X-CSRF-Token':csrf}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    const result=await response.json();
    if(!response.ok){if(response.status===401 && path!=='login'){showLogin();form.hidden=false;form.elements.username.focus();}throw Error(result.message || 'The review service could not complete this request.');}
    return result;
  }
  const node=(tag,text,className)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;if(className)element.className=className;return element;};
  function render() {
    const q=search.value.trim().toLocaleLowerCase();
    const matches=entries.filter(r=>(filter.value==='all'||r.status===filter.value)&&[r.title,r.credit,r.id].join(' ').toLocaleLowerCase().includes(q));
    const fragment=document.createDocumentFragment();
    matches.forEach(record=>{
      const work=node('article',undefined,'review-work stack');
      const image=node('img');image.src=record.imageURL;image.alt=record.alt;image.width=record.width;image.height=record.height;image.loading='lazy';image.decoding='async';
      work.append(image,node('p',record.status==='approved'?'Published / Approved':'Private / Pending','type-label'),node('h2',record.title),node('p',record.description));
      const details=node('dl');
      [['Creator',record.credit],['Email',record.email],['Category',record.category],['Permission',record.publicationConsent?'Public display permitted':'Private review only — do not publish'],['Notification',record.notification],['Reference',record.id],['Received',new Date(record.createdAt).toLocaleString()]].forEach(([label,value])=>details.append(node('dt',label),node('dd',value)));
      work.append(details);
      const actions=node('div',undefined,'cluster');
      const button=(label,action,disabled=false)=>{
        const control=node('button',label,'button button--secondary');control.type='button';control.disabled=disabled||pending;
        control.addEventListener('click',()=>confirm(record,action,control));actions.append(control);
      };
      if(record.status==='pending'){button('Approve publication','approve',!record.publicationConsent);button('Reject and delete','reject');}
      else button('Withdraw and delete','withdraw');
      if(record.notification!=='sent')button('Retry email notification','retry-email');
      work.append(actions);fragment.append(work);
    });
    queue.replaceChildren(fragment);document.querySelector('#queue-empty').hidden=!!matches.length;
    document.querySelector('#queue-count').textContent=`${matches.length} ${matches.length===1?'submission':'submissions'} in this view.`;
  }
  async function refresh() {
    const [data,health]=await Promise.all([request('submissions'),request('status')]);
    entries=data.entries;
    const box=document.querySelector('#health');box.replaceChildren();
    [[`${health.pending} pending`,`${health.approved} approved for publication`],[health.emailConfigured?'Email configured':'Email needs setup',health.emailConfigured?'SMTP credentials present; use the host check to verify connection.':'Notifications are retained for retry after SMTP setup.'],['Private storage ready',`${health.notificationsToRetry} notification(s) awaiting delivery`]].forEach(([title,description])=>{const item=node('div');item.append(node('strong',title),node('p',description));box.append(item);});
    render();
  }
  async function confirm(record,action,button) {
    if(pending)return;
    const label=action==='approve'?'Publish this work?':action==='retry-email'?'Send notification to HTAFL?':'Delete this submission?';
    const description=action==='approve'?`“${record.title}” will appear publicly with its creator credit and description. Review the image and permission first.`:action==='retry-email'?`Send “${record.title}” and its private review details to htafl@africamail.com.`:`“${record.title}” will be removed from storage and the public gallery. This cannot be undone here.`;
    document.querySelector('#confirm-title').textContent=label;document.querySelector('#confirm-description').textContent=description;
    document.querySelector('#confirm-action').textContent=action==='approve'?'Publish work':action==='retry-email'?'Send notification':'Delete work';
    dialog.returnValue='';returnFocus=button;dialog.showModal();
    const accepted=await new Promise(resolve=>dialog.addEventListener('close',()=>resolve(dialog.returnValue==='confirm'),{once:true}));
    document.querySelector('#confirm-title').textContent='';document.querySelector('#confirm-description').textContent='';
    if(!accepted){returnFocus?.focus();return;}
    pending=true;review.setAttribute('aria-busy','true');render();announce('Processing this submission…');
    try{const result=await request(`submissions/${record.id}/${action}`,'POST');await refresh();announce(result.message);}
    catch(error){announce(error.message);}
    finally{pending=false;review.removeAttribute('aria-busy');render();status.focus();}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(pending)return;
    pending=true;const button=form.querySelector('button');button.disabled=true;announce('Signing in…');
    try{
      const session=await request('login','POST',{username:form.elements.username.value,password:form.elements.password.value});
      csrf=session.csrf;form.elements.password.value='';login.hidden=true;review.hidden=false;logout.hidden=false;
      await refresh();announce('Signed in. Private submissions are ready to review.');document.querySelector('#review-title').focus();
    }catch(error){announce(error.message);form.elements.password.value='';form.elements.password.focus();}
    finally{pending=false;button.disabled=false;render();}
  });
  logout.addEventListener('click',async()=>{
    if(pending)return;
    try{await request('logout','POST');showLogin();form.hidden=false;announce('Signed out.');form.elements.username.focus();}
    catch(error){announce(error.message);}
  });
  document.querySelector('#refresh').addEventListener('click',async()=>{if(pending)return;try{await refresh();announce('Review inbox refreshed.');}catch(error){announce(error.message);}});
  filter.addEventListener('change',render);search.addEventListener('input',render);
  (async()=>{
    try{
      const session=await request('session');
      if(session.authenticated){csrf=session.csrf;login.hidden=true;review.hidden=false;logout.hidden=false;await refresh();}
      else if(session.configured){notice.textContent='Sign in with your private administrator account.';form.hidden=false;}
      else notice.textContent='Administrator access is not set up yet. The host operator can run “npm run backend:setup” to set a private passphrase.';
    }catch(error){announce(error.message);}
  })();
})();
