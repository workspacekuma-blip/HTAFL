import {randomUUID} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,unlink,rename} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const idPattern=/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
export function privateStorage(value) {
  if(value?.kind==='blob')return value;
  const storage=path.resolve(value || process.env.UPLOAD_DIR || path.join(root,'var/community'));
  const relative=path.relative(root,storage);
  const outside=relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  if(!outside && !(relative===path.join('var','community') || relative.startsWith(`var${path.sep}`)))throw Error('UPLOAD_DIR must be under the private var folder or outside the website directory.');
  return storage;
}
export async function saveRecord(storage,record) {
  if(!idPattern.test(record.id))throw Error('Invalid record identifier.');
  if(storage?.kind==='blob'){await storage.store.setJSON(`records/${record.id}`,record);return;}
  const file=path.join(storage,`${record.id}.json`),temporary=`${file}.${randomUUID()}.tmp`;
  await writeFile(temporary,JSON.stringify(record,null,2),{flag:'wx',mode:0o600});
  try{await rename(temporary,file);}catch(error){await unlink(temporary).catch(()=>{});throw error;}
}
export async function readRecord(storage,id) {
  if(!idPattern.test(id || ''))throw Object.assign(Error('Submission not found.'),{status:404});
  let record;
  try{record=storage?.kind==='blob'?await storage.store.get(`records/${id}`,{type:'json',consistency:'strong'}):JSON.parse(await readFile(path.join(storage,`${id}.json`),'utf8'));}
  catch(error){if(error.code==='ENOENT')throw Object.assign(Error('Submission not found.'),{status:404});throw error;}
  if(record?.id!==id)throw Object.assign(Error('Submission not found.'),{status:404});
  return record;
}
export async function listRecords(storage) {
  if(storage?.kind==='blob'){
    const {blobs}=await storage.store.list({prefix:'records/'}),records=[];
    for(const {key} of blobs){
      const id=key.slice('records/'.length);if(!idPattern.test(id))continue;
      try{records.push(await readRecord(storage,id));}catch(error){if(error.status!==404)throw error;}
    }
    return records.sort((a,b)=>(b.createdAt || '').localeCompare(a.createdAt || ''));
  }
  await mkdir(storage,{recursive:true});
  const records=[];
  for(const file of await readdir(storage)) {
    if(!file.endsWith('.json') || !idPattern.test(file.slice(0,-5)))continue;
    try{records.push(await readRecord(storage,file.slice(0,-5)));}
    catch(error){if(error instanceof SyntaxError || error.status===404)continue;throw error;}
  }
  return records.sort((a,b)=>(b.createdAt || '').localeCompare(a.createdAt || ''));
}
export async function moderateRecord(storage,id,action) {
  const record=await readRecord(storage,id);
  if(action==='approve') {
    if(record.publicationConsent!==true || record.rightsConsent!==true || record.contactConsent!==true)throw Object.assign(Error('This creator has not given permission to publish.'),{status:422});
    if(record.status!=='pending')throw Object.assign(Error('Only pending submissions may be approved.'),{status:409});
    record.status='approved';record.approvedAt=new Date().toISOString();
    await saveRecord(storage,record);
  } else if(['reject','withdraw'].includes(action)) {
    if(storage?.kind==='blob'){
      // Hide first, so interrupted image deletion can never leave a public work.
      await storage.store.delete(`records/${id}`);await storage.store.delete(`images/${id}.webp`);return;
    }
    await unlink(path.join(storage,`${id}.webp`)).catch(error=>{if(error.code!=='ENOENT')throw error;});
    await unlink(path.join(storage,`${id}.json`));
  } else throw Object.assign(Error('Choose a valid review action.'),{status:422});
}
export async function readImage(storage,id){
  if(!idPattern.test(id || ''))throw Object.assign(Error('Image not found.'),{status:404});
  if(storage?.kind==='blob'){
    const value=await storage.store.get(`images/${id}.webp`,{type:'arrayBuffer',consistency:'strong'});
    if(!value)throw Object.assign(Error('Image not found.'),{status:404});return Buffer.from(value);
  }
  return readFile(path.join(storage,`${id}.webp`));
}
export async function writeImage(storage,id,data){
  if(!idPattern.test(id))throw Error('Invalid image identifier.');
  if(storage?.kind==='blob'){const result=await storage.store.set(`images/${id}.webp`,Uint8Array.from(data).buffer,{onlyIfNew:true});if(!result.modified)throw Error('Image already exists.');return;}
  await mkdir(storage,{recursive:true});await writeFile(path.join(storage,`${id}.webp`),data,{flag:'wx',mode:0o600});
}
export async function removeImage(storage,id){
  if(!idPattern.test(id))throw Error('Invalid image identifier.');
  if(storage?.kind==='blob')return storage.store.delete(`images/${id}.webp`);
  await unlink(path.join(storage,`${id}.webp`)).catch(error=>{if(error.code!=='ENOENT')throw error;});
}
