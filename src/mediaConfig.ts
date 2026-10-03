// Optional media for either face of the lower billboard above the garage.
// Put images/MP4s in public/media and use /media/filename here.
// YouTube accepts only the 11-character video ID (from its watch URL).
export type BillboardMedia = {kind:'image'|'video'|'youtube';source:string} | null;
export const billboardMedia:{front:BillboardMedia;back:BillboardMedia}={front:null,back:null};
