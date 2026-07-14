import type { AuthRole } from '@/features/auth/types/authTypes'
import { ROUTES } from '@/shared/constants/routes'

export const getHomeRoute = (
  role: AuthRole,
): string => {

  switch (role) {

    case 'RM':
      return ROUTES.rm.facilities

    case 'CM':
      return ROUTES.cm.dashboard

    case 'CMS':
      return ROUTES.cms.dashboard

    case 'VALUER':
      return ROUTES.valuer.dashboard

    case 'BM':
      return ROUTES.bm.dashboard

    case 'AUDIT':
      return ROUTES.audit.dashboard

    case 'ADMIN':
      return ROUTES.admin.dashboard

    default:
      return ROUTES.welcome

  }

}