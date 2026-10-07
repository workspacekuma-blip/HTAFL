/* Reuses the website/social artwork system; no new runtime or website build step. */
const fs = require('node:fs');
const path = require('node:path');
const { tokens, colors:c, escape, rect, text, mark, wrap, svg, approvedImage } = require('../social/artwork.cjs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname,'templates.json'),'utf8'));
const timing=config.sting;
if (!timing || ![timing.durationMs,timing.pathRevealMs,timing.wordmarkDelayMs,timing.taglineDelayMs].every(Number.isInteger) ||
    timing.durationMs<2000 || timing.durationMs>3000 || timing.pathRevealMs<100 || timing.pathRevealMs>180 ||
    timing.wordmarkDelayMs<timing.pathRevealMs*5 || timing.taglineDelayMs<timing.wordmarkDelayMs+160 ||
    timing.taglineDelayMs+160>timing.durationMs) throw new Error('Sting timing must be sequential and fit a 2–3 second package.');
const out = path.join(__dirname,'exports');
const assets = [];
const add = (id,label,w,h,body) => { assets.push({id,label,svg:svg(w,h,label,body)}); };
const families = {
  create: {bg:c.cobalt,fg:c.white,accent:c.paper,summary:'Art. Fashion. Process.'},
  overcome: {bg:c.paper,fg:c.ink,accent:c.coral,summary:'Movement. Practice. Reflection.'},
  connect: {bg:c.ink,fg:c.paper,accent:c.cobalt,summary:'Community. Collaboration. Stories.'},
};
function lines(value,x,y,size,color,width,max=3,display=true) {
  return wrap(value,Math.floor(width/(size*.61)),max).map((line,i)=>text(x,y+i*size*1.2,line,size,color,display)).join('');
}
function imageFrame(record,x,y,w,h,fill) {
  if (!record.image) return rect(x,y,w,h,fill,16)+text(x+28,y+60,'[Approved focal image]',32,c.ink,false,500)+text(x+28,y+108,'No image supplied',28,c.ink);
  return `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" href="${approvedImage(record)}"><title>${escape(record.image.alt)}</title></image>`;
}
function cue(family,f,y=80,width=1280) {
  return text(64,y,family.toUpperCase(),30,f.fg,false,500)+mark(width-120,y-44,60,f.bg===c.paper?c.cobalt:c.paper)
    +(family==='overcome'?rect(64,y+28,90,10,c.coral,5):family==='connect'?`<path d="M64 ${y+30}H${width-160}" fill="none" stroke="${c.cobalt}" stroke-width="3"/>`:'');
}
add('channel-avatar','HTAFL channel avatar',1024,1024,rect(0,0,1024,1024,c.cobalt)+mark(192,192,640,c.paper));
const banner=rect(0,0,2560,1440,c.paper)+`<path d="M0 1040C560 1040 680 990 1280 990S2100 1040 2560 1040" fill="none" stroke="${c.cobalt}" stroke-width="8"/>`
  +mark(800,624,176,c.cobalt)+text(1010,744,'HTAFL',128,c.ink,true)+text(1010,820,tokens.brand.tagline.toUpperCase(),42,c.ink,false,500);
add('channel-banner','HTAFL YouTube channel banner',2560,1440,banner);
add('channel-banner-guide','Banner guide — not for upload',2560,1440,banner+rect(662.5,551,1235,338,'none',0,c.cobalt)+text(662.5,520,'HTAFL conservative central text/logo guide',32,c.ink));
for (const [family,f] of Object.entries(families)) {
  let thumb=rect(0,0,1280,720,f.bg)+cue(family,f)+lines(config.thumbnail.headline,64,286,84,f.fg,660,3)
    +text(64,610,config.thumbnail.support,32,f.fg)+imageFrame(config.thumbnail,768,166,448,420,family==='connect'?c.mist:c.paper);
  // Vector editing coordinates remain 1280×720; the upload master is 3840×2160.
  assets.push({id:`thumbnail-${family}`,label:`${family.toUpperCase()} video thumbnail`,svg:svg(1280,720,`${family.toUpperCase()} thumbnail`,thumb).replace('width="1280" height="720"','width="3840" height="2160"')});
  add(`playlist-${family}`,`${family.toUpperCase()} playlist master`,1280,720,rect(0,0,1280,720,f.bg)+cue(family,f)+text(64,336,family.toUpperCase(),128,f.fg,true)+text(64,430,f.summary,38,f.fg)+text(64,614,tokens.brand.tagline,32,f.fg));
  let shorts=rect(0,0,1080,1920,f.bg)+text(88,390,family.toUpperCase(),30,f.fg,false,500)+mark(780,346,60,f.bg===c.paper?c.cobalt:c.paper)
    +lines(config.shorts.headline,88,630,88,f.fg,752,3)+text(88,920,config.shorts.support,36,f.fg)
    +imageFrame(config.shorts,88,990,752,340,family==='connect'?c.mist:c.paper)+text(88,1420,config.shorts.caption,36,f.fg);
  assets.push({id:`shorts-${family}`,label:`${family.toUpperCase()} Shorts cover / title`,svg:svg(1080,1920,`${family.toUpperCase()} Shorts cover`,shorts).replace('width="1080" height="1920"','width="2160" height="3840"')});
  add(`chapter-${family}`,`${family.toUpperCase()} chapter/title card`,1920,1080,rect(0,0,1920,1080,f.bg)+text(96,120,'HTAFL',60,f.fg,true)+text(96,284,`${family.toUpperCase()} / ${config.chapter.number}`,38,f.fg,false,500)+lines(config.chapter.headline,96,480,120,f.fg,1680,3)+text(96,928,config.chapter.support,44,f.fg));
}
add('lower-third','HTAFL lower third — transparent overlay',1920,1080,rect(96,716,1080,190,c.paper,16,c.ink)+mark(124,766,84,c.cobalt)+text(240,797,config.lowerThird.name,52,c.ink,true)+text(240,859,config.lowerThird.role,32,c.ink));
add('quote-card','HTAFL editorial quote card',1920,1080,rect(0,0,1920,1080,c.paper)+text(96,120,'HTAFL',60,c.ink,true)+lines(config.quote.headline,96,428,112,c.ink,1680,3)+text(96,928,config.quote.credit,40,c.ink));
add('source-reference','HTAFL source/reference card',1920,1080,rect(0,0,1920,1080,c.paper)+text(96,120,'HTAFL',60,c.ink,true)+text(96,240,'SOURCE / REFERENCE',34,c.ink,false,500)+lines(config.reference.headline,96,396,88,c.ink,1680,2)+config.reference.lines.map((line,i)=>text(96,640+i*72,line,40,c.ink)).join(''));
const end=rect(0,0,1920,1080,c.ink)+text(120,110,'HTAFL',60,c.paper,true)+lines('Keep creating. Keep moving. Stay connected.',120,230,76,c.paper,1680,2);
add('end-screen','HTAFL clean end-screen background',1920,1080,end);
add('end-screen-guide','End-screen placement guide — not final artwork',1920,1080,end+rect(120,450,650,366,'none',16,c.paper)+rect(850,450,650,366,'none',16,c.paper)+`<circle cx="1710" cy="633" r="102" fill="none" stroke="${c.paper}" stroke-width="2"/>`+text(120,884,'Next video',40,c.paper)+text(850,884,'Playlist',40,c.paper)+text(1600,884,'Subscribe',40,c.paper));
const sting=rect(0,0,1920,1080,c.paper)+`<g data-sting-paths>${mark(460,378,240,c.cobalt)}</g><g data-sting-wordmark>${text(754,558,'HTAFL',164,c.ink,true)}</g><g data-sting-tagline>${text(754,654,tokens.brand.tagline,44,c.ink)}</g>`;
add('brand-sting','HTAFL static brand sting lockup',1920,1080,sting);
fs.mkdirSync(out,{recursive:true});
assets.forEach(asset=>fs.writeFileSync(path.join(out,asset.id+'.svg'),asset.svg+'\n'));
const inline=(asset)=>asset.svg.replaceAll('art-title',asset.id+'-title').replaceAll('art-desc',asset.id+'-desc');
const cards=assets.map(asset=>`<article class="card"><h2 class="type-h3">${escape(asset.label)}</h2><a href="${asset.id}.svg" download>Download editable SVG</a>${inline(asset)}${asset.id==='brand-sting'?'<div class="cluster"><button class="button button--primary" type="button" data-play-sting hidden>Play 2.4s sting</button></div><p data-sting-status role="status" aria-live="polite"></p><noscript><p>The static sting is shown. JavaScript is needed for manual animation playback.</p></noscript>':''}</article>`).join('\n');
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>HTAFL YouTube template reference</title><link rel="stylesheet" href="../../main.css"><style>.video-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr));gap:var(--space-8)}.video-grid svg{inline-size:100%;block-size:auto}.video-grid svg:has([data-sting-paths]){overflow:visible}</style><script src="../sting.js" defer></script></head><body class="page"><a class="skip-link" href="#main">Skip to templates</a><main id="main" tabindex="-1" class="container section stack"><p class="type-label">HTAFL / YouTube template reference</p><h1 class="type-h2">Create. Overcome. Connect.</h1><p class="reading">Same Five-Path Mark, palette and typography as the website and social system. Bracketed copy and image frames are editing placeholders. Guides are not upload artwork; the end-screen background needs real Studio elements.</p><div class="cluster"><a href="../../docs/youtube-brand-system.md">Specifications</a><a href="../README.md">Editing and export guide</a><a href="../../social/exports/index.html">Social reference</a></div><div class="video-grid">${cards}</div><script type="application/json" id="sting-timing">${JSON.stringify(config.sting)}</script></main></body></html>\n`);
console.log(`Generated ${assets.length} YouTube SVG assets and an inline-font preview.`);

