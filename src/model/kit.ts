import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type V3 = [number, number, number];
export const C = { pink: '#ff348d', cyan: '#5df4ef', amber: '#ffb45b', purple: '#9d70ff' };
export function random(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
function texture(kind: 'concrete' | 'metal' | 'asphalt' | 'tile') {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!; const rand = random(101);
  ctx.fillStyle = kind === 'asphalt' ? '#34383d' : kind === 'metal' ? '#9b9b96' : '#8d918e'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 23000; i++) { const a = rand(); ctx.fillStyle = `rgba(${a > .5 ? '255,255,245' : '0,0,0'},${rand() * .14})`; const size = kind === 'asphalt' ? rand() * 2 : rand() * 4; ctx.fillRect(rand() * 512, rand() * 512, size, size); }
  if (kind === 'metal') { for (let i = 0; i < 40; i++) { ctx.fillStyle = '#1c252518'; ctx.fillRect(0, rand() * 512, 512, 1); } }
  if (kind === 'tile') { ctx.strokeStyle = '#30393b'; ctx.lineWidth = 3; for (let i = 0; i < 512; i += 64) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke(); } }
  const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace; map.wrapS = map.wrapT = T.RepeatWrapping; map.anisotropy = 4; return map;
}
export function makeMaterials() {
  const concrete = texture('concrete'), metal = texture('metal'), asphalt = texture('asphalt'), tiles = texture('tile');
  const mat = (color: string, roughness = .7, metalness = .15, map?: T.Texture) => new T.MeshStandardMaterial({ color, roughness, metalness, ...(map ? { map } : {}) });
  const glow = (color: string, power = 3) => new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: power, roughness: .4, toneMapped: false });
  return {
    carPaint: new T.MeshPhysicalMaterial({color:'#344851',metalness:.72,roughness:.24,clearcoat:1,clearcoatRoughness:.16}),
    wall: mat('#bdcbd5', .43, .12), darkWall: mat('#405670', .4, .3), plaster: mat('#d6d8e3', .38, .12),
    steel: mat('#586273', .38, .72, metal), dark: mat('#111a26', .52, .5), rust: mat('#ad8771', .35, .65, metal), cream: mat('#d2c4a3', .6, .15, metal),
    teal: mat('#276365', .4, .55, metal), wood: mat('#9a5036', .7, .05, concrete), red: mat('#87384d', .78), fabric: mat('#306477', .6),
    glass: mat('#172c46', .12, .82), road: mat('#424a51', .6, .3, asphalt), pavement: mat('#a5a7ab', .72, .15, tiles), rubber: mat('#10121b', .95, .02),
    white: mat('#d0d8d7', .4, .35), gold: mat('#ffb750', .32, .5), chrome: mat('#bfcfd4', .2, .9), skin: mat('#9f8376', .85), leaf: mat('#2c6b5d', .85),
    pink: glow(C.pink, 3), cyan: glow(C.cyan, 2.6), amber: glow(C.amber, 2.6), violet: glow(C.purple, 2),
    warmWindow: glow('#ffae60', .8), coldWindow: glow('#3eafc4', .65), lantern: glow('#ff7840', 1.3), redLight: glow('#ff3d4f', 3),
    dim: glow('#93b7c2', .3), screen: glow('#37c6b6', .75),
    skinWarm: mat('#c49a82', .6, .02), skinTan: mat('#a87b65', .64, .02), lips: mat('#81514d', .6),
    leather: mat('#211b21', .37, .12), jacket: mat('#67483c', .57, .1, metal), dress: mat('#672640', .3, .25),
    hair: mat('#21151c', .46, .12), hairRed: mat('#70323d', .45, .1), iris: mat('#59796c', .28), ink: mat('#263639', .85),
    bikeRed: new T.MeshPhysicalMaterial({color:'#ac1527',metalness:.68,roughness:.26,clearcoat:1,clearcoatRoughness:.2}),
    carbon: mat('#161a23',.37,.5,metal), bronze: mat('#a99057',.27,.8), cigar: mat('#764c33',.94),
  };
}
export type Materials = ReturnType<typeof makeMaterials>;
export type MaterialName = keyof Materials;

