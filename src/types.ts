export type Access='none'|'view'|'edit';
export type Presence='Online'|'Active'|'Inactive';
export interface HRMember{id:string;name:string;email:string;status:Presence;lastLogin:string;lastActive:string;isHead?:boolean}
export interface Permission{hrId:string;moduleId:string;accessLevel:Access}
export interface Job{id:string;title:string;department:string;description:string;skills:string[];experience:string;type:string;vacancies:number;location:string;salary?:string;deadline:string;postedDate:string;responsibilities:string;qualifications:string;additional?:string;status:'Draft'|'Published'|'Closed'|'Expired'}
export type AppStatus='New'|'Under Review'|'Shortlisted'|'Rejected'|'On Hold';
export interface Candidate{id:string;name:string;position:string;email:string;phone:string;experience:string;date:string;status:AppStatus}
