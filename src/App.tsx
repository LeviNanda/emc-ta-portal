import {useState} from 'react';import {NavLink,Navigate,Route,Routes} from 'react-router-dom';import {Briefcase,ShieldCheck,Menu,Bell,Lock} from 'lucide-react';
import JobOpenings from './modules/job-openings/JobOpenings';import HRTeamPermissions from './modules/hr-team-permissions/HRTeamPermissions';
import {Toast} from './components/common/ui';import {useLocalStorage} from './hooks/useLocalStorage';import {HEAD_HR,MOCK_HR} from './data/mockHRMembers';import {MOCK_PERMS} from './data/mockPermissions';
import {Permission} from './types';import {getAccess,canView} from './utils/permissionUtils';
export default function App(){
 // DEV-ONLY role simulator. In the master app, pass the real signed-in HR and permissions instead.
 const members=[HEAD_HR,...MOCK_HR];const [uid,setUid]=useLocalStorage('emc_dev_user','HR-100');const user=members.find(m=>m.id===uid)??HEAD_HR;
 const [perms,setPerms]=useLocalStorage<Permission[]>('emc_perms',MOCK_PERMS);const [toast,setToast]=useState('');const [open,setOpen]=useState(false);
 const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)};
 const jobA=getAccess(user,perms,'job-openings');const hrA=getAccess(user,perms,'hr-team-permissions');
 const nav=[{to:'/job-openings',l:'Job Openings',i:<Briefcase size={18} className="shrink-0"/>,show:canView(jobA)},{to:'/hr-team-permissions',l:'HR Team & Permissions',i:<ShieldCheck size={18} className="shrink-0"/>,show:!!user.isHead}];
 const Denied=<div className="card flex flex-col items-center gap-2 p-10 text-tx2"><Lock/>You do not have access to this module.</div>;
 return <div className="min-h-screen">
  <aside className={`fixed inset-y-0 left-0 z-40 w-[145px] bg-white p-3 shadow transition md:translate-x-0 ${open?'':'-translate-x-full'}`}>
   <img src="/emc-logo.png" alt="EMC Ecometrix" className="mb-1 h-auto w-full object-contain"/>
   <p className="mb-5 text-center text-[10px] font-semibold leading-tight tracking-wide text-tx">TALENT ACQUISITION PORTAL</p>
   {nav.filter(n=>n.show).map(n=><NavLink key={n.to} to={n.to} onClick={()=>setOpen(false)} className={({isActive})=>`mb-2 flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-[13px] font-medium leading-tight transition ${isActive?'bg-g text-white shadow-sm':'bg-[#F4F5F9] text-tx hover:bg-gl'}`}>{n.i}{n.l}</NavLink>)}</aside>
  <div className="md:ml-[145px]"><header className="flex flex-wrap items-center gap-3 border-b bg-white px-4 py-3">
   <button className="md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}><Menu/></button>
   <div className="flex-1"><Routes><Route path="/hr-team-permissions" element={<><h1 className="font-bold">HR Team & Permissions</h1><p className="text-xs text-tx2">Manage HR members and control module-level access.</p></>}/><Route path="*" element={<><h1 className="font-bold">Job Openings</h1><p className="text-xs text-tx2">Create, Edit or View Job Openings.</p></>}/></Routes></div>
   <div className="flex flex-col items-start">
    <label className="rounded-lg bg-ol px-2 py-1 text-xs">DEV role: <select value={uid} onChange={e=>setUid(e.target.value)} className="bg-transparent">{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
    <p className="mt-1 text-[10px] leading-tight text-orange-700">To be removed after functional integration of backend by Subham</p>
   </div>
   <Bell size={20} className="text-tx2"/><div className="flex h-8 w-8 items-center justify-center rounded-full bg-g text-xs font-bold text-white">{user.name[0]}</div></header>
  <main className="p-4"><Routes><Route path="/" element={<Navigate to={canView(jobA)?'/job-openings':'/hr-team-permissions'} replace/>}/>
   <Route path="/job-openings" element={canView(jobA)?<JobOpenings access={jobA} notify={notify}/>:Denied}/>
   <Route path="/hr-team-permissions" element={hrA==='edit'&&user.isHead?<HRTeamPermissions currentUser={user} members={members} permissions={perms} onChange={setPerms} notify={notify}/>:Denied}/></Routes></main></div>
  <Toast msg={toast}/></div>;}
