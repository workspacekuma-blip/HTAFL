import {getStore} from '@netlify/blobs';
import {createApiHandler} from '../../server/netlify-api.js';
import {createBlobStorage,BlobState} from '../../server/blob-storage.js';
export default async(request,context)=>{
  try{
    const production=context.deploy.context==='production';
    const namespace=production?'production':`preview-${context.deploy.id}`;
    const origin=process.env.PUBLIC_ORIGIN || context.site.url;
    const url=new URL(origin);
    if(url.protocol!=='https:' || url.origin!==origin)return Response.json({message:'The public HTTPS origin has not been configured correctly.'},{status:503});
    const storage=createBlobStorage(getStore({name:`htafl-community-${namespace}`,consistency:'strong'}));
    const state=new BlobState(getStore({name:`htafl-access-${namespace}`,consistency:'strong'}));
    // Preview work stays separate and never sends production mail.
    const run=createApiHandler({storage,state,publicOrigin:production?origin:new URL(request.url).origin,...(!production?{mailReady:false}:{})});
    return await run(request,context);
  }catch{return Response.json({message:'The service is temporarily unavailable. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});}
};
export const config={path:['/api/*','/admin/api/*','/healthz']};
