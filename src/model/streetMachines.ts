import { C, ModelBuilder } from './kit';

export function streetMachines(b:ModelBuilder){
  // Recessed product bay, real cans, payment console and retrieval drawer.
  b.with([8.55,.12,3.55],[0,-.1,0],()=>{
    b.box([0,1.17,0],[1.3,2.34,.8],'cream',[0,0,0],.075);
    b.box([0,1.18,.41],[1.16,2.17,.06],'dark',[0,0,0],.04);
    b.sign('AFTER FUEL',[0,2.13,.452],[1.07,.25],C.cyan,{sub:'COLD DRINKS / 24H',border:false});
    b.box([-.15,1.35,.45],[.78,1.13,.025],'glass');
    for(let row=0;row<3;row++){
      b.box([-.15,.92+row*.33,.51],[.76,.035,.2],'chrome');
      for(let col=0;col<3;col++){
        const x=-.4+col*.25,y=1.06+row*.33;
        b.cylinder([x,y,.5],.068,.068,.22,row===0?'teal':row===1?'red':'gold', [0,0,0],20);
        b.cylinder([x,y+.112,.5],.062,.062,.008,'chrome');
        b.box([x,y,.566],[.075,.065,.008],'cream');
      }
    }
    b.sign('TAP',[.43,1.68,.462],[.2,.25],C.cyan,{sub:'PAY',border:false});
    for(let i=0;i<6;i++)b.cylinder([.42,1.38-i*.095,.47],.025,.025,.016,'amber',[Math.PI/2,0,0],12);
    b.box([0,.5,.46],[.96,.28,.08],'steel',[0,0,0],.04);
    b.box([0,.52,.509],[.78,.13,.015],'dark');
    b.box([0,.38,.57],[.89,.035,.18],'chrome');
    for(const side of [-1,1])b.box([side*.575,1.33,.465],[.018,1.53,.018],'cyan');
    for(let i=0;i<7;i++)b.box([-.35+i*.115,.19,.435],[.055,.13,.02],'dark');
    b.sign('FUEL',[.663,1.4,0],[.6,1.45],C.pink,{rotation:[0,Math.PI/2,0],vertical:true});
  });
  // Arcade beside the right facade, clear of the staircase and its landing.
  b.with([6.7,.12,-4.75],[0,Math.PI+.2,0],()=>{
    b.box([0,.63,0],[.87,1.26,.8],'dark',[0,0,0],.045);
    for(const side of [-1,1])b.box([side*.47,1.2,-.1],[.09,2.35,.96],'teal',[0,0,0],.035);
    b.box([0,2.23,-.1],[.95,.34,.96],'dark',[0,0,0],.035);
    b.sign('NIGHT RUN',[0,2.23,.397],[.85,.25],C.pink,{border:false});
    b.box([0,1.64,.05],[.83,.78,.12],'carbon',[-.18,0,0]);
    b.sign('INSERT COIN',[0,1.64,.13],[.71,.59],C.cyan,{graphic:'circuit',sub:'PLAYER 01',rotation:[-.18,0,0]});
    b.box([0,1.16,.43],[.94,.13,.52],'steel',[-.12,0,0],.025);
    b.cylinder([-.23,1.3,.5],.018,.018,.18,'chrome');b.sphere([-.23,1.4,.5],.055,'red');
    for(let i=0;i<3;i++)b.cylinder([.05+i*.12,1.25,.5],.045,.045,.025,i%2?'pink':'cyan');
    b.box([0,.69,.42],[.28,.32,.035],'steel');b.box([0,.75,.45],[.12,.018,.015],'amber');
    for(const side of [-1,1])b.box([side*.44,1.1,.46],[.018,1.9,.018],'violet');
  });
  // Wayfinding at the crossing: arrow silhouettes, street name, pedestrian LEDs.
  b.with([-8.65,0,4.55],[0,.15,0],()=>{
    b.box([0,.1,0],[.5,.18,.48],'steel',[0,0,0],.035);
    b.cylinder([0,1.75,0],.055,.085,3.5,'steel');
    const labels=['PROJECTS >','< ABOUT','CONTACT >'];
    for(let i=0;i<3;i++){
      const y=1.28+i*.48;
      b.profile([[-.58,y-.17],[.45,y-.17],[.64,y],[.45,y+.17],[-.58,y+.17]],.12,[0,0,.05],'dark');
      b.sign(labels[i],[0,y,.12],[1.04,.26],[C.pink,C.cyan,C.amber][i],{border:false});
    }
    b.box([0,3.12,0],[.57,.7,.28],'dark',[0,0,0],.04);
    b.sign('WALK',[0,3.1,.155],[.46,.52],C.cyan,{sub:'07',border:false});
    b.box([0,3.68,0],[1.25,.28,.12],'gold');
    b.sign('SECTOR 07',[0,3.68,.07],[1.13,.2],'#101a24',{background:'#ffcb35',border:false});
  });
}
