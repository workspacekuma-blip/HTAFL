const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
  const {createApp}=await import('../server/index.js');
  const server=createApp().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const response=await page.goto(base+'/merchandise/',{waitUntil:'networkidle'});
    assert.equal(response.status(),200,'Merchandise route is served');
    assert.match(await page.locator('h1').textContent(),/Merchandise/);
    assert.match(await page.locator('main').textContent(),/Coming soon/);
    assert.equal(await page.locator('main form,main [data-checkout]').count(),0,'Coming soon does not take orders');
    for(const width of [1440,768,390,320]){
      await page.setViewportSize({width,height:960});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`No overflow at ${width}`);
      if(width===390 && process.env.AXE_SCRIPT){await page.evaluate(fs.readFileSync(process.env.AXE_SCRIPT,'utf8'));assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))).violations.map(v=>v.id),[]);}
    }
    await page.goto(base+'/',{waitUntil:'networkidle'});await page.setViewportSize({width:1440,height:960});
    const merchandise=page.locator('.site-nav--desktop a').filter({hasText:'Merchandise'});assert.equal(await merchandise.count(),1);
    assert.equal(await page.locator('.site-footer').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(0, 0, 0)');
    assert.equal(await page.locator('.site-footer').evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
    assert.equal(await page.locator('.site-join').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(5, 26, 110)');
    const social=page.locator('site-footer a.social-icon');assert.equal(await social.count(),3);
    for(const a of await social.all()){assert.equal(await a.getAttribute('target'),'_blank');assert.match(await a.getAttribute('rel'),/noopener/);}
    assert.match(await page.locator('[data-social=instagram]').evaluate(e=>getComputedStyle(e).backgroundImage),/gradient/);
    await merchandise.click();assert.equal(new URL(page.url()).pathname,'/merchandise/');
    await page.setViewportSize({width:390,height:844});await page.goto(base+'/',{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    const mobile=page.locator('.site-menu a').filter({hasText:'Merchandise'});assert.equal(await mobile.isVisible(),true);
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Menu',exact:true}).evaluate(e=>e===document.activeElement),true);
    await page.goto(base+'/merchandise/',{waitUntil:'networkidle'});await page.screenshot({path:'test-results/merchandise-mobile.png',fullPage:true});
    await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/merchandise-desktop.png',fullPage:true});
    await page.locator('site-footer').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/retail-footer.png'});
    assert.deepEqual(errors,[]);console.log('Passed merchandise routing, honest coming-soon state, four layouts/accessibility, black/white/blue shell, colored social/new-tab behavior and mobile navigation.');
  } finally {await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
