/* Homepage textile study. Local CC0 Microsoft/Khronos mesh; no framework or GL loader.
   Material maps and geometry are documented in assets/materials/sheen-cloth/manifest.json. */
(() => {
  'use strict';
  const stage=document.querySelector('[data-fashion-cloth]');
  if(!stage)return;
  const base=new URL('../assets/materials/sheen-cloth/',document.currentScript.src);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const forced=matchMedia('(forced-colors: active)');
  const pointer=matchMedia('(min-width: 75rem) and (hover: hover) and (pointer: fine)');
  const limited=navigator.connection?.saveData || navigator.deviceMemory<=2;
  let visible=false,away=false,failed=false,loading=false,renderer,frame=0,sizeDirty=true;
  let x=0,y=0,tx=0,ty=0;
  stage.dataset.clothState='fallback';
  const enabled=()=>visible && !away && !document.hidden && !motion.matches && !forced.matches && !failed;
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};
  const fallback=()=>{stop();stage.dataset.clothState='fallback';};
  const schedule=()=>{if(enabled() && renderer && !frame)frame=requestAnimationFrame(render);};
  const shaderSource={
    vertex:`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec2 aUV;attribute vec4 aTangent;
      uniform vec2 uRotation;uniform float uAspect;varying vec3 vNormal;varying vec3 vTangent;varying float vHand;varying vec2 vUV;
      void main(){float a=-.88+uRotation.y,b=-.35+uRotation.x;
        mat3 rx=mat3(1.,0.,0.,0.,cos(a),sin(a),0.,-sin(a),cos(a));
        mat3 ry=mat3(cos(b),0.,-sin(b),0.,1.,0.,sin(b),0.,cos(b));mat3 r=rx*ry;
        vec3 p=r*aPosition;p.z-=4.;
        gl_Position=vec4(p.x/(uAspect*.40),p.y/.40,-1.01*p.z-.201,-p.z);
        vNormal=r*aNormal;vTangent=r*aTangent.xyz;vHand=aTangent.w;vUV=aUV*vec2(30.,-30.);}`,
    fragment:`precision mediump float;uniform sampler2D uBase;uniform sampler2D uNormal;uniform sampler2D uSheen;uniform vec3 uTint;
      varying vec3 vNormal;varying vec3 vTangent;varying float vHand;varying vec2 vUV;
      void main(){vec3 n=normalize(vNormal),t=normalize(vTangent-n*dot(n,vTangent)),b=cross(n,t)*vHand;
        vec3 grain=texture2D(uNormal,vUV).xyz*2.-1.;grain.xy*=.28;n=normalize(mat3(t,b,n)*grain);
        if(!gl_FrontFacing)n=-n;vec3 light=normalize(vec3(-.4,.8,1.));
        float diffuse=max(dot(n,light),0.);vec4 sheen=texture2D(uSheen,vUV);
        float highlight=pow(max(dot(n,normalize(light+vec3(0.,0.,1.))),0.),mix(22.,7.,sheen.a))*.065;
        float weave=dot(texture2D(uBase,vUV).rgb,vec3(.21,.72,.07));
        gl_FragColor=vec4(uTint*(.38+.62*diffuse)*(.82+weave*.26)+vec3(highlight),1.);}`
  };
  function compile(gl,type,source){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw Error('Shader unavailable');}return shader;
  }
  const loadImage=url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=url;});
  async function initialize(){
    if(loading || renderer || failed || limited || !enabled() || location.protocol==='file:')return;
    loading=true;
    const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.tabIndex=-1;
    let gl,program,vbo,ibo,textures=[];
    try{
      gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power',depth:true,preserveDrawingBuffer:false});
      if(!gl)throw Error('WebGL unavailable');
      // Fetch only after the stage enters the viewport and WebGL is available.
      const urls=['technicalFabricSmall_basecolor_256.webp','technicalFabricSmall_normal_256.webp','technicalFabricSmall_sheen_256.webp'];
      const results=await Promise.allSettled([fetch(new URL('cloth-mesh.json',base)).then(r=>{if(!r.ok)throw Error();return r.json();}),...urls.map(url=>loadImage(new URL(url,base)))]);
      if(results.some(r=>r.status!=='fulfilled'))throw Error('Material unavailable');
      const mesh=results[0].value;
      if(mesh.encoding!=='base64' || typeof mesh.data!=='string' || mesh.data.length>134000)throw Error('Invalid mesh');
      const data=Uint8Array.from(atob(mesh.data),character=>character.charCodeAt(0)).buffer;
      if(data.byteLength!==99888)throw Error('Invalid mesh');
      const vs=compile(gl,gl.VERTEX_SHADER,shaderSource.vertex),fs=compile(gl,gl.FRAGMENT_SHADER,shaderSource.fragment);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Program unavailable');
      gl.useProgram(program);
      vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(data,0,80688),gl.STATIC_DRAW);
      for(const [name,count,offset] of [['aPosition',3,0],['aNormal',3,12],['aUV',2,24],['aTangent',4,32]]){
        const attribute=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,count,gl.FLOAT,false,48,offset);
      }
      ibo=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(data,80688,9600),gl.STATIC_DRAW);
      results.slice(1).forEach((result,index)=>{
        const texture=gl.createTexture();textures.push(texture);gl.activeTexture(gl.TEXTURE0+index);gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,result.value);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(gl.getUniformLocation(program,['uBase','uNormal','uSheen'][index]),index);
      });
      const token=getComputedStyle(document.documentElement).getPropertyValue('--htafl-paper').trim();
      const color=/^#[\da-f]{6}$/i.test(token)?[1,3,5].map(i=>parseInt(token.slice(i,i+2),16)/255):[.97,.96,.93];
      gl.uniform3fv(gl.getUniformLocation(program,'uTint'),color);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
      renderer={canvas,gl,program,vbo,ibo,textures,rotation:gl.getUniformLocation(program,'uRotation'),aspect:gl.getUniformLocation(program,'uAspect')};
      canvas.addEventListener('webglcontextlost',()=>{failed=true;fallback();});
      stage.prepend(canvas);sizeDirty=true;schedule();
    }catch{
      failed=true;fallback();
      if(gl){if(program)gl.deleteProgram(program);if(vbo)gl.deleteBuffer(vbo);if(ibo)gl.deleteBuffer(ibo);textures.forEach(texture=>gl.deleteTexture(texture));}
    }finally{loading=false;}
  }
  function render(){
    frame=0;if(!enabled() || !renderer)return;
    const {canvas,gl,rotation,aspect}=renderer;
    if(sizeDirty){
      const rect=stage.getBoundingClientRect();if(!rect.width || !rect.height)return;
      const mobile=innerWidth<1200,dpr=Math.min(devicePixelRatio||1,mobile?1:1.5,Math.sqrt(350000/(rect.width*rect.height)));
      canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));
      gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(aspect,rect.width/rect.height);sizeDirty=false;
    }
    x+=(tx-x)*.16;y+=(ty-y)*.16;gl.uniform2f(rotation,x,y);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,9600,gl.UNSIGNED_SHORT,0);
    stage.dataset.clothState='ready';
    // No idle loop: rendering stops once the restrained pointer/scroll response settles.
    if(Math.abs(tx-x)+Math.abs(ty-y)>.0002)schedule();
  }
  const enter=entries=>{visible=entries[0].isIntersecting;if(visible){initialize();schedule();}else stop();};
  if('IntersectionObserver' in window)new IntersectionObserver(enter,{threshold:.01}).observe(stage);
  else{visible=true;initialize();}
  if('ResizeObserver' in window)new ResizeObserver(()=>{sizeDirty=true;schedule();}).observe(stage);
  else window.addEventListener('resize',()=>{sizeDirty=true;schedule();},{passive:true});
  stage.addEventListener('pointermove',event=>{
    if(!enabled() || !pointer.matches)return;
    const rect=stage.getBoundingClientRect();tx=Math.max(-.09,Math.min(.09,((event.clientX-rect.left)/rect.width-.5)*.18));schedule();
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{tx=0;schedule();},{passive:true});
  window.addEventListener('scroll',()=>{
    if(!enabled())return;ty=pointer.matches?Math.max(-.035,Math.min(.035,(stage.getBoundingClientRect().top/innerHeight-.35)*.035)):0;schedule();
  },{passive:true});
  const preferences=()=>{stop();tx=ty=x=y=0;if(enabled()){sizeDirty=true;initialize();schedule();}else fallback();};
  motion.addEventListener('change',preferences);forced.addEventListener('change',preferences);pointer.addEventListener('change',preferences);
  document.addEventListener('visibilitychange',preferences);
  window.addEventListener('pagehide',()=>{away=true;stop();});window.addEventListener('pageshow',()=>{away=false;preferences();});
})();
