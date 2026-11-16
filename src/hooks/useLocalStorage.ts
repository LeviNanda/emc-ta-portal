import {useState,useEffect} from 'react';
// Swap for API-backed hooks later (see README).
export function useLocalStorage<T>(key:string,init:T){
 const [v,setV]=useState<T>(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init}catch{return init}});
 useEffect(()=>{localStorage.setItem(key,JSON.stringify(v))},[key,v]);
 return [v,setV] as const;}
