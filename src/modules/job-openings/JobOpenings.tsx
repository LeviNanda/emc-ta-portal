import {useState} from 'react';import {PlusCircle,Pencil,Users} from 'lucide-react';
import {Job,Candidate,AppStatus,Access} from '../../types';import {Btn,Badge,Modal,ConfirmationDialog} from '../../components/common/ui';
import {useLocalStorage} from '../../hooks/useLocalStorage';import {MOCK_JOBS,MOCK_CANDIDATES} from '../../data/mockJobs';import {today} from '../../utils/dateUtils';
const DEPTS=['Engineering','IT','Accounts & Finance','Urban Planning','GIS','Telecom','Human Resources','Other'];
const EXPS=['Fresher','0–1 Years','1–3 Years','3–5 Years','5+ Years'];const TYPES=['Full Time','Part Time','Contract','Internship'];
const STATUSES:AppStatus[]=['New','Under Review','Shortlisted','Rejected','On Hold'];
const blank=():Job=>({id:'',title:'',department:'',description:'',skills:[],experience:'',type:'',vacancies:1,location:'',salary:'',deadline:'',postedDate:today(),responsibilities:'',qualifications:'',additional:'',status:'Draft'});
const eff=(j:Job):Job['status']=>j.status==='Published'&&j.deadline<today()?'Expired':j.status;
const jc=(s:string)=>({Published:'green',Draft:'grey',Closed:'orange',Expired:'red'} as const)[s as 'Draft'];
// Props make the module embeddable: master app passes the user's access level.
export default function JobOpenings({access='edit',notify=()=>{}}:{access?:Access;notify?:(m:string)=>void}){
 const ro=access!=='edit';const [jobs,setJobs]=useLocalStorage<Job[]>('emc_jobs',MOCK_JOBS);const [cands,setCands]=useLocalStorage<Candidate[]>('emc_cands',MOCK_CANDIDATES);
 const [view,setView]=useState<'home'|'create'|'edit'|'subs'>('home');const [editing,setEditing]=useState<Job|null>(null);
 const save=(j:Job)=>{setJobs(p=>p.some(x=>x.id===j.id)?p.map(x=>x.id===j.id?j:x):[j,...p]);notify(j.status==='Published'?'Opening published':'Saved');setEditing(null);setView('edit');};
 const Card=({c,i,t,d,on}:{c:string;i:any;t:string;d:string;on:()=>void})=><button onClick={on} className={`${c} rounded-2xl p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md`}>{i}<h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="text-sm opacity-90">{d}</p></button>;
 return <div className="space-y-4">
  {ro&&<div className="rounded-lg bg-bl px-4 py-2 text-sm text-b">View-only access: create, edit, publish, close and delete are disabled.</div>}
  {view!=='home'&&<Btn v="ghost" onClick={()=>{setView('home');setEditing(null)}}>← Job Openings</Btn>}
  {view==='home'&&<div className="grid gap-4 md:grid-cols-3">
   <Card c={`bg-g text-white ${ro?'opacity-50 pointer-events-none':''}`} i={<PlusCircle/>} t="Create Opening" d="Post a new job" on={()=>setView('create')}/>
   <Card c="bg-o text-white" i={<Pencil/>} t={ro?'View Openings':'Edit Opening'} d="Manage existing openings" on={()=>setView('edit')}/>
   <Card c="bg-gl text-gd" i={<Users/>} t="View Submissions" d="Review candidates" on={()=>setView('subs')}/></div>}
  {(view==='create'||editing)&&!ro&&<JobForm key={editing?.id??'new'} init={editing??blank()} jobs={jobs} onSave={save}/>}
  {view==='edit'&&!editing&&<JobTable jobs={jobs} ro={ro} onEdit={j=>{setEditing(j)}} onClose={id=>{setJobs(p=>p.map(x=>x.id===id?{...x,status:'Closed'}:x));notify('Opening closed')}} onDelete={id=>{setJobs(p=>p.filter(x=>x.id!==id));notify('Opening deleted')}}/>}
  {view==='subs'&&<Subs cands={cands} ro={ro} setStatus={(id,s)=>{setCands(p=>p.map(x=>x.id===id?{...x,status:s}:x));notify('Status updated')}}/>}
 </div>;}
