# EMC Ecometrix – Talent Acquisition Portal (Job Openings + HR Team & Permissions)
Install: `npm install` · Run: `npm run dev` · Build: `npm run build`

## Structure
`src/modules/job-openings/JobOpenings.tsx`, `src/modules/hr-team-permissions/HRTeamPermissions.tsx` are the exportable modules. `App.tsx` is only the standalone shell (sidebar, header, DEV role switcher).

## Integrating
```tsx
<JobOpenings access={getAccess(user, perms, 'job-openings')} notify={toast}/>   // 'none'|'view'|'edit'
<HRTeamPermissions currentUser={user} members={hrList} permissions={perms} onChange={savePerms} notify={toast}/>
```
- **Current HR identity:** pass `HRMember` (`isHead:true` for the Head HR).
- **Permission data:** `Permission[]` of `{hrId,moduleId,accessLevel}`; missing = `none`. Helpers in `utils/permissionUtils.ts`.
- **Backend:** replace `useLocalStorage` (jobs/candidates/perms) with API hooks; `onChange` is where you POST permissions. Module ids are in `data/moduleCatalog.ts`.
- Remove the DEV role switcher in `App.tsx` before shipping.
