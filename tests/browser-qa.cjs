/* Run with PLAYWRIGHT_MODULE pointing to an installed Playwright package. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.QA_ORIGIN || 'http://localhost:3128';
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const errors=[],report=[];
  const pages=['/','/about/','/how-it-works/','/create/','/community/','/resources/','/get-involved/','/overcome/','/credits/','/merchandise/','/immersive/'];
  const page=await browser.newPage({reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  for(const width of [1440,768,390,320]) {
    await page.setViewportSize({width,height:960});
    for(const route of pages) {
      try { await page.goto(base+route,{waitUntil:'networkidle'}); }
      catch(error) {
        if(!error.message.includes('ERR_NETWORK_IO_SUSPENDED'))throw error;
        await page.goto(base+route,{waitUntil:'networkidle'});
      }
      await page.locator('site-header .site-logo').waitFor();
      const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
      assert.ok(dimensions.scroll<=dimensions.width+1,`Overflow ${route} ${width}: ${JSON.stringify(dimensions)}`);
      const images=await page.locator('img[src]').evaluateAll(images=>images.filter(i=>i.getClientRects().length && (!i.complete || !i.naturalWidth)).map(i=>i.src));
      // Lazy images are checked after entering the viewport below.
      const eagerBroken=await page.locator('img[src]:not([loading="lazy"])').evaluateAll(images=>images.filter(i=>i.getClientRects().length && i.complete && !i.naturalWidth).map(i=>i.src));
      assert.deepEqual(eagerBroken,[],`${route} broken images`);
      if(process.env.AXE_SCRIPT && width===390) {
        await page.evaluate(fs.readFileSync(process.env.AXE_SCRIPT,'utf8'));
        const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
        assert.deepEqual(violations,[],`${route} accessibility: ${JSON.stringify(violations)}`);
      }
      report.push(`${route} @ ${width}: no overflow`);
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/');
  const menu=page.locator('.site-menu-toggle'); await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'),'true');
  assert.equal(await page.evaluate(()=>document.body.classList.contains('nav-is-open')),true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.querySelector('.site-menu').contains(document.activeElement)),true);
  await page.keyboard.press('Escape'); await page.waitForTimeout(50);
  assert.equal(await menu.getAttribute('aria-expanded'),'false'); assert.equal(await menu.evaluate(n=>n===document.activeElement),true);
  assert.equal(await page.locator('[data-world-link]').count(),3);
  await page.locator('[data-world-link=overcome]').focus();await Promise.all([page.waitForURL('**/overcome/'),page.keyboard.press('Enter')]);
  assert.match(page.url(),/overcome\//);assert.match(await page.locator('h1').textContent(),/Move/);
  await page.setViewportSize({width:1440,height:1000}); await page.goto(base+'/');
  fs.mkdirSync('test-results',{recursive:true});
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:false});
  await page.locator('[data-photo-view]').first().click(); assert.equal(await page.locator('[data-media-dialog]').evaluate(n=>n.open),true);
  await page.keyboard.press('Escape'); await page.waitForTimeout(50); assert.equal(await page.locator('[data-photo-view]').first().evaluate(n=>n===document.activeElement),true);
  await page.goto(base+'/resources/'); assert.equal(await page.locator('[data-resource-list]>li').count(),3);
  await page.locator('label.filter-choice').filter({hasText:'Mind'}).click(); assert.equal(await page.locator('[data-resource-empty]').isVisible(),true);
  await page.locator('[data-clear-resources]').click(); await page.locator('#resource-query').fill('textile');
  await page.waitForTimeout(250); // Search debounce and URL state.
  await page.goto(base+'/community/'); assert.equal(await page.locator('[data-submit]').isEnabled(),true);
  await page.locator('[data-submit]').click(); assert.equal(await page.locator('[data-form-errors]').isVisible(),true);
  assert.equal(await page.locator('[data-form-errors]').evaluate(n=>n===document.activeElement),true);
  await page.goto(base+'/get-involved/collaborate/'); assert.equal(await page.locator('#involvement-collaborate-interest').inputValue(),'collaborate');
  const liveConfig=await page.request.get(base+'/api/config').then(r=>r.json());
  await page.waitForFunction(()=>!document.querySelector('[data-form-notice]').textContent.includes('Checking'));
  assert.equal(await page.locator('#involvement-collaborate-contact [data-submit]').isDisabled(),!liveConfig.emailReady);
  assert.match(await page.locator('#involvement-collaborate-contact [data-form-notice]').textContent(),liveConfig.emailReady?/sent to htafl@africamail.com/:/not configured/);
  // Keep the unavailable-state check isolated from live sending credentials.
  await page.route('**/api/config',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({emailReady:false,uploadsReady:true})}));
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#involvement-collaborate-contact [data-submit]').isDisabled(),true);
  assert.match(await page.locator('#involvement-collaborate-contact [data-form-notice]').textContent(),/not configured/);
  await page.unroute('**/api/config');
  await page.goto(base+'/'); await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.hero-atelier img').first().evaluate(n=>getComputedStyle(n).animationName),'none');
  const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.href).filter(href=>href.startsWith(location.origin)));
  for(const href of new Set(links))assert.ok((await page.request.get(href)).status()<400,href);
  assert.deepEqual(errors,[],'Browser errors');
  // Exercise real services with a mock mail transport and isolated private storage.
  const {createApp}=await import('../server/index.js');
  const os=require('node:os');
  const storage=fs.mkdtempSync(path.join(os.tmpdir(),'htafl-browser-test-'));
  const mails=[];
  const server=createApp({mailReady:true,storage,sendMail:async mail=>{mails.push(mail);}}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const testBase=`http://127.0.0.1:${server.address().port}`;
  try {
    await page.goto(testBase+'/get-involved/create/');
    await page.locator('#involvement-create-name').fill('Test designer');
    await page.locator('#involvement-create-email').fill('designer@example.com');
    await page.locator('#involvement-create-creativePractice').selectOption('fashion');
    await page.locator('#involvement-create-creativeGoal').selectOption('collaborate');await page.locator('#involvement-create-projectStage').selectOption('idea');
    await page.locator('#involvement-create-message').fill('I would like to collaborate on a textile project.');
    await page.locator('#involvement-create-consent').check();
    await page.locator('#involvement-create-contact [data-submit]').click();
    await page.waitForFunction(()=>document.querySelector('#involvement-create-contact [data-form-status]').textContent.includes('has been sent'));
    assert.equal(mails[0].to,'htafl@africamail.com'); assert.equal(await page.locator('#involvement-create-name').inputValue(),'');
    await page.goto(testBase+'/community/');
    await page.locator('#artwork-credit').fill('Test creator');
    await page.locator('#artwork-email').fill('creator@example.com');
    await page.locator('#artwork-title').fill('Test textile study');
    await page.locator('#artwork-category').selectOption('fashion');
    await page.locator('#artwork-description').fill('A textile study created for testing private review.');
    await page.locator('#artwork-alt').fill('A fabric surface with folded edges.');
    await page.locator('#artwork-artwork').setInputFiles(path.resolve('assets/photography/illustrative/illustrative-textiles-640.webp'));
    await page.locator('[data-upload-preview]').waitFor({state:'visible'});
    await page.locator('#artwork-rightsConsent').check(); await page.locator('#artwork-contactConsent').check();
    assert.equal(await page.locator('#artwork-publicationConsent').isChecked(),false);
    await page.locator('[data-submit]').click();
    await page.waitForFunction(()=>document.querySelector('[data-form-status]').textContent.includes('Reference:'));
    assert.equal((await page.request.get(testBase+'/api/community').then(r=>r.json())).entries.length,0);
    assert.equal(mails.length,2);
    await page.goto(testBase+'/get-involved/create/');
    await page.route('**/api/involvement',route=>route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({message:'Delivery failed. Please try again.',fields:{}})}));
    await page.locator('#involvement-create-name').fill('Keep my details');
    await page.locator('#involvement-create-email').fill('designer@example.com');
    await page.locator('#involvement-create-creativePractice').selectOption('fashion'); await page.locator('#involvement-create-creativeGoal').selectOption('collaborate');await page.locator('#involvement-create-projectStage').selectOption('idea');
    await page.locator('#involvement-create-message').fill('A message that should remain editable after failure.'); await page.locator('#involvement-create-consent').check();
    await page.locator('#involvement-create-contact [data-submit]').click(); await page.waitForFunction(()=>document.querySelector('#involvement-create-contact [data-form-status]').textContent.includes('Delivery failed'));
    assert.equal(await page.locator('#involvement-create-name').inputValue(),'Keep my details'); assert.equal(await page.locator('#involvement-create-contact [data-submit]').isEnabled(),true);
  } finally {
    await new Promise(resolve=>server.close(resolve)); fs.rmSync(storage,{recursive:true,force:true});
  }
  fs.writeFileSync('test-results/browser-qa.json',JSON.stringify({report,errors,checked:'mobile menu, scene keyboard/query, image dialog, resource filters, forms unavailable/validation, reduced motion, home links'},null,2));
  console.log(`Passed ${report.length} responsive page checks and interaction checks.`);
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
