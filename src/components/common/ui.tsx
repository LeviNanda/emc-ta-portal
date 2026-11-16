import {ReactNode} from 'react';import {X} from 'lucide-react';
export function Modal({title,onClose,children,footer,wide}:{title:ReactNode;onClose:()=>void;children:ReactNode;footer?:ReactNode;wide?:boolean}){
 return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" onClick={onClose}>
  <div className={`card flex max-h-[92vh] w-full flex-col ${wide?'max-w-4xl':'max-w-lg'}`} onClick={e=>e.stopPropagation()}>
   <div className="flex items-start justify-between border-b p-4"><div>{title}</div><button aria-label="Close" onClick={onClose}><X size={20}/></button></div>
   <div className="overflow-y-auto p-4">{children}</div>{footer&&<div className="flex flex-wrap justify-end gap-2 border-t p-4">{footer}</div>}</div></div>;}
export function ConfirmationDialog({msg,onYes,onNo}:{msg:string;onYes:()=>void;onNo:()=>void}){
 return <Modal title={<b>Please confirm</b>} onClose={onNo} footer={<><Btn v="ghost" onClick={onNo}>Cancel</Btn><Btn v="danger" onClick={onYes}>Confirm</Btn></>}><p className="text-sm">{msg}</p></Modal>;}
const V={primary:'bg-g text-white hover:bg-gd',orange:'bg-o text-white hover:opacity-90',ghost:'border bg-white hover:bg-gray-50',danger:'bg-red-500 text-white hover:bg-red-600'};
export function Btn({v='primary',...p}:{v?:keyof typeof V}&React.ButtonHTMLAttributes<HTMLButtonElement>){return <button {...p} className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${V[v]} ${p.className??''}`}/>}
export function Badge({c,children}:{c:'green'|'orange'|'grey'|'blue'|'red';children:ReactNode}){
 const m={green:'bg-gl text-gd',orange:'bg-ol text-orange-700',grey:'bg-gray-100 text-gray-600',blue:'bg-bl text-b',red:'bg-red-50 text-red-600'};
 return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${m[c]}`}>{children}</span>;}
export function Toast({msg}:{msg:string}){return msg?<div className="fixed bottom-5 right-5 z-[60] rounded-xl bg-gd px-4 py-3 text-sm text-white shadow-lg">{msg}</div>:null}
