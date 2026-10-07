import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm,mkdir} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {buildSite} from '../server/build-site.js';
test('Netlify public package excludes configuration, uploads and tools and writes canonical metadata',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'htafl-build-test-'));
  try{
    const html='<html><head><title>HTAFL test</title><meta name="description" content="Test &amp; description"></head><body><h1>HTAFL</h1></body></html>';
    await writeFile(path.join(root,'index.html'),html);await writeFile(path.join(root,'404.html'),html);await writeFile(path.join(root,'main.css'),'');await writeFile(path.join(root,'robots.txt'),'User-agent: *\n');
    await writeFile(path.join(root,'.env'),'PRIVATE=never-publish');await mkdir(path.join(root,'server'));await writeFile(path.join(root,'server','setup.js'),'secret');
    await mkdir(path.join(root,'assets'));await writeFile(path.join(root,'assets','htafl-wordmark.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>');
    await mkdir(path.join(root,'about'));await writeFile(path.join(root,'about','index.html'),html);
    const result=await buildSite({root,origin:'https://example.netlify.app',production:true});
    const page=await readFile(path.join(result.output,'about','index.html'),'utf8');
    assert.match(page,/rel="canonical" href="https:\/\/example.netlify.app\/about\/"/);assert.match(page,/property="og:description" content="Test &amp; description"/);
    const sitemap=await readFile(path.join(result.output,'sitemap.xml'),'utf8');assert.ok(!sitemap.includes('404'));assert.ok(sitemap.includes('/about/'));
    await assert.rejects(readFile(path.join(result.output,'.env')));await assert.rejects(readFile(path.join(result.output,'server','setup.js')));
    await assert.rejects(buildSite({root,origin:'http://example.netlify.app'}));
  }finally{await rm(root,{recursive:true,force:true});}
});
