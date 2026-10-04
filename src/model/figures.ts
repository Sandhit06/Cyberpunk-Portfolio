import * as T from 'three';
import { ModelBuilder, type Materials, type MaterialName, type V3 } from './kit';

// Elliptical cross-sections produce continuous sculpted surfaces instead of box bodies.
type Ring = [y:number, width:number, depth:number, x?:number, z?:number];
export function loft(b:ModelBuilder,rings:Ring[],material:MaterialName,segments=24) {
  const positions:number[]=[],uv:number[]=[],indices:number[]=[];
  for(let j=0;j<rings.length;j++){const [y,w,d,x=0,z=0]=rings[j];for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;positions.push(x+Math.cos(a)*w,y,z+Math.sin(a)*d);uv.push(i/segments,j/(rings.length-1));}}
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,c=a+segments+1;indices.push(a,c,a+1,a+1,c,c+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();b.add(g,material);
}
function limb(b:ModelBuilder,a:V3,end:V3,r1:number,r2:number,mat:MaterialName){
  const delta=new T.Vector3(...end).sub(new T.Vector3(...a));const g=new T.CylinderGeometry(r2,r1,delta.length(),16,5);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize()));b.add(g,mat,[(a[0]+end[0])/2,(a[1]+end[1])/2,(a[2]+end[2])/2]);b.sphere(a,r1,mat,[1,1,.9]);b.sphere(end,r2,mat,[1,1,.9]);
}
function hand(b:ModelBuilder,at:V3,mat:MaterialName,grip=false){
  b.sphere(at,.046,mat,[.83,1.25,.5]);
  for(let i=0;i<4;i++){const x=at[0]-.026+i*.016;const y=at[1]-.028; b.pipe([[x,y,at[2]],[x,y-.027,at[2]+(grip?.025:0)],[x,y-.05,at[2]+(grip?.041:.005)]],.008,mat);}
  b.pipe([[at[0]+.031,at[1]+.003,at[2]],[at[0]+.049,at[1]-.027,at[2]+.013],[at[0]+.036,at[1]-.04,at[2]+.022]],.011,mat);
}
function rose(b:ModelBuilder,at:V3,scale=.04){
  for(let i=0;i<5;i++){const a=i*Math.PI*.4;b.torus([at[0]+Math.cos(a)*scale*.35,at[1]+Math.sin(a)*scale*.35,at[2]],scale*.55,.0025,'ink');}
  b.pipe([[at[0],at[1]-scale*.4,at[2]],[at[0]-.01,at[1]-scale*1.4,at[2]],[at[0]+.015,at[1]-scale*2,at[2]]],.0025,'ink');
}
function head(b:ModelBuilder,female:boolean,variant:number){
  const skin=female?'skinWarm':'skinTan';
  const accent:MaterialName=variant===3?'teal':'hairRed';
  loft(b,[[0,.025,.028],[.018,.067,.074],[.055,.104,.096],[.115,.126,.106],[.19,.129,.109],[.26,.117,.096],[.302,.08,.075],[.32,.015,.014]],skin,32);
  // Cheekbones, tapered nose, chin, lips, inset eyes, brows and ears.
  for(const side of [-1,1]){
    b.sphere([side*.063,.145,.076],.062,skin,[.91,.55,.48]);
    b.sphere([side*.053,.2,.099],.034,'ink',[1,.36,.32]);
    b.sphere([side*.053,.2,.107],.029,'white',[1,.38,.2]);
    b.sphere([side*.053,.2,.114],.012,'iris',[.8,.95,.23]);
    b.sphere([side*.053,.2,.117],.005,'dark',[.7,1,.3]);
    b.sphere([side*.049,.205,.119],.003,'white');
    b.pipe([[side*.025,.203,.111],[side*.05,.213,.113],[side*.08,.202,.104]],.0045,female?'ink':skin);
    b.pipe([[side*.025,.195,.111],[side*.052,.188,.112],[side*.08,.198,.104]],.003,skin);
    b.sphere([side*.017,.135,.14],.006,'ink',[1,.5,.4]);
    b.pipe([[side*.023,.233,.108],[side*.055,.242,.105],[side*.09,.231,.09]],.007,'hair');
    b.sphere([side*.13,.151,-.005],.04,skin,[.42,1,.55]);
    b.sphere([side*.146,.152,.005],.022,'lips',[.15,1,.55]);
  }
  b.sphere([0,.174,.111],.032,skin,[.43,1.34,.73]);b.sphere([0,.144,.133],.023,skin,[.75,.56,.64]);
  b.sphere([0,.09,.096],.034,'lips',[1,.18,.4]);b.sphere([0,.08,.097],.027,'lips',[1,.2,.35]);
  b.sphere([0,.045,.066],.049,skin,[.86,.57,.62]);
  b.pipe([[.092,.185,.074],[.106,.135,.075],[.077,.111,.094],[.082,.089,.088]],.0035,'chrome');
  b.box([.126,.229,.033],[.009,.065,.043],'steel',[0,0,.1],.003);
  b.box([.134,.233,.034],[.006,.047,.027],'cyan');
  b.torus([.146,.13,.021],.026,.004,'chrome',[0,.25,0]);
  if(female){
    // Side-shave and individually swept, volumetric locks, with longer asymmetrical fringe.
    const cap=new T.SphereGeometry(1,28,18,0,Math.PI*2,0,Math.PI*.49);cap.scale(.134,.14,.115);b.add(cap,'hair',[0,.2,-.018]);
    for(let i=0;i<17;i++) {const x=-.11+i*.011; b.pipe([[x*.65,.302,-.043],[x-.026,.321,.045],[x-.067,.246,.098],[x-.079,.105,.101],[x-.082,-.06,.06]],.009+i%3*.002,i%4===0?accent:'hair');}
    for(let i=0;i<9;i++)b.pipe([[.098,.269,-.058+i*.009],[.126,.226,-.065+i*.009],[.131,.17,-.059+i*.009]],.0028,'hair');
  } else {
    // Fitted hair cap and sideburns make the swept strands read as one hairstyle.
    const cap=new T.SphereGeometry(1,32,20,0,Math.PI*2,0,Math.PI*.48);cap.scale(.13,.11,.113);b.add(cap,'hair',[0,.22,-.018]);
    for(const side of [-1,1]) {
      b.sphere([side*.105,.076,.054],.038,'hair',[.55,1.5,.7]);
      b.pipe([[side*.105,.07,.07],[side*.074,.027,.085],[0,.018,.083]],.011,'hair');
      b.pipe([[side*.01,.116,.115],[side*.035,.113,.109],[side*.055,.107,.1]],.005,'hair');
    }
    for(let i=0;i<18;i++){const x=-.107+i*.012;b.pipe([[x,.255,.045],[x,.327,.015],[x*.92,.3,-.087]],.013,'hair');}
    for(let i=0;i<12;i++)b.pipe([[-.105+i*.018,.059,.065],[-.095+i*.017,.033,.07],[-.08+i*.014,.02,.06]],.0028,'hair');
    b.pipe([[-.1,.159,.081],[-.078,.129,.098],[-.075,.105,.097]],.003,'lips');
  }
}
export type Figure = {root:T.Group; torso:T.Group; head:T.Group; arm:T.Group; ember?:T.Mesh; smokeOrigin:T.Object3D};
export function createFigure(m:Materials,female:boolean,variant=0):Figure {
  const root=new T.Group(),torso=new T.Group(),headGroup=new T.Group(),arm=new T.Group();
  const skin:MaterialName=female?'skinWarm':'skinTan';
  const lower=new ModelBuilder(m);
  for(const side of [-1,1]){
    const hip:V3=[side*.112,.98,0],knee:V3=[side*.13,.56,side===1?.047:-.035],ankle:V3=[side*.15,.13,side===1?.08:-.04];
    limb(lower,hip,knee,female?.09:.105,.064,female?skin:'leather');
    limb(lower,knee,ankle,.064,.044,female?skin:'leather');
    if(female){ limb(lower,[knee[0],.48,knee[2]],ankle,.068,.055,'leather');lower.box([ankle[0],.05,ankle[2]-.06],[.056,.1,.065],'chrome',[0,0,0],.008); }
    else {lower.sphere(knee,.083,'leather',[1,.9,.85]);for(let i=0;i<5;i++) lower.pipe([[knee[0]-.065,knee[1]-.04+i*.021,knee[2]+.05],[knee[0],knee[1]-.047+i*.021,knee[2]+.075],[knee[0]+.065,knee[1]-.04+i*.021,knee[2]+.05]],.004,'steel');}
    lower.box([ankle[0],.085,ankle[2]+.065],[.135,.12,.26],'leather',[0,side*.09,0],.045);
    lower.box([ankle[0],.024,ankle[2]+.075],[.14,.037,.275],'rubber',[0,side*.09,0],.016);
    lower.box([ankle[0],.14,ankle[2]+.073],[.089,.018,.045],'chrome');
    for(let i=0;i<5;i++) {
      const y=.12+i*.028,z=ankle[2]+.095-i*.008;
      lower.beam([ankle[0]-.033,y,z],[ankle[0]+.033,y+.017,z],.004,'cream');
      lower.beam([ankle[0]+.033,y,z],[ankle[0]-.033,y+.017,z],.004,'cream');
    }
    lower.sphere([ankle[0],.088,ankle[2]+.16],.067,'carbon',[1,.52,.85]);
    if(female&&variant===3){
      limb(lower,hip,knee,.095,.072,'carbon');
      lower.sphere([knee[0],knee[1],knee[2]+.055],.077,'chrome',[.87,1.2,.35]);
      for(const y of [.7,.82])lower.box([hip[0],y,.082],[.16,.023,.03],'leather');
    }
  }
  root.add(lower.finish());
  const body=new ModelBuilder(m);
  if(female){
    loft(body,[[.88,.198,.111],[.93,.206,.123],[1.03,.18,.117],[1.12,.135,.092],[1.21,.14,.098],[1.33,.167,.115],[1.42,.16,.104],[1.45,.143,.09]],'dress',32);
    loft(body,[[1.37,.158,.091],[1.46,.176,.09],[1.51,.188,.077],[1.54,.141,.068],[1.57,.052,.051],[1.63,.047,.047]],skin,28);
    for(const side of [-1,1]){body.pipe([[side*.115,1.38,.087],[side*.127,1.48,.076],[side*.14,1.536,.012],[side*.125,1.46,-.072],[side*.116,1.37,-.084]],.012,'leather');rose(body,[side*.06,1.535,.062],.022);}
    body.pipe([[-.16,.94,.106],[-.11,1.07,.092],[-.105,1.23,.09],[-.12,1.38,.088]],.004,'chrome');
    body.pipe([[.165,.89,.11],[.16,1.01,.105],[.14,1.07,.1]],.005,'leather');
    body.torus([0,1.6,0],.05,.007,'chrome',[Math.PI/2,0,0]);
    body.box([.075,1.18,.09],[.05,.024,.014],'chrome');
    rose(body,[-.18,1.47,.049],.024);
  } else {
    loft(body,[[.94,.175,.115],[1.0,.183,.129],[1.1,.19,.126],[1.24,.212,.143],[1.4,.25,.149],[1.48,.237,.129],[1.52,.176,.094]],'jacket',32);
    body.box([0,1.26,.14],[.14,.43,.035],'leather',[0,0,0],.025);
    for(const side of [-1,1]){
      body.profile([[side*.075,1.09],[side*.06,1.39],[side*.14,1.55],[side*.197,1.45],[side*.137,1.21]],.036,[0,0,.157],'jacket',.008);
      body.pipe([[side*.075,1.06,.143],[side*.104,1.31,.17],[side*.155,1.51,.131]],.006,'chrome');
      body.sphere([side*.234,1.425,.015],.105,'jacket',[1,.79,1]);
      body.cylinder([side*.224,1.45,.088],.032,.032,.014,'steel',[Math.PI/2,0,0]);
      body.box([side*.125,1.14,.145],[.082,.01,.014],'chrome');
    }
    body.cylinder([0,1.565,0],.059,.077,.16,skin);
    body.pipe([[-.1,1.46,-.105],[-.087,1.56,-.063],[0,1.579,-.052],[.087,1.56,-.063],[.1,1.46,-.105]],.022,'cyan');
    body.box([0,.982,.128],[.075,.044,.026],'chrome');
    for(let i=0;i<7;i++)body.torus([.16+i*.008,1.04-i*.013,.149],.012,.003,'chrome');
    body.sign('SAMURAI',[0,1.28,-.156],[.28,.22],'#ce6761',{border:false,background:'#392c27'});
  }
  // Tailored bolero and a second netrunner variant, with layered plates and lit seams.
  if(female){
    for(const side of [-1,1]){
      body.sphere([side*.177,1.475,-.003],.077,variant===3?'chrome':'jacket',[1,.75,1.15]);
      body.profile([[side*.08,1.24],[side*.095,1.44],[side*.15,1.52],[side*.19,1.44],[side*.14,1.27]],.03,[0,0,.108],variant===3?'carbon':'jacket',.008);
      body.pipe([[side*.11,1.29,.14],[side*.125,1.43,.13],[side*.11,1.5,.08]],.006,'chrome');
      body.pipe([[side*.09,1.5,-.035],[side*.095,1.56,-.06],[side*.04,1.58,-.065]],.008,variant===3?'cyan':'violet');
    }
    if(variant===3)for(let i=0;i<3;i++)body.sphere([0,1.16+i*.075,.09],.1,'carbon',[1.3,.4,.42]);
  } else {
    for(const side of [-1,1])for(let i=0;i<3;i++)body.pipe([[side*.14,1.02+i*.035,.115],[side*.19,1.03+i*.035,.10],[side*.2,1.07+i*.035,.065]],.007,'leather');
    body.box([-.17,1.38,.16],[.055,.075,.018],'red');
  }
  // Relaxed left arm, bent at the elbow, with shoulder and wrist anatomy.
  const shoulder:V3=[female?.19:.257,1.46,0],elbow:V3=[female?.26:.32,1.22,.013],wrist:V3=[female?.173:.23,1.02,.12];
  limb(body,shoulder,elbow,female?.057:.085,.047,female?skin:'jacket');limb(body,elbow,wrist,.049,.03,female?skin:'jacket');hand(body,[wrist[0],wrist[1]-.038,wrist[2]+.014],skin);
  body.cylinder([wrist[0],wrist[1]+.018,wrist[2]],.036,.036,.044,'steel');
  body.box([wrist[0],wrist[1]+.016,wrist[2]+.036],[.039,.029,.009],'cyan');
  torso.add(body.finish());root.add(torso);
  const hb=new ModelBuilder(m);head(hb,female,variant);headGroup.add(hb.finish());headGroup.position.set(0,1.6,0);headGroup.rotation.y=female?-.14:.08;torso.add(headGroup);
  const ab=new ModelBuilder(m);arm.position.set(0,1.46,0);
  if(female){limb(ab,[-.19,0,0],[-.245,-.24,.02],.057,.044,skin);limb(ab,[-.245,-.24,.02],[-.245,-.46,.075],.047,.028,skin);hand(ab,[-.246,-.493,.077],skin);rose(ab,[-.211,-.065,.05],.027);}
  else {limb(ab,[-.25,0,0],[-.32,-.21,.1],.085,.065,'jacket');limb(ab,[-.32,-.21,.1],[-.09,.205,.165],.06,.032,'jacket');hand(ab,[-.073,.227,.183],skin,true);}
  arm.add(ab.finish());torso.add(arm);
  const smokeOrigin=new T.Object3D();let ember:T.Mesh|undefined;
  if(!female){
    // Keep the cigar anchored to the mouth/head so the gesture reads at every camera distance.
    const cigarBuilder=new ModelBuilder(m);
    cigarBuilder.beam([.045,.075,.12],[.045,.075,.30],.011,'cigar');
    cigarBuilder.beam([.045,.075,.24],[.045,.075,.255],.012,'gold');
    headGroup.add(cigarBuilder.finish());
    ember=new T.Mesh(new T.SphereGeometry(.012,10,8),m.lantern);
    ember.position.set(.045,.075,.302);headGroup.add(ember);
    smokeOrigin.position.copy(ember.position);headGroup.add(smokeOrigin);
  }
  else {smokeOrigin.visible=false;root.add(smokeOrigin);}
  root.userData.variant=variant;
  return {root,torso,head:headGroup,arm,ember,smokeOrigin};
}
