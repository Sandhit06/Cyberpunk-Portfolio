import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as T from 'three';
import { C, disposeModel, makeMaterials, ModelBuilder, random, type Materials } from './model/kit';
import { architecture } from './model/architecture';
import { props, streets } from './model/props';
import SceneDetails from './SceneDetails';
import BillboardMedia from './BillboardMedia';
import Cast, {type Inspection} from './Cast';

type SceneProps = { started: boolean; reduced: boolean; onProgress: (value: number) => void; onReady: () => void; onError: () => void };
const target = new T.Vector3(0, 5.3, 0);
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

function District({ onProgress, onError }: Pick<SceneProps, 'onProgress' | 'onError'>) {
  const [model, setModel] = useState<T.Group | null>(null);
  useEffect(() => {
    let active = true, result: T.Group | null = null, mats: Materials | null = null, builder: ModelBuilder | null = null;
    const build = async () => {
      try {
        onProgress(8); await frame(); if (!active) return;
        mats = makeMaterials(); builder = new ModelBuilder(mats); onProgress(23); await frame(); if (!active) return;
        streets(builder); architecture(builder); onProgress(55); await frame(); if (!active) return;
        props(builder); onProgress(76); await frame(); if (!active) return;
        result = builder.finish(); onProgress(88); setModel(result);
      } catch (error) { console.error('District construction failed', error); if (active) onError(); }
    };
    void build();
    return () => { active = false; builder?.dispose(); if (mats) disposeModel(result ?? new T.Group(), mats); };
  }, [onProgress, onError]);
  return model ? <primitive object={model} dispose={null}/> : null;
}

function Ready({ onReady, onProgress, onError }: Pick<SceneProps,'onReady'|'onProgress'|'onError'>) {
  const { gl, scene, camera } = useThree(); const compiling = useRef(false); const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useFrame(() => {
    if (compiling.current || !scene.children.some(child => child.type === 'Group' && child.children.length > 20)) return;
    compiling.current = true; onProgress(93);
    void gl.compileAsync(scene, camera).then(async () => { await frame(); await frame(); if (alive.current) onReady(); }).catch(error => { console.error('Shader initialization failed', error); if (alive.current) onError(); });
  }); return null;
}

function Camera({ started, reduced, inspection, onInspect }: Pick<SceneProps,'started'|'reduced'> & {inspection:Inspection;onInspect:(value:Inspection)=>void}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size, gl } = useThree();
  const elapsed = useRef(0); const [arrived, setArrived] = useState(false);
  const travel=useRef<{from:T.Vector3;to:T.Vector3;lookFrom:T.Vector3;lookTo:T.Vector3;t:number}|null>(null);
  const portrait = size.width / size.height < .85;
  const final = useMemo(() => new T.Vector3(portrait ? 35 : 21, portrait ? 20 : 12.8, portrait ? 47 : 27), [portrait]);
  const start = useMemo(() => new T.Vector3(portrait ? 44 : 29, 25, portrait ? 58 : 40), [portrait]);
  useEffect(() => { if (!started) { camera.position.copy(start); camera.lookAt(target); } }, [camera, start, started]);
  useEffect(() => { if (arrived) { camera.position.copy(final); controls.current?.target.copy(target); controls.current?.update(); } }, [portrait]); // Reframe only when orientation changes.
  useEffect(()=>{if(!arrived||!controls.current)return;const lookTo=inspection?new T.Vector3(...inspection.at):target.clone();const to=inspection?lookTo.clone().add(new T.Vector3(.5,.2,1).normalize().multiplyScalar(inspection.distance)):final.clone();travel.current={from:camera.position.clone(),to,lookFrom:controls.current.target.clone(),lookTo,t:0};},[inspection]);
  useEffect(() => {
    gl.domElement.tabIndex = 0; gl.domElement.setAttribute('aria-label','Explore the 3D district. Arrow keys orbit. Plus and minus zoom. R resets.');
    const keyboard = (event: KeyboardEvent) => {
      if (!started || !arrived || !controls.current) return;
      const offset = camera.position.clone().sub(controls.current.target); const spherical = new T.Spherical().setFromVector3(offset);
      if(event.key === 'ArrowLeft') spherical.theta -= .1;
      else if(event.key === 'ArrowRight') spherical.theta += .1;
      else if(event.key === 'ArrowUp') spherical.phi = Math.max(.15,spherical.phi-.08);
      else if(event.key === 'ArrowDown') spherical.phi = Math.min(Math.PI/2-.025,spherical.phi+.08);
      else if(event.key === '+' || event.key === '=') spherical.radius = Math.max(inspection?1.5:10,spherical.radius*.9);
      else if(event.key === '-') spherical.radius = Math.min(90,spherical.radius*1.1);
      else if(event.key.toLowerCase() === 'r'||event.key==='Escape') { onInspect(null);travel.current=null;camera.position.copy(final); controls.current.target.copy(target); controls.current.update(); event.preventDefault(); return; }
      else return;
      event.preventDefault(); camera.position.copy(new T.Vector3().setFromSpherical(spherical).add(controls.current.target)); controls.current.update();
    }; gl.domElement.addEventListener('keydown',keyboard); return () => gl.domElement.removeEventListener('keydown',keyboard);
  }, [started, arrived, camera, final, gl, inspection,onInspect]);
  useFrame((_,delta)=>{const move=travel.current;if(!move||!controls.current)return;move.t+=Math.min(delta,.1);const t=reduced?1:Math.min(1,move.t/1.2),ease=t*t*(3-2*t);camera.position.lerpVectors(move.from,move.to,ease);controls.current.target.lerpVectors(move.lookFrom,move.lookTo,ease);controls.current.update();if(t===1)travel.current=null;});
  useFrame((_, delta) => { if(!started || arrived) return; elapsed.current += Math.min(delta,.1); const t = reduced ? 1 : Math.min(1,elapsed.current/4); const e = t*t*(3-2*t); camera.position.lerpVectors(start,final,e); camera.lookAt(target); if(t === 1) { setArrived(true); gl.domElement.focus({preventScroll:true}); } });
  return <OrbitControls ref={controls} target={[0,5.3,0]} enabled={started && arrived} enablePan={false} enableDamping={!reduced} dampingFactor={.065} minDistance={inspection?1.5:10} maxDistance={90} minPolarAngle={.12} maxPolarAngle={Math.PI/2-.025} rotateSpeed={.62} zoomSpeed={.75} makeDefault/>;
}

