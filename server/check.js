import {mkdir,writeFile,unlink,readFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import nodemailer from 'nodemailer';
import {privateStorage} from './storage.js';
import {validHash} from './password.js';

console.log('HTAFL backend readiness check — no email is sent.');
let ready=true;
const report=(label,passed,detail)=>{console.log(`${passed?'READY':'SETUP NEEDED'}: ${label}${detail?` — ${detail}`:''}`);if(!passed)ready=false;};
report('Administrator passphrase',validHash(process.env.ADMIN_PASSWORD_HASH),'Use npm run backend:setup to configure or reset it.');
const configured=!!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
if(!configured)report('Email delivery',false,'Configure SMTP credentials privately; inbox: htafl@africamail.com.');
else {
  const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||465),secure:process.env.SMTP_SECURE!=='false',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:10000,socketTimeout:15000});
  try{await transport.verify();report('SMTP connection and authentication',true,'This verifies access, not final inbox delivery.');}
  catch{report('SMTP connection and authentication',false,'Check credentials, port and host connectivity.');}
  finally{transport.close();}
}
try{
  const storage=privateStorage();await mkdir(storage,{recursive:true});const file=path.join(storage,`.check-${randomUUID()}`);
  await writeFile(file,'storage check',{flag:'wx',mode:0o600});await unlink(file);report('Private upload storage',true,'Confirm this is a persistent host volume.');
}catch{report('Private upload storage',false,'Check UPLOAD_DIR and host write permissions.');}
let originReady=false;
try{
  const url=new URL(process.env.PUBLIC_ORIGIN);const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  originReady=url.origin===process.env.PUBLIC_ORIGIN && !url.username && !url.password && (url.protocol==='https:' || (url.protocol==='http:' && local && process.env.NODE_ENV!=='production'));
}catch{}
report('Website origin',originReady,'Use your exact HTTPS origin; localhost HTTP is supported for development.');
try{
  const {bank,crypto}=JSON.parse(await readFile(new URL('../content/support-contributions.json',import.meta.url),'utf8'));
  const bankReady=['name','accountHolder','accountNumber','currency'].every(key=>typeof bank?.[key]==='string' && bank[key].trim());
  report('Bank contribution details',bankReady,'Owner-supplied instructions only; verify account holder with the bank. No transfers are processed or confirmed by this website.');
  const cryptoReady=['currency','network','address'].every(key=>typeof crypto?.[key]==='string' && crypto[key].trim());
  console.log(cryptoReady?'INFO: Crypto instructions supplied; manually verify the asset, network and public address.':'INFO: Optional crypto pathway awaits currency, network and public wallet address; it stays unavailable.');
}catch{report('Contribution instructions',false,'Check content/support-contributions.json and regenerate the public pages.');}
if(!ready)process.exitCode=1;