function JobForm({init,jobs,onSave}:{init:Job;jobs:Job[];onSave:(j:Job)=>void}){
 const [f,setF]=useState<Job>(init);const [sk,setSk]=useState('');const [err,setErr]=useState<Record<string,string>>({});
 const set=(k:keyof Job,v:any)=>setF(p=>({...p,[k]:v}));
 const addSk=()=>{const s=sk.trim();if(s&&!f.skills.some(x=>x.toLowerCase()===s.toLowerCase()))set('skills',[...f.skills,s]);setSk('')};
 const go=(status:Job['status'])=>{const e:Record<string,string>={};
  (['title','department','description','experience','type','location','responsibilities','qualifications'] as const).forEach(k=>{if(!String(f[k]).trim())e[k]='Required'});
  if(!f.skills.length)e.skills='Add at least one skill';if(!(f.vacancies>=1))e.vacancies='Must be ≥ 1';
  if(!f.deadline)e.deadline='Required';else if(f.deadline<today()&&status==='Published')e.deadline='Deadline cannot be in the past';
  setErr(e);if(Object.keys(e).length)return;
  const id=f.id||'JOB-'+(1000+jobs.length+1+Math.floor(Math.random()*900));onSave({...f,id,status});};
 const L=({k,l,children}:{k:string;l:string;children:any})=><label className="block text-sm font-medium">{l}{children}{err[k]&&<span className="text-xs text-red-500">{err[k]}</span>}</label>;
 const T=(k:keyof Job,l:string,type='text')=><L k={k} l={l}><input type={type} className="inp mt-1" value={String(f[k]??'')} onChange={e=>set(k,type==='number'?+e.target.value:e.target.value)}/></L>;
 const S=(k:keyof Job,l:string,o:string[])=><L k={k} l={l}><select className="inp mt-1" value={String(f[k])} onChange={e=>set(k,e.target.value)}><option value="">Select…</option>{o.map(x=><option key={x}>{x}</option>)}</select></L>;
 const A=(k:keyof Job,l:string)=><L k={k} l={l}><textarea rows={3} className="inp mt-1" value={String(f[k]??'')} onChange={e=>set(k,e.target.value)}/></L>;
 return <div className="card space-y-4 p-5"><h2 className="text-lg font-semibold">{init.id?'Edit Opening '+init.id:'Create Opening'}</h2>
  <div className="grid gap-4 md:grid-cols-2">{T('title','Job Title')}{S('department','Department',DEPTS)}{S('experience','Experience Required',EXPS)}{S('type','Employment Type',TYPES)}{T('vacancies','Number of Vacancies','number')}{T('location','Work Location')}{T('salary','Salary Range (optional)')}{T('deadline','Application Deadline','date')}</div>
  {A('description','Job Description')}{A('responsibilities','Job Responsibilities')}{A('qualifications','Required Qualifications')}{A('additional','Additional Requirements (optional)')}
  <div><b className="text-sm">Required Skills</b><div className="mt-1 flex gap-2"><input className="inp" value={sk} placeholder="Type a skill and press Enter" onChange={e=>setSk(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addSk()}}}/><Btn v="orange" onClick={addSk}>Add</Btn></div>
   <div className="mt-2 flex flex-wrap gap-2">{f.skills.map(s=><span key={s} className="rounded-full bg-gl px-3 py-1 text-xs text-gd">{s} <button aria-label={'Remove '+s} onClick={()=>set('skills',f.skills.filter(x=>x!==s))}>×</button></span>)}</div>{err.skills&&<span className="text-xs text-red-500">{err.skills}</span>}</div>
  <div className="flex flex-wrap justify-end gap-2"><Btn v="ghost" onClick={()=>{setF(init);setErr({})}}>Reset</Btn><Btn v="orange" onClick={()=>go('Draft')}>Save as Draft</Btn><Btn onClick={()=>go('Published')}>Publish Opening</Btn></div></div>;}
