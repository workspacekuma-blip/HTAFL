import {pathways} from './involvement.js';
const target=process.argv[2] || process.env.PUBLIC_ORIGIN || 'http://localhost:3128';
try{
  const url=new URL(target),local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if((url.protocol!=='https:' && !(local && url.protocol==='http:')) || url.username || url.password || url.pathname!=='/' || url.hash || url.search)throw Error('Use the exact website origin, with HTTPS outside localhost.');
  const availability=await fetch(url.origin+'/api/config',{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw Error('The website service is unavailable.');return r.json();});
  if(!availability.emailReady)throw Error('Email delivery is not enabled. Save private SMTP settings and restart/redeploy first. No submission was sent.');
  const body={interest:'participate',name:'HTAFL Operations Manager',email:'htafl@africamail.com',message:'Owner-authorized HTAFL delivery test of the participation form. This is a technical test, not a request to join an event. Please confirm receipt in the HTAFL inbox.',consent:true,adultConsent:true};
  for(const field of pathways.participate.fields)if(field.type==='select' && field.required)body[field.name]=field.options[0][0];
  const response=await fetch(url.origin+'/api/involvement',{method:'POST',headers:{Origin:url.origin,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(45000)});
  const result=await response.json();if(!response.ok)throw Error(result.message || 'Submission failed.');
  console.log('Real participation submission accepted by SMTP for htafl@africamail.com. Confirm the “HTAFL involvement: participate” message in the inbox/spam folder. SMTP acceptance alone is not proof of inbox receipt.');
}catch(error){console.error(error.message);process.exitCode=1;}
