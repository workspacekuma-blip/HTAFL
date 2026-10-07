/* Local-only email setup; this app is never mounted on the public website. */
import express from 'express';
import nodemailer from 'nodemailer';
import {readFile,writeFile,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {hashPassword} from './password.js';
import {emailAddress,smtpHost,transportSettings} from './email-config.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const inbox=emailAddress;
const replace=(source,key,value)=>{
  const line=`${key}=${JSON.stringify(value)}`,pattern=new RegExp(`^${key}=.*$`,'m');
  return pattern.test(source)?source.replace(pattern,()=>line):`${source.trimEnd()}\n${line}\n`;
};
export function createEmailSetup(options={}){
  const app=express(),configFile=options.configFile || path.join(root,'.env');
  let busy=false,saved=false,adminSaved=false,attempts=0,windowStart=Date.now();
  app.disable('x-powered-by');
  app.use((req,res,next)=>{
    // Reject public proxying/DNS rebinding, including forged forwarded headers.
    const local=['127.0.0.1','::ffff:127.0.0.1','::1'].includes(req.socket.remoteAddress);
    const host=`127.0.0.1:${req.socket.localPort}`;
    if(!local || req.get('host')!==host || req.get('x-forwarded-host') || req.get('x-forwarded-for'))return res.sendStatus(403);
    res.set({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
      'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});
    if(req.method==='POST' && (req.get('origin')!==`http://${host}` || !req.is('application/json')))return res.sendStatus(403);
    next();
  });
  app.get('/',(req,res)=>res.sendFile(path.join(root,'server/email-setup-ui/index.html')));
  app.get('/setup.js',(req,res)=>res.sendFile(path.join(root,'server/email-setup-ui/setup.js')));
  app.get('/favicon.svg',(req,res)=>res.sendFile(path.join(root,'assets/htafl-favicon.svg')));
  app.get('/main.css',(req,res)=>res.sendFile(path.join(root,'main.css')));
  app.use('/styles',express.static(path.join(root,'styles'),{dotfiles:'deny'}));
  app.use('/assets/fonts',express.static(path.join(root,'assets/fonts'),{dotfiles:'deny'}));
  app.get('/status',(req,res)=>res.json({saved,inbox}));
  app.get('/admin-status',(req,res)=>res.json({saved:adminSaved}));
  app.post('/configure-admin',express.json({limit:'2kb'}),async(req,res)=>{
    if(adminSaved)return res.status(409).json({message:'Administrator configuration already saved. Restart the website to activate it.'});
    if(busy)return res.status(409).json({message:'Another configuration is being saved. Please wait.'});
    const {username,password,confirmation,reviewer}=req.body || {};
    if(typeof username!=='string' || !/^[a-zA-Z0-9._-]{3,100}$/.test(username) || typeof password!=='string' || password.length<16 || password.length>256 || password!==confirmation || typeof reviewer!=='string' || !reviewer.trim() || reviewer.length>100 || /[\x00-\x1f\x7f]/.test(reviewer))return res.status(422).json({message:'Use a valid username, matching passphrases of 16–256 characters, and the name of the person assigned to review community work.'});
    busy=true;let temporary;
    try{
      const hash=await hashPassword(password);
      let config,newFile=false;
      try{config=await readFile(configFile,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;config=await readFile(path.join(root,'.env.example'),'utf8');newFile=true;}
      for(const [key,value] of Object.entries({ADMIN_USERNAME:username,ADMIN_PASSWORD_HASH:hash,COMMUNITY_REVIEWER:reviewer.trim()}))config=replace(config,key,value);
      if(newFile)config=replace(replace(config,'PORT','3128'),'PUBLIC_ORIGIN','http://localhost:3128');
      temporary=`${configFile}.email-${randomUUID()}.tmp`;
      await writeFile(temporary,config,{flag:'wx',mode:0o600});await rename(temporary,configFile);temporary=undefined;adminSaved=true;
      res.json({message:'Administrator hash and reviewer assignment saved privately. Keep your passphrase in your password manager. Restart the website to activate sign-in.'});
    }catch{if(temporary)await unlink(temporary).catch(()=>{});res.status(500).json({message:'Administrator settings could not be saved. No credential is shown in logs.'});}
    finally{busy=false;}
  });
  app.post('/configure',express.json({limit:'1kb'}),async(req,res)=>{
    if(saved)return res.status(409).json({message:'Email configuration is already saved. Close this setup window.'});
    if(busy)return res.status(409).json({message:'A connection check is already running.'});
    if(Date.now()-windowStart>60000){attempts=0;windowStart=Date.now();}
    if(++attempts>3){res.set('Retry-After','60');return res.status(429).json({message:'Please wait one minute before trying again.'});}
    const password=typeof req.body?.password==='string'?req.body.password:'';
    if(password.length<8 || password.length>256 || /[\x00-\x1f\x7f]/.test(password))return res.status(422).json({message:'Enter the mail.com SMTP credential, 8–256 characters. Use an application-specific password when two-factor authentication is enabled.'});
    busy=true;
    const transport=(options.transportFactory || nodemailer.createTransport)({...transportSettings({SMTP_PORT:465,SMTP_PASS:password}),connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,dnsTimeout:10000});
    let temporary;
    try{
      await transport.verify(); // Connection/authentication only; sends no email.
      let config,newFile=false;
      try{config=await readFile(configFile,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;config=await readFile(path.join(root,'.env.example'),'utf8');newFile=true;}
      for(const [key,value] of Object.entries({SMTP_HOST:smtpHost,SMTP_PORT:'465',SMTP_SECURE:'true',SMTP_USER:inbox,SMTP_FROM:inbox,SMTP_PASS:password}))config=replace(config,key,value);
      if(newFile){config=replace(replace(config,'PORT','3128'),'PUBLIC_ORIGIN','http://localhost:3128');}
      temporary=`${configFile}.email-${randomUUID()}.tmp`;
      await writeFile(temporary,config,{flag:'wx',mode:0o600});await rename(temporary,configFile);temporary=undefined;saved=true;
      options.onSaved?.();
      res.json({message:'Mail.com authentication verified and private settings saved. Return to Codex so the website can restart with email enabled. No test email was sent.'});
    }catch(error){
      if(temporary)await unlink(temporary).catch(()=>{});
      res.status(502).json({message:error.code==='EAUTH'?'Mail.com did not accept this credential. Check htafl@africamail.com has SMTP access and use the account’s application-specific password if required. No settings were changed.':'The connection or save could not be completed. Check connectivity and try again. Credentials are never shown in logs.'});
    }finally{transport.close();busy=false;}
  });
  app.use((err,req,res,next)=>{res.status(400).json({message:'The setup request could not be read.'});});
  app.use((req,res)=>res.sendStatus(404));
  return app;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  let shutdown;
  const app=createEmailSetup();
  const server=app.listen(Number(process.env.EMAIL_SETUP_PORT || 0),'127.0.0.1',()=>console.log(`Private email and administrator setup: http://127.0.0.1:${server.address().port}/`));
  shutdown=setTimeout(()=>server.close(),30*60000);
  server.once('close',()=>{clearTimeout(shutdown);console.log('Private email setup closed.');});
}