function Hologram({ reduced }: { reduced: boolean }) {
  const group = useRef<T.Group>(null);
  const particles = useMemo(() => { const a = new Float32Array(3600); const rand=random(97); for(let i=0;i<a.length;i+=3) { const y=rand(); const angle=rand()*Math.PI*2; const radius=.22+Math.sqrt(y)*.72; a[i]=Math.cos(angle)*radius; a[i+1]=y*.73-.4; a[i+2]=Math.sin(angle)*radius; } return a; }, []);
  useFrame(({clock}) => { if(group.current && !reduced) group.current.rotation.y=clock.elapsedTime*.22; });
  return <group position={[2.5,9.36,-.25]}>
    <mesh position={[0,-1.22,0]}><cylinderGeometry args={[.53,.65,.18,32]}/><meshStandardMaterial color="#202635" metalness={.8} roughness={.28}/></mesh>
    <mesh position={[0,-1.115,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.38,.49,48]}/><meshBasicMaterial color={C.cyan} toneMapped={false}/></mesh>
    <group ref={group}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles,3]}/></bufferGeometry><pointsMaterial color={C.cyan} size={.023} transparent opacity={.72} toneMapped={false} depthWrite={false}/></points>
      <mesh position={[0,.35,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.94,.016,6,64]}/><meshBasicMaterial color={C.cyan} toneMapped={false}/></mesh>
      {[0,1,2].map(i=><mesh key={i} position={[-.3+i*.3,.72,0]} rotation={[0,0,-.4]}><cylinderGeometry args={[.012,.012,.6,6]}/><meshBasicMaterial color={C.pink} toneMapped={false}/></mesh>)}
    </group>
    <mesh position={[0,-.61,0]}><cylinderGeometry args={[.83,.38,1,48,1,true]}/><meshBasicMaterial color={C.cyan} transparent opacity={.035} side={T.DoubleSide} depthWrite={false} blending={T.AdditiveBlending}/></mesh>
    <mesh position={[0,-2.66,0]}><cylinderGeometry args={[.09,.09,2.7,12]}/><meshStandardMaterial color="#354459" metalness={.8}/></mesh>
    <mesh position={[0,.15,-.03]}><torusGeometry args={[1.38,.023,8,96]}/><meshBasicMaterial color={C.pink} toneMapped={false}/></mesh>
  </group>;
}

