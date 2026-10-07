const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
(async()=>{
  const {createEmailSetup}=await import('../server/email-setup.js');
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'htafl-launch-ui-'));
  const server=createEmailSetup({configFile:path.join(directory,'.env'),transportFactory:()=>({verify:async()=>true,close(){}})}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const width of [1440,390,320]){
      await page.setViewportSize({width,height:960});await page.goto(origin);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
      if(process.env.AXE_SCRIPT){await page.evaluate(fs.readFileSync(process.env.AXE_SCRIPT,'utf8'));const result=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id));assert.deepEqual(result,[]);}
    }
    await page.getByLabel('Gmail App Password',{exact:true}).fill('abcdefghijklmnop');await page.getByRole('button',{name:'Verify and save Gmail delivery'}).click();
    await page.waitForFunction(()=>document.querySelector('#setup-status').textContent.includes('verified'));
    assert.equal(await page.locator('#app-password').inputValue(),'');
    await page.getByLabel('New administrator passphrase',{exact:true}).fill('Private browser test passphrase');await page.getByLabel('Repeat passphrase',{exact:true}).fill('Private browser test passphrase');
    await page.getByRole('button',{name:'Save administrator and reviewer'}).click();await page.waitForFunction(()=>document.querySelector('#admin-setup-status').textContent.includes('saved privately'));
    assert.equal(await page.locator('#admin-password').inputValue(),'');assert.equal(await page.locator('#admin-confirmation').inputValue(),'');
    assert.equal(await page.locator('#admin-setup-status').evaluate(n=>n===document.activeElement),true);assert.deepEqual(errors,[]);
    console.log('Passed private setup layouts/accessibility, mock Gmail save, administrator/reviewer save, cleared secrets and keyboard status focus. No real credential or email used.');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));fs.rmSync(directory,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
