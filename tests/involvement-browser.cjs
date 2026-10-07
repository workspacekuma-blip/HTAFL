const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
(async()=>{
  const {createApp}=await import('../server/index.js');
  const {pathways}=await import('../server/involvement.js');
  const storage=fs.mkdtempSync(path.join(os.tmpdir(),'htafl-pathway-browser-')),sent=[];
  const server=createApp({storage,mailReady:true,sendMail:async mail=>sent.push(mail),rateLimit:30}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(origin+'/',{waitUntil:'networkidle'});
    await page.getByRole('link',{name:'Join HTAFL',exact:true}).click();
    assert.equal(new URL(page.url()).pathname,'/get-involved/');
    assert.equal(await page.locator('form,input,textarea,select').count(),0);
    for(const width of [1440,768,390,320]){
      await page.setViewportSize({width,height:960});
      for(const key of Object.keys(pathways)){
        await page.goto(`${origin}/get-involved/${key}/`,{waitUntil:'networkidle'});
        assert.equal(await page.locator(`#involvement-${key}-contact`).isVisible(),true);
        assert.equal(await page.locator('form').count(),1);
        assert.equal(await page.locator('[data-involvement-pathway]').count(),0,'Choice list is separate from the questionnaire');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${key} @ ${width}`);
        if(width===390 && process.env.AXE_SCRIPT){
          await page.evaluate(fs.readFileSync(process.env.AXE_SCRIPT,'utf8'));
          const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
          assert.deepEqual(violations,[],key);
        }
      }
    }
    for(const [key,schema] of Object.entries(pathways)) {
      await page.goto(`${origin}/get-involved/${key}/`);
      const form=page.locator(`#involvement-${key}-contact`);
      await form.locator('[data-submit]').click();await form.locator('[data-form-errors]').waitFor({state:'visible'});
      assert.equal(await form.locator('[data-form-errors]').evaluate(n=>n===document.activeElement),true);
      for(const field of schema.fields){
        const control=form.locator(`[name="${field.name}"]`);
        if(field.type==='select')await control.selectOption(field.options[0][0]);
        else await control.fill(field.name==='email'?'person@example.com':field.type==='url'?'https://example.com/studio':field.name==='name'?'Test contributor':'A thoughtful contribution for this test workflow.');
      }
      await form.locator('[name=adultConsent]').check(); await form.locator('[name=consent]').check();await form.locator('[data-submit]').click();
      await page.waitForFunction(k=>document.querySelector(`#involvement-${k}-contact [data-form-status]`).textContent.includes('has been sent'),key);
      assert.ok(sent.at(-1).subject.endsWith(key));
    }
    for(const width of [1440,768,390,320]){
      await page.setViewportSize({width,height:960});await page.goto(origin+'/get-involved/');
      assert.equal(await page.locator('form,input,textarea,select').count(),0);
      assert.equal(await page.locator('[data-involvement-pathway]').count(),5);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    }
    await page.locator('[data-involvement-pathway=collaborate]').focus();await Promise.all([page.waitForURL('**/get-involved/collaborate/'),page.keyboard.press('Enter')]);
    assert.match(page.url(),/get-involved\/collaborate\//);
    assert.equal(await page.locator('form').count(),1);
    await page.goBack();assert.equal(await page.locator('form').count(),0);
    await page.goto(origin+'/get-involved/?interest=create#involvement-form');
    assert.match(page.url(),/get-involved\/create\//);
    await page.goto(origin+'/get-involved/#support-payment');
    await page.waitForURL('**/get-involved/support/#support-payment');
    assert.equal(await page.locator('#involvement-support-contact').isVisible(),true);
    const contributions=page.locator('[data-support-contributions]');
    assert.equal(await contributions.locator('article').count(),2);
    assert.equal(await page.locator('#support-bank-account').textContent(),'0473372177');
    assert.match(await contributions.textContent(),/GT Bank/);
    assert.match(await contributions.textContent(),/Ekuma Billclinton/);
    assert.match(await contributions.textContent(),/Naira/);
    assert.match(await contributions.textContent(),/Wallet details coming soon/);
    assert.equal(await page.locator('#support-crypto-address').count(),0);
    assert.doesNotMatch(await page.content(),/stripe/i);
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedAccount=value;}}}));
    const copy=page.getByRole('button',{name:'Copy account number'});
    await copy.focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('[data-copy-status]').textContent==='Account number copied.');
    assert.equal(await page.evaluate(()=>window.copiedAccount),'0473372177');
    assert.equal(await copy.evaluate(n=>n===document.activeElement),true);
    await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('Permission denied');};});
    await copy.click();
    await page.waitForFunction(()=>document.querySelector('[data-copy-status]').textContent.includes('Select and copy'));
    assert.equal(await copy.isEnabled(),true);
    await page.route('**/api/config',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({emailReady:false,uploadsReady:true})}));
    await page.goto(origin+'/get-involved/support/');
    assert.equal(await page.locator('#support-bank-account').textContent(),'0473372177','Bank details remain readable independently of email delivery');
    assert.equal(await page.locator('#involvement-support-contact [data-submit]').isDisabled(),true);
    const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(origin+'/get-involved/');
    assert.equal(await nojs.locator('form').count(),0);
    await nojs.locator('[data-involvement-pathway=create]').click();
    assert.equal(await nojs.locator('form').count(),1);
    assert.equal(await nojs.locator('#involvement-create-name').isDisabled(),true);
    const privacy=new URL(await nojs.locator('a.text-link').filter({hasText:'Privacy Notice'}).getAttribute('href'),nojs.url());
    assert.equal(privacy.pathname,'/privacy/');
    assert.equal((await nojs.request.get(privacy.href)).status(),200);
    await nojs.goto(origin+'/get-involved/support/');
    assert.equal(await nojs.locator('#support-bank-account').textContent(),'0473372177');
    assert.equal(await nojs.getByRole('button',{name:'Copy account number'}).isVisible(),false);
    assert.match(await nojs.locator('[data-support-contributions]').textContent(),/Wallet details coming soon/);
    assert.deepEqual(errors,[]);
    console.log('Passed 24 pathway/index layout checks, 5 separate-form mock submissions, accessibility, keyboard routing/history, legacy links, bank details with/without JavaScript, pending crypto, and copy success/failure/focus. No transfer or real email was made.');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(storage,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
