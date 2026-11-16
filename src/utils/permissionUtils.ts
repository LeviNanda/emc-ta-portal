import {Access,HRMember,Permission} from '../types';
export const getAccess=(user:HRMember,perms:Permission[],moduleId:string):Access=>user.isHead?'edit':(perms.find(x=>x.hrId===user.id&&x.moduleId===moduleId)?.accessLevel??'none');
export const canView=(a:Access)=>a!=='none';
export const canEdit=(a:Access)=>a==='edit';
// Only the Head HR may manage permissions, regardless of module grants.
export const canManagePermissions=(user:HRMember)=>!!user.isHead;
// Apply a draft for one HR; 'none' entries are not stored (default = none).
export const applyDraft=(perms:Permission[],hrId:string,draft:Record<string,Access>):Permission[]=>[...perms.filter(x=>x.hrId!==hrId),...Object.entries(draft).filter(([,a])=>a!=='none').map(([moduleId,accessLevel])=>({hrId,moduleId,accessLevel}))];
