import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as T from 'three';
import { C, ModelBuilder, makeMaterials, disposeModel, type V3 } from './model/kit';

const units: {at:V3;angle:number}[] = [
  {at:[-4.5,9.5,1.62],angle:0},{at:[-1.6,9.5,1.62],angle:0},
  {at:[-5.65,4.18,-1],angle:-Math.PI/2},{at:[-3.8,7.2,-3.25],angle:Math.PI},
  {at:[3,5.27,-1.7],angle:0},
];
function Fan({at,angle,reduced}:{at:V3;angle:number;reduced:boolean}){
  const rotor=useRef<T.Group>(null);
  useFrame((_,dt)=>{if(rotor.current&&!reduced)rotor.current.rotation.z+=Math.min(dt,.05)*5;});
  return <group position={at} rotation={[0,angle,0]}>
    <group position={[-.23,0,.27]}>
      <group ref={rotor}>
        {[0,1,2,3,4].map(i=><group key={i} rotation={[0,0,i*Math.PI*2/5]}>
          <mesh position={[.09,.045,0]} rotation={[.2,.12,-.45]} scale={[1,.48,.18]}><sphereGeometry args={[.125,12,8]}/><meshStandardMaterial color="#c7e6e9" metalness={.6} roughness={.3}/></mesh>
        </group>)}
      </group>
      <mesh position={[0,0,.025]}><sphereGeometry args={[.05,16,8]}/><meshStandardMaterial color="#648b9f" metalness={.7} roughness={.3}/></mesh>
      <mesh position={[0,0,.025]}><torusGeometry args={[.225,.008,6,48]}/><meshStandardMaterial color="#6af5eb" emissive="#6af5eb" emissiveIntensity={.5}/></mesh>
    </group>
  </group>;
}
export default function SceneDetails({reduced}:{reduced:boolean}){
  const details=useMemo(()=>{
    const materials=makeMaterials(),b=new ModelBuilder(materials);
    const board=(at:V3,w:number,h:number,text:string,sub:string,color:string,angle=0)=>{
      b.with(at,[0,angle,0],()=>{
        b.box([0,0,0],[w+.18,h+.18,.22],'dark',[0,0,0],.06);
        b.sign(text,[0,0,.125],[w,h],color,{sub,graphic:'circuit',background:'#0c1930'});
        b.sign(text,[0,0,-.125],[w,h],color,{sub,graphic:'circuit',background:'#0c1930',rotation:[0,Math.PI,0]});
        for(const side of [-1,1]){
          b.box([side*(w/2+.06),0,.12],[.025,h,.04],'cyan');
          b.beam([side*w*.35,-h/2,0],[side*w*.35,-h/2-.85,0],.045,'steel');
        }
      });
    };
    board([-2.7,12.35,1.05],5.8,1.65,'AFTER HOURS','FOOD / CULTURE / CONNECTION',C.cyan);
    board([3.85,9.9,-2.3],4.4,2.15,'NEURAL CITY','STAY CONNECTED  /  24 : 07',C.purple);
    board([-5.57,9,-.75],2.8,1.35,'NIGHT LIFE','ALWAYS AWAKE',C.pink,-Math.PI/2);
    board([-.9,11,-3.22],3.3,1.3,'SECTOR 07','WELCOME TO THE DISTRICT',C.cyan,Math.PI);
    for(const y of [4.66,7.2,10.2]){
      b.pipe([[-5.4,y,1.52],[.14,y,1.52],[.14,y,-2.94]],.018,'cyan',false);
      b.beam([-5.4,y,-2.94],[-5.4,y,1.52],.014,'violet');
    }
    b.beam([1.68,4.8,1.98],[6.3,4.8,1.98],.023,'pink');
    for(let i=0;i<10;i++) b.box([6.86,.13+i*.45,2.5-i*.5],[1.08,.018,.035],'cyan');
    // Small balcony gardens soften the new enamel facade.
    for(const y of [4.94,7.44])for(const x of [-4.5,-1.2]){
      b.box([x,y+.12,2.05],[.78,.23,.3],'cream',[0,0,0],.035);
      for(let i=0;i<5;i++)b.sphere([x-.3+i*.15,y+.31,2.05],.15,'leaf',[.7,1.5,.7]);
    }
    const group=b.finish();return {group,materials};
  },[]);
  useEffect(()=>()=>disposeModel(details.group,details.materials),[details]);
  return <>
    <primitive object={details.group} dispose={null}/>
    {units.map((unit,i)=><Fan key={i} {...unit} reduced={reduced}/>)}
    <RoundedBox args={[19,.72,14]} radius={.16} smoothness={3} position={[0,-.4,0]}>
      <meshPhysicalMaterial color="#b5e8ed" transmission={.92} thickness={.7} roughness={.09} metalness={0} ior={1.46} clearcoat={1} attenuationColor="#5ecfdb" attenuationDistance={3}/>
    </RoundedBox>
    {[-1,1].map(side=><group key={side}>
      <mesh position={[0,-.14,side*6.96]}><boxGeometry args={[18.7,.018,.025]}/><meshStandardMaterial color={C.cyan} emissive={C.cyan} emissiveIntensity={1.3}/></mesh>
      <mesh position={[side*9.46,-.14,0]}><boxGeometry args={[.025,.018,13.7]}/><meshStandardMaterial color={C.cyan} emissive={C.cyan} emissiveIntensity={1.3}/></mesh>
    </group>)}
  </>;
}
