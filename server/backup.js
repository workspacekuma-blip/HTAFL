import {createCipheriv,createDecipheriv,createHash,randomBytes} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {idPattern,privateStorage} from './storage.js';

const magic=Buffer.from('HTAFLBK1'),limit=64*1024*1024;
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
function validate(data){
  if(data?.version!==1||!Array.isArray(data.entries))throw Error('Unsupported backup.');
  const ids=new Set();
  for(const entry of data.entries){
    if(!idPattern.test(entry?.record?.id)||ids.has(entry.record.id))throw Error('Invalid or duplicate record.');
    ids.add(entry.record.id);
    if(typeof entry.image!=='string'||entry.image.length>12*1024*1024||!/^[A-Za-z0-9+/]*={0,2}$/.test(entry.image))throw Error('Invalid image.');
    const bytes=Buffer.from(entry.image,'base64');
    if(bytes.toString('base64')!==entry.image||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||digest(bytes)!==entry.sha256)throw Error('Image integrity check failed.');
  }
  return data;
}
export function sealBackup(entries,key,source={}){
  if(!Buffer.isBuffer(key)||key.length!==32)throw Error('A 32-byte recovery key is required.');
  const data=validate({version:1,createdAt:new Date().toISOString(),source,entries:entries.map(({record,image})=>({record,image:image.toString('base64'),sha256:digest(image)}))});
  const plain=Buffer.from(JSON.stringify(data));
  if(plain.length>limit)throw Error('Backup exceeds 64 MB; use a streaming backup before the library grows further.');
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(magic);
  const encrypted=Buffer.concat([cipher.update(gzipSync(plain)),cipher.final()]);
  return Buffer.concat([magic,iv,cipher.getAuthTag(),encrypted]);
}
export function openBackup(bytes,key){
  if(!Buffer.isBuffer(key)||key.length!==32||bytes.length<37||bytes.length>limit||!bytes.subarray(0,8).equals(magic))throw Error('Invalid backup or recovery key.');
  const decipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(8,20));decipher.setAAD(magic);decipher.setAuthTag(bytes.subarray(20,36));
  const compressed=Buffer.concat([decipher.update(bytes.subarray(36)),decipher.final()]);
  return validate(JSON.parse(gunzipSync(compressed,{maxOutputLength:limit}).toString('utf8')));
}
export async function recoverBackup(bytes,key,destination){
  const data=openBackup(bytes,key),folder=privateStorage(destination);
  await mkdir(path.dirname(folder),{recursive:true});
  await mkdir(folder,{mode:0o700}); // Refuse existing folders and production overwrites.
  for(const {record,image} of data.entries){
    const recovered={...record,status:'pending',publicationConsent:false,recoveredAt:new Date().toISOString(),recoveryRequiresFreshConsent:true};
    delete recovered.approvedAt;
    await writeFile(path.join(folder,record.id+'.webp'),Buffer.from(image,'base64'),{flag:'wx',mode:0o600});
    await writeFile(path.join(folder,record.id+'.json'),JSON.stringify(recovered,null,2),{flag:'wx',mode:0o600});
  }
  return {count:data.entries.length};
}
