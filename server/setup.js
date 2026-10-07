import {readFile,writeFile,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
import {emitKeypressEvents} from 'node:readline';
import {hashPassword} from './password.js';

// Secrets are read without terminal echo and never printed or passed as arguments.
async function secret(prompt) {
  if(!process.stdin.isTTY)throw Error('Run the setup wizard in an interactive terminal.');
  process.stdout.write(prompt);
  emitKeypressEvents(process.stdin);process.stdin.setRawMode(true);process.stdin.resume();
  return new Promise((resolve,reject)=>{
    let value='';
    const finish=(error)=>{process.stdin.off('keypress',key);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');error?reject(error):resolve(value);};
    const key=(text,event={})=>{
      if(event.ctrl && event.name==='c')return finish(Error('Setup cancelled. No configuration was changed.'));
      if(event.name==='return')return finish();
      if(['backspace','delete'].includes(event.name)){value=value.slice(0,-1);return;}
      if(text && !event.ctrl && !/[\x00-\x1f\x7f]/.test(text) && value.length+text.length<=256)value+=text;
    };
    process.stdin.on('keypress',key);
  });
}
const question=async(prompt)=>{
  const rl=createInterface({input:process.stdin,output:process.stdout});
  try{return (await rl.question(prompt)).trim();}finally{rl.close();}
};
function replace(source,key,value) {
  const line=`${key}=${JSON.stringify(value)}`;
  const regex=new RegExp(`^${key}=.*$`,'m');
  return regex.test(source)?source.replace(regex,()=>line):`${source.trimEnd()}\n${line}\n`;
}
try{
  if(!process.stdin.isTTY)throw Error('Use an interactive terminal for private backend setup.');
  console.log('HTAFL backend setup. Passwords stay hidden. Existing settings are preserved unless you change them.');
  let config;
  try{config=await readFile('.env','utf8');}catch(error){if(error.code!=='ENOENT')throw error;config=await readFile('.env.example','utf8');}
  const username=await question('Administrator username [htaflco]: ') || 'htaflco';
  if(!/^[a-zA-Z0-9._-]{3,100}$/.test(username))throw Error('Use 3–100 letters, numbers, dots, underscores or hyphens for the username.');
  const password=await secret('New admin passphrase (16–256 characters; hidden): ');
  const confirmation=await secret('Repeat admin passphrase (hidden): ');
  if(password!==confirmation)throw Error('Passphrases did not match. No settings were changed.');
  const hash=await hashPassword(password);
  config=replace(replace(config,'ADMIN_USERNAME',username),'ADMIN_PASSWORD_HASH',hash);
  const mail=await question('Configure email delivery now? [y/N]: ');
  if(mail.toLowerCase()==='y') {
    const host=await question('SMTP host [smtp.gmail.com]: ') || 'smtp.gmail.com';
    const port=await question('SMTP port [465]: ') || '465';
    const user=await question('SMTP sending account [htaflco@gmail.com]: ') || 'htaflco@gmail.com';
    const mailPassword=await secret('SMTP/App Password (hidden; never your normal Gmail password): ');
    if(!mailPassword || !/^[a-zA-Z0-9.-]+$/.test(host) || !['465','587'].includes(port) || /[\s<>\r\n]/.test(user) || !user.includes('@'))throw Error('Check the SMTP host, port, email and password. No settings were changed.');
    for(const [key,value] of Object.entries({SMTP_HOST:host,SMTP_PORT:port,SMTP_SECURE:String(port==='465'),SMTP_USER:user,SMTP_FROM:user,SMTP_PASS:mailPassword}))config=replace(config,key,value);
  }
  const origin=await question('Website origin (for example https://htafl.example; blank keeps current): ');
  if(origin) {
    const url=new URL(origin);
    const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
    if((url.protocol!=='https:' && !(url.protocol==='http:' && local)) || url.username || url.password || url.pathname!=='/' || url.search || url.hash)throw Error('Use an HTTPS origin, or HTTP for localhost. No settings were changed.');
    config=replace(config,'PUBLIC_ORIGIN',url.origin);
    if(local && url.protocol==='http:')config=replace(replace(config,'PORT',url.port || '80'),'NODE_ENV','development');
    else if(url.protocol==='https:')config=replace(config,'NODE_ENV','production');
  }
  config=config.replace(/^SUPPORT_PAYMENT_URL=.*(?:\r?\n|$)/gm,'');
  const temporary=`.env.setup-${randomUUID()}.tmp`;
  await writeFile(temporary,config,{flag:'wx',mode:0o600});
  try{await rename(temporary,'.env');}catch(error){await unlink(temporary).catch(()=>{});throw error;}
  console.log('Private configuration saved. Restart the server, run npm run backend:check, then open /admin/.');
}catch(error){console.error(error.message);process.exitCode=1;}
