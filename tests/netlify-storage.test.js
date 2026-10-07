import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createBlobStorage,BlobState} from '../server/blob-storage.js';
import {readRecord,saveRecord,listRecords,readImage,writeImage,moderateRecord} from '../server/storage.js';
import {createApp} from '../server/index.js';
import {hashPassword} from '../server/password.js';
import sharp from 'sharp';
class Store {
  data=new Map();sequence=0;
  async get(key,options={}){const value=this.data.get(key);if(!value)return null;return options.type==='json'?JSON.parse(value.data):options.type==='arrayBuffer'?value.data instanceof ArrayBuffer?value.data:Uint8Array.from(value.data).buffer:value.data;}
  async getWithMetadata(key){const value=this.data.get(key);return value?{data:JSON.parse(value.data),etag:value.etag}:null;}
  async set(key,data,options={}){const prior=this.data.get(key);if(options.onlyIfNew && prior || options.onlyIfMatch && prior?.etag!==options.onlyIfMatch)return {modified:false};const etag=String(++this.sequence);this.data.set(key,{data,etag});return {modified:true,etag};}
  async setJSON(key,value,options){return this.set(key,JSON.stringify(value),options);}
  async delete(key){this.data.delete(key);}
  async list(){return {blobs:[...this.data.keys()].map(key=>({key}))};}
}
test('persistent blob uploads survive new application instances and withdrawal removes image/record',async()=>{
  const store=new Store(),first=createBlobStorage(store),id=randomUUID();
  await writeImage(first,id,Buffer.from('test-image'));
  await saveRecord(first,{id,status:'pending',publicationConsent:true,rightsConsent:true,contactConsent:true,createdAt:new Date().toISOString()});
  const second=createBlobStorage(store);
  assert.equal((await listRecords(second)).length,1);assert.equal((await readImage(second,id)).toString(),'test-image');
  await moderateRecord(second,id,'approve');assert.equal((await readRecord(first,id)).status,'approved');
  await moderateRecord(second,id,'withdraw');assert.equal((await listRecords(first)).length,0);
  await assert.rejects(readImage(first,id));await assert.rejects(readRecord(first,'../../private'));
});
test('blob state supports sessions across instances, atomic limits and exclusive moderation leases',async()=>{
  const store=new Store(),first=new BlobState(store),second=new BlobState(store);
  await first.setSession('abc',{seen:Date.now(),expires:Date.now()+100000,csrf:'test'});
  assert.equal((await second.getSession('abc')).csrf,'test');
  await second.deleteSession('abc');assert.equal(await first.getSession('abc'),null);
  const counts=await Promise.all(Array.from({length:5},(_,i)=>(i%2?first:second).attempt('submission','ip')));
  assert.deepEqual(counts.map(v=>v.count).sort(),[1,2,3,4,5]);
  const release=await first.lock('work');assert.equal(await second.lock('work'),null);await release();
  assert.equal(typeof await second.lock('work'),'function');
});

test('shared blob API converts real uploads and enforces private review/publication/withdrawal across instances',async()=>{
  const uploads=new Store(),access=new Store(),password='Cross-instance test passphrase',adminHash=await hashPassword(password);
  let mailStarted,finishMail;const started=new Promise(resolve=>mailStarted=resolve),mail=new Promise(resolve=>finishMail=resolve);
  const settings={mailReady:true,sendMail:async()=>{mailStarted();await mail;},adminHash,adminUsername:'reviewer',secureCookies:false,rateLimit:30};
  const servers=[0,1].map(()=>createApp({...settings,storage:createBlobStorage(uploads),state:new BlobState(access)}).listen(0,'127.0.0.1'));
  await Promise.all(servers.map(s=>new Promise(resolve=>s.once('listening',resolve))));
  const origins=servers.map(s=>`http://127.0.0.1:${s.address().port}`);
  const request=(i,route,body,headers={})=>fetch(origins[i]+route,{...(body?{method:'POST',body:body instanceof FormData?body:JSON.stringify(body)}:{}),headers:{Origin:origins[i],...(!(body instanceof FormData)?{'Content-Type':'application/json'}:{}),...headers}});
  try{
    const form=new FormData();Object.entries({credit:'Test-only creator',email:'private@example.com',title:'Test-only upload',description:'Test work for validating the backend storage boundary.',alt:'A test-only ivory rectangle.',category:'art',rightsConsent:'true',contactConsent:'true',publicationConsent:'true'}).forEach(([key,value])=>form.set(key,value));
    const image=await sharp({create:{width:20,height:20,channels:3,background:'#f7f4ec'}}).png().toBuffer();form.set('artwork',new Blob([image],{type:'image/png'}),'test.png');
    const submitting=request(0,'/api/community/submissions',form);await started;
    const [{id}]=await listRecords(createBlobStorage(uploads));
    assert.equal((await request(1,`/api/community/images/${id}`)).status,404);
    const login=await request(1,'/admin/api/login',{username:'reviewer',password});assert.equal(login.status,200);
    const session=await login.json(),headers={Cookie:login.headers.get('set-cookie').split(';')[0],'X-CSRF-Token':session.csrf};
    assert.equal((await request(1,`/admin/api/submissions/${id}/approve`,{},headers)).status,409);
    finishMail();const receipt=await submitting;assert.equal(receipt.status,201);assert.equal((await receipt.json()).notification,'sent');
    assert.equal((await request(0,`/admin/api/submissions/${id}/approve`,{},headers)).status,200);
    const publicData=await request(1,'/api/community').then(r=>r.json());assert.equal(publicData.entries.length,1);assert.ok(!JSON.stringify(publicData).includes('private@example.com'));
    const published=await request(0,`/api/community/images/${id}`);assert.equal(published.status,200);assert.equal(published.headers.get('content-type'),'image/webp');
    assert.equal((await request(1,`/admin/api/submissions/${id}/withdraw`,{},headers)).status,200);
    assert.equal((await request(0,`/api/community/images/${id}`)).status,404);assert.equal((await listRecords(createBlobStorage(uploads))).length,0);
  }finally{await Promise.all(servers.map(s=>new Promise(resolve=>s.close(resolve))));}
});
