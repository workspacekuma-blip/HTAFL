import test from 'node:test';
import assert from 'node:assert/strict';
import {createApiHandler} from '../server/netlify-api.js';
import {BlobState,createBlobStorage} from '../server/blob-storage.js';
import {hashPassword} from '../server/password.js';
class Store {
  data=new Map();sequence=0;
  async get(key){const v=this.data.get(key);return v?JSON.parse(v.data):null;}
  async getWithMetadata(key){const v=this.data.get(key);return v?{data:JSON.parse(v.data),etag:v.etag}:null;}
  async setJSON(key,value,options={}){const prior=this.data.get(key);if(options.onlyIfNew && prior || options.onlyIfMatch && prior?.etag!==options.onlyIfMatch)return {modified:false};const etag=String(++this.sequence);this.data.set(key,{data:JSON.stringify(value),etag});return {modified:true,etag};}
}
test('modern function adapter preserves secure sign-in, cross-instance sessions and logout',async()=>{
  const store=new Store(),password='Netlify function test passphrase',adminHash=await hashPassword(password);
  const options={storage:createBlobStorage(store),state:new BlobState(store),adminHash,adminUsername:'reviewer',mailReady:false,publicOrigin:'https://test.netlify.app'};
  const first=createApiHandler(options),second=createApiHandler({...options,state:new BlobState(store)});
  const context={ip:'198.51.100.10'};
  const call=(handler,path,body,headers={})=>handler(new Request('https://test.netlify.app'+path,{method:body?'POST':'GET',headers:{Origin:'https://test.netlify.app','Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})}),context);
  const login=await call(first,'/admin/api/login',{username:'reviewer',password});assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie');assert.match(cookie,/Secure/);assert.match(cookie,/HttpOnly/);
  const token=await login.json();const headers={Cookie:cookie.split(';')[0],'X-CSRF-Token':token.csrf};
  const active=await call(second,'/admin/api/session',null,headers);assert.equal((await active.json()).authenticated,true);
  assert.equal((await call(second,'/admin/api/logout',{},headers)).status,200);
  assert.equal((await call(first,'/admin/api/session',null,headers).then(r=>r.json())).authenticated,false);
  assert.equal((await call(first,'/admin/api/login',{username:'reviewer',password},{Origin:'https://foreign.example'})).status,403);
  const config=await call(first,'/api/config').then(r=>r.json());assert.equal(config.maxUploadBytes,3*1024*1024);
});
