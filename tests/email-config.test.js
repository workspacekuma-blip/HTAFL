import test from 'node:test';
import assert from 'node:assert/strict';
import {emailAddress,smtpHost,emailConfigured,transportSettings} from '../server/email-config.js';

test('only the approved mailbox and provider enable sending, with required encrypted transport',()=>{
  const settings={SMTP_HOST:smtpHost,SMTP_USER:emailAddress,SMTP_FROM:emailAddress,SMTP_PASS:'test-only credential'};
  assert.equal(emailConfigured(settings),true);
  for(const change of [{SMTP_HOST:'smtp.other.example'},{SMTP_USER:'other@example.com'},{SMTP_FROM:'other@example.com'},{SMTP_PASS:''},{SMTP_PORT:'25'}])assert.equal(emailConfigured({...settings,...change}),false);
  const tls=transportSettings(settings);
  assert.equal(tls.host,'smtp.mail.com');assert.equal(tls.auth.user,'htafl@africamail.com');assert.equal(tls.secure,true);assert.equal(tls.requireTLS,true);
  const startTls=transportSettings({...settings,SMTP_PORT:'587'});
  assert.equal(startTls.secure,false);assert.equal(startTls.requireTLS,true);
});
