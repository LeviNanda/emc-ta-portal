import {Permission,Access} from '../types';
const p=(h:string,o:Record<string,Access>):Permission[]=>Object.entries(o).map(([moduleId,accessLevel])=>({hrId:h,moduleId,accessLevel}));
export const MOCK_PERMS:Permission[]=[...p('HR-101',{dashboard:'view','job-openings':'edit','ai-screening':'view','report-generation':'view',help:'view'}),...p('HR-102',{dashboard:'view','job-openings':'view','interview-management':'edit'}),...p('HR-103',{'job-openings':'view'}),...p('HR-104',{'job-openings':'edit',dashboard:'view'})];
