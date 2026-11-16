import {HRMember} from '../types';
const m=(id:string,name:string,status:HRMember['status'],lastLogin:string,lastActive:string,isHead=false):HRMember=>({id,name,email:name.toLowerCase().replace(' ','.')+'@emcecometrix.com',status,lastLogin,lastActive,isHead});
export const HEAD_HR=m('HR-100','Head HR','Online','Today 09:02','Just now',true);
export const MOCK_HR:HRMember[]=[m('HR-101','Sneha Das','Active','Today 09:15','2 min ago'),m('HR-102','Rohan Mehta','Online','Today 08:40','Just now'),m('HR-103','Anita Sahoo','Inactive','Yesterday 17:20','3 hrs ago'),m('HR-104','Priya Sharma','Active','Today 10:05','12 min ago'),m('HR-105','Rahul Kumar','Inactive','2 days ago','2 days ago')];