function Atmosphere({ reduced, started }: Pick<SceneProps,'reduced'|'started'>) {
  const steam = useRef<T.Group>(null);
  const smokeMap = useMemo(() => { const c=document.createElement('canvas'); c.width=c.height=64; const ctx=c.getContext('2d')!; const g=ctx.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'#ffffff70');g.addColorStop(.35,'#ffffff35');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);return new T.CanvasTexture(c); },[]);
  useEffect(()=>()=>smokeMap.dispose(),[smokeMap]);
  useFrame(({clock})=> { if(reduced || !started) return; if(steam.current) steam.current.children.forEach((sprite,i)=>{ const p=(clock.elapsedTime*.14+i/12)%1; sprite.position.set(-3.3+Math.sin(p*5+i)*p*.3,3.55+p*2.1,2.6+Math.sin(p*3)*.3); sprite.scale.setScalar(.3+p*1.6); (sprite as T.Sprite).material.opacity=Math.sin(p*Math.PI)*.14; }); });
  return <><group ref={steam}>{Array.from({length:12},(_,i)=><sprite key={i} position={[-3.3,4+i*.1,2.6]}><spriteMaterial map={smokeMap} color="#c2c6d7" transparent opacity={0} depthWrite={false}/></sprite>)}</group></>;
}

function World(p: SceneProps) {
  const [inspection,onInspect]=useState<Inspection>(null);
  return <>
    <color attach="background" args={['#03040a']}/><fog attach="fog" args={['#03040a',38,95]}/>
    <Camera started={p.started} reduced={p.reduced} inspection={inspection} onInspect={onInspect}/>
    <ambientLight intensity={.55} color="#758aa9"/><hemisphereLight args={['#9bafdf','#272039',1.3]}/>
    <directionalLight position={[4,18,9]} intensity={2.4} color="#a6c9f2" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={18} shadow-camera-bottom={-15} shadow-normalBias={.025} shadow-bias={-.00012}/>
    <directionalLight position={[-12,10,-6]} intensity={1.5} color="#b175a3"/>
    <pointLight position={[-2,2.6,2.5]} intensity={65} color={C.amber} distance={12} decay={2}/>
    <pointLight position={[-1.7,1.8,-1]} intensity={22} color="#ff9c48" distance={6}/>
    <pointLight position={[.3,7.3,3]} intensity={105} color={C.pink} distance={12}/>
    <pointLight position={[4.7,2.1,1.1]} intensity={55} color={C.cyan} distance={9}/>
    <pointLight position={[2.5,9.6,.2]} intensity={30} color={C.cyan} distance={6}/>
    <pointLight position={[-6,5.9,3.6]} intensity={38} color="#f8bf8b" distance={11}/>
    <pointLight position={[-1.4,.5,5.3]} intensity={10} color={C.cyan} distance={5}/>
    <Environment resolution={64} frames={1}><Lightformer form="rect" intensity={1.3} color="#8299ba" position={[0,12,0]} rotation={[Math.PI/2,0,0]} scale={[18,18,1]}/><Lightformer intensity={2} color={C.cyan} position={[12,5,2]} rotation={[0,-Math.PI/2,0]} scale={[4,8,1]}/><Lightformer intensity={2} color={C.pink} position={[-9,4,2]} rotation={[0,Math.PI/2,0]} scale={[3,6,1]}/></Environment>
    <District onProgress={p.onProgress} onError={p.onError}/>
    <SceneDetails reduced={p.reduced}/>
    <BillboardMedia started={p.started} reduced={p.reduced}/>
    <Cast started={p.started} reduced={p.reduced} onInspect={onInspect}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.015,0]} receiveShadow>
      <planeGeometry args={[18.8,13.8]}/><MeshReflectorMaterial resolution={512} blur={[35,15]} mixBlur={.18} mixStrength={1.1} mirror={.85} minDepthThreshold={.4} maxDepthThreshold={1.4} depthScale={.3} color="#819da8" metalness={.3} roughness={.12}/>
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.12,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#090b13" roughness={.75} metalness={.15}/></mesh>
    <Hologram reduced={p.reduced}/><Atmosphere reduced={p.reduced} started={p.started}/>
    <EffectComposer multisampling={0}><Bloom intensity={.64} luminanceThreshold={1.15} luminanceSmoothing={.2} mipmapBlur/><Vignette eskil={false} offset={.2} darkness={.35}/></EffectComposer>
    <Ready onProgress={p.onProgress} onReady={p.onReady} onError={p.onError}/>
  </>;
}
export default function Scene(p: SceneProps) {
  return <Canvas shadows dpr={[1,1.5]} camera={{position:[29,23,40],fov:40,near:.1,far:180}} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>{ gl.domElement.addEventListener('webglcontextlost',p.onError); }}><World {...p}/></Canvas>;
}
