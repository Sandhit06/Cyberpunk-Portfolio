import * as T from 'three';
import { ModelBuilder } from './kit';

export function motorcycle(b:ModelBuilder){
  b.with([-1.4,.14,5.3],[0,-.17,-.065],()=>{
    // Front is -X: broad low nose, sunken saddle, raised angular tail.
    for(const x of [-1.14,1.09]){
      b.cylinder([x,.48,0],.465,.465,.29,'rubber',[Math.PI/2,0,0],48);
      for(const side of [-1,1]){
        const z=side*.156;
        b.torus([x,.48,z],.374,.028,'bronze');
        b.cylinder([x,.48,side*.165],.341,.341,.032,x<0?'bikeRed':'chrome',[Math.PI/2,0,0],40);
        b.cylinder([x,.48,side*.19],.162,.162,.034,'carbon',[Math.PI/2,0,0],24);
        b.cylinder([x,.48,side*.216],.087,.087,.04,x<0?'steel':'teal',[Math.PI/2,0,0]);
        for(let i=0;i<10;i++){const a=i*Math.PI/5;b.cylinder([x+Math.cos(a)*.255,.48+Math.sin(a)*.255,side*.189],.04,.04,.012,'dark',[Math.PI/2,0,0],12);}
        for(let i=0;i<44;i++){const a=i*Math.PI*2/44;b.box([x+Math.cos(a)*.456,.48+Math.sin(a)*.456,side*.085],[.012,.024,.05],'dark',[0,0,a]);}
        b.torus([x,.48,side*.184],.326,.009,'chrome');
      }
    }
    b.profile([[-1.57,.97],[-1.32,1.2],[-.64,1.41],[-.24,1.32],[-.43,.81],[-.86,.71],[-1.29,.77]],.64,[0,0,0],'bikeRed',.045);
    b.profile([[-1.55,1.015],[-1.25,1.245],[-.65,1.45],[-.34,1.38],[-.73,1.15]],.59,[0,0,0],'carbon',.017);
    b.profile([[-.64,.47],[-.72,.75],[-.26,1.19],[.14,1.05],[.23,.65],[.7,.59],[.73,.36],[-.29,.32]],.55,[0,0,0],'steel',.05);
    b.profile([[.14,1.05],[.35,.93],[.84,.95],[1.1,1.22],[1.51,1.28],[1.41,.98],[1.09,.69],[.6,.67]],.61,[0,0,0],'bikeRed',.035);
    b.profile([[-.1,1.12],[.21,1.05],[.43,1.0],[.84,1.02],[.96,1.18],[.78,1.16],[.53,1.1],[.17,1.12]],.43,[0,0,0],'leather',.03);
    b.box([1.21,1.31,0],[.69,.075,.67],'bikeRed',[0,0,-.09],.03);
    b.box([1.52,1.19,0],[.023,.1,.52],'redLight');
    for(const side of [-1,1]){
      b.profile([[-1.28,.83],[-.8,1.18],[-.43,1.25],[-.37,.91],[-.64,.6],[-.92,.63]],.034,[0,0,side*.344],'bikeRed',.018);
      b.profile([[-.54,.69],[-.33,1.03],[-.12,.97],[-.18,.66]],.036,[0,0,side*.351],'cream',.013);
      for(let i=0;i<5;i++)b.box([-.24,.65+i*.052,side*.36],[.29,.018,.018],'carbon',[0,0,.17]);
      b.cylinder([-.21,.48,side*.34],.24,.24,.07,'carbon',[Math.PI/2,0,0],40);
      b.cylinder([-.21,.48,side*.389],.19,.19,.018,'steel',[Math.PI/2,0,0],32);
      b.torus([-.21,.48,side*.403],.155,.016,'chrome');
      b.cylinder([-.57,.64,side*.37],.115,.115,.065,'chrome',[Math.PI/2,0,0],24);
      b.cylinder([-.57,.64,side*.411],.083,.083,.025,'teal',[Math.PI/2,0,0]);
      for(let i=0;i<14;i++){const a=i*Math.PI/7;b.box([-.21+Math.cos(a)*.171,.48+Math.sin(a)*.171,side*.407],[.009,.037,.009],'dark',[0,0,a]);}
      b.beam([.18,.39,side*.32],[1.09,.48,side*.225],.055,'steel');
      b.beam([-.69,1.1,side*.22],[-1.14,.48,side*.21],.037,'chrome');
      b.beam([-.97,.74,side*.22],[-1.14,.48,side*.21],.056,'bikeRed');
      b.pipe([[.23,.72,side*.33],[.45,.63,side*.34],[.74,.36,side*.32]],.034,'chrome');
      for(let i=0;i<9;i++) b.torus([.42+i*.025,.61-i*.026,side*.34],.053,.008,'bikeRed',[0,0,-.75]);
      b.pipe([[-.43,.28,side*.23],[-.15,.24,side*.28],[.42,.28,side*.32],[.75,.4,side*.33]],.057,'steel');
      b.cylinder([.78,.42,side*.34],.07,.063,.24,'carbon',[0,0,-.8]);
      b.box([.32,.65,side*.41],[.28,.035,.09],'chrome',[0,0,.25]);
      b.beam([-.55,1.24,side*.2],[-.42,1.32,side*.43],.022,'steel');
      b.beam([-.42,1.32,side*.43],[-.31,1.3,side*.5],.026,'rubber');
      // Geometric livery inset into the body, readable from either side.
      b.profile([[-.92,.92],[-.82,1.13],[-.76,1.13],[-.86,.92]],.009,[0,0,side*.372],'cream',0);
      b.profile([[-.78,.93],[-.68,1.16],[-.62,1.16],[-.72,.93]],.009,[0,0,side*.372],'cream',0);
      for(let i=0;i<5;i++)b.cylinder([.75+i*.1,1.075,side*.326],.013,.013,.01,'chrome',[Math.PI/2,0,0],8);
    }
    b.box([-1.51,.947,0],[.08,.049,.44],'cyan',[0,0,-.32]);
    b.beam([.3,.43,.21],[.47,.045,.46],.025,'steel');
    // Functional front assembly: twin fork tubes, steering crown, handlebar and a recessed headlamp.
    for(const side of [-1,1]){
      b.beam([-1.02,.82,side*.18],[-1.34,1.56,side*.24],.045,'chrome');
      b.beam([-1.11,.84,side*.22],[-1.42,1.55,side*.29],.022,'teal');
      b.cylinder([-1.37,1.52,side*.27],.07,.07,.1,'carbon',[Math.PI/2,0,0],18);
      b.box([-1.39,1.57,side*.42],[.24,.035,.045],'steel',[0,0,.08]);
      b.box([-1.54,1.58,side*.53],[.08,.026,.06],'rubber',[0,0,.08]);
      b.cylinder([-1.54,1.28,side*.29],.12,.12,.035,'lantern',[Math.PI/2,0,0],24);
    }
    b.box([-1.61,1.29,0],[.055,.19,.31],'carbon',[0,0,-.08]);
    b.box([-1.66,1.31,0],[.018,.085,.22],'lantern',[0,0,0]);
    b.torus([-1.68,1.31,0],.096,.012,'chrome',[Math.PI/2,0,0]);
    // Brake discs, calipers and a visible drive chain give the wheels mechanical depth.
    for(const side of [-1,1]){
      b.cylinder([-1.14,.48,side*.24],.22,.22,.022,'steel',[Math.PI/2,0,0],32);
      b.torus([-1.14,.48,side*.255],.17,.012,'bikeRed',[Math.PI/2,0,0]);
      b.box([-1.28,.61,side*.275],[.07,.13,.035],'dark',[0,0,-.2]);
      b.cylinder([1.09,.48,side*.24],.2,.2,.022,'steel',[Math.PI/2,0,0],32);
      b.torus([1.09,.48,side*.255],.14,.01,'bikeRed',[Math.PI/2,0,0]);
      b.beam([.72,.43,side*.37],[1.07,.49,side*.37],.018,'gold');
      for(let i=0;i<13;i++){
        const a=i*Math.PI*2/13;
        b.box([1.09+Math.cos(a)*.157,.48+Math.sin(a)*.157,side*.278],[.012,.034,.018],'dark',[0,0,a]);
      }
    }
    // Battery housing, cooling ribs, rear shock and foot controls expose the powertrain.
    b.box([.02,.64,0],[.72,.32,.48],'carbon',[0,0,-.04],.08);
    for(let i=0;i<7;i++) b.box([-.25+i*.09,.67,.258],[.045,.18,.018],'chrome',[0,0,.05]);
    for(const side of [-1,1]){
      b.beam([.53,.62,side*.25],[.83,.49,side*.29],.034,'bronze');
      b.beam([.83,.49,side*.29],[1.08,.47,side*.24],.026,'chrome');
      b.box([.53,.38,side*.39],[.23,.045,.12],'rubber',[0,0,.12]);
      b.cylinder([.58,.37,side*.38],.04,.04,.2,'steel',[0,0,Math.PI/2],16);
    }
    b.pipe([[.62,.92,0],[.72,.7,0],[.6,.45,0]],.045,'bronze');
    b.torus([.67,.68,0],.13,.018,'bikeRed',[0,Math.PI/2,0]);
    // Small marker lights and underglow break up the silhouette in the rainy street.
    b.box([-.75,.73,.39],[.22,.018,.014],'teal',[0,0,.04]);
    b.box([.72,.77,.39],[.25,.018,.014],'redLight',[0,0,-.04]);
    b.beam([-.85,.29,.03],[.82,.29,.03],.018,'teal');
    // Wheel arches wrap the tires instead of forming rectangular fenders.
    for(const x of [-1.14,1.09]) {const g=new T.TorusGeometry(.496,.036,8,36,Math.PI*.72);g.rotateZ(Math.PI*.14);b.add(g,'bikeRed',[x,.48,0]);}
  });
}
