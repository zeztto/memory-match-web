import type {BestRecords,Difficulty} from '@/types/game';
export function readStorage(key:string):string|null {try{return localStorage.getItem(key);}catch{return null;}}
export function writeStorage(key:string,value:string):boolean {try{localStorage.setItem(key,value);return true;}catch{return false;}}
export function removeStorage(key:string):boolean {try{localStorage.removeItem(key);return true;}catch{return false;}}
export function parseBestRecords(raw:string|null):BestRecords {
 try{
  const value:unknown=raw?JSON.parse(raw):{};
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  const result:BestRecords={};
  for(const difficulty of ['easy','medium','hard'] as Difficulty[]){
   const record=(value as Record<string,unknown>)[difficulty];
   if(!record||typeof record!=='object')continue;
   const r=record as Record<string,unknown>;
   if(typeof r.time==='number'&&Number.isInteger(r.time)&&r.time>=0&&typeof r.moves==='number'&&Number.isInteger(r.moves)&&r.moves>=0&&typeof r.date==='string'&&Number.isFinite(Date.parse(r.date))){result[difficulty]={time:r.time,moves:r.moves,date:r.date};}
  }
  return result;
 }catch{return {};}
}

export function loadBestRecords():{records:BestRecords;writable:boolean} {
 let raw:string|null;
 try {raw=localStorage.getItem('card-puzzle-best-records');} catch {return {records:{},writable:false};}
 if(raw===null)return {records:{},writable:true};
 try {
  const value:unknown=JSON.parse(raw);
  const records=parseBestRecords(raw);
  const valid=!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>['easy','medium','hard'].includes(key))&&Object.keys(value).length===Object.keys(records).length;
  return {records,writable:valid};
 }catch{return {records:{},writable:false};}
}
