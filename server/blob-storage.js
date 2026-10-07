import {createHash,randomUUID} from 'node:crypto';
const fail=(message,status=503)=>Object.assign(Error(message),{status});
const hash=value=>createHash('sha256').update(value).digest('hex');
export function createBlobStorage(store){
  return {kind:'blob',store};
}
/* Conditional writes coordinate separate function instances; no process-local auth state. */
export class BlobState {
  constructor(store){this.store=store;}
  async update(key,change){
    for(let attempt=0;attempt<12;attempt++){
      const prior=await this.store.getWithMetadata(key,{type:'json',consistency:'strong'});
      if(prior && !prior.etag)throw fail('Protected storage could not verify a conditional write.');
      const next=change(prior?.data || null);
      const result=await this.store.setJSON(key,next,prior?{onlyIfMatch:prior.etag}:{onlyIfNew:true});
      if(result.modified)return next;
    }
    throw fail('This service is busy. Please retry.');
  }
  async getSession(key){
    const value=await this.store.get('session/'+key,{type:'json',consistency:'strong'});
    return value && value.expires>Date.now() && Date.now()-value.seen<=30*60000 && !value.revoked?value:null;
  }
  async touchSession(key){
    const result=await this.update('session/'+key,value=>value && !value.revoked && value.expires>Date.now() && Date.now()-value.seen<=30*60000?{...value,seen:Date.now()}: {revoked:true,expires:Date.now()});
    return result.revoked?null:result;
  }
  async setSession(key,value){await this.store.setJSON('session/'+key,value);}
  async deleteSession(key){await this.update('session/'+key,()=>({revoked:true,expires:Date.now()}));}
  async attempt(kind,ip){
    const now=Date.now();
    return this.update('limit/'+hash(kind+':'+ip),value=>!value || now-value.start>15*60000?{start:now,count:1,expires:now+15*60000}:{...value,count:value.count+1});
  }
  async lock(id){
    const key='lock/'+hash(id),token=randomUUID(),now=Date.now();
    const value=await this.update(key,prior=>prior && prior.expires>now?prior:{token,expires:now+90000});
    if(value.token!==token)return null;
    return ()=>this.update(key,prior=>prior?.token===token?{token:null,expires:0}:prior);
  }
}
