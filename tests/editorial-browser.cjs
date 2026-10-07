/* Real browser verification of destinations, identity and bounded textile rendering. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.QA_ORIGIN || 'http://localhost:3128';
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await page.addInitScript(()=>{window.clothDraws=0;const original=WebGLRenderingContext.prototype.drawElements;WebGLRenderingContext.prototype.drawElements=function(...args){window.clothDraws++;return original.apply(this,args);};});
    await page.goto(base+'/',{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('[data-fashion-cloth]').dataset.clothState==='ready');
    assert.equal(await page.locator('[data-fashion-cloth] canvas').count(),1);
    assert.equal(await page.locator('[data-fashion-cloth] canvas').getAttribute('aria-hidden'),'true');
    const canvas=await page.locator('[data-fashion-cloth] canvas').evaluate(n=>({pixels:n.width*n.height,cssWidth:n.getBoundingClientRect().width}));
    assert.ok(canvas.pixels<=351500);
    const started=await page.evaluate(()=>window.clothDraws);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.clothDraws),started,'No continuous idle loop');
    const box=await page.locator('[data-fashion-cloth]').boundingBox();await page.mouse.move(box.x+box.width*.9,box.y+box.height*.6);
    await page.waitForTimeout(700);assert.ok(await page.evaluate(()=>window.clothDraws)>started,'Pointer response draws');
    const settled=await page.evaluate(()=>window.clothDraws);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>window.clothDraws),settled,'Settled pointer stops');
    await page.locator('.partnership').scrollIntoViewIfNeeded();await page.waitForTimeout(150);const offscreen=await page.evaluate(()=>window.clothDraws);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.clothDraws),offscreen,'Offscreen stops');
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('[data-fashion-cloth]').dataset.clothState==='fallback');assert.equal(await page.locator('[data-fashion-cloth]').getAttribute('data-cloth-state'),'fallback');
    const reduced=await page.evaluate(()=>window.clothDraws);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.clothDraws),reduced);
    await page.goto(base+'/',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-fashion-cloth] canvas').count(),0,'Reduced motion skips WebGL');
    const join=await page.locator('.site-header__actions a.site-join').getAttribute('href');
    const partner=await page.getByRole('link',{name:'Partner With HTAFL',exact:true}).getAttribute('href');
    assert.equal(new URL(join,page.url()).pathname,'/get-involved/');assert.equal(new URL(partner,page.url()).pathname,'/get-involved/collaborate/');
    assert.equal(await page.locator('[data-world-link]').count(),3);assert.equal(await page.locator('[data-scenes],.five-ideas').count(),0);
    const duplicateLinks=await page.locator('a[href]').evaluateAll(links=>{
      const seen=new Set(),duplicates=[];
      for(const link of links){if(!link.getClientRects().length || link.getAttribute('href').startsWith('#'))continue;
        const u=new URL(link.href),key=u.origin+u.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
        if(seen.has(key))duplicates.push(key);seen.add(key);
      }return duplicates;
    });assert.deepEqual(duplicateLinks,[],'Visible homepage destinations are unique');
    assert.match(await page.locator('link[rel=icon]').getAttribute('href'),/htafl-favicon.svg/);
    assert.match(await page.locator('site-header .site-logo img').getAttribute('src'),/htafl-wordmark.svg/);
    assert.equal(await page.locator('site-footer .social-icon img').count(),3);assert.match(await page.locator('site-footer').textContent(),/© \d{4} HTAFL/);
    await page.getByRole('link',{name:'Explore why HTAFL exists'}).click();assert.match(page.url(),/about\/#founder-story/);
    assert.match(await page.locator('#founder-story').textContent(),/hostel room/);
    assert.match(await page.locator('#founder-story').textContent(),/HATE TAKEN AWAY FOR LIFE/);
    const sources=JSON.parse(fs.readFileSync('content/research.json','utf8'));assert.equal(sources.sources.length,3);
    // An unavailable GPU leaves readable content and a static textile plane.
    const fallback=await browser.newPage({viewport:{width:390,height:844}});
    await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};});
    await fallback.goto(base+'/',{waitUntil:'networkidle'});assert.equal(await fallback.locator('[data-fashion-cloth]').getAttribute('data-cloth-state'),'fallback');
    assert.equal(await fallback.locator('h1').isVisible(),true);assert.equal(await fallback.locator('[data-fashion-cloth] canvas').count(),0);
    assert.deepEqual(errors,[]);console.log('Passed separate Join/Partner destinations, unique visible homepage links, founder story, supplied wordmark/favicon, icon/copyright checks, real cloth rendering, pixel cap, pointer/idle/offscreen/reduced-motion and unavailable-GPU fallback.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
