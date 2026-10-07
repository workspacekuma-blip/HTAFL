import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, writeFile, readdir, rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import {createApp, recipient, privateStorage, saveRecord} from '../server/index.js';

const valid = {name:'Test designer',email:'designer@example.com',interest:'create',creativePractice:'fashion',projectStage:'idea',creativeGoal:'share-work',message:'I would like to share my textile work with you.',portfolio:'https://example.com/portfolio',consent:true};
async function service(options, run) {
  const storage = await mkdtemp(path.join(os.tmpdir(),'htafl-service-test-'));
  const server = createApp({...options,storage}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (route, init={}) => fetch(base+route,{...init,headers:{Origin:base,...init.headers}});
  try { await run({request,storage,base}); }
  finally { await new Promise(resolve=>server.close(resolve)); await rm(storage,{recursive:true,force:true}); }
}
const post = body => ({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const artwork = async ({permission='true',bytes,mime='image/png',rights='true'}={}) => {
  const form=new FormData();
  Object.entries({credit:'A test creator',email:'private@example.com',title:'Original textile study',category:'fashion',description:'An original fabric experiment made for this test.',alt:'A small square of warm ivory fabric.',rightsConsent:rights,contactConsent:'true',publicationConsent:permission}).forEach(([key,value])=>form.set(key,value));
  const image=bytes || await sharp({create:{width:80,height:60,channels:3,background:'#f7f4ec'}}).png().toBuffer();
  form.set('artwork',new Blob([image],{type:mime}),'untrusted-name.png'); return {method:'POST',body:form};
};

test('enquiries deliver to the specified inbox only, with validated reply address', async()=>{
  const sent=[];
  await service({mailReady:true,sendMail:async mail=>sent.push(mail)},async({request})=>{
    const response=await request('/api/involvement',post(valid)); assert.equal(response.status,200);
    assert.equal(sent.length,1); assert.equal(sent[0].to,recipient); assert.equal(sent[0].replyTo,valid.email);
    assert.match(sent[0].text,/Consent|consent/);
    const bad=await request('/api/involvement',post({...valid,consent:false,email:'bad'})); assert.equal(bad.status,422); assert.equal(sent.length,1);
    const errors=await bad.json(); assert.ok(errors.fields.email); assert.ok(errors.fields.consent);
    assert.equal((await request('/api/involvement',{...post(valid),headers:{'Content-Type':'application/json',Origin:'https://unrelated.example'}})).status,403);
  });
});
test('unconfigured and failed email never report success',async()=>{
  await service({mailReady:false},async({request})=>{
    assert.equal((await request('/api/config').then(r=>r.json())).emailReady,false);
    assert.equal((await request('/api/involvement',post(valid))).status,503);
  });
  await service({mailReady:true,sendMail:async()=>{throw Error('Mock transport failure');}},async({request})=>{
    assert.equal((await request('/api/involvement',post(valid))).status,502);
  });
});
test('uploads stay private until explicit consent and approval; public records omit email',async()=>{
  const sent=[];
  await service({mailReady:true,sendMail:async mail=>sent.push(mail)},async({request,storage})=>{
    const response=await request('/api/community/submissions',await artwork()); assert.equal(response.status,201);
    const receipt=await response.json(),file=path.join(storage,`${receipt.id}.json`);
    assert.equal(receipt.notification,'sent'); assert.equal(sent[0].to,recipient); assert.equal(sent[0].attachments[0].contentType,'image/webp');
    let record=JSON.parse(await readFile(file,'utf8')); assert.equal(record.status,'pending'); assert.equal(record.email,'private@example.com');
    assert.equal((await request('/api/community').then(r=>r.json())).entries.length,0);
    assert.equal((await request(`/api/community/images/${receipt.id}`)).status,404);
    assert.equal((await sharp(await readFile(path.join(storage,`${receipt.id}.webp`))).metadata()).exif,undefined);
    record.status='approved'; await saveRecord(storage,record);
    const publicData=await request('/api/community').then(r=>r.json()); assert.equal(publicData.entries.length,1); assert.ok(!JSON.stringify(publicData).includes('private@example.com'));
    assert.equal((await request(`/api/community/images/${receipt.id}`)).status,200);
    record.publicationConsent=false; await saveRecord(storage,record);
    assert.equal((await request('/api/community').then(r=>r.json())).entries.length,0);
    assert.equal((await request(`/api/community/images/${receipt.id}`)).status,404);
    for(const privatePath of ['/server/index.js','/.env','/package.json','/design/figma-context/context.json',`/var/community/${receipt.id}.webp`])assert.equal((await request(privatePath)).status,404,privatePath);
  });
});
test('upload validation rejects spoofed, oversized and unpermitted files',async()=>{
  await service({mailReady:false},async({request,storage})=>{
    assert.equal((await request('/api/community/submissions',await artwork({bytes:Buffer.from('<svg></svg>')}))).status,422);
    assert.equal((await request('/api/community/submissions',await artwork({bytes:Buffer.alloc(8*1024*1024+1)}))).status,413);
    assert.equal((await request('/api/community/submissions',await artwork({rights:'false'}))).status,422);
    assert.deepEqual(await readdir(storage),[]);
    const response=await request('/api/community/submissions',await artwork({permission:'false'})); assert.equal(response.status,201);
    const result=await response.json(); assert.equal(result.notification,'not-configured');
    const record=JSON.parse(await readFile(path.join(storage,`${result.id}.json`),'utf8')); assert.equal(record.publicationConsent,false);
  });
});
test('rate limits and private storage boundaries',async()=>{
  assert.throws(()=>privateStorage(path.resolve('assets/uploads')),/private/);
  await service({mailReady:false,rateLimit:1},async({request})=>{
    await request('/api/involvement',post(valid));
    assert.equal((await request('/api/involvement',post(valid))).status,429);
  });
});