export class ModelBuilder {
  private buckets = new Map<T.Material, T.BufferGeometry[]>();
  private transform = new T.Matrix4();
  signs: T.Material[] = [];
  constructor(public m: Materials) {}
  with(at: V3, rotation: V3, fn: () => void) { const parent = this.transform; this.transform = parent.clone().multiply(new T.Matrix4().compose(new T.Vector3(...at), new T.Quaternion().setFromEuler(new T.Euler(...rotation)), new T.Vector3(1, 1, 1))); fn(); this.transform = parent; }
  add(geo: T.BufferGeometry, material: MaterialName | T.Material, at: V3 = [0, 0, 0], rotation: V3 = [0, 0, 0]) {
    const local = new T.Matrix4().compose(new T.Vector3(...at), new T.Quaternion().setFromEuler(new T.Euler(...rotation)), new T.Vector3(1, 1, 1));
    geo.applyMatrix4(this.transform.clone().multiply(local));
    const m = typeof material === 'string' ? this.m[material] : material; if (!this.buckets.has(m)) this.buckets.set(m, []); this.buckets.get(m)!.push(geo);
  }
  box(at: V3, size: V3, material: MaterialName = 'steel', rotation: V3 = [0, 0, 0], bevel = 0) { this.add(bevel ? new RoundedBoxGeometry(...size, 1, bevel) : new T.BoxGeometry(...size), material, at, rotation); }
  cylinder(at: V3, top: number, bottom: number, height: number, material: MaterialName = 'steel', rotation: V3 = [0, 0, 0], segments = 16) { this.add(new T.CylinderGeometry(top, bottom, height, segments), material, at, rotation); }
  sphere(at: V3, radius: number, material: MaterialName, scale: V3 = [1, 1, 1]) { const g = new T.SphereGeometry(radius, 16, 12); g.scale(...scale); this.add(g, material, at); }
  torus(at: V3, radius: number, tube: number, material: MaterialName, rotation: V3 = [0, 0, 0]) { this.add(new T.TorusGeometry(radius, tube, 6, 32), material, at, rotation); }
  pipe(points: V3[], radius: number, material: MaterialName = 'steel', smooth = true) { const path = smooth ? new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))) : new T.CurvePath<T.Vector3>(); if (!smooth) for (let i = 0; i < points.length - 1; i++) (path as T.CurvePath<T.Vector3>).add(new T.LineCurve3(new T.Vector3(...points[i]), new T.Vector3(...points[i + 1]))); this.add(new T.TubeGeometry(path, Math.max(8, points.length * 8), radius, 6, false), material); }
  beam(a: V3, b: V3, radius: number, material: MaterialName = 'steel') { const v = new T.Vector3(...b).sub(new T.Vector3(...a)); const g = new T.CylinderGeometry(radius, radius, v.length(), 8); g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), v.clone().normalize())); this.add(g, material, [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2]); }
  profile(points: [number, number][], depth: number, at: V3, material: MaterialName, bevel = .025) { const s = new T.Shape(); s.moveTo(...points[0]); points.slice(1).forEach(p => s.lineTo(...p)); s.closePath(); const g = new T.ExtrudeGeometry(s, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1, steps: 1 }); g.translate(0, 0, -depth / 2); this.add(g, material, at); }
  sign(text: string, at: V3, size: [number, number], color = '#ffb56c', options: { rotation?: V3; sub?: string; vertical?: boolean; background?: string; border?: boolean; graphic?: 'circuit' | 'menu' | 'poster' } = {}) {
    const c = document.createElement('canvas'); c.width = options.vertical ? 256 : 1024; c.height = options.vertical ? 1024 : Math.max(128, Math.round(1024 * size[1] / size[0]));
    const ctx = c.getContext('2d')!; ctx.fillStyle = options.background ?? '#111923'; ctx.fillRect(0, 0, c.width, c.height);
    if (options.border !== false) { ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(12, 12, c.width - 24, c.height - 24); }
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (options.vertical) { const letters = Array.from(text); const h = (c.height - 60) / letters.length; ctx.font = `bold ${Math.min(h * .8, 160)}px sans-serif`; letters.forEach((letter, i) => ctx.fillText(letter, c.width / 2, 30 + h * (i + .5))); }
    else { ctx.font = `bold ${Math.min(c.height * .5, c.width / (text.length * .62))}px sans-serif`; ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.fillText(text, c.width / 2, c.height * (options.sub ? .42 : .5), c.width - 60); ctx.shadowBlur = 0; if (options.sub) { ctx.font = `${Math.min(c.height * .13, 30)}px monospace`; ctx.fillText(options.sub, c.width / 2, c.height * .77, c.width - 75); } }
    if (options.graphic === 'circuit') { const rand = random(11); ctx.lineWidth = 1; for (let i = 0; i < 30; i++) { ctx.strokeStyle = `${color}55`; const x = rand() * c.width, y = rand() * c.height; ctx.strokeRect(x, y, 20 + rand() * 80, 10 + rand() * 50); } }
    if (options.graphic === 'menu') { ctx.textAlign = 'left'; ctx.font = '23px monospace'; ['MISO RAMEN ........ 012','SHOYU RAMEN ....... 014','MIDNIGHT SPECIAL . 018'].forEach((t, i) => ctx.fillText(t, 65, c.height * .6 + i * 39)); }
    if (options.graphic === 'poster') {
      ctx.fillStyle = '#12142b'; ctx.fillRect(0,0,c.width,c.height);
      const cx=c.width*.3,cy=c.height*.45,r=c.height*.31;
      const sunset=ctx.createLinearGradient(0,cy-r,0,cy+r);sunset.addColorStop(0,'#ffba79');sunset.addColorStop(.5,'#f44d84');sunset.addColorStop(1,'#69369f');
      ctx.fillStyle=sunset;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#12142b';for(let i=0;i<8;i++)ctx.fillRect(cx-r,cy+i*r*.12,r*2,3+i);
      ctx.strokeStyle='#64f4eb';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(cx,cy+r*.18,r*.58,r*.18,0,0,Math.PI);ctx.lineTo(cx-r*.45,cy+r*.68);ctx.quadraticCurveTo(cx,cy+r*.87,cx+r*.45,cy+r*.68);ctx.lineTo(cx+r*.58,cy+r*.18);ctx.stroke();
      ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(cx-r*.15+i*20,cy+r*.14);ctx.bezierCurveTo(cx-r*.3+i*20,cy-r*.12,cx+r*.15+i*20,cy-r*.3,cx-r*.12+i*20,cy-r*.47);ctx.stroke();}
      ctx.fillStyle='#ffebd5';ctx.textAlign='left';ctx.font=`bold ${c.height*.145}px sans-serif`;ctx.fillText('AFTER',c.width*.57,c.height*.33);ctx.fillText('HOURS',c.width*.57,c.height*.49);
      ctx.fillStyle='#72ded9';ctx.font=`${c.height*.045}px monospace`;ctx.fillText('GOOD FOOD. BAD HOURS.',c.width*.56,c.height*.67);
      ctx.textAlign='center';ctx.font=`${c.height*.04}px monospace`;ctx.fillText('NIGHT KITCHEN    /    SECTOR 07    /    24 : 00',c.width*.5,c.height*.9);
      ctx.strokeStyle='#72ded955';ctx.lineWidth=2;ctx.strokeRect(14,14,c.width-28,c.height-28);
    }
    const map = new T.CanvasTexture(c); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4;
    const mat = new T.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: 1.45, roughness: .42, metalness: .12, toneMapped: false }); this.signs.push(mat);
    this.add(new T.PlaneGeometry(...size), mat, at, options.rotation);
  }
  finish() { const group = new T.Group(); for (const [mat, geometries] of this.buckets) { const normalized = geometries.map(g => { const n = g.index ? g.toNonIndexed() : g; if (n !== g) g.dispose(); return n; }); const merged = mergeGeometries(normalized, false); if (!merged) throw new Error('Could not combine the district geometry'); normalized.forEach(g => g.dispose()); const mesh = new T.Mesh(merged, mat); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); } this.buckets.clear(); return group; }
  dispose() { for (const gs of this.buckets.values()) gs.forEach(g => g.dispose()); this.buckets.clear(); }
}

export function disposeModel(group: T.Group, materials: Materials) {
  const textures = new Set<T.Texture>(), mats = new Set<T.Material>(Object.values(materials));
  group.traverse(o => { if (o instanceof T.Mesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.add(m)); } });
  mats.forEach(m => { const standard = m as T.MeshStandardMaterial; if (standard.map) textures.add(standard.map); if (standard.emissiveMap) textures.add(standard.emissiveMap); m.dispose(); }); textures.forEach(t => t.dispose());
}
