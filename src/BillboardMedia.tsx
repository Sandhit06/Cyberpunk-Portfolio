import { Suspense, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as T from 'three';
import { billboardMedia, type BillboardMedia as Media } from './mediaConfig';

function ImageScreen({source}:{source:string}){
  const map=useLoader(T.TextureLoader,source);map.colorSpace=T.SRGBColorSpace;
  return <mesh><planeGeometry args={[3.95,2.05]}/><meshBasicMaterial map={map} toneMapped={false}/></mesh>;
}
function VideoScreen({source,started,reduced}:{source:string;started:boolean;reduced:boolean}){
  const media=useMemo(()=>{const video=document.createElement('video');video.src=source;video.crossOrigin='anonymous';video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';const texture=new T.VideoTexture(video);texture.colorSpace=T.SRGBColorSpace;return {video,texture};},[source]);
  useEffect(()=>{if(started&&!reduced)void media.video.play().catch(()=>{});else media.video.pause();},[media,started,reduced]);
  useEffect(()=>()=>{media.video.pause();media.video.removeAttribute('src');media.video.load();media.texture.dispose();},[media]);
  return <mesh><planeGeometry args={[3.95,2.05]}/><meshBasicMaterial map={media.texture} toneMapped={false}/></mesh>;
}
function Face({media,back,started,reduced}:{media:Media;back:boolean;started:boolean;reduced:boolean}){
  if(!media)return null;
  return <group position={[3.6,7.08,back?-2.625:-2.365]} rotation={[0,back?Math.PI:0,0]}>
    {media.kind==='image'?<ImageScreen source={media.source}/>:media.kind==='video'?<VideoScreen source={media.source} started={started} reduced={reduced}/>:started&&/^[\w-]{11}$/.test(media.source)?<Html transform occlude distanceFactor={1.54}><iframe title={back?'Rear billboard video':'Front billboard video'} width="1024" height="532" style={{border:0}} src={`https://www.youtube-nocookie.com/embed/${media.source}?autoplay=0&rel=0`} allow="encrypted-media; picture-in-picture" allowFullScreen/></Html>:null}
  </group>;
}
export default function BillboardMedia({started,reduced}:{started:boolean;reduced:boolean}){
  return <Suspense fallback={null}><Face media={billboardMedia.front} back={false} started={started} reduced={reduced}/><Face media={billboardMedia.back} back started={started} reduced={reduced}/></Suspense>;
}
