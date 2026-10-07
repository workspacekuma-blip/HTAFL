import express from 'express';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validHash,verifyPassword} from './password.js';
import {listRecords,readRecord,moderateRecord,saveRecord,readImage} from './storage.js';

const ui=path.join(path.dirname(fileURLToPath(import.meta.url)),'admin-ui');
const digest=value=>createHash('sha256').update(value).digest('hex');
const fail=(message,status)=>Object.assign(Error(message),{status});
export function mountAdmin(app,{storage,sameOrigin,configured,send,from,recipient,adminHash,adminUsername,secureCookies,state}) {
  const router=express.Router(),sessions=new Map(),attempts=new Map(),busy=new Set();
  const hash=adminHash ?? process.env.ADMIN_PASSWORD_HASH;
  const username=adminUsername ?? process.env.ADMIN_USERNAME ?? 'htaflco';
  const secure=secureCookies ?? (process.env.NODE_ENV==='production' || process.env.PUBLIC_ORIGIN?.startsWith('https://') || false);
  const cookieName='htafl_admin';
  const cookieOptions={httpOnly:true,secure,sameSite:'strict',path:'/admin',maxAge:8*60*60*1000};
  router.use((req,res,next)=>{res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'});next();});
  const sessionFor=async req=>{
    const now=Date.now();
    for(const [key,s] of sessions)if(s.expires<now || now-s.seen>30*60000)sessions.delete(key);
    const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith(`${cookieName}=`))?.slice(cookieName.length+1);
    if(!token || !/^[a-zA-Z0-9_-]{43}$/.test(token))return null;
    const key=digest(token);
    const session=state?await state.getSession(key):sessions.get(key);
    if(state && session?.authVersion!==digest(hash || '')){if(session)await state.deleteSession(key);return null;}
    if(state && session){req.sessionKey=key;return state.touchSession(key);}
    if(session){session.seen=now;req.sessionKey=digest(token);} return session;
  };
  const auth=async(req,res,next)=>{
    const session=await sessionFor(req);
    if(!session)return next(fail('Please sign in to the review dashboard.',401));
    req.adminSession=session;next();
  };
  const csrf=(req,res,next)=>{
    const token=req.get('x-csrf-token');
    if(!token || !/^[a-f0-9]{64}$/.test(token) || !timingSafeEqual(Buffer.from(token),Buffer.from(req.adminSession.csrf)))return next(fail('Your session changed. Refresh the dashboard and try again.',403));
    next();
  };
  router.get('/',(req,res)=>res.sendFile(path.join(ui,'index.html')));
  router.get('/app.js',(req,res)=>res.sendFile(path.join(ui,'app.js')));
  router.get('/admin.css',(req,res)=>res.sendFile(path.join(ui,'admin.css')));
  router.get('/api/session',async(req,res)=>{
    const session=await sessionFor(req);
    res.json({configured:validHash(hash),authenticated:!!session,...(session?{csrf:session.csrf,username}: {})});
  });
  router.post('/api/login',sameOrigin,express.json({limit:'2kb'}),async(req,res,next)=>{
    try{
      if(!validHash(hash))throw fail('Administrator access has not been configured yet.',503);
      if(secure && !req.secure)throw fail('Administrator sign-in requires HTTPS on this host.',403);
      const now=Date.now();for(const [ip,v] of attempts)if(now-v.start>15*60000)attempts.delete(ip);
      if(!state && attempts.size>=5000 && !attempts.has(req.ip))throw fail('Please try again later.',429);
      const attempt=state?await state.attempt('login',req.ip):attempts.get(req.ip)||{count:0,start:now};
      if(!state){attempt.count++;attempts.set(req.ip,attempt);}
      if(attempt.count>5){res.set('Retry-After','900');throw fail('Too many sign-in attempts. Wait 15 minutes.',429);}
      const verified=await verifyPassword(req.body?.password,hash);
      if(!verified || req.body?.username!==username)throw fail('The username or password is incorrect.',401);
      const prior=await sessionFor(req);if(prior){if(state)await state.deleteSession(req.sessionKey);else sessions.delete(req.sessionKey);}
      if(sessions.size>=100)sessions.delete(sessions.keys().next().value);
      const token=randomBytes(32).toString('base64url'),session={csrf:randomBytes(32).toString('hex'),seen:now,expires:now+8*60*60*1000,authVersion:digest(hash)};
      if(state)await state.setSession(digest(token),session);else sessions.set(digest(token),session);
      res.cookie(cookieName,token,cookieOptions);
      res.json({authenticated:true,username,csrf:session.csrf});
    }catch(error){next(error);}
  });
  router.post('/api/logout',sameOrigin,auth,csrf,async(req,res)=>{
    if(state)await state.deleteSession(req.sessionKey);else sessions.delete(req.sessionKey);
    res.clearCookie(cookieName,{...cookieOptions,maxAge:undefined});res.json({message:'Signed out.'});
  });
  router.get('/api/status',auth,async(req,res,next)=>{
    try{const records=await listRecords(storage);res.json({emailConfigured:configured,recipient,storageReady:true,pending:records.filter(r=>r.status==='pending').length,approved:records.filter(r=>r.status==='approved').length,notificationsToRetry:records.filter(r=>r.notification!=='sent').length});}
    catch(error){next(error);}
  });
  router.get('/api/submissions',auth,async(req,res,next)=>{
    try{const records=await listRecords(storage);res.json({entries:records.map(r=>({...r,imageURL:`/admin/api/images/${r.id}`}))});}
    catch(error){next(error);}
  });
  router.get('/api/images/:id',auth,async(req,res,next)=>{
    try{await readRecord(storage,req.params.id);res.type('webp').send(await readImage(storage,req.params.id));}
    catch(error){next(error);}
  });
  router.post('/api/submissions/:id/:action',sameOrigin,auth,csrf,async(req,res,next)=>{
    const {id,action}=req.params;
    const release=state?await state.lock(id):busy.has(id)?null:()=>busy.delete(id);
    if(!release)return next(fail('This submission is already being processed.',409));
    if(!state)busy.add(id);
    try{
      if(action==='retry-email') {
        if(!configured)throw fail('Configure SMTP before retrying notification email.',503);
        const record=await readRecord(storage,id);
        if(record.notification==='sent')throw fail('This notification has already been sent.',409);
        try{
          const content=await readImage(storage,id);
          await send({from,to:recipient,replyTo:record.email,subject:`HTAFL creative submission: ${record.category}`,text:`Submission: ${id}\nCreator: ${record.credit}\nEmail: ${record.email}\nTitle: ${record.title}\nPublication permission: ${record.publicationConsent?'Yes':'No — private review only'}\nStatus: ${record.status}\n\n${record.description}\n\nReview securely through the HTAFL administrator dashboard.`,attachments:[{filename:`${id}.webp`,content,contentType:'image/webp'}]});
          record.notification='sent';record.notifiedAt=new Date().toISOString();await saveRecord(storage,record);
        }catch(error){record.notification='failed';await saveRecord(storage,record);throw fail('Notification could not be sent. The work remains stored for review.',502);}
      } else await moderateRecord(storage,id,action);
      res.json({message:action==='approve'?'Approved. This work is now visible in the community gallery.':action==='retry-email'?'Notification sent to HTAFL.':'The submission has been removed from storage and publication.'});
    }catch(error){next(error);}finally{await release();}
  });
  router.use('/api',(req,res)=>res.status(404).json({message:'Review tool not found.'}));
  app.use('/admin',router);
}
