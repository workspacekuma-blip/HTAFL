/* Native WebGL installation: visible preview drift, event-driven entered views. */
(() => {
  'use strict';
  const namespace = window.HTAFLWorld;
  const mix = (a,b,t) => a.map((v,i) => v+(b[i]-v)*t);
  const smooth = t => t*t*t*(t*(t*6-15)+10);
  const dot = (a,b) => a.reduce((s,v,i) => s+v*b[i],0);
  const unit = v => { const n=Math.hypot(...v)||1; return v.map(x=>x/n); };
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function camera(eye,target,aspect,mobile) {
    const z=unit(eye.map((v,i)=>v-target[i])),x=unit(cross([0,1,0],z)),y=cross(z,x);
    const view=[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
    const near=.12,far=115,f=1/Math.tan((mobile?70:58)*Math.PI/360);
    const perspective=[f/aspect,0,0,0,0,f,0,0,mobile?0:-.16,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
    const matrix=new Float32Array(16);
    for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)matrix[col*4+row]+=perspective[k*4+row]*view[col*4+k];
    return matrix;
  }
  const vertexSource=`
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;
    attribute float aId;
    uniform mat4 uCamera;
    uniform vec2 uObject;
    uniform vec2 uPrevious;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vId;
    void main() {
      vec3 position=aPosition;
      float selected=1.-step(.1,abs(aId-uObject.x));
      float previous=1.-step(.1,abs(aId-uPrevious.x));
      position+=vec3(0.,.16,.12)*(selected*uObject.y+previous*uPrevious.y);
      gl_Position=uCamera*vec4(position,1.);
      vNormal=aNormal;vColor=aColor;vPosition=position;vId=aId;
    }
  `;
  const fragmentSource=`
    precision mediump float;
    uniform vec3 uPaper;
    uniform vec3 uInk;
    uniform vec3 uEye;
    uniform vec3 uLighting;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vId;
    void main() {
      float line=1.-step(.1,length(vNormal));
      vec3 normal=normalize(vNormal+vec3(0.,.0001,0.));
      normal*=gl_FrontFacing?1.:-1.;
      vec3 light=normalize(vec3(-.62,1.,.42));
      float key=max(dot(normal,light),0.);
      float fill=max(dot(normal,normalize(vec3(.8,.35,-.6))),0.);
      vec3 view=normalize(uEye-vPosition);
      float satin=pow(max(dot(normal,normalize(light+view)),0.),vId==2.?12.:30.);
      float rim=pow(1.-max(dot(normal,view),0.),3.)*key;
      vec3 color=vColor*mix(uLighting.x+uLighting.y*key+uLighting.z*fill,1.,line);
      color+=uPaper*(satin*.07+rim*.025)*(1.-line);
      // Subtle surface variation remains procedural and uses no texture maps.
      float grain=fract(sin(dot(vPosition.xz,vec2(17.13,91.7)))*413.71)-.5;
      color*=1.+grain*.009*(1.-line);
      if(vPosition.y<.05 && normal.y>.9 && line<.5) {
        float a=length(vPosition.xz-vec2(-12.,1.));
        float b=length(vPosition.xz-vec2(0.,-2.));
        float c=length(vPosition.xz-vec2(12.,-.5));
        float contact=(exp(-a*a*.12)+exp(-b*b*.12)+exp(-c*c*.12))*.065;
        color=mix(color,uInk,contact);
      }
      float fog=smoothstep(22.,65.,distance(uEye,vPosition))*.7;
      gl_FragColor=vec4(mix(color,uPaper,fog),1.);
    }
  `;

  namespace.Scene=class Scene {
    constructor(host,source,options) {
      this.options=options;this.canvas=document.createElement('canvas');
      this.canvas.setAttribute('aria-hidden','true');this.canvas.setAttribute('role','presentation');
      this.canvas.className='immersive-canvas';this.buffers=[];this.frame=0;this.active=true;
      this.mobile=options.mobile();this.index=-1;this.preview=true;this.clock=0;this.focusId=-1;this.focus=0;this.focusTo=0;
      this.previous={id:-1,lift:0};this.parallax=[0,0];this.pointer=[0,0];this.last=0;
      this.gl=this.canvas.getContext('webgl',{alpha:false,antialias:!options.limited,depth:true,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
      if(!this.gl)throw new Error('WebGL unavailable');
      const gl=this.gl;
      try {
        const shaders=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((type,i)=> {
          const shader=gl.createShader(type);if(!shader)throw new Error('Shader allocation failed');
          gl.shaderSource(shader,i?fragmentSource:vertexSource);gl.compileShader(shader);return shader;
        });
        this.program=gl.createProgram();if(!this.program){shaders.forEach(s=>gl.deleteShader(s));throw new Error('Program allocation failed');}
        shaders.forEach(shader=>{gl.attachShader(this.program,shader);gl.deleteShader(shader);});
        gl.bindAttribLocation(this.program,0,'aPosition');gl.linkProgram(this.program);
        if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error('Shader link failed');
        gl.useProgram(this.program);
        this.attributes=['aPosition','aNormal','aColor','aId'].map(n=>gl.getAttribLocation(this.program,n));
        this.uniforms=Object.fromEntries(['uCamera','uObject','uPrevious','uPaper','uInk','uEye','uLighting'].map(n=>[n,gl.getUniformLocation(this.program,n)]));
        const tokens=getComputedStyle(document.documentElement),palette={};
        ['paper','ink','cobalt','coral','mist','white'].forEach(name=>{const hex=tokens.getPropertyValue('--htafl-'+name).trim().slice(1);palette[name]=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255);});
        const geometry=namespace.build(palette,this.mobile||options.limited,source);
        [geometry.solid,geometry.lines].forEach((vertices,i)=>{
          const buffer=gl.createBuffer();if(!buffer)throw new Error('Buffer allocation failed');
          this.buffers.push({buffer,count:vertices.length/10,mode:i?gl.LINES:gl.TRIANGLES});
          gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        });
        if(gl.getError()!==gl.NO_ERROR)throw new Error('Geometry allocation failed');
        this.attributes.forEach(a=>gl.enableVertexAttribArray(a));gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
        gl.uniform3fv(this.uniforms.uPaper,palette.paper);gl.uniform3fv(this.uniforms.uInk,palette.ink);
        gl.clearColor(...palette.paper,1);
        this.canvas.addEventListener('webglcontextlost',()=>{if(!this.disposed)options.failure();},{once:true});
        host.prepend(this.canvas);this.resize();
        this.position=this.view(-1).eye;this.target=this.view(-1).target;this.lighting=this.view(-1).light;
      } catch(error){this.dispose();throw error;}
    }
    view(index) {
      if(index<0)return {eye:[-10.8,2.3,this.mobile?12:10.8],target:[-12,2,-4.5],light:[.4,.59,.15]};
      const x=namespace.worlds[index].x,views=[
        {eye:[x+1.2,1.9,this.mobile?7.3:5.8],target:[x-.3,1.75,-4.5],light:[.36,.62,.17]},
        {eye:[x+1.7,2,this.mobile?7.6:5.8],target:[x-.5,2.3,-4.6],light:[.49,.55,.15]},
        {eye:[x+1.8,2.1,this.mobile?7.5:5.8],target:[x-.3,2.1,-4.5],light:[.6,.43,.17]},
      ];return views[index];
    }
    staticView(index) {
      const view=this.view(index);this.index=index;this.position=view.eye;this.target=view.target;this.lighting=view.light;this.transition=null;this.preview=false;this.draw(performance.now());
    }
    go(index,done=()=>{}) {
      const outside=this.index<0&&index>0,view=this.view(index);this.index=index;this.pointer=[0,0];this.parallax=[0,0];this.focusTo=0;
      if(this.options.reduced()){this.position=view.eye;this.target=view.target;this.lighting=view.light;this.transition=null;this.project(camera(view.eye,view.target,this.width/this.height,this.mobile));done();this.request();return;}
      this.transition={from:[...this.position],look:[...this.target],light:[...this.lighting],to:view.eye,target:view.target,toLight:view.light,via:outside?[view.eye[0],2.3,this.mobile?12:10.8]:null,elapsed:0,duration:this.mobile?1200:1600,done};
      this.request();
    }
    select(id){if(id&&id!==this.focusId){this.previous={id:this.focusId,lift:this.focus};this.focusId=id;this.focus=0;}this.focusTo=id?1:0;this.request();}
    point(x,y){if(this.mobile||this.options.reduced())return;this.pointer=[x*.3,y*.14];this.request();}
    setPreview(value){this.preview=value;this.request();}
    resize() {
      this.mobile=this.options.mobile();const bounds=this.canvas.getBoundingClientRect();
      this.width=Math.max(1,bounds.width);this.height=Math.max(1,bounds.height);this.needsResize=false;
      // Both device-class DPR and a total pixel budget protect high-DPI mobile GPUs.
      const cap=this.mobile||this.options.limited?1.15:1.5;
      const dpr=Math.min(devicePixelRatio||1,cap,Math.sqrt((this.mobile?400000:1100000)/(this.width*this.height)));
      const width=Math.max(1,Math.round(this.width*dpr)),height=Math.max(1,Math.round(this.height*dpr));
      if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;this.gl.viewport(0,0,width,height);}
    }
    invalidate(){this.needsResize=true;this.request();}
    motionChange(){this.pointer=[0,0];this.parallax=[0,0];if(this.transition&&this.options.reduced())this.go(this.index,this.transition.done);else this.request();}
    request(){if(this.active&&!this.frame)this.frame=requestAnimationFrame(now=>this.draw(now));}
    pause(){this.active=false;cancelAnimationFrame(this.frame);this.frame=0;this.last=0;}
    resume(){if(this.disposed)return;this.active=true;this.last=0;this.request();}
    draw(now) {
      this.frame=0;if(!this.active||this.disposed)return;
      const fps=this.preview?(this.mobile||this.options.limited?12:18):(this.mobile||this.options.limited?20:30),interval=1000/fps;
      if(this.last&&now-this.last<interval-1){this.frame=requestAnimationFrame(t=>this.draw(t));return;}
      const elapsed=this.last?now-this.last:interval,delta=Math.min(elapsed,80);this.last=now;
      if(this.needsResize)this.resize();
      let done;
      if(this.transition) {
        const t=this.transition; t.elapsed+=elapsed;
        const progress=t.duration?Math.min(1,t.elapsed/t.duration):1,ease=smooth(progress);
        this.position=t.via?(progress<.5?mix(t.from,t.via,smooth(progress*2)):mix(t.via,t.to,smooth((progress-.5)*2))):mix(t.from,t.to,ease);this.target=mix(t.look,t.target,ease);
        this.lighting=mix(t.light,t.toLight,ease);
        this.position[1]+=Math.sin(progress*Math.PI)*(this.mobile ? .12 : .28);
        this.position[2]+=Math.sin(progress*Math.PI)*(this.mobile ? .12 : .3);
        if(progress===1){done=t.done;this.transition=null;}
      }
      const ease=this.options.reduced()?1:1-Math.exp(-delta*.018);
      this.focus+=(this.focusTo-this.focus)*ease;
      this.previous.lift*=1-ease;
      this.parallax=mix(this.parallax,this.pointer,ease);
      this.clock+=delta/1000;
      const drift=this.preview&&!this.options.reduced()?(this.mobile ? .06 : .16):0;
      const eye=[this.position[0]+this.parallax[0]+Math.sin(this.clock*.28)*drift,this.position[1]+this.parallax[1]+Math.sin(this.clock*.21)*drift*.45,this.position[2]+Math.sin(this.clock*.16)*drift];
      const matrix=camera(eye,this.target,this.width/this.height,this.mobile),gl=this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(this.uniforms.uCamera,false,matrix);
      gl.uniform2f(this.uniforms.uObject,this.focusId,this.focus);gl.uniform3fv(this.uniforms.uEye,eye);
      gl.uniform2f(this.uniforms.uPrevious,this.previous.id,this.previous.lift);
      gl.uniform3fv(this.uniforms.uLighting,this.lighting);
      this.buffers.forEach(({buffer,count,mode})=> {
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        this.attributes.forEach((a,i)=>gl.vertexAttribPointer(a,i===3?1:3,gl.FLOAT,false,40,i*12));
        gl.drawArrays(mode,0,count);
      });
      this.project(matrix);
      done?.();
      if((this.preview&&!this.options.reduced())||this.transition||Math.abs(this.focus-this.focusTo)>.001||this.previous.lift>.001||this.parallax.some((v,i)=>Math.abs(v-this.pointer[i])>.0001))this.frame=requestAnimationFrame(t=>this.draw(t));
      else this.last=0;
    }
    project(matrix) {
      this.options.project(point=> {
        const p=[...point,1],clip=[0,0,0,0];
        for(let row=0;row<4;row++)for(let col=0;col<4;col++)clip[row]+=matrix[col*4+row]*p[col];
        return {x:(clip[0]/clip[3]*.5+.5)*100,y:(-.5*clip[1]/clip[3]+.5)*100,visible:clip[3]>.12&&Math.abs(clip[0]/clip[3])<1.1&&Math.abs(clip[1]/clip[3])<1.1};
      });
    }
    dispose() {
      if(this.disposed)return;this.disposed=true;this.pause();
      this.buffers.forEach(({buffer})=>this.gl?.deleteBuffer(buffer));if(this.program)this.gl.deleteProgram(this.program);
      this.canvas.remove();
      if(this.gl&&!this.gl.isContextLost())this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  };
})();
