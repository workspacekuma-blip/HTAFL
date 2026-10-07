import {cp,mkdir,readdir,readFile,writeFile,rm,lstat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const publicFolders=['assets','styles','scripts','about','how-it-works','create','overcome','community','resources','get-involved','merchandise','privacy','accessibility','community-guidelines','credits','immersive','not-found'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function exists(file){try{return await lstat(file);}catch(error){if(error.code==='ENOENT')return null;throw error;}}
export async function buildSite({root=project,origin=process.env.PUBLIC_ORIGIN || process.env.URL,production=process.env.CONTEXT==='production'}={}){
  let base;
  if(origin){const url=new URL(origin);if(url.protocol!=='https:' || url.username || url.password || url.pathname!=='/' || url.search || url.hash)throw Error('Use an exact public HTTPS origin.');base=url.origin;}
  if(process.env.NETLIFY && !base)throw Error('The Netlify site URL is required for domain metadata.');
  const output=path.resolve(root,'dist');
  if(path.relative(path.resolve(root),output)!=='dist' || (await exists(output))?.isSymbolicLink())throw Error('Refusing to replace an unsafe publish directory.');
  await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
  for(const name of ['index.html','404.html','main.css','robots.txt',...publicFolders]){
    const source=path.join(root,name);if(!await exists(source))continue;
    await cp(source,path.join(output,name),{recursive:true,filter:async file=>!(await lstat(file)).isSymbolicLink() && !path.basename(file).startsWith('.')});
  }
  const admin=path.join(root,'server/admin-ui');if(await exists(admin))await cp(admin,path.join(output,'admin'),{recursive:true});
  const routes=[];let pages=0;
  for(const file of await readdir(output,{recursive:true})){
    if(path.extname(file)!=='.html')continue;
    pages++;
    const target=path.join(output,file);let html=await readFile(target,'utf8');
    const excluded=file==='404.html' || file.startsWith('not-found'+path.sep) || file.startsWith('admin'+path.sep);
    if(base && !excluded){
      const route='/'+file.split(path.sep).join('/').replace(/index\.html$/,'');
      const title=html.match(/<title>([^<]*)<\/title>/)?.[1] || 'HTAFL';
      const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '';
      const canonical=escape(base+route);
      const metadata=`<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="HTAFL"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${escape(base)}/assets/htafl-sharing.png"><meta property="og:image:alt" content="HTAFL wordmark"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@htaflco">`;
      html=html.replace('</head>',metadata+'</head>');routes.push(base+route);
    }
    if(!production || excluded)html=html.replace('</head>','<meta name="robots" content="noindex, nofollow"></head>');
    await writeFile(target,html);
  }
  if(base){
    await sharp(path.join(root,'assets/htafl-wordmark.svg')).resize(1200,630,{fit:'contain',background:'#000000'}).png().toFile(path.join(output,'assets/htafl-sharing.png'));
    const sitemap='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+(production?routes:[]).map(url=>'<url><loc>'+escape(url)+'</loc></url>').join('')+'</urlset>';
    await writeFile(path.join(output,'sitemap.xml'),sitemap);
    const robots=production?(await readFile(path.join(output,'robots.txt'),'utf8')).trimEnd()+`\nSitemap: ${base}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n';
    await writeFile(path.join(output,'robots.txt'),robots);
  }
  return {output,pages,domainMetadata:!!base,production};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(await buildSite(),null,2));}catch(error){console.error(error.message);process.exitCode=1;}
}
