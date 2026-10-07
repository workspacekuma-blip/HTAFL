const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
(async()=>{
  const {createApp,saveRecord}=await import('../server/index.js');
  const {moderateRecord}=await import('../server/storage.js');
  const sharp=(await import('sharp')).default;
  const storage=fs.mkdtempSync(path.join(os.tmpdir(),'htafl-featured-test-'));
  const server=createApp({storage,mailReady:false}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    const image=await sharp({create:{width:40,height:60,channels:3,background:'#d6c1a7'}}).webp().toBuffer();
    const ids=[];
    for(let i=0;i<10;i++){
      const id=require('node:crypto').randomUUID();ids.push(id);
      await saveRecord(storage,{id,title:`Test work ${i+1}`,credit:`Test creator ${i+1}`,description:i===0?'<img src=x onerror=alert(1)>':`Test-only art study ${i+1}.`,alt:'A test-only beige rectangle.',email:'private@example.com',category:'art',width:40,height:60,status:i===8?'pending':'approved',publicationConsent:i!==9,rightsConsent:true,contactConsent:true,createdAt:new Date(Date.UTC(2026,9,7,12-i)).toISOString()});
      fs.writeFileSync(path.join(storage,id+'.webp'),image);
    }
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await page.goto(base+'/community/',{waitUntil:'networkidle'});
    assert.equal(await page.getByRole('heading',{name:'Featured community work.',exact:true}).count(),1,'Community contains the featured section');
    const works=page.locator('[data-community-gallery] > li');assert.equal(await works.count(),6,'Latest six works featured initially');
    assert.match(await works.first().textContent(),/Test work 1/);assert.equal(await works.locator('img[onerror]').count(),0,'Descriptions remain text');
    assert.equal((await page.locator('main').textContent()).includes('private@example.com'),false);
    const expand=page.locator('button[aria-controls="featured-community-works"]');assert.equal(await expand.textContent(),'View all 8 works');await expand.click();assert.equal(await works.count(),8);assert.equal(await expand.getAttribute('aria-expanded'),'true');
    const invoker=works.first().locator('[data-photo-view]');await invoker.click();
    assert.equal(await page.locator('[data-media-dialog] h2').textContent(),'Community work');
    assert.match(await page.locator('[data-media-image]').getAttribute('src'),new RegExp(ids[0]));
    assert.equal((await page.locator('[data-media-dialog]').textContent()).includes('Illustrative process'),false);
    await page.keyboard.press('ArrowRight');assert.match(await page.locator('[data-media-image]').getAttribute('src'),new RegExp(ids[1]));
    await page.keyboard.press('Escape');assert.equal(await invoker.evaluate(e=>e===document.activeElement),true);
    for(const width of [1440,768,390,320]){
      await page.setViewportSize({width,height:960});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`Gallery fits ${width}`);
      if(width===390&&process.env.AXE_SCRIPT){await page.evaluate(fs.readFileSync(process.env.AXE_SCRIPT,'utf8'));assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))).violations.map(v=>v.id),[]);}
    }
    await moderateRecord(storage,ids[0],'withdraw');await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-community-gallery]').textContent().then(t=>t.includes('Test work 1')),false,'Withdrawn work disappears');
    for(const id of ids.slice(1,8))await moderateRecord(storage,id,'withdraw');
    await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-gallery-empty]').isVisible(),true);assert.equal(await page.locator('[data-community-gallery]').isVisible(),false);
    await page.route('**/api/community',r=>r.fulfill({status:503,body:'Unavailable'}));await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.getByRole('button',{name:'Retry gallery'}).isVisible(),true);await page.unroute('**/api/community');await page.getByRole('button',{name:'Retry gallery'}).click();await page.waitForFunction(()=>document.querySelector('[data-gallery-status]').textContent.includes('No community works'));
    assert.equal(await page.locator('[data-gallery-empty] a').evaluate(e=>e===document.activeElement),true,'Retry restores a useful focus target');
    await page.goto(base+'/',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-community-gallery]').count(),0);
    await page.goto(base+'/merchandise/',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-community-gallery]').count(),0);
    assert.deepEqual(errors.filter(e=>!e.includes('503')),[]);
    console.log('Passed Community-only featured selection, consent/private data, view-all, real uploaded-image viewer, keyboard/focus, four layouts/accessibility, withdrawal, empty and retry states.');
  } finally {await browser.close();await new Promise(r=>server.close(r));fs.rmSync(storage,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
