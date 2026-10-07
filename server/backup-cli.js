import {getStore} from '@netlify/blobs';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sealBackup,openBackup,recoverBackup} from './backup.js';
import {idPattern} from './storage.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const privateRoot=path.join(root,'var'),keyFile=path.join(privateRoot,'secrets','backup.key');
const expectedSite='61194eef-4369-403b-8ff5-cba6e1e14435',expectedOrigin='https://htaflco.netlify.app';
async function readBounded(file,max){if((await stat(file)).size>max)throw Error('File is too large.');return readFile(file);}
async function key(create=false){
  try{return await readBounded(keyFile,32);}catch(error){
    if(!create||error.code!=='ENOENT')throw error;
    await mkdir(path.dirname(keyFile),{recursive:true,mode:0o700});
    const value=randomBytes(32);await writeFile(keyFile,value,{flag:'wx',mode:0o600});return value;
  }
}
async function create(){
  const state=JSON.parse(await readFile(path.join(root,'.netlify','state.json'),'utf8'));
  if(state.siteId!==expectedSite)throw Error('The linked site is not the final HTAFL production site.');
  let token=process.env.NETLIFY_AUTH_TOKEN;
  if(!token){const config=JSON.parse(await readFile(path.join(process.env.APPDATA,'netlify','Config','config.json'),'utf8'));token=config.users[config.userId]?.auth?.token;}
  if(!token)throw Error('Sign in to Netlify CLI first.');
  const response=await fetch(`https://api.netlify.com/api/v1/sites/${expectedSite}`,{headers:{Authorization:`Bearer ${token}`}});
  if(!response.ok)throw Error('Could not verify production hosting access.');
  const site=await response.json();if(site.ssl_url!==expectedOrigin)throw Error('Production origin did not match.');
  const store=getStore({name:'htafl-community-production',siteID:expectedSite,token,consistency:'strong'}),entries=[];
  let bytes=0;
  for await(const page of store.list({prefix:'records/',paginate:true}))for(const {key:recordKey} of page.blobs){
    const id=recordKey.slice(8);if(!idPattern.test(id))throw Error('Unexpected submission key.');
    const record=await store.get(recordKey,{type:'json',consistency:'strong'});
    const image=await store.get(`images/${id}.webp`,{type:'arrayBuffer',consistency:'strong'});
    const check=await store.get(recordKey,{type:'json',consistency:'strong'});
    if(record?.id!==id||!image||JSON.stringify(record)!==JSON.stringify(check))throw Error('Submissions changed during backup. Pause review and retry.');
    bytes+=image.byteLength*4/3+Buffer.byteLength(JSON.stringify(record));if(bytes>60*1024*1024)throw Error('Backup limit reached; use a streaming tool before the library grows.');
    entries.push({record,image:Buffer.from(image)});
  }
  const recoveryKey=await key(true),archive=sealBackup(entries,recoveryKey,{site:expectedOrigin,siteId:expectedSite,store:'htafl-community-production'});
  openBackup(archive,recoveryKey);
  const folder=path.join(privateRoot,'backups');await mkdir(folder,{recursive:true,mode:0o700});
  const file=path.join(folder,`htafl-${new Date().toISOString().replace(/[:.]/g,'-')}.htaflbk`);
  await writeFile(file,archive,{flag:'wx',mode:0o600});
  console.log(JSON.stringify({file,records:entries.length,bytes:archive.length,verified:true,keyFile}));
}
try{
  const [command,file]=process.argv.slice(2);
  if(command==='create')await create();
  else if(['verify','recover'].includes(command)&&file){
    const archive=await readBounded(path.resolve(file),64*1024*1024),recoveryKey=await key();
    if(command==='verify')console.log(JSON.stringify({verified:true,records:openBackup(archive,recoveryKey).entries.length}));
    else{const folder=path.join(privateRoot,'recovery',`review-${Date.now()}`);console.log(JSON.stringify({folder,...await recoverBackup(archive,recoveryKey,folder),published:false}));}
  }else throw Error('Use backup:create, backup:verify -- <archive>, or backup:recover -- <archive>.');
}catch(error){console.error(error.message);process.exitCode=1;}
