/* Optional asset generator, not a website build step. No packages required. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { tokens, colors, escape, rect, text, mark, wrap, svg, approvedImage } = require('./artwork.cjs');
const templates = JSON.parse(fs.readFileSync(path.join(__dirname, 'templates.json'), 'utf8')).templates;
const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(`--${name}`); return i < 0 ? undefined : args[i + 1]; };
const formatOverride = option('format');
const familyOverride = option('family');
const formats = { portrait: [1080, 1350], square: [1080, 1080], vertical: [1080, 1920], landscape: [1200, 675] };
const families = {
  create: { bg: colors.cobalt, fg: colors.white, accent: colors.paper },
  overcome: { bg: colors.paper, fg: colors.ink, accent: colors.coral },
  connect: { bg: colors.paper, fg: colors.ink, accent: colors.cobalt },
};
if (formatOverride && !formats[formatOverride]) throw new Error('Format must be portrait, square, vertical or landscape.');
if (familyOverride && !families[familyOverride]) throw new Error('Family must be create, overcome or connect.');
const output = path.resolve(root, option('out') || 'social/exports');
const exportRoot = path.join(__dirname,'exports');
if (output !== exportRoot && !output.startsWith(exportRoot + path.sep)) throw new Error('Export only into social/exports or its subdirectories.');
const ids = new Set();
templates.forEach(item => {
  if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id) || !families[item.family] ||
      !['quote','editorial','instruction','image','event'].includes(item.layout) ||
      typeof item.headline !== 'string' || !Array.isArray(item.body)) throw new Error('Invalid or duplicate template configuration.');
  ids.add(item.id);
});
function render(item, family, format) {
  const [w,h] = formats[format]; const f = families[family];
  const landscape = format === 'landscape', vertical = format === 'vertical';
  const x = landscape ? 64 : vertical ? 88 : 80;
  const right = vertical ? 240 : x;
  const header = vertical ? 390 : landscape ? 72 : 100;
  const baseline = vertical ? 620 : landscape ? 198 : 280;
  const bottom = vertical ? 1470 : h - 76;
  const imageLayout = item.layout === 'image';
  const titleWidth = landscape && imageLayout ? 620 : w - x - right;
  const titleSize = landscape ? 60 : format === 'square' ? 78 : 88;
  const titleLines = wrap(item.headline, Math.floor(titleWidth / (titleSize * 0.61)), landscape ? 2 : 3);
  let parts = rect(0,0,w,h,f.bg);
  if (family === 'overcome') parts += rect(x,header-16,12,64,f.accent,6);
  if (family === 'connect') parts += `<path d="M${x} ${header+32}H${w-right}" fill="none" stroke="${f.accent}" stroke-width="3"/>`;
  parts += text(x + (family === 'overcome' ? 28 : 0),header,family.toUpperCase(),28,f.fg,false,500);
  if (item.brand === 'formal') {
    parts += mark(w-right-220,header-44,60,f.fg) + text(w-right-144,header,'HTAFL',44,f.fg,true);
  } else if (item.brand === 'editorial') parts += text(w-right-144,header,'HTAFL',44,f.fg,true);
  else parts += mark(w-right-60,header-44,60,f.fg);
  titleLines.forEach((line,i)=>{parts += text(x,baseline+i*titleSize*1.12,line,titleSize,f.fg,true);});
  const bodyY = baseline + titleLines.length*titleSize*1.12 + (landscape ? 12 : 36);
  const bodySize = landscape ? 28 : 36;
  const bodyWidth = titleWidth - (item.layout === 'instruction' ? 84 : 0);
  let cursor = bodyY;
  (item.body || []).forEach((line,i)=>{
    const lines = wrap(line,Math.floor(bodyWidth/(bodySize*.61)),2);
    if (item.layout === 'instruction') {
      parts += rect(x,cursor-30,56,44,f.accent,8);
      parts += text(x+10,cursor,String(i+1).padStart(2,'0'),25,family==='connect'?colors.white:colors.ink,false,500);
    }
    lines.forEach((value,j)=>{parts += text(x+(item.layout==='instruction'?84:0),cursor+j*bodySize*1.4,value,bodySize,f.fg);});
    cursor += lines.length*bodySize*1.4 + (landscape ? 12 : 28);
  });
  if (imageLayout) {
    const ix = landscape ? 776 : x;
    const iy = landscape ? 160 : Math.max(vertical ? 990 : 650,cursor+20);
    const iw = landscape ? 360 : w-x-right;
    const ih = landscape ? 360 : bottom-iy-110;
    if (ih < 160) throw new Error(`${item.id}: shorten copy to leave enough image space.`);
    parts += rect(ix,iy,iw,ih,family==='connect'?colors.mist:colors.paper,Number.parseInt(tokens.radius.md),f.fg);
    if (item.image) {
      parts += `<image x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice" href="${approvedImage(item)}"><title>${escape(item.image.alt)}</title></image>`;
      parts += text(x,bottom-58,item.credit,landscape?24:28,f.fg);
    } else {
      parts += text(ix+24,iy+56,'[Approved image]',landscape?28:36,colors.ink,false,500);
      parts += text(ix+24,iy+100,'No image supplied',landscape?24:28,colors.ink);
    }
  }
  if (cursor > bottom-100 && !imageLayout) throw new Error(`${item.id}: body copy overlaps the footer.`);
  if (item.cta) {
    const lines=wrap(item.cta,Math.floor((w-x-right)/(bodySize*.61)),1);
    parts += text(x,bottom-12,lines[0],bodySize,f.fg,false,500);
  }
  if (item.page) parts += text(w-right-124,bottom+38,item.page,28,f.fg,false,500);
  return svg(w,h,`HTAFL ${family.toUpperCase()} / ${item.name}`,parts);
}
const assets = templates.map(item=>({id:item.id,name:item.name,family:familyOverride||item.family,format:formatOverride||item.format||'portrait',item}));
// Build every item before writing: oversized copy fails without partially replacing the pack.
assets.forEach(asset=>{asset.svg=render(asset.item,asset.family,asset.format);});
const avatar=svg(1024,1024,'HTAFL Five-Path Mark social avatar',rect(0,0,1024,1024,colors.cobalt)+mark(192,192,640,colors.paper));
const banner=svg(1500,500,'HTAFL formal banner',rect(0,0,1500,500,colors.paper)+mark(400,120,180,colors.cobalt)+text(614,244,'HTAFL',108,colors.ink,true)+text(616,320,tokens.brand.tagline,36,colors.ink));
fs.mkdirSync(output,{recursive:true});
assets.forEach(asset=>fs.writeFileSync(path.join(output,asset.id+'.svg'),asset.svg+'\n'));
fs.writeFileSync(path.join(output,'profile-avatar.svg'),avatar+'\n');
fs.writeFileSync(path.join(output,'formal-banner.svg'),banner+'\n');
const relative=(file)=>path.relative(output,path.join(root,file)).split(path.sep).join('/');
const inline=(art,id)=>art.replaceAll('art-title',`${id}-title`).replaceAll('art-desc',`${id}-desc`);
const cards=assets.map(asset=>`<article class="card stack"><div class="stack"><p class="type-label">${asset.family.toUpperCase()} / ${asset.format}</p><h2 class="type-h3">${escape(asset.name)}</h2><a href="${asset.id}.svg" download>Download editable SVG</a></div>${inline(asset.svg,asset.id)}</article>`).join('\n');
fs.writeFileSync(path.join(output,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>HTAFL social template reference</title><link rel="stylesheet" href="${relative('main.css')}"><style>.social-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:var(--space-8)}.social-grid svg{inline-size:100%;block-size:auto}</style></head><body class="page"><a class="skip-link" href="#main">Skip to templates</a><main id="main" tabindex="-1" class="container section stack"><p class="type-label">HTAFL / Social template reference</p><h1 class="type-h2">Create. Overcome. Connect.</h1><p class="reading">Reusable templates for Instagram, TikTok, Facebook and X. Bracketed copy and empty frames are placeholders. Replace them with approved material before publishing.</p><p class="reading">Editable SVGs require Space Grotesk 700 and Inter 400/500 in your design tool. This inline preview uses the website fonts. Export finished artwork to PNG/JPEG for social upload.</p><div class="cluster"><a href="${relative('docs/social-brand-system.md')}">Specifications</a><a href="${relative('social/README.md')}">Editing and export guide</a></div><h2 class="type-h3">Profile identity</h2><div class="social-grid"><article class="card"><h3 class="type-h3">Mark-only avatar</h3>${inline(avatar,'avatar')}<a href="profile-avatar.svg" download>Download avatar SVG</a></article><article class="card"><h3 class="type-h3">Formal banner / mark + HTAFL</h3>${inline(banner,'banner')}<a href="formal-banner.svg" download>Download banner SVG</a></article></div><h2 class="type-h3">Content templates</h2><div class="social-grid">${cards}</div></main></body></html>\n`);
console.log(`Generated ${assets.length} editable content SVGs, avatar, banner and preview in ${path.relative(root,output)}.`);


