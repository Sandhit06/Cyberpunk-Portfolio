import * as T from 'three';
import { ModelBuilder, type MaterialName } from './kit';

// Longitudinal cross sections make a tapered body, not a constant-width extrusion.
function shell(b:ModelBuilder, sections:number[][], material:MaterialName){
  const vertices:number[]=[],indices:number[]=[];
  for(const [x,low,top,width,crown] of sections){
    for(const [y,z] of [[low,-width*.88],[top-.09,-width],[top,-width*.76],[top+crown,0],[top,width*.76],[top-.09,width],[low,width*.88],[low,0]])vertices.push(x,y,z);
  }
  for(let i=0;i<sections.length-1;i++)for(let j=0;j<8;j++){const a=i*8+j,d=i*8+(j+1)%8;indices.push(a,d,a+8,d,d+8,a+8);}
  for(let j=1;j<7;j++){indices.push(0,j+1,j);const a=(sections.length-1)*8;indices.push(a,a+j,a+j+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(vertices.length/3*2),2));g.setIndex(indices);g.computeVertexNormals();b.add(g,material);
}
export function quadra(b:ModelBuilder){
  // Car envelope x [-8.85,-6.55], z [-3.15,1.95]. Poles begin at z 2.7.
  b.with([-7.7,.04,-.6],[0,Math.PI/2,0],()=>{
    shell(b,[[-2.5,.25,.49,.78,.01],[-2.18,.25,.65,.98,.02],[-1.45,.29,.82,1.04,.035],[-.65,.3,.81,.91,.02],[.6,.29,.82,.94,.025],[1.45,.28,.9,1.09,.02],[2.3,.28,.73,1,.015]],'carPaint');
    shell(b,[[-1.02,.8,.83,.79,.01],[-.33,.82,1.3,.69,.055],[.54,.83,1.31,.69,.035],[1.23,.8,.91,.84,.01]],'glass');
    shell(b,[[-.36,1.29,1.32,.71,.035],[.55,1.3,1.34,.71,.025]],'carPaint');
    for(const side of [-1,1]){
      b.pipe([[-1.03,.83,side*.79],[-.33,1.33,side*.69],[.56,1.35,side*.69],[1.24,.9,side*.84]],.022,'bronze',false);
      b.beam([.6,.85,side*.86],[.51,1.32,side*.7],.029,'carPaint');
      b.box([-.85,.94,side*.97],[.24,.095,.15],'carPaint',[0,0,.08],.025);
      b.beam([-.75,.91,side*.81],[-.85,.94,side*.95],.022,'steel');
      for(let i=0;i<5;i++) b.box([.37,.35+i*.068,side*.974],[1.76,.031,.044],'carbon');
      b.beam([-.65,.81,side*.93],[.5,.82,side*.95],.009,'dark');
      b.box([.42,.79,side*.962],[.17,.025,.018],'chrome');
      b.box([-.55,.26,side*.95],[2.4,.042,.045],'bronze');
      b.box([-1.84,.7,side*.45],[.54,.038,.28],'chrome',[0,0,-.12]);
      for(let i=0;i<4;i++)b.box([-1.98+i*.105,.728,side*.45],[.048,.012,.23],'cream',[0,0,-.12]);
      b.box([-2.47,.43,side*.49],[.022,.038,.45],'dim');
      for(const x of [-1.48,1.46]){
        b.cylinder([x,.42,side*.97],.42,.42,.31,'rubber',[Math.PI/2,0,0],48);
        b.cylinder([x,.42,side*1.135],.325,.325,.025,'chrome',[Math.PI/2,0,0],48);
        b.cylinder([x,.42,side*1.153],.23,.23,.029,'carbon',[Math.PI/2,0,0],32);
        b.torus([x,.42,side*1.176],.29,.021,'chrome');
        b.cylinder([x,.42,side*1.183],.075,.075,.035,'bronze',[Math.PI/2,0,0],16);
        for(let i=0;i<12;i++){const a=i*Math.PI/6;b.beam([x+Math.cos(a)*.08,.42+Math.sin(a)*.08,side*1.17],[x+Math.cos(a+.13)*.25,.42+Math.sin(a+.13)*.25,side*1.17],.014,'steel');}
        const arch=new T.TorusGeometry(.465,.055,8,32,Math.PI);b.add(arch,'carPaint',[x,.42,side*1.035]);
        for(let i=0;i<7;i++){const a=i*Math.PI/6;b.sphere([x+Math.cos(a)*.48,.42+Math.sin(a)*.48,side*1.09],.012,'chrome');}
      }
      b.box([1.97,1.04,side*.73],[.075,.36,.065],'carbon',[0,0,-.15]);
      b.box([2.02,1.27,side*1.06],[.45,.16,.06],'carPaint',[0,0,-.09]);
      for(let i=0;i<4;i++)b.box([2.31,.44+i*.074,side*.58],[.025,.025,.73],'redLight');
      b.pipe([[1.64,.22,side*.48],[1.94,.16,side*.48],[2.4,.2,side*.48]],.073,'chrome');
      b.cylinder([2.42,.2,side*.48],.058,.058,.025,'dark',[0,0,Math.PI/2],20);
    }
    b.box([2.03,1.24,0],[.45,.065,2.18],'carPaint',[0,0,-.09],.022);
    for(let i=0;i<7;i++)b.box([1.12+i*.13,.9,0],[.045,.025,1.35],'carbon');
    b.box([-2.45,.26,0],[.18,.06,1.85],'carbon',[0,0,0],.02);
    b.box([2.34,.29,0],[.13,.14,1.7],'carbon');
    b.sign('QUADRA',[2.375,.72,0],[1.1,.17],'#f3dcb0',{rotation:[0,Math.PI/2,0],border:false});
    b.beam([-.85,.13,0],[.85,.13,0],.018,'cyan');
  });
}
