import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as T from 'three';
import { createFigure, type Figure } from './model/figures';
import { disposeModel, makeMaterials, type V3 } from './model/kit';

export type Inspection = { at: V3; distance: number } | null;
const placements: {at:V3; angle:number; female:boolean; scale:number}[] = [
  {at:[-5.05,.14,3.68],angle:.35,female:false,scale:1.09},
  {at:[3.01,.14,3.49],angle:.3,female:true,scale:1.07},
  {at:[4.86,.14,.99],angle:2.8,female:false,scale:1},
  {at:[-2.6,.14,.04],angle:.2,female:true,scale:1},
];
export default function Cast({started,reduced,onInspect}:{started:boolean;reduced:boolean;onInspect:(value:Inspection)=>void}){
  const [figures,setFigures]=useState<Figure[]>([]);const time=useRef(0);const smoke=useRef<T.Group>(null);
  const [smokeMap,setSmokeMap]=useState<T.CanvasTexture|null>(null);
  useEffect(()=>{
    const materials=makeMaterials();const cast=placements.map((p,i)=>createFigure(materials,p.female,i));
    const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d')!;const g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#ffffff90');g.addColorStop(.45,'#ffffff30');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);const map=new T.CanvasTexture(c);setSmokeMap(map);setFigures(cast);
    return()=>{const all=new T.Group();cast.forEach(f=>all.add(f.root));disposeModel(all,materials);map.dispose();};
  },[]);
  useFrame((_,dt)=>{
    if(!started)return;
    if(!reduced)time.current+=Math.min(dt,.05);
    figures.forEach((f,i)=>{
      const t=time.current+i*1.83;
      const idle=reduced?0:Math.sin(t*1.4);
      f.torso.scale.y=1+idle*.0035;
      f.head.rotation.y=(placements[i].female?-.14:.08)+(reduced?0:Math.sin(t*.34)*.075);
      f.head.rotation.z=reduced?0:Math.sin(t*.51)*.016;
      if(placements[i].female){f.arm.rotation.z=reduced?0:Math.sin(t*.7)*.025;f.torso.rotation.y=reduced?0:Math.sin(t*.42)*.018;}
      else {const cycle=t%12;const raised=cycle<3?T.MathUtils.smoothstep(cycle,0,3):cycle<7?1:1-T.MathUtils.smoothstep(cycle,7,10);f.arm.rotation.x=reduced?0:(1-raised)*1.02;f.arm.rotation.z=reduced?0:(1-raised)*-.13;if(f.ember)f.ember.scale.setScalar(1+raised*.5);}
    });
    if(smoke.current && figures[0]){
      const origin=new T.Vector3();figures[0].smokeOrigin.getWorldPosition(origin);
      smoke.current.children.forEach((o,i)=>{const p=(time.current*.26+i/14)%1;const s=o as T.Sprite;s.position.copy(origin).add(new T.Vector3(Math.sin(p*5+i)*p*.09,p*.7,Math.cos(p*3+i)*p*.06));s.scale.setScalar(.018+p*.22);s.material.opacity=reduced?0:Math.sin(p*Math.PI)*.16;});
    }
  });
  return <>
    {figures.map((figure,i)=>{const p=placements[i];return <group key={i} position={p.at} rotation={[0,p.angle,0]} scale={p.scale} onDoubleClick={event=>{event.stopPropagation();onInspect({at:[p.at[0],p.at[1]+1.12,p.at[2]],distance:3.9});}}><primitive object={figure.root} dispose={null}/></group>;})}
    <mesh position={[-1.4,.95,5.3]} rotation={[0,-.17,0]} onDoubleClick={event=>{event.stopPropagation();onInspect({at:[-1.4,.82,5.3],distance:4.2});}}><boxGeometry args={[3.4,1.55,.95]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
    <group ref={smoke}>{smokeMap&&Array.from({length:14},(_,i)=><sprite key={i}><spriteMaterial map={smokeMap} color="#b6c2cd" transparent opacity={0} depthWrite={false}/></sprite>)}</group>
  </>;
}
