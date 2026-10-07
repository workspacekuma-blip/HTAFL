import serverless from 'serverless-http';
import {createApp} from './index.js';
/* Keep Express validation/review logic; adapt modern Fetch requests at the platform boundary. */
export function createApiHandler(options={}){
  const app=createApp({...options,apiOnly:true,secureCookies:true,trustProxy:1,maxUploadBytes:3*1024*1024});
  const invoke=serverless(app,{binary:['image/webp']});
  return async(request,context={})=>{
    const url=new URL(request.url),headers=Object.fromEntries(request.headers);
    // Trust platform context, never caller-supplied proxy/IP headers.
    for(const key of Object.keys(headers))if(key.startsWith('x-forwarded-') || key==='forwarded')delete headers[key];
    headers.host=url.host;headers['x-forwarded-proto']=url.protocol.slice(0,-1);
    headers['x-forwarded-for']=context.ip || '127.0.0.1';
    const bytes=Buffer.from(await request.arrayBuffer());
    if(bytes.length>3*1024*1024+32768)return Response.json({message:'Choose one image no larger than 3 MB.'},{status:413});
    const result=await invoke({version:'2.0',rawPath:url.pathname,rawQueryString:url.search.slice(1),headers,
      requestContext:{http:{method:request.method,sourceIp:context.ip || '127.0.0.1'}},body:bytes.toString('base64'),isBase64Encoded:true},{});
    const responseHeaders=new Headers(result.headers);
    for(const [name,values] of Object.entries(result.multiValueHeaders || {}))for(const value of values)responseHeaders.append(name,value);
    for(const cookie of result.cookies || [])responseHeaders.append('set-cookie',cookie);
    const body=result.isBase64Encoded?Buffer.from(result.body,'base64'):result.body;
    return new Response(request.method==='HEAD' || result.statusCode===204?null:body,{status:result.statusCode,headers:responseHeaders});
  };
}
