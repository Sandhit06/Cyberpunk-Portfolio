import { quadra } from './quadra';
import { streetMachines } from './streetMachines';
import { C, ModelBuilder, random, type V3, type MaterialName } from './kit';
import { aircon, railing } from './architecture';
import { motorcycle } from './motorcycle';

export function streets(b: ModelBuilder) {
  // Finite diorama curb with paved sidewalks, street markings and drains.
  // Glass foundation is rendered separately in Scene.
  b.box([-.2,.02,-.3],[12.8,.12,7.3],'pavement');
  // Front promenade exposes the reflective glass surface.
  // Side promenade exposes the glass foundation.
  for (let i=0;i<32;i++) b.box([-8.25+i*.52,.105,4.39],[.49,.18,.23],i%6<2?'cream':'steel');
  for (let i=0;i<17;i++) b.box([7.37,.105,-4.5+i*.53],[.2,.18,.49],i%6<2?'cream':'steel');
  for (let i=0;i<12;i++) b.box([-8.35+i*1.48,.021,6.21],[.88,.01,.07],'gold');
  b.box([-6.25,.018,5.5],[3.1,.012,2.3],'dark');
  // Crossing bars run across the lane, so pedestrians move straight from the curb to the shop.
  for(let i=0;i<10;i++)b.box([-6.25,.029,4.48+i*.225],[2.92,.012,.11],'gold');
  for(const x of [-7.82,-4.68])b.box([x,.03,5.5],[.045,.015,2.3],'gold');
  for(const x of [-5.3,4.2]) { b.box([x,.17,4.07],[1.07,.025,.3],'dark'); for(let i=0;i<12;i++) b.box([x-.49+i*.088,.19,4.07],[.035,.015,.26],'steel'); }
  b.cylinder([5.7,.104,3.57],.44,.44,.026,'dark',[0,0,0],32);
  for(let i=0;i<7;i++) b.box([5.7,.123,3.31+i*.075],[.6,.012,.022],'steel');
  // Pavement repairs and road reflectors.
  b.box([-5.5,.09,-3.8],[2,.025,1.1],'darkWall');
  for(const x of [-8,-3,2,7]) b.box([x,.08,6.26],[.12,.035,.09],'amber');
}
function bowl(b: ModelBuilder, at: V3) {
  b.cylinder(at,.22,.105,.19,'red', [0,0,0],24);
  b.cylinder([at[0],at[1]+.101,at[2]],.194,.194,.016,'gold');
  b.torus([at[0],at[1]+.105,at[2]],.215,.018,'cream',[Math.PI/2,0,0]);
  b.sphere([at[0]-.065,at[1]+.12,at[2]],.072,'white',[1,.28,1]);
  b.sphere([at[0]-.065,at[1]+.14,at[2]],.035,'gold',[1,.3,1]);
  for(let i=0;i<3;i++) b.box([at[0]+.05+i*.025,at[1]+.12,at[2]+.05],[.03,.015,.15],'leaf',[0,.4,0]);
  b.beam([at[0]-.28,at[1]+.14,at[2]-.12],[at[0]+.18,at[1]+.17,at[2]+.22],.009,'wood');
  b.beam([at[0]-.3,at[1]+.14,at[2]-.09],[at[0]+.15,at[1]+.17,at[2]+.24],.009,'wood');
}
function bottle(b: ModelBuilder, at: V3, color: MaterialName='teal') {
  b.cylinder(at,.055,.058,.22,color); b.cylinder([at[0],at[1]+.145,at[2]],.026,.05,.08,color); b.cylinder([at[0],at[1]+.207,at[2]],.025,.025,.052,'gold');
  b.box([at[0],at[1],at[2]+.052],[.07,.115,.015],'cream');
}
function stool(b: ModelBuilder, at: V3) {
  b.cylinder([at[0],at[1]+.65,at[2]],.28,.28,.11,'red',[0,0,0],24);
  b.cylinder([at[0],at[1]+.62,at[2]],.3,.3,.045,'steel');
  b.torus([at[0],at[1]+.23,at[2]],.21,.017,'steel',[Math.PI/2,0,0]);
  for(let i=0;i<4;i++) { const a = i*Math.PI/2+.5; b.beam([at[0]+Math.cos(a)*.24,at[1],at[2]+Math.sin(a)*.24],[at[0]+Math.cos(a)*.15,at[1]+.6,at[2]+Math.sin(a)*.15],.024,'steel'); }
}
function person(b: ModelBuilder, at: V3, rotation: number, jacket: MaterialName='dark', umbrella=false) {
  b.with(at,[0,rotation,0],()=>{
    b.box([0,1.04,0],[.39,.62,.24],jacket,[0,0,0],.065);
    b.box([0,.84,0],[.46,.19,.28],jacket,[0,0,0],.04);
    b.sphere([0,1.51,0],.155,'skin',[.86,1.15,.9]); b.sphere([0,1.57,-.045],.151,'dark',[.97,.78,.83]);
    b.box([0,1.53,.136],[.22,.047,.028],'cyan');
    for(const i of [-1,1]) { b.beam([i*.11,.76,0],[i*.11,.42,i*.07],.075,'dark'); b.beam([i*.11,.42,i*.07],[i*.12,.08,.02],.055,'dark'); b.box([i*.12,.055,.07],[.14,.09,.29],'rubber',[0,0,0],.03); b.beam([i*.235,1.29,0],[i*.29,1.0,.08],.065,jacket); b.beam([i*.29,1,.08],[i*.21,.86,.15],.05,jacket); b.sphere([i*.21,.85,.15],.065,'skin'); }
    b.box([0,1.0,-.157],[.27,.44,.12],'steel',[0,0,0],.04);
    b.box([0,1.16,-.22],[.19,.026,.012],'cyan');
    if(umbrella) { b.beam([.21,.9,.16],[.21,2.14,.16],.016,'steel'); b.cylinder([.21,2.05,.16],.02,.82,.26,'red',[0,0,0],12); for(let i=0;i<12;i++) { const a = i*Math.PI/6; b.beam([.21,2.19,.16],[.21+Math.cos(a)*.8,1.94,.16+Math.sin(a)*.8],.007,'steel'); } b.cylinder([.21,2.21,.16],.018,.018,.09,'steel'); }
  });
}
function scooter(b: ModelBuilder, at: V3) {
  b.with(at,[0,-.3,0],()=>{
    for(const z of [-.56,.65]) { b.cylinder([0,.31,z],.29,.29,.15,'rubber',[0,0,Math.PI/2],24); b.cylinder([.085,.31,z],.17,.17,.018,'chrome',[0,0,Math.PI/2]); }
    b.box([0,.43,.02],[.43,.11,1.05],'teal',[0,0,0],.045);
    b.box([0,.63,-.45],[.48,.44,.49],'teal',[0,0,0],.08); b.box([0,.9,-.43],[.5,.12,.57],'dark',[0,0,0],.05);
    b.box([0,.86,.52],[.45,.78,.13],'cream',[-.2,0,0],.065);
    b.beam([0,.3,.65],[0,1.33,.45],.037,'chrome'); b.beam([-.35,1.35,.45],[.35,1.35,.45],.035,'steel');
    b.cylinder([0,1.23,.62],.105,.105,.08,'amber',[Math.PI/2,0,0]);
    b.box([0,.87,-.88],[.58,.59,.49],'red',[0,0,0],.05); b.sign('EXPRESS',[0,.87,-1.14],[.48,.3],C.amber,{rotation:[0,Math.PI,0]});
    b.beam([-.13,.48,.1],[-.28,.05,.27],.019,'steel');
  });
}
export function props(b: ModelBuilder) {
  for(const x of [-4.55,-3.2,-1.85,-.5,.85]) { stool(b,[x,.11,2.84]); bowl(b,[x,1.235,1.91]); }
  for(let i=0;i<20;i++) bottle(b,[-4.8+i*.29,2.37,-2.22],i%3===0?'red':i%3===1?'teal':'gold');
  for(const x of [-3.8,-1.4,.4]) { bottle(b,[x,1.29,1.45]); b.cylinder([x+.2,1.25,1.7],.055,.045,.24,'cream'); }
  // Suspended red paper lanterns with ribbed shades.
  for(const x of [-4.8,-2.2,.7]) { b.beam([x,3.1,3.06],[x,2.7,3.06],.016,'dark'); b.sphere([x,2.4,3.06],.28,'lantern',[.8,1.13,.8]); for(let i=0;i<9;i++) { const y=-.24+i*.06; b.torus([x,2.4+y,3.06],Math.sqrt(Math.max(.001,.28*.28-y*y))*.8,.007,'rust',[Math.PI/2,0,0]); } b.cylinder([x,2.72,3.06],.08,.08,.07,'dark'); b.cylinder([x,2.08,3.06],.07,.07,.06,'gold'); }
  // Crates, stools and small street clutter, concentrated in believable corners.
  for(let i=0;i<3;i++) { b.box([-5.92,.29+i*.33,-1.7],[.73,.3,.56],'teal'); for(let j=0;j<6;j++) b.box([-6.24+j*.12,.29+i*.33,-1.407],[.055,.2,.015],'dark'); }
  for(const x of [-6.5,6.75]) { b.cylinder([x,.43,-3.7],.31,.28,.7,'dark'); b.cylinder([x,.8,-3.7],.34,.34,.045,'steel'); b.torus([x,.44,-3.7],.307,.026,'steel',[Math.PI/2,0,0]); }
  b.with([2.03,.12,3.24],[0,-.18,0],()=>{ b.box([0,.62,0],[.75,1.13,.08],'wood',[-.13,0,0]); b.box([0,.62,-.23],[.75,1.13,.08],'wood',[.13,0,0]); b.sign('EAT',[0,.78,.085],[.59,.72],C.amber,{sub:'OPEN UNTIL DAWN',background:'#11191d'}); });
  // Rooftop ventilation, water tank, solar cells and access structures.
  b.cylinder([-3.86,12.8,-1.53],.74,.74,1.67,'steel',[0,0,0],32);
  b.cylinder([-3.86,13.68,-1.53],.09,.79,.25,'dark',[0,0,0],32);
  for(const y of [12.18,12.6,13.12,13.54]) b.torus([-3.86,y,-1.53],.75,.03,'rust',[Math.PI/2,0,0]);
  for(const x of [-4.4,-3.32]) for(const z of [-2.05,-1.0]) b.beam([x,11.85,z],[x,12.12,z],.045,'steel');
  b.pipe([[-3.2,12.5,-1.5],[-2.85,12.5,-1.5],[-2.8,10.25,-1.5],[-1.3,10.25,-1.5]],.064,'rust');
  // Feet sit on the roof slab (top = 10.305); only the panel surface is tilted.
  for(const x of [-1.65,-.4]) {
    for(const sx of [-.4,.4]) for(const dz of [-.67,.67]) {
      const top=11.55-Math.sin(.26)*dz;
      b.cylinder([x+sx,10.355,-1.5+dz],.11,.16,.1,'steel');
      b.beam([x+sx,10.405,-1.5+dz],[x+sx,top,-1.5+dz],.048,'chrome');
      b.box([x+sx,top,-1.5+dz],[.16,.09,.18],'steel');
    }
    for(const dz of [-.67,.67]) {
      b.beam([x-.4,10.55,-1.5+dz],[x+.4,11.28,-1.5+dz],.025,'steel');
      b.beam([x+.4,10.55,-1.5+dz],[x-.4,11.28,-1.5+dz],.025,'steel');
    }
    b.with([x,11.55,-1.5],[-.26,0,0],()=>{
      b.box([0,0,0],[1.24,.06,1.95],'steel');
      b.box([0,.04,0],[1.12,.018,1.83],'glass');
      for(let i=0;i<5;i++) b.box([0,.055,-.9+i*.45],[1.1,.01,.012],'coldWindow');
      for(let i=0;i<4;i++) b.box([-.54+i*.36,.055,0],[.012,.01,1.8],'coldWindow');
    });
    b.pipe([[x,11.5,-1.5],[x+.45,11.3,-1.5],[x+.45,10.4,-1.5],[0,10.47,-2.6]],.018,'dark',false);
  }
  b.box([4.88,5.29,-1.47],[1.73,.96,1.58],'steel',[0,0,0],.05);
  for(const x of [4.4,5.35]) { b.cylinder([x,5.79,-1.45],.36,.36,.07,'dark',[0,0,0],24); for(let r=0;r<5;r++) b.torus([x,5.84,-1.45],.06+r*.065,.009,'steel',[Math.PI/2,0,0]); }
  aircon(b,[3.0,5.27,-1.7]);
  b.cylinder([2.75,5.02,-.35],.39,.39,.51,'steel');
  b.cylinder([2.75,5.36,-.35],.55,.35,.19,'dark');
  // Rooftop antenna and a large framing gantry.
  b.beam([-.7,10.3,-2.6],[-.7,13.75,-2.6],.055); b.cylinder([-.7,13.86,-2.6],.044,.044,.16,'redLight');
  for(const y of [12.5,13.1]) { b.beam([-1.25,y,-2.6],[-.15,y,-2.6],.022); b.beam([-.7,y,-3.02],[-.7,y,-2.18],.022); }
  for(const x of [1.35,5.8]) b.beam([x,4.8,-2.7],[x,8.1,-2.7],.06,'steel');
  b.beam([1.35,8.1,-2.7],[5.8,8.1,-2.7],.075,'steel');
  b.sign('AFTER HOURS',[3.6,7.08,-2.38],[3.95,2.05],C.purple,{graphic:'poster'});
  b.sign('MEMORY LANE',[3.6,7.08,-2.61],[3.95,2.05],C.cyan,{rotation:[0,Math.PI,0],sub:'YOUR STORIES / YOUR SCREEN',graphic:'circuit'});
  b.box([3.6,7.08,-2.5],[4.13,2.22,.16],'dark');
  b.box([3.6,8.23,-2.5],[4.28,.08,.3],'steel');
  for(const x of [1.61,5.59]) b.box([x,7.08,-2.35],[.025,2.09,.018],'violet');
  // Rooftop bistro corner gives scale and an inhabited silhouette.
  b.cylinder([3.95,5.48,.44],.53,.53,.055,'wood',[0,0,0],24);
  b.cylinder([3.95,5.13,.44],.055,.055,.7,'steel');
  b.cylinder([3.95,4.81,.44],.23,.23,.045,'dark');
  stool(b,[3.05,4.8,.62]); stool(b,[4.84,4.8,.62]);
  bottle(b,[3.87,5.61,.4]); bowl(b,[4.19,5.61,.36]);
  // Utility poles and hanging cables form arcs around the building.
  for(const at of [[-7.12,0,2.8],[7.62,0,-3.8]] as V3[]) { b.cylinder([at[0],3.33,at[2]],.066,.1,6.6,'steel'); b.box([at[0],6.24,at[2]],[1.6,.08,.12],'steel'); for(const dx of [-.58,0,.58]) b.cylinder([at[0]+dx,6.4,at[2]],.06,.06,.2,'cream'); b.box([at[0],3,at[2]],[.24,.52,.2],'rust'); }
  for(let i=0;i<3;i++) b.pipe([[-7.7+i*.56,6.48,2.8],[-5.4,5.5,3.7],[-1.4,5.13,4.35],[2.8,5.5,3.9],[7.04+i*.56,6.48,-3.8]],.014,'dark');
  b.pipe([[-7.1,6.5,2.8],[-6.4,7.8,-1],[-4.7,9.2,-3.3],[-1,8.7,-4],[3.7,6.1,-4.4],[7.6,6.5,-3.8]],.025,'dark');
  b.pipe([[.1,10.4,0],[2.2,8.9,-.6],[4.5,8.7,-1.2],[5.8,8.1,-2.7]],.018,'dark');
  // Terminate the service runs in junction boxes and a continuous rear riser.
  b.box([0,10.47,-2.6],[.3,.32,.2],'steel');
  b.pipe([[0,10.47,-2.6],[0,10.47,-3.15],[0,1.1,-3.15],[2.15,1.1,-3.15],[2.15,1.8,-3.02]],.035,'dark',false);
  for(const x of [-5.2,0]) {
    b.pipe([[x,4.3,1.05],[x,4.15,1.05],[x,4.15,1.48],[x,3.6,1.48]],.058,'rust',false);
    b.box([x,3.6,1.48],[.25,.32,.17],'steel');
  }
  for(const y of [5,7.5,10]) b.box([0,y,-3.15],[.15,.06,.13],'steel');
  // Street lamp with cantilever and a warm pool of light supplied by the scene.
  b.cylinder([-7.15,3.2,3.6],.07,.14,6.25,'steel'); b.pipe([[-7.15,6.2,3.6],[-7.12,6.62,3.6],[-6.6,6.71,3.6],[-5.98,6.71,3.6]],.065,'steel');
  b.box([-5.94,6.64,3.6],[.72,.1,.3],'steel'); b.box([-5.94,6.57,3.6],[.56,.025,.23],'amber');
  quadra(b); motorcycle(b); streetMachines(b);
  // Small planter on roof, with angled fleshy leaves.
  for(const x of [2.1,5.65]) { b.cylinder([x,4.99,.9],.25,.17,.4,'rust'); const rand = random(41); for(let i=0;i<9;i++) { const a=rand()*Math.PI*2; b.beam([x,5.11,.9],[x+Math.cos(a)*.29,5.3+rand()*.4,.9+Math.sin(a)*.29],.035,'leaf'); } }
  railing(b,[-5.28,10.3,-2.7],[-5.28,10.3,1.2]);
}
