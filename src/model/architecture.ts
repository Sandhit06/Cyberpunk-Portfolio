import { C, ModelBuilder, type V3 } from './kit';

export function railing(b: ModelBuilder, a: V3, end: V3, height = .72) {
  b.beam([a[0], a[1] + height, a[2]], [end[0], end[1] + height, end[2]], .034);
  b.beam([a[0], a[1] + .22, a[2]], [end[0], end[1] + .22, end[2]], .022);
  const length = Math.hypot(end[0] - a[0], end[2] - a[2]);
  const n = Math.ceil(length / .36); for (let i = 0; i <= n; i++) { const x = a[0] + (end[0] - a[0]) * i / n, z = a[2] + (end[2] - a[2]) * i / n; b.beam([x, a[1], z], [x, a[1] + height, z], .022); }
}
export function aircon(b: ModelBuilder, at: V3, rotation = 0) {
  b.with(at, [0, rotation, 0], () => {
    b.box([0, 0, 0], [1.15, .66, .45], 'cream', [0, 0, 0], .04);
    b.cylinder([-.23, 0, .25], .235, .235, .035, 'dark', [Math.PI/2, 0, 0], 24);
    for (let i = 0; i < 4; i++) b.torus([-.23, 0, .277], .06 + .046 * i, .008, 'steel');
    for (let i = 0; i < 6; i++) b.box([.31, -.21 + i * .075, .242], [.34, .025, .025], 'dark');
    b.box([-.5, -.4, 0], [.1, .16, .54]); b.box([.5, -.4, 0], [.1, .16, .54]);
    b.pipe([[.47, -.1, -.05], [.75, -.2, -.08], [.77, -.7, -.18]], .035, 'rust');
    b.box([.77,-.7,-.18],[.14,.18,.12],'steel');
  });
}
function windowUnit(b: ModelBuilder, at: V3, rotation = 0, warm = true, width = 1.3, height = 1.5) {
  b.with(at, [0, rotation, 0], () => {
    b.box([0, 0, 0], [width + .16, height + .16, .17], 'dark');
    b.box([0, 0, .095], [width, height, .035], warm ? 'warmWindow' : 'glass');
    b.box([0, -height/2-.07, .17], [width+.3, .1, .34], 'steel');
    b.box([0, 0, .15], [.055, height, .05], 'steel');
    b.box([0, .2, .15], [width, .05, .05], 'steel');
    for (let i = 0; i < 5; i++) b.box([0, height/2 - .1 - i * .09, .135], [width, .047, .04], 'dark');
    if (warm) b.box([width*.27, -.05, .12], [.15, height*.8, .025], 'fabric');
  });
}
export function architecture(b: ModelBuilder) {
  // The restaurant is an actual open volume: kitchen, counter, columns and roof.
  b.box([-1.8, .12, -.3], [7.4, .24, 5.4], 'darkWall');
  b.box([-1.8, 1.9, -2.9], [7.2, 3.7, .24], 'wall');
  b.box([-5.35, 1.85, -.45], [.24, 3.7, 5.1], 'darkWall');
  for (const x of [-5.15, -1.5, 1.75]) { b.box([x, 1.75, 2.08], [.19, 3.5, .22], 'rust'); b.box([x, .18, 2.08], [.34, .36, .35], 'dark'); }
  b.box([-1.8, 3.45, -.3], [7.7, .26, 5.7], 'steel');
  b.box([-1.8, 3.25, 2.2], [7.7, .18, .3], 'dark');
  b.box([-1.9, 1.03, 1.65], [6.5, .12, .9], 'wood', [0, 0, 0], .035);
  b.box([-1.9, .48, 1.63], [6.5, .97, .53], 'wood');
  for (let i = 0; i < 25; i++) b.box([-5 + i*.258, .49, 1.905], [.15, .81, .035], 'rust');
  b.box([-1.8, 1.09, 1.7], [6.7, .045, 1.05], 'steel');
  b.box([-1.8, .95, 2.22], [6.5, .035, .025], 'amber');
  // Tile backsplash, steel shelves, extractor hood and service line.
  b.box([-1.8, 1.56, -2.73], [6.6, 1.55, .03], 'pavement');
  for (const y of [1.05, 2.2, 2.68]) b.box([-1.8, y, -2.3], [6.5, .065, .68], 'steel');
  b.box([-1.5, 2.85, -1.4], [2.2, .48, 1.1], 'dark');
  b.box([-1.5, 2.61, -1.3], [2.4, .09, 1.35], 'steel');
  b.box([-1.5, 3.15, -1.6], [.65, .4, .6], 'steel');
  b.box([.45, .65, -1.6], [1.55, 1.15, 1], 'cream');
  b.box([.45, 1.24, -1.6], [1.6, .06, 1.1], 'steel');
  b.cylinder([.3, 1.46, -1.65], .26, .26, .4, 'steel');
  b.cylinder([.3, 1.68, -1.65], .3, .3, .04, 'chrome');
  b.sign('NIGHT KITCHEN', [-3.85, 2.75, -2.54], [1.8, .65], '#fff0b1', {border:false});
  b.sign('MENU', [.7, 2.42, -2.53], [1.35, 1.1], '#ffdab0', {graphic:'menu'});
  // Deep overhanging canopy, exposed ribs, and fabric valance.
  b.box([-1.75, 3.04, 2.63], [7.6, .13, 1.65], 'fabric', [.16, 0, 0]);
  for (let i = 0; i < 14; i++) b.box([-5.4 + i*.56, 3.05, 2.63], [.028, .045, 1.65], 'steel', [.16, 0, 0]);
  b.box([-1.75, 2.9, 3.43], [7.6, .22, .08], 'dark');
  b.box([-1.75, 2.78, 3.46], [7.35, .035, .028], 'amber');
  for (let i = 0; i < 7; i++) { b.box([-4.65 + i*.98, 2.53, 2.25], [.88, .62, .025], 'red'); b.sign(['W','E','L','C','O','M','E'][i], [-4.65+i*.98,2.53,2.28],[.42,.39],'#ffdfb2',{background:'#612739',border:false}); }
  // Main sign sits on a dimensional steel frame above the canopy.
  b.box([-1.8, 3.95, 2.52], [7.3, .92, .25], 'dark', [0,0,0], .06);
  b.sign('NIGHT SHIFT', [-1.8,3.95,2.665], [7.02,.73], C.amber, {sub:'RAMEN • SAKE • OPEN ALL NIGHT',border:false});
  b.box([-1.8,4.47,2.53],[7.5,.06,.34],'rust');
  for (const x of [-5.38,1.78]) b.box([x,3.95,2.68],[.035,.79,.02],'amber');
  // Narrow hotel grows out of the restaurant, with multiple setbacks.
  b.box([-2.65, 7.27, -.8], [5.35,5.62,4.3], 'plaster', [0,0,0], .055);
  for (const y of [4.65,7.18,9.9]) b.box([-2.65,y,-.8],[5.65,.14,4.55],'darkWall');
  b.box([-2.65,10.18,-1.22],[5.65,.25,3.8],'steel');
  b.box([-3.75,11,-1.15],[2.7,1.45,3.65],'darkWall');
  b.box([-3.75,11.78,-1.15],[2.95,.14,3.9],'steel');
  for (const y of [5.75,8.25]) for (const x of [-4.1,-1.9]) windowUnit(b,[x,y,1.385],0,x === -4.1 || y > 7,1.45,1.55);
  for (const y of [5.8,8.4]) for (const z of [-2,-.1]) windowUnit(b,[.075,y,z],Math.PI/2,z < -1,1.1,1.5);
  for (const y of [5.8,8.3]) for (const z of [-2.1,-.2]) windowUnit(b,[-5.375,y,z],-Math.PI/2,y<7,1.1,1.4);
  for (const x of [-4.1,-2.1]) for (const y of [5.8,8.3]) windowUnit(b,[x,y,-2.98],Math.PI,true,1.1,1.35);
  // Balcony planes make the façade read as architecture from an angle.
  for (const y of [4.86,7.36]) { b.box([-2.9,y,1.73],[4.6,.13,1.08],'steel'); railing(b,[-5.15,y,2.23],[-.6,y,2.23],.69); railing(b,[-5.15,y,1.3],[-5.15,y,2.23],.69); railing(b,[-.6,y,1.3],[-.6,y,2.23],.69); }
  for (const x of [-5.2,.0]) b.pipe([[x,10.1,1.4],[x,9.8,1.49],[x,4.55,1.49],[x,4.3,1.05]],.058,'rust');
  // Hotel blade sign is readable on both faces and stands clear of the wall.
  b.box([-.2,7.72,2.04],[1.1,4.9,.35],'dark',[0,0,0],.065);
  b.sign('HOTEL',[-.2,7.72,2.23],[.92,4.64],C.pink,{vertical:true});
  b.sign('HOTEL',[-.2,7.72,1.85],[.92,4.64],C.pink,{vertical:true,rotation:[0,Math.PI,0]});
  b.box([-.79,7.72,2.04],[.045,4.7,.37],'pink'); b.box([.39,7.72,2.04],[.045,4.7,.37],'pink');
  b.sign('NO VACANCY',[-3.85,10.98,.7],[2.23,.55],C.pink,{border:false});
  aircon(b,[-4.5,9.5,1.62]); aircon(b,[-1.6,9.5,1.62]);
  aircon(b,[-5.65,4.18,-1],-Math.PI/2); aircon(b,[-3.8,7.2,-3.25],Math.PI);
  // Workshop wing: glazed open interior, monitor wall, illuminated portal.
  b.box([3.95,2.26,-2.74],[4.45,4.4,.2],'darkWall');
  b.box([6.13,2.26,-.55],[.19,4.4,4.4],'teal');
  b.box([1.83,2.2,-1.1],[.17,4.3,3.4],'darkWall');
  b.box([3.96,4.48,-.56],[4.6,.22,4.7],'steel');
  b.box([3.96,4.68,-.56],[4.8,.15,4.9],'dark');
  b.box([3.96,3.63,1.71],[4.6,1.44,.21],'teal');
  b.sign('NETRUNNER', [3.96,3.85,1.84], [4.15,.55], C.cyan, {sub:'NEURAL SYSTEMS / SERVICE & REPAIR'});
  b.box([3.96,3.02,1.9],[4.6,.065,.28],'cyan');
  for (const x of [1.81,3.45,6.11]) b.box([x,1.5,1.66],[.12,2.9,.14],'steel');
  b.box([3.96,.25,1.7],[4.4,.38,.22],'dark');
  b.box([4.85,1.1,.65],[2.1,.13,1],'steel');
  for (const x of [4.1,5.6]) b.box([x,.54,.65],[.09,1,.12],'steel');
  for (let i=0;i<3;i++) { b.box([3.7+i*.77,1.83,-2.49],[.68,1.16,.1],'dark'); b.sign(['SYS_01','LINK','DATA'][i],[3.7+i*.77,1.83,-2.42],[.58,1.04],C.cyan,{graphic:'circuit',sub:'CONNECTED'}); }
  b.sign('JACK IN', [5,1.63,.37],[1.28,.71],C.cyan,{graphic:'circuit',sub:'ACCESS TERMINAL'});
  b.box([5,1.63,.29],[1.43,.86,.13],'dark',[0,0,0],.055);
  b.box([5,1.21,.45],[.09,.38,.14],'steel');
  b.box([4.9,1.19,.87],[.8,.035,.23],'dark');
  // A metal service staircase runs down the side; proper individual treads.
  for(let i=0;i<20;i++) { const z = -2.5 + i*.25, y = 4.62-i*.225; b.box([6.86,y,z],[1.25,.06,.29],'steel'); }
  b.beam([6.2,.24,2.5],[6.2,4.74,-2.5],.055); b.beam([7.51,.24,2.5],[7.51,4.74,-2.5],.055);
  for (const x of [6.24,7.48]) { b.beam([x,1.1,2.5],[x,5.59,-2.5],.035); for(let i=0;i<=10;i++) b.beam([x,.24+i*.45,2.5-i*.5],[x,1.1+i*.45,2.5-i*.5],.025); }
  b.box([6.45,4.7,-2.6],[2.35,.1,.75],'steel');
  railing(b,[1.7,4.77,1.83],[6.25,4.77,1.83]); railing(b,[6.25,4.77,1.83],[6.25,4.77,-2.2]);
  // Rear service frontage remains authored when the user orbits.
  b.box([3.6,1.5,-2.92],[1.55,2.8,.14],'dark');
  b.sign('SERVICE / 07',[3.6,2.48,-3.01],[1.2,.35],C.amber,{rotation:[0,Math.PI,0]});
  for(let i=0;i<14;i++) b.box([3.6,.3+i*.15,-3.01],[1.32,.035,.025],'steel');
  b.pipe([[5.75,.2,-3],[5.75,4,-3],[5.4,4.24,-3],[2.8,4.24,-3]],.11,'steel');
  for(const x of [2.15,2.55]) { b.box([x,2.1,-2.99],[.28,.6,.14],'cream'); b.pipe([[x,1.8,-3.02],[x,.2,-3.02]],.025,'rust'); }
  // Keep the main title on the right side of the access ladder so the district marker stays legible.
  b.sign('SECTOR 07',[3.9,3.45,-3.05],[1.65,.42],C.cyan,{rotation:[0,Math.PI,0],sub:'DISTRICT ACCESS'});
  b.sign('AFTER HOURS',[-2.3,2.5,-3.05],[3.45,.9],C.purple,{rotation:[0,Math.PI,0],sub:'THE DISTRICT NEVER SLEEPS'});
  // Rear ladder with hoops and roof access.
  for (const x of [-.65,.05]) b.box([x,5.45,-3.21],[.05,10.3,.05],'steel');
  for(let i=0;i<28;i++) b.box([-.3,.55+i*.36,-3.21],[.74,.032,.08],'steel');
  for(const y of [4,6,8]) b.torus([-.3,y,-3.18],.49,.024,'steel',[Math.PI/2,0,0]);
  // A perpendicular illuminated blade, nested signs and a service-side mural.
  b.box([-5.65,5.5,1.5],[.3,3.22,1.05],'dark',[0,0,0],.045);
  b.sign('LATE BITES',[-5.82,5.5,1.5],[.91,2.97],C.amber,{vertical:true,rotation:[0,-Math.PI/2,0]});
  b.sign('LATE BITES',[-5.48,5.5,1.5],[.91,2.97],C.amber,{vertical:true,rotation:[0,Math.PI/2,0]});
  b.box([-5.67,5.5,2.06],[.35,3.18,.035],'amber');
  b.box([-5.2,3.65,3.28],[.85,1.15,.16],'dark');
  b.sign('24',[-5.2,3.65,3.38],[.73,.99],C.pink,{sub:'OPEN',background:'#241023'});
  b.sign('NIGHT CITY',[-5.5,2.05,-.7],[2.9,1.1],C.purple,{rotation:[0,-Math.PI/2,0],sub:'AFTER HOURS / DISTRICT 07',border:false});
}
