import type { AuthRole } from '@/features/auth/types/authTypes'

export type FacilityWorkspaceTab = {
  id: string
  label: string
}

const COMMON_TABS: FacilityWorkspaceTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'customer', label: 'Customer' },
  { id: 'collateral', label: 'Collateral' },
  { id: 'documents', label: 'Documents' },
]

export const getFacilityWorkspaceTabs = (
  role: AuthRole,
): FacilityWorkspaceTab[] => {

  switch (role) {

    case 'RM':
      return [
        ...COMMON_TABS,
        {
          id: 'payment',
          label: 'Payment',
        },
      ]

    case 'CM':
      return [
        ...COMMON_TABS,
        {
          id: 'workflow',
          label: 'Workflow',
        },
      ]

    case 'CMS':
      return [
        ...COMMON_TABS,
        {
          id: 'assignment',
          label: 'Assignment',
        },
      ]

      

    default:
      return COMMON_TABS

  }

}