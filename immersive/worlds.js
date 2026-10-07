/* Original HTAFL installation and narrative. No external models or member data. */
(() => {
  'use strict';
  const namespace = window.HTAFLWorld = window.HTAFLWorld || {};


  namespace.build = function build(palette, mobile, source) {
    const solid = [], lines = [], shadows = [];
    const vertex = (dest, p, n, c, id = -1) => dest.push(...p, ...n, ...c, id);
    const normal = (a, b, c) => {
      const u = b.map((v, i) => v - a[i]), v = c.map((v, i) => v - a[i]);
      const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]], length = Math.hypot(...n) || 1;
      return n.map(v => v / length);
    };
    const triangle = (a, b, c, color, id, normals) => {
      const n = normal(a,b,c); [a,b,c].forEach((p,i) => vertex(solid,p,normals?normals[i]:n,color,id));
      // Original planar silhouettes, projected along the key light. No shadow map.
      if(id>0||id===-3)[a,b,c].forEach(p=>vertex(shadows,[p[0]+p[1]*.62,.032,p[2]-p[1]*.42],[0,0,0],palette.paper.map((v,i)=>v*.88+palette.ink[i]*.12),-2));
    };
    const edge = (a, b, color, id) => [a,b].forEach(p => vertex(lines,p,[0,0,0],color,id));
    function box(center, size, color, id = -1, angle = 0) {
      const [cx,cy,cz] = center, [w,h,d] = size;
      const points = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x,y,z]) => [cx + x*w/2*Math.cos(angle) + z*d/2*Math.sin(angle),cy + y*h/2,cz - x*w/2*Math.sin(angle) + z*d/2*Math.cos(angle)]);
      [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]].forEach(face => {
        triangle(points[face[0]],points[face[1]],points[face[2]],color,id);
        triangle(points[face[0]],points[face[2]],points[face[3]],color,id);
      });
    }
    function frame(x,y,z,w,h,color,id,angle = 0,thickness=.11) {
      const offset=(dx,dy)=>[x+dx*Math.cos(angle),y+dy,z-dx*Math.sin(angle)];
      box(offset(-w/2,0),[thickness,h,.19],color,id,angle);box(offset(w/2,0),[thickness,h,.19],color,id,angle);
      box(offset(0,h/2),[w,thickness,.19],color,id,angle);box(offset(0,-h/2),[w,thickness,.19],color,id,angle);
    }
    function cylinder(center, radius, height, color, id = -1) {
      const segments = mobile ? 16 : 32, [x,y,z] = center;
      for(let i=0;i<segments;i++) {
        const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
        const pa=[x+Math.cos(a)*radius,y+height/2,z+Math.sin(a)*radius],pb=[x+Math.cos(b)*radius,y+height/2,z+Math.sin(b)*radius];
        const pc=[pa[0],y-height/2,pa[2]],pd=[pb[0],y-height/2,pb[2]];
        const na=[Math.cos(a),0,Math.sin(a)],nb=[Math.cos(b),0,Math.sin(b)];
        triangle([x,y+height/2,z],pb,pa,color,id);triangle(pa,pb,pc,color,id,[na,nb,na]);triangle(pb,pd,pc,color,id,[nb,nb,na]);
      }
    }
    function cloth(x,y,z,color,id) {
      const steps=mobile?10:20;
      const point=(u,v)=>[x+(u-.5)*2.5,y+(v-.5)*4.8,z+Math.sin(u*Math.PI*4)*.24+Math.sin(v*Math.PI)*.38];
      for(let u=0;u<steps;u++)for(let v=0;v<steps;v++) {
        const a=point(u/steps,v/steps),b=point((u+1)/steps,v/steps),c=point(u/steps,(v+1)/steps),d=point((u+1)/steps,(v+1)/steps);
        triangle(a,b,c,color,id);triangle(b,d,c,color,id);
      }
    }
    // Three original, connected rooms. Broad side portals allow real camera travel.
    const blend=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
    box([0,-.18,-1],[40,.3,26],palette.paper);
    namespace.worlds.forEach((room,i)=> {
      const x=room.x,wall=i===0?blend(palette.paper,palette.ink,.065):i===1?palette.white:palette.paper;
      box([x,-.035,-1],[11.8,.12,18.8],i===0?blend(palette.paper,palette.ink,.15):palette.paper);
      box([x,3.3,-10.5],[11.8,6.6,.25],wall);
      box([x,6.65,-1.1],[11.8,.16,19],wall);
      // Front doorway: thick reveals, side wall panels and a lintel.
      box([x-4.4,3.3,8.35],[3,6.6,.28],wall);box([x+4.4,3.3,8.35],[3,6.6,.28],wall);
      box([x,5.8,8.35],[5.8,1.6,.28],wall);
      frame(x,2.5,8.14,5.8,5,palette.ink,-1,0,.1);
      // Each side doorway is open from Z=2 to 7.9, with a real overhead beam.
      for(const side of [-1,1]) {
        box([x+side*5.9,3.3,-4.3],[.22,6.6,12.6],wall);
        box([x+side*5.9,3.3,8.2],[.22,6.6,.6],wall);
        box([x+side*5.9,5.7,5],[.22,1.8,6],wall);
        box([x+side*5.8,.1,5],[.15,.08,6],palette.ink);
      }
      // Restrained architectural seams, all colors from existing tokens.
      for(let z=-8;z<8;z+=2)edge([x-5.65,.04,z],[x+5.65,.04,z],blend(palette.paper,palette.ink,.22));
      box([x,6.53,-3],[5.4,.04,1.1],palette.white);
    });
    // OVERCOME: tangible, receding steps and an architectural practice rail.
    namespace.worlds[0].objects.forEach(({id,point},i)=> {
      box([point[0],point[1]/2-.08,point[2]],[1.85,point[1]-.16,1.2],i%2?palette.paper:palette.ink,id,.06*(i%2?1:-1));
      edge([point[0]-.62,point[1]+.002,point[2]],[point[0]+.62,point[1]+.002,point[2]],palette.cobalt,id);
    });
    frame(-15.8,2.8,-7.6,1.9,5.1,palette.ink,-3,-.1,.16);
    box([-8.6,2.1,-9.5],[1.8,4.2,.5],palette.paper,-3,.1);
    edge([-15.1,.18,3],[-13.6,3.15,-7.7],palette.ink);
    edge([-11.9,.18,3],[-9.8,3.15,-7.7],palette.ink);
    // CREATE: angled paper, a suspended folded textile and a close camera frame.
    box([-1.8,2.2,-2.8],[2.25,3,.16],palette.white,1,-.2);
    frame(-1.8,2.2,-2.8,2.4,3.15,palette.ink,1,-.2);
    for(let j=0;j<4;j++)edge([-2.5,1.5+j*.38,-2.54],[-1.1,1.64+j*.38,-2.83],palette.cobalt,1);
    cloth(2.6,3.3,-6.4,palette.paper,2);
    box([2.6,5.73,-6.4],[3.1,.12,.22],palette.ink,2);
    cylinder([-3.6,.9,2.6],.68,1.8,palette.ink,3);
    box([-3.6,1.88,2.6],[1.45,.14,1.05],palette.paper,3,.3);
    frame(2.4,2.1,1.3,1.8,3.6,palette.cobalt,4,-.36,.13);
    box([-1.2,.86,.1],[2.4,.32,1.45],palette.ink,5,-.2);
    box([-1.2,1.04,.1],[2.2,.05,1.3],palette.white,5,-.2);
    edge([-2,1.08,.3],[-1.3,1.08,-.45],palette.cobalt,5);edge([-1.3,1.08,-.45],[-.4,1.08,.3],palette.cobalt,5);
    frame(-3.8,2.8,-7.6,2.2,4.4,palette.ink,6,.22);
    // CONNECT: a shared gathering surface, satellite seats and suspended frames.
    cylinder([11.8,.55,-1.7],1.5,1.02,palette.white,21);
    frame(9,2.9,-5.3,2.4,4.6,palette.cobalt,22,.22,.13);
    frame(15.1,3,-7.3,2.1,5.2,palette.ink,23,-.22,.13);
    cylinder([8.9,.4,1.3],.8,.74,palette.paper,24);
    cylinder([15.1,.65,-2.8],.75,1.24,palette.white,25);
    frame(14.5,2.6,1.3,2.6,4.7,palette.paper,-3,-.32,.18);
    for(let i=0;i<5;i++) {
      const a=i/5*Math.PI*2,near=[11.8+Math.cos(a)*1.65,.06,-1.7+Math.sin(a)*1.65];
      const far=[11.8+Math.cos(a)*4.5,i%2?2.2:.04,-1.7+Math.sin(a)*5.4];
      for(let j=0;j<20;j++){const point=t=>near.map((v,k)=>v+(far[k]-v)*t+(k===1?Math.sin(t*Math.PI)*.45:0));edge(point(j/20),point((j+1)/20),palette.ink);}
    }
    // Production SVG contours become raised, gently bowed rails between worlds.
    if(source)source.querySelectorAll('path').forEach(path=> {
      const length=path.getTotalLength(),steps=mobile?48:96,view=source.viewBox.baseVal;
      for(const junction of [-6,6]){
        const convert=p=>{const x=(p.x-view.x-view.width/2)/view.width,y=(p.y-view.y-view.height/2)/view.height;return[junction+x*2.6,2.5-y*2.6,4.8+Math.sin(x*Math.PI)*.45];};
        for(let i=0;i<steps;i++)edge(convert(path.getPointAtLength(i/steps*length)),convert(path.getPointAtLength((i+1)/steps*length)),palette.cobalt);
      }
    });
    return {solid:new Float32Array([...solid,...shadows]),lines:new Float32Array(lines)};
  };
})();
