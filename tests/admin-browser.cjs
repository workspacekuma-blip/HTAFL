/* Local browser QA with isolated storage and mock email. No real work is published. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
(async()=>{
  const {createApp}=await import('../server/index.js');
  const {hashPassword}=await import('../server/password.js');
  const storage=fs.mkdtempSync(path.join(os.tmpdir(),'htafl-admin-browser-'));
  const password='Browser-test private administrator passphrase';
  const adminHash=await hashPassword(password);
  const server=createApp({storage,adminHash,adminUsername:'test-reviewer',secureCookies:false,mailReady:false}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const record=new FormData();
    Object.entries({credit:'Test-only textile creator',email:'private@example.com',title:'Consent-approved browser fixture',category:'fashion',description:'A work created only to test the private review dashboard.',alt:'Illustrative textile material used as a test fixture.',rightsConsent:'true',contactConsent:'true',adultConsent:'true',publicationConsent:'true'}).forEach(([key,value])=>record.set(key,value));
    record.set('artwork',new Blob([fs.readFileSync('assets/photography/illustrative/illustrative-textiles-640.webp')],{type:'image/webp'}),'fixture.webp');
    const upload=await fetch(origin+'/api/community/submissions',{method:'POST',headers:{Origin:origin},body:record});assert.equal(upload.status,201);
    const {id}=await upload.json();
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(origin+'/admin/',{waitUntil:'networkidle'});
    await page.locator('#username').fill('test-reviewer');await page.locator('#password').fill(password);
    await page.getByRole('button',{name:'Sign in',exact:true}).click();
    await page.locator('.review-work').waitFor();
    assert.equal(await page.locator('body').textContent().then(text=>text.includes('private@example.com')),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    if(process.env.AXE_SCRIPT){
      await page.evaluate(fs.readFileSync(process.env.AXE_SCRIPT,'utf8'));
      const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
      assert.deepEqual(violations,[]);
    }
    await page.getByRole('button',{name:'Approve publication'}).click();
    await page.locator('#confirm-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button',{name:'Approve publication'}).evaluate(n=>n===document.activeElement),true);
    await page.getByRole('button',{name:'Approve publication'}).click();await page.getByRole('button',{name:'Publish work',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#admin-status').textContent.includes('now visible'));
    assert.equal((await fetch(origin+'/api/community').then(r=>r.json())).entries.length,1);
    await page.locator('#review-filter').selectOption('approved');await page.locator('.review-work').waitFor();
    await page.getByRole('button',{name:'Withdraw and delete'}).click();await page.getByRole('button',{name:'Delete work',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#admin-status').textContent.includes('removed'));
    assert.equal((await fetch(origin+'/api/community').then(r=>r.json())).entries.length,0);
    assert.equal(fs.existsSync(path.join(storage,id+'.json')),false);
    await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.locator('#login-form').waitFor();
    assert.equal(await page.locator('body').textContent().then(text=>text.includes('private@example.com')),false);
    assert.equal((await page.request.get(origin+'/admin/api/submissions')).status(),401);
    await page.goto((process.env.QA_ORIGIN || 'http://localhost:3128')+'/');
    assert.equal(await page.locator('site-footer a[href="https://www.instagram.com/htaflco/"]').count(),1);
    assert.equal(await page.locator('site-footer a[href="https://www.instagram.com/htaflco/"] img').isVisible(),true);
    await page.locator('.site-menu-toggle').click();assert.equal(await page.locator('.site-menu a[href="https://www.instagram.com/htaflco/"]').count(),0);await page.keyboard.press('Escape');
    assert.deepEqual(errors,[]);
    console.log('Passed private login, mobile layout/accessibility, confirmation focus, approve/withdraw, logout privacy and Instagram checks.');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(storage,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