function JobTable({jobs,ro,onEdit,onClose,onDelete}:{jobs:Job[];ro:boolean;onEdit:(j:Job)=>void;onClose:(id:string)=>void;onDelete:(id:string)=>void}){
 const [q,setQ]=useState('');const [st,setSt]=useState('');const [dir,setDir]=useState(1);const [pg,setPg]=useState(0);const [view,setView]=useState<Job|null>(null);const [cf,setCf]=useState<{t:'close'|'del';id:string}|null>(null);
 const rows=jobs.filter(j=>(j.title+j.id).toLowerCase().includes(q.toLowerCase())&&(!st||eff(j)===st)).sort((a,b)=>dir*a.deadline.localeCompare(b.deadline));const pages=Math.max(1,Math.ceil(rows.length/5));const cur=rows.slice(pg*5,pg*5+5);
 return <div className="card p-4"><div className="mb-3 flex flex-wrap gap-2"><input className="inp max-w-xs" placeholder="Search title or ID" value={q} onChange={e=>{setQ(e.target.value);setPg(0)}}/><select className="inp max-w-[10rem]" value={st} onChange={e=>{setSt(e.target.value);setPg(0)}}><option value="">All statuses</option>{['Draft','Published','Closed','Expired'].map(s=><option key={s}>{s}</option>)}</select></div>
  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-tx2"><tr>{['Job ID','Title','Department','Experience','Vacancies','Posted'].map(h=><th key={h} className="p-2">{h}</th>)}<th className="cursor-pointer p-2" onClick={()=>setDir(-dir)}>Deadline {dir>0?'↑':'↓'}</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
  <tbody>{cur.map(j=><tr key={j.id} className="border-t"><td className="p-2">{j.id}</td><td className="p-2 font-medium">{j.title}</td><td className="p-2">{j.department}</td><td className="p-2">{j.experience}</td><td className="p-2">{j.vacancies}</td><td className="p-2">{j.postedDate}</td><td className="p-2">{j.deadline}</td><td className="p-2"><Badge c={jc(eff(j))}>{eff(j)}</Badge></td>
   <td className="space-x-2 whitespace-nowrap p-2"><button className="text-b" onClick={()=>setView(j)}>View</button>{!ro&&<><button className="text-gd" onClick={()=>onEdit(j)}>Edit</button><button disabled={j.status==='Closed'} className="text-orange-600 disabled:opacity-30" onClick={()=>setCf({t:'close',id:j.id})}>Close</button><button className="text-red-500" onClick={()=>setCf({t:'del',id:j.id})}>Delete</button></>}</td></tr>)}
  {!cur.length&&<tr><td colSpan={9} className="p-6 text-center text-tx2">No openings found</td></tr>}</tbody></table></div>
  <div className="mt-3 flex items-center justify-end gap-2 text-sm"><Btn v="ghost" disabled={pg===0} onClick={()=>setPg(pg-1)}>Prev</Btn>Page {pg+1}/{pages}<Btn v="ghost" disabled={pg>=pages-1} onClick={()=>setPg(pg+1)}>Next</Btn></div>
  {view&&<Modal title={<b>{view.title} ({view.id})</b>} onClose={()=>setView(null)}><p className="text-sm">{view.description}</p><p className="mt-2 text-sm"><b>Skills:</b> {view.skills.join(', ')}</p><p className="text-sm"><b>Location:</b> {view.location} · {view.type}</p></Modal>}
  {cf&&<ConfirmationDialog msg={cf.t==='del'?'Delete this opening permanently?':'Close this opening to new applications?'} onNo={()=>setCf(null)} onYes={()=>{cf.t==='del'?onDelete(cf.id):onClose(cf.id);setCf(null)}}/>}</div>;}
function Subs({cands,ro,setStatus}:{cands:Candidate[];ro:boolean;setStatus:(id:string,s:AppStatus)=>void}){
 const [q,setQ]=useState('');const [st,setSt]=useState('');const [sel,setSel]=useState<Candidate|null>(null);
 const rows=cands.filter(c=>(c.name+c.position+c.email).toLowerCase().includes(q.toLowerCase())&&(!st||c.status===st));
 const col=(s:string)=>({New:'blue','Under Review':'orange',Shortlisted:'green',Rejected:'red','On Hold':'grey'} as const)[s as 'New'];
 return <div className="card p-4"><div className="mb-3 flex flex-wrap gap-2"><input className="inp max-w-xs" placeholder="Search candidates" value={q} onChange={e=>setQ(e.target.value)}/><select className="inp max-w-[10rem]" value={st} onChange={e=>setSt(e.target.value)}><option value="">All statuses</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-tx2"><tr>{['Candidate','Position','Email','Contact','Experience','Applied','Status','Actions'].map(h=><th key={h} className="p-2">{h}</th>)}</tr></thead>
  <tbody>{rows.map(c=><tr key={c.id} className="border-t"><td className="p-2 font-medium">{c.name}</td><td className="p-2">{c.position}</td><td className="p-2">{c.email}</td><td className="p-2">{c.phone}</td><td className="p-2">{c.experience}</td><td className="p-2">{c.date}</td><td className="p-2"><Badge c={col(c.status)}>{c.status}</Badge></td><td className="p-2"><button className="text-b" onClick={()=>setSel(c)}>Details</button></td></tr>)}</tbody></table></div>
  {sel&&<Modal title={<b>{sel.name}</b>} onClose={()=>setSel(null)}><p className="text-sm">{sel.position} · {sel.experience}<br/>{sel.email} · {sel.phone}</p>
   <label className="mt-3 block text-sm font-medium">Update status<select disabled={ro} className="inp mt-1" value={cands.find(c=>c.id===sel.id)!.status} onChange={e=>setStatus(sel.id,e.target.value as AppStatus)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></label></Modal>}</div>;}
