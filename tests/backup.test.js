import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {mkdtemp,readFile,readdir,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

// A missing authentication check would recover tampered data; publication must
// never survive recovery without a fresh review and permission check.
test('encrypted backups authenticate data and recover work privately',async()=>{
  const {sealBackup,openBackup,recoverBackup}=await import('../server/backup.js');
  const key=randomBytes(32),id='12345678-1234-1234-1234-123456789abc';
  const image=await sharp({create:{width:8,height:8,channels:3,background:'#111111'}}).webp().toBuffer();
  const entries=[{record:{id,status:'approved',publicationConsent:true,email:'private@example.com'},image}];
  const encrypted=sealBackup(entries,key,{site:'test-only'});
  assert.equal(encrypted.includes(Buffer.from('private@example.com')),false);
  assert.equal(openBackup(encrypted,key).entries[0].record.id,id);
  const damaged=Buffer.from(encrypted);damaged[damaged.length-1]^=1;
  assert.throws(()=>openBackup(damaged,key));assert.throws(()=>openBackup(encrypted,randomBytes(32)));
  assert.throws(()=>sealBackup([{...entries[0],record:{id:'../../outside'}}],key));
  const folder=await mkdtemp(path.join(os.tmpdir(),'htafl-backup-test-'));
  try{
    const invalid=path.join(folder,'invalid');
    await assert.rejects(recoverBackup(damaged,key,invalid));
    assert.deepEqual(await readdir(folder),[]);
    const target=path.join(folder,'private-recovery');
    await recoverBackup(encrypted,key,target);
    const record=JSON.parse(await readFile(path.join(target,id+'.json'),'utf8'));
    assert.equal(record.status,'pending');assert.equal(record.publicationConsent,false);
    assert.deepEqual(await readFile(path.join(target,id+'.webp')),image);
    await assert.rejects(recoverBackup(encrypted,key,target));
  }finally{await rm(folder,{recursive:true,force:true});}
});
