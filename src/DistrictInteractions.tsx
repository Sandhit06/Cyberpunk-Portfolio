import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as T from 'three';
import type { Inspection } from './Cast';
import type { V3 } from './model/kit';

const destinations = {
  projects: {id:'projects',at:[8.55,1.35,3.55] as V3,distance:4,direction:[-.1,.08,1] as V3},
  about: {id:'about',at:[-5.05,1.25,3.68] as V3,distance:4,direction:[-.4,.12,1] as V3},
  games: {id:'games',at:[6.7,1.3,-4.75] as V3,distance:4,direction:[-.2,.1,-1] as V3},
  car: {id:'car',at:[-7.7,.85,-.6] as V3,distance:6,direction:[-1,.35,.65] as V3},
};
type Destination=keyof typeof destinations;

function Hit({at,size,go}:{at:V3;size:V3;go:()=>void}) {
  return <mesh position={at} onClick={e=>{if(e.delta>4)return;e.stopPropagation();go();}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer';}} onPointerOut={()=>{document.body.style.cursor='';}}>
    <boxGeometry args={size}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/>
  </mesh>;
}

function FuelMascot({active}:{active:boolean}) {
  const bot=useRef<T.Group>(null);
  useFrame(({clock})=>{if(bot.current)bot.current.position.y=1.35+(active?Math.sin(clock.elapsedTime*2)*.035:0);});
  return <group position={[8.55,.12,3.55]} rotation={[0,-.1,0]}>
    <mesh position={[-.15,1.35,.625]}><boxGeometry args={[.79,1.15,.025]}/><meshStandardMaterial color="#072e35" emissive="#12665b" emissiveIntensity={.5}/></mesh>
    <group ref={bot} position={[-.15,1.35,.65]}>
      <mesh><sphereGeometry args={[.23,24,16]}/><meshStandardMaterial color="#55dfba" metalness={.3} roughness={.3}/></mesh>
      <mesh position={[0,.03,.23]}><boxGeometry args={[.33,.13,.07]}/><meshStandardMaterial color="#102632"/></mesh>
      {[-1,1].map(side=><group key={side}>
        <mesh position={[side*.085,.04,.275]}><sphereGeometry args={[.027,12,8]}/><meshBasicMaterial color="#b6fff0"/></mesh>
        <mesh position={[side*.25,-.08,.01]} rotation={[0,0,side*.6]}><capsuleGeometry args={[.035,.14,4,8]}/><meshStandardMaterial color="#ffb650"/></mesh>
      </group>)}
      <mesh position={[0,.29,0]}><sphereGeometry args={[.045,12,8]}/><meshBasicMaterial color="#ffb650"/></mesh>
      <mesh position={[0,-.3,0]}><cylinderGeometry args={[.13,.1,.2,16]}/><meshStandardMaterial color="#354c65"/></mesh>
    </group>
  </group>;
}

export default function DistrictInteractions({started,inspection,onInspect}:{started:boolean;inspection:Inspection;onInspect:(v:Inspection)=>void}) {
  const [page,setPage]=useState<Destination|null>(null);
  const [project,setProject]=useState<string|null>(null);
  const [round,setRound]=useState({score:0,target:4});
  const panel=useRef<HTMLDivElement>(null);
  const open=(id:Destination)=>{onInspect(destinations[id]);setPage(id);setProject(null);};
  const close=()=>{setPage(null);onInspect(null);};
  useEffect(()=>{if(!inspection?.id)setPage(null);},[inspection]);
  useEffect(()=>{
    if(!page)return;
    const timer=setTimeout(()=>panel.current?.focus(),0);
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){setPage(null);onInspect(null);}
      if(e.key==='Tab'&&panel.current){const nodes=Array.from(panel.current.querySelectorAll<HTMLElement>('button,a[href]'));const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
    };
    window.addEventListener('keydown',key);return()=>{clearTimeout(timer);window.removeEventListener('keydown',key);};
  },[page,onInspect]);
  return <>
    <FuelMascot active={started&&!matchMedia('(prefers-reduced-motion: reduce)').matches}/>
    {started&&<>
      <Hit at={[8.55,1.3,3.55]} size={[1.4,2.6,1.2]} go={()=>open('projects')}/>
      <Hit at={[6.7,1.3,-4.75]} size={[1.2,2.6,1.3]} go={()=>open('games')}/>
      <Hit at={[-7.7,.9,-.6]} size={[2.3,1.8,5]} go={()=>open('car')}/>
      {(['projects','about','games'] as const).map((id,i)=><Hit key={id} at={[-8.65,1.28+i*.48,4.64]} size={[1.35,.35,.3]} go={()=>open(id)}/>)}
      <group position={[-8.65,0,4.55]} rotation={[0,.15,0]}>
        {(['projects','about','games'] as const).map((id,i)=><Html key={id} transform position={[0,1.28+i*.48,.18]} distanceFactor={1}>
          <button className={`street-arrow arrow-${id}`} aria-label={`Explore ${id}`} onClick={()=>open(id)}>{id==='about'?'← ABOUT':id.toUpperCase()+' →'}</button>
        </Html>)}
      </group>
      {inspection&&<Html fullscreen calculatePosition={(_object,_camera,size)=>[size.width/2,size.height/2]} style={{pointerEvents:'none'}}>
        {page&&page!=='car'?<div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={page==='projects'?'After Fuel project terminal':page==='games'?'Night Run arcade':'About Sandhit'} className="district-terminal">
          <header><span>SECTOR 07 / {page.toUpperCase()}</span><button onClick={close} aria-label="Close and return to street">×</button></header>
          {page==='projects'&&<><p className="terminal-eyebrow">AFTER FUEL · CREATIVE ENERGY</p><h2>Pick your next fix.</h2><p>Two builds from this district. Tap a cartridge to explore.</p><div className="project-cartridges">
            <button onClick={()=>setProject('portfolio')}><i className="cartridge cyan">3D</i><strong>After Hours</strong><span>Interactive portfolio</span></button>
            <button onClick={()=>setProject('gta')}><i className="cartridge amber">GTA</i><strong>GTA Unity</strong><span>Browser game</span></button>
          </div>{project&&<section className="project-detail"><h3>{project==='gta'?'GTA Unity':'After Hours'}</h3><p>{project==='gta'?'Explore Sandhit’s Unity game project and playable browser build.':'The district you are standing in: an interactive scene built with React, Three.js and original procedural geometry.'}</p>{project==='gta'?<><a href="https://gta-unity.vercel.app/" target="_blank" rel="noreferrer">Play the build ↗</a><a href="https://github.com/Sandhit06/GTA-Unity" target="_blank" rel="noreferrer">View source ↗</a></>:<button onClick={close}>Return to the district →</button>}</section>}</>}
          {page==='about'&&<><p className="terminal-eyebrow">MEET THE BUILDER</p><h2>Sandhit.</h2><p>An Indian creator building interactive worlds, games and a portfolio you can walk around.</p><p>This district brings together a love of cyberpunk cities and playful 3D experiences.</p><a href="https://github.com/Sandhit06" target="_blank" rel="noreferrer">Explore my GitHub ↗</a></>}
          {page==='games'&&<><p className="terminal-eyebrow">NIGHT RUN / SIGNAL HUNT</p><h2>Catch the signal.</h2><p>Tap the glowing tile. Each hit reroutes the signal.</p><output aria-live="polite">{round.score.toString().padStart(2,'0')} CONNECTIONS</output><div className="signal-grid">{Array.from({length:9},(_,i)=><button aria-label={`Signal tile ${i+1}${round.target===i?', active':''}`} key={i} className={round.target===i?'lit':''} onClick={()=>{if(i===round.target)setRound(r=>({score:r.score+1,target:(r.target+1+Math.floor(Math.random()*8))%9}));}}>{round.target===i?'✦':'·'}</button>)}</div><button onClick={()=>setRound({score:0,target:4})}>Reset score</button></>}
          <footer><button onClick={close}>← Back to the street</button><small>ESC TO EXIT</small></footer>
        </div>:<button className="inspection-back" onClick={close}>← Back to the street</button>}
      </Html>}
    </>}
  </>;
}
