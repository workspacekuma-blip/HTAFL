import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createApp} from '../server/index.js';
import {pathways} from '../server/involvement.js';

const base={name:'Test contributor',email:'person@example.com',message:'I would like to discuss contributing to this project.',consent:true,adultConsent:true};
test('pathway index has no forms and each dedicated route serves exactly its own form',async()=>{
  const server=createApp({mailReady:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  try{
    const index=await fetch(origin+'/get-involved/').then(r=>r.text());
    assert.equal((index.match(/<form\b/g)||[]).length,0);
    for(const key of Object.keys(pathways)){
      const response=await fetch(`${origin}/get-involved/${key}/`);assert.equal(response.status,200);
      const html=await response.text();assert.equal((html.match(/<form\b/g)||[]).length,1);
      assert.ok(html.includes(`id="involvement-${key}-contact"`));
      assert.equal(html.includes('data-support-contributions'),key==='support');
      const redirect=await fetch(`${origin}/get-involved/?interest=${key}`,{redirect:'manual'});
      assert.equal(redirect.status,302);assert.equal(redirect.headers.get('location'),`/get-involved/${key}/#involvement-form`);
    }
    const unknown=await fetch(origin+'/get-involved/?interest=constructor',{redirect:'manual'});assert.equal(unknown.status,200);
    assert.equal((await fetch(origin+'/get-involved/unknown/')).status,404);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
test('all five tailored forms validate and deliver their own details',async()=>{
  const storage=await mkdtemp(path.join(os.tmpdir(),'htafl-pathway-test-')),sent=[];
  const server=createApp({storage,mailReady:true,sendMail:async mail=>sent.push(mail),rateLimit:30}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const post=body=>fetch(origin+'/api/involvement',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
  try{
    for(const [interest,schema] of Object.entries(pathways)) {
      const payload={...base,interest};
      for(const field of schema.fields) {
        if(field.type==='select')payload[field.name]=field.options[0][0];
        else if(!Object.hasOwn(payload,field.name))payload[field.name]=field.type==='url'?'https://example.com/studio':'Test skill or studio';
      }
      const response=await post(payload);assert.equal(response.status,200,interest);
      const mail=sent.at(-1);assert.equal(mail.to,'htafl@africamail.com');assert.match(mail.subject,new RegExp(interest));
      for(const field of schema.fields)assert.ok(mail.text.includes(field.label),`${interest} ${field.name}`);
      const required=schema.fields.find(field=>field.type==='select' && field.required) || schema.fields.find(field=>field.name==='skills');
      const rejected=await post({...payload,[required.name]:''});assert.equal(rejected.status,422,interest);assert.ok((await rejected.json()).fields[required.name]);
    }
    assert.equal(sent.length,5);
    assert.equal((await post({...base,interest:'constructor'})).status,422);
    assert.equal((await post({...base,interest:'volunteer',skills:'A helpful skill',availability:'not-an-option'})).status,422);
  }finally{await new Promise(resolve=>server.close(resolve));await rm(storage,{recursive:true,force:true});}
});
test('support serves the supplied bank details without a processor or invented crypto address',async()=>{
  const server=createApp({mailReady:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  try {
    const html=await fetch(origin+'/get-involved/support/').then(r=>r.text());
    for(const detail of ['GT Bank','Ekuma Billclinton','0473372177','Naira','Crypto wallet','Wallet details coming soon'])assert.ok(html.includes(detail),detail);
    assert.doesNotMatch(html,/stripe|buy\.stripe|data-payment-mount/i);
    assert.ok(html.includes('data-copy-target="support-bank-account"'));
    assert.equal(Object.hasOwn(await fetch(origin+'/api/config').then(r=>r.json()),'supportPayment'),false);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
