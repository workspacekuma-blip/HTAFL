import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {createApp} from '../server/index.js';
import {hashPassword,verifyPassword} from '../server/password.js';

const password='Test-only passphrase for isolated services';
const hash=await hashPassword(password);
const json=body=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
async function service(options,run) {
  const storage=await mkdtemp(path.join(tmpdir(),'htafl-admin-test-'));
  const server=createApp({mailReady:false,adminHash:hash,adminUsername:'reviewer',secureCookies:false,...options,storage}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  const request=(route,init={})=>fetch(base+route,{...init,headers:{Origin:base,...init.headers}});
  try{await run({storage,request});}finally{await new Promise(resolve=>server.close(resolve));await rm(storage,{recursive:true,force:true});}
}
async function login(request) {
  const response=await request('/admin/api/login',json({username:'reviewer',password}));assert.equal(response.status,200);
  const cookie=response.headers.get('set-cookie');assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Strict/);assert.match(cookie,/Path=\/admin/);
  const session=await response.json();return {cookie:cookie.split(';')[0],csrf:session.csrf};
}
async function upload(request,permission) {
  const data=new FormData();
  Object.entries({credit:'Test creator',email:'private@example.com',title:'Test fabric study',description:'A textile study made for isolated service testing.',alt:'A small piece of ivory fabric.',category:'fashion',publicationConsent:String(permission),rightsConsent:'true',contactConsent:'true',adultConsent:'true'}).forEach(([key,value])=>data.set(key,value));
  const image=await sharp({create:{width:40,height:40,channels:3,background:'#f7f4ec'}}).png().toBuffer();
  data.set('artwork',new Blob([image],{type:'image/png'}),'test.png');
  const response=await request('/api/community/submissions',{method:'POST',body:data});assert.equal(response.status,201);return response.json();
}
test('admin password hashes and verification',async()=>{
  assert.equal(await verifyPassword(password,hash),true);assert.equal(await verifyPassword('incorrect',hash),false);
  assert.equal(await verifyPassword(password,'bad hash'),false);await assert.rejects(hashPassword('short'),/16/);
});
test('private dashboard access, consent enforcement, publication and logout',async()=>{
  await service({},async({request,storage})=>{
    const a=await upload(request,false),b=await upload(request,true);
    for(const route of ['/admin/api/status','/admin/api/submissions',`/admin/api/images/${a.id}`])assert.equal((await request(route)).status,401);
    const state=await request('/admin/api/session').then(r=>r.json());assert.deepEqual(state,{configured:true,authenticated:false});
    const signed=await login(request),headers={Cookie:signed.cookie,'X-CSRF-Token':signed.csrf};
    const queue=await request('/admin/api/submissions',{headers});assert.equal(queue.headers.get('cache-control'),'no-store');
    assert.equal((await queue.json()).entries.length,2);
    assert.equal((await request(`/admin/api/images/${a.id}`,{headers})).status,200);
    assert.equal((await request(`/api/community/images/${a.id}`)).status,404);
    const approve=id=>`/admin/api/submissions/${id}/approve`;
    assert.equal((await request(approve(b.id),{method:'POST',headers:{Cookie:signed.cookie}})).status,403);
    assert.equal((await request(approve(b.id),{method:'POST',headers:{...headers,Origin:'https://other.example'}})).status,403);
    assert.equal((await request(approve(b.id),{method:'POST',headers:{...headers,'X-CSRF-Token':'wrong'}})).status,403);
    assert.equal((await request(approve(a.id),{method:'POST',headers})).status,422);
    assert.equal((await request(approve(b.id),{method:'POST',headers})).status,200);
    const publicData=await request('/api/community').then(r=>r.json());assert.equal(publicData.entries.length,1);assert.ok(!JSON.stringify(publicData).includes('private@example.com'));
    assert.equal((await request(approve(b.id),{method:'POST',headers})).status,409);
    assert.equal((await request(`/admin/api/submissions/${b.id}/withdraw`,{method:'POST',headers})).status,200);
    assert.equal((await request('/api/community').then(r=>r.json())).entries.length,0);
    await assert.rejects(readFile(path.join(storage,`${b.id}.json`)),{code:'ENOENT'});
    assert.equal((await request(`/admin/api/submissions/${a.id}/reject`,{method:'POST',headers})).status,200);
    assert.equal((await request('/admin/api/logout',{method:'POST',headers})).status,200);
    assert.equal((await request('/admin/api/submissions',{headers})).status,401);
    assert.equal((await request('/server/admin-ui/app.js')).status,404);
  });
});
test('failed notifications retry through authenticated tools only',async()=>{
  let fail=true;const mail=[];
  await service({mailReady:true,sendMail:async record=>{if(fail)throw Error('mock failure');mail.push(record);}},async({request})=>{
    const receipt=await upload(request,true);assert.equal(receipt.notification,'failed');
    const signed=await login(request),headers={Cookie:signed.cookie,'X-CSRF-Token':signed.csrf};
    const route=`/admin/api/submissions/${receipt.id}/retry-email`;
    assert.equal((await request(route,{method:'POST',headers})).status,502);
    fail=false;assert.equal((await request(route,{method:'POST',headers})).status,200);
    assert.equal(mail.length,1);assert.equal(mail[0].to,'htafl@africamail.com');
    assert.equal((await request(route,{method:'POST',headers})).status,409);
    const entries=await request('/admin/api/submissions',{headers}).then(r=>r.json());assert.equal(entries.entries[0].notification,'sent');
  });
});
test('disabled setup, HTTPS enforcement and sign-in throttling',async()=>{
  await service({adminHash:''},async({request})=>assert.equal((await request('/admin/api/login',json({username:'reviewer',password}))).status,503));
  await service({secureCookies:true},async({request})=>assert.equal((await request('/admin/api/login',json({username:'reviewer',password}))).status,403));
  await service({},async({request})=>{
    for(let i=0;i<5;i++)assert.equal((await request('/admin/api/login',json({username:'reviewer',password:'incorrect'}))).status,401);
    assert.equal((await request('/admin/api/login',json({username:'reviewer',password}))).status,429);
  });
});
