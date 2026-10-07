import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {privateStorage,saveRecord,idPattern,listRecords,readRecord,readImage,writeImage,removeImage} from './storage.js';
import {mountAdmin} from './admin.js';
import {pathways,validateInvolvement,involvementMessage} from './involvement.js';
import {emailAddress,senderAddress,emailConfigured,transportSettings} from './email-config.js';
export {privateStorage,saveRecord,idPattern} from './storage.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const recipient = emailAddress;
const categories = ['art', 'fashion', 'illustration', 'upcycling', 'photography'];
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fail = (message, status = 422, fields = {}) => Object.assign(new Error(message), {status, fields});
const text = (body, key, min, max, errors) => {
  const value = typeof body[key] === 'string' ? body[key].trim() : '';
  if (value.length < min || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) errors[key] = `Use ${min}–${max} characters.`;
  return value;
};

export async function publicEntries(storage) {
  const records = [];
  for (const r of await listRecords(storage)) {
    if (r.status === 'approved' && r.publicationConsent === true && r.rightsConsent === true) records.push({id:r.id, title:r.title, credit:r.credit, summary:r.description, category:r.category,
      image:{src:`/api/community/images/${r.id}`, alt:r.alt, width:r.width, height:r.height}});
  }
  return records;
}

export function createApp(options = {}) {
  const app = express();
  const storage = privateStorage(options.storage);
  const maxUploadBytes=options.maxUploadBytes || 8*1024*1024;
  const smtpConfigured = emailConfigured();
  const configured = options.mailReady ?? smtpConfigured;
  const transport = configured && !options.sendMail ? nodemailer.createTransport({...transportSettings(),connectionTimeout:15000,socketTimeout:20000}) : null;
  const send = options.sendMail || (mail => transport.sendMail(mail));
  const from = senderAddress;
  app.disable('x-powered-by');
  if(options.trustProxy!==undefined)app.set('trust proxy',options.trustProxy);
  else if (process.env.TRUST_PROXY_HOPS) app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS));
  app.use((req, res, next) => {
    res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',
      'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"});
    next();
  });
  app.use('/api', (req, res, next) => { res.set('Cache-Control','no-store'); next(); });
  const attempts = new Map();
  const limit = async (req, res, next) => {
    const now=Date.now(), key=req.ip, limit=options.rateLimit || 8;
    if(options.state){
      const entry=await options.state.attempt('submission',key);
      if(entry.count>limit){res.set('Retry-After','900');return next(fail('Too many submissions. Please wait 15 minutes.',429));}
      return next();
    }
    for (const [ip, value] of attempts) if (now-value.start > 15*60000) attempts.delete(ip);
    const entry=attempts.get(key) || {start:now, count:0};
    if (attempts.size>=5000 && !attempts.has(key)) return next(fail('Please try again later.',429));
    entry.count++; attempts.set(key,entry);
    if (entry.count>limit) {res.set('Retry-After','900');return next(fail('Too many submissions. Please wait 15 minutes.',429));}
    next();
  };
  const sameOrigin = (req, res, next) => {
    const expected = options.publicOrigin || process.env.PUBLIC_ORIGIN || `${req.protocol}://${req.get('host')}`;
    if (!req.get('origin') || req.get('origin') !== expected || req.get('sec-fetch-site') === 'cross-site') return next(fail('Please submit from the HTAFL website.',403));
    next();
  };
  mountAdmin(app,{storage,sameOrigin,configured,send,from,recipient,adminHash:options.adminHash,adminUsername:options.adminUsername,secureCookies:options.secureCookies,state:options.state});
  app.get('/healthz',(req,res)=>res.json({status:'ok'}));
  app.get('/api/config', (req,res) => res.json({emailReady:configured, uploadsReady:true, recipient, maxUploadBytes}));
  app.post('/api/involvement', sameOrigin, limit, express.json({limit:'16kb'}), async (req,res,next) => {
    try {
      const b=req.body || {}, {fields:errors,values}=validateInvolvement(b);
      if (b.website) throw fail('Submission could not be accepted.',422);
      if (Object.keys(errors).length) throw fail('Please check your details.',422,errors);
      if (!configured) throw fail('Email delivery is not configured yet. Please email htafl@africamail.com directly.',503);
      try {
        await send({from,to:recipient,replyTo:values.email,subject:`HTAFL involvement: ${b.interest}`,text:involvementMessage(b.interest,values)});
      } catch {throw fail('Your message could not be sent. Your entries are preserved; please try again or email htafl@africamail.com.',502);}
      res.json({message:'Your message has been sent to HTAFL. Thank you for reaching out.'});
    } catch(e) {next(e);}
  });
  const upload = multer({storage:multer.memoryStorage(), limits:{fileSize:maxUploadBytes,files:1,fields:11,parts:12,fieldSize:6000},
    fileFilter:(req,file,cb)=>cb(acceptedImageTypes.includes(file.mimetype)?null:fail('Choose a JPEG, PNG or WebP image.'),acceptedImageTypes.includes(file.mimetype))}).single('artwork');
  app.post('/api/community/submissions', sameOrigin, limit, upload, async(req,res,next)=>{
    try {
      const b=req.body || {},errors={},credit=text(b,'credit',1,100,errors),email=text(b,'email',3,254,errors),title=text(b,'title',1,120,errors),description=text(b,'description',20,1000,errors),alt=text(b,'alt',10,300,errors);
      if(!emailPattern.test(email))errors.email='Enter a valid email address.';
      if(!categories.includes(b.category))errors.category='Choose a creative category.';
      if(b.rightsConsent!=='true')errors.rightsConsent='Confirm you own the work and have permission from people shown.';
      if(b.contactConsent!=='true')errors.contactConsent='Consent is required to review your submission.';
      if(!req.file)errors.artwork=`Choose one image, up to ${maxUploadBytes/1024/1024} MB.`;
      if(b.website)throw fail('Submission could not be accepted.');
      if(Object.keys(errors).length)throw fail('Please check your submission.',422,errors);
      let converted;
      try {
        const source=sharp(req.file.buffer,{limitInputPixels:24000000,failOn:'error'}),meta=await source.metadata();
        if(!['jpeg','png','webp'].includes(meta.format)|| (meta.pages || 1)>1 || !meta.width || !meta.height)throw Error();
        converted=await source.rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toBuffer({resolveWithObject:true});
      } catch {throw fail('This image could not be read. Use a still JPEG, PNG or WebP image under 24 megapixels.',422,{artwork:'Choose a readable still image.'});}
      const id=randomUUID(),record={id,credit,email,title,description,alt,category:b.category,
        publicationConsent:b.publicationConsent==='true',rightsConsent:true,contactConsent:true,status:'pending',
        width:converted.info.width,height:converted.info.height,createdAt:new Date().toISOString(),notification:'not-configured'};
      const release=options.state?await options.state.lock(id):null;
      if(options.state && !release)throw fail('This submission is already being processed.',409);
      try{
      await writeImage(storage,id,converted.data);
      try {await saveRecord(storage,record);}
      catch(e){await removeImage(storage,id).catch(()=>{});throw e;}
      if(configured){try {await send({from,to:recipient,replyTo:email,subject:`HTAFL creative submission: ${b.category}`,text:`Submission: ${id}\nCreator credit: ${credit}\nEmail: ${email}\nTitle: ${title}\nCategory: ${b.category}\nPublication permission: ${record.publicationConsent?'Yes':'No — private review only'}\n\n${description}\n\nAlt description: ${alt}\n\nThis work is private and pending review. Use the server review command to approve publication.`,attachments:[{filename:`${id}.webp`,content:converted.data,contentType:'image/webp'}]});record.notification='sent';}
        catch{record.notification='failed';}
        await saveRecord(storage,record);
      }
      res.status(201).json({id,message:'Your work has been received for private review. It is not published. Keep your reference if you contact us about it.',notification:record.notification});
      }finally{if(release)await release();}
    } catch(e){next(e);}
  });
  app.get('/api/community',async(req,res,next)=>{try{res.json({entries:await publicEntries(storage)});}catch(e){next(e);}});
  app.get('/api/community/images/:id',async(req,res,next)=>{
    try{if(!idPattern.test(req.params.id))return res.sendStatus(404);
      const r=await readRecord(storage,req.params.id);
      if(r.id!==req.params.id||r.status!=='approved'||r.publicationConsent!==true||r.rightsConsent!==true)return res.sendStatus(404);
      res.type('webp').send(await readImage(storage,req.params.id));
    }catch(e){if(e.code==='ENOENT')return res.sendStatus(404);next(e);}
  });
  app.get(['/get-involved','/get-involved/','/get-involved/index.html'],(req,res,next)=>{
    const interest=req.query.interest;
    if(typeof interest==='string' && Object.hasOwn(pathways,interest))return res.redirect(302,`/get-involved/${interest}/#involvement-form`);
    next();
  });
  if(!options.apiOnly)for(const directory of ['assets','styles','scripts','social','youtube','about','overcome','credits','how-it-works','create','community','resources','merchandise','get-involved','privacy','accessibility','community-guidelines','immersive'])app.use(`/${directory}`,express.static(path.join(root,directory),{dotfiles:'deny',index:'index.html'}));
  if(!options.apiOnly){
  app.get(['/', '/index.html'],(req,res)=>res.sendFile(path.join(root,'index.html')));
  app.get('/main.css',(req,res)=>res.sendFile(path.join(root,'main.css')));
  app.get('/robots.txt',(req,res)=>res.sendFile(path.join(root,'robots.txt')));
  app.get('/about.html',(req,res)=>res.redirect(301,'/about/'));
  }
  app.use('/api',(req,res)=>res.status(404).json({message:'This service could not be found.'}));
  app.use((req,res)=>options.apiOnly?res.status(404).json({message:'This service could not be found.'}):res.status(404).sendFile(path.join(root,'404.html')));
  app.use((err,req,res,next)=>{
    if(res.headersSent)return next(err);
    const status=err.code==='LIMIT_FILE_SIZE'?413:err instanceof multer.MulterError?422:err.status || 500;
    const message=err.code==='LIMIT_FILE_SIZE'?`Choose an image no larger than ${maxUploadBytes/1024/1024} MB.`:err instanceof multer.MulterError?'Choose one image and keep the form within the stated limits.':status<500?err.message:err.status?err.message:'The service could not complete your request. Please try again.';
    res.status(status).json({message,fields:err.fields || {}});
  });
  return app;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const app=createApp();
  app.listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log(`HTAFL ready at http://localhost:${process.env.PORT || 3000}`));
}
