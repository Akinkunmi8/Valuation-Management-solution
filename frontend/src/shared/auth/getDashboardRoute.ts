// import { ROUTES } from '../constants/routes'
// import type { AuthRole } from '@/features/auth/types/authTypes'

// export const getDashboardRoute = (
//   role: AuthRole,
// ) => {

//   return {

//     // RM: ROUTES.rm.dashboard,
//     RM: ROUTES.rm.facilities,

//     CM: ROUTES.cm.dashboard,

//     CMS: ROUTES.cms.dashboard,

//     BM: ROUTES.bm.dashboard,

//     VALUER: ROUTES.valuer.dashboard,

//     AUDIT: ROUTES.audit.dashboard,

//     ADMIN: ROUTES.admin.dashboard,

//   }[role]

// }









import { ROUTES } from '../constants/routes'
import type { AuthRole } from '@/features/auth/types/authTypes'

export const getDashboardRoute = (role?: AuthRole): string => {
  if (!role) {
    return ROUTES.auth.login;
  }

  const routeMap: Record<AuthRole, string> = {
    RM: ROUTES.rm.facilities,
    CM: ROUTES.cm.dashboard,
    CMS: ROUTES.cms.dashboard,
    BM: ROUTES.bm.dashboard,
    VALUER: ROUTES.valuer.dashboard,
    AUDIT: ROUTES.audit.dashboard,
    ADMIN: ROUTES.admin.dashboard,
  };

  return routeMap[role] || ROUTES.auth.login;
};