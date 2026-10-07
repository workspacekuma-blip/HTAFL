import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {parseEnv} from 'node:util';
import {createEmailSetup} from '../server/email-setup.js';
import {verifyPassword} from '../server/password.js';

async function fixture(factory,run){
  const directory=await mkdtemp(path.join(os.tmpdir(),'htafl-email-setup-')),configFile=path.join(directory,'.env');
  const server=createEmailSetup({configFile,transportFactory:factory}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
  const post=(password,extra={})=>fetch(origin+'/configure',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...extra},body:JSON.stringify({password})});
  try{await run({origin,post,configFile});}finally{await new Promise(resolve=>server.close(resolve));await rm(directory,{recursive:true,force:true});}
}
test('local email setup rejects foreign origins/proxying and exposes no secret files',async()=>{
  let calls=0;
  await fixture(()=>{calls++;return{verify:async()=>true,close(){}};},async({origin,post})=>{
    assert.equal((await post('abcdefghijklmnop',{Origin:'https://foreign.example'})).status,403);
    assert.equal((await post('abcdefghijklmnop',{'X-Forwarded-Host':'public.example'})).status,403);
    assert.equal((await fetch(origin+'/.env')).status,404);
    assert.equal((await fetch(origin+'/server/index.js')).status,404);
    assert.equal((await post('short')).status,422);assert.equal(calls,0);
  });
});
test('failed mail.com authentication preserves existing configuration and never echoes credentials',async()=>{
  await fixture(()=>({verify:async()=>{throw Object.assign(new Error('private provider error'),{code:'EAUTH'});},close(){}}),async({post,configFile})=>{
    const original='ADMIN_USERNAME=keep-me\nSMTP_PASS=previous-private-value\n';await writeFile(configFile,original);
    const response=await post('abcdefghijklmnop');assert.equal(response.status,502);
    const body=await response.text();assert.ok(!body.includes('abcdefghijklmnop'));assert.ok(!body.includes('private provider error'));
    assert.equal(await readFile(configFile,'utf8'),original);
  });
});
test('successful setup saves only verified mail.com settings and preserves unrelated settings',async()=>{
  let verified=false,closed=false;
  await fixture(options=>{assert.equal(options.host,'smtp.mail.com');assert.equal(options.secure,true);assert.equal(options.auth.user,'htafl@africamail.com');assert.equal(options.logger,false);return{verify:async()=>{verified=true;},close(){closed=true;}};},async({post,configFile,origin})=>{
    await writeFile(configFile,'PORT=4321\nADMIN_USERNAME=keep-me\nPUBLIC_ORIGIN=https://example.com\n');
    const response=await post('smtp secret with spaces!');assert.equal(response.status,200);assert.equal(verified,true);assert.equal(closed,true);
    const config=parseEnv(await readFile(configFile,'utf8'));assert.equal(config.SMTP_PASS,'smtp secret with spaces!');assert.equal(config.SMTP_USER,'htafl@africamail.com');assert.equal(config.PORT,'4321');assert.equal(config.ADMIN_USERNAME,'keep-me');assert.equal(config.PUBLIC_ORIGIN,'https://example.com');
    assert.ok(!(await response.text()).includes(config.SMTP_PASS));assert.equal((await post('abcdefghijklmnop')).status,409);
    assert.deepEqual(await fetch(origin+'/status').then(r=>r.json()),{saved:true,inbox:'htafl@africamail.com'});
  });
});

test('private administrator setup validates confirmation, stores a hash and records the chosen reviewer',async()=>{
  await fixture(()=>({verify:async()=>true,close(){}}),async({origin,configFile})=>{
    const password='Private setup test passphrase';
    const post=body=>fetch(origin+'/configure-admin',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.equal((await post({username:'reviewer',password,confirmation:'different',reviewer:'Confirmed test reviewer'})).status,422);
    const response=await post({username:'reviewer',password,confirmation:password,reviewer:'Confirmed test reviewer'});
    assert.equal(response.status,200);assert.ok(!(await response.text()).includes(password));
    const config=parseEnv(await readFile(configFile,'utf8'));
    assert.equal(config.ADMIN_USERNAME,'reviewer');assert.equal(config.COMMUNITY_REVIEWER,'Confirmed test reviewer');
    assert.equal(await verifyPassword(password,config.ADMIN_PASSWORD_HASH),true);
    assert.ok(!(await readFile(configFile,'utf8')).includes(password));
    assert.equal((await post({username:'other',password,confirmation:password,reviewer:'Other reviewer'})).status,409);
    assert.equal((await fetch(origin+'/admin-status').then(r=>r.json())).saved,true);
    assert.equal((await fetch(origin+'/configure-admin',{method:'POST',headers:{Origin:'https://foreign.example','Content-Type':'application/json'},body:'{}'})).status,403);
  });
});
