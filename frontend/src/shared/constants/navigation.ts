import {
  FiBarChart2,
  FiBriefcase,
  // FiCheckSquare,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiSettings,
  FiUsers,
} from 'react-icons/fi'

import type { IconType } from 'react-icons'

import type { AuthRole } from '@/features/auth/types/authTypes'

import { ROUTES } from './routes'

export type NavigationItem = {
  label: string
  description: string
  href: string
  icon: IconType
  exact?: boolean
}

export const ROLE_MENUS: Record<
  AuthRole,
  NavigationItem[]
> = {
RM: [

  {
    label: 'Facilities',
    description: 'Credit facilities',
    href: ROUTES.rm.facilities,
    icon: FiBriefcase,
    exact: true
  },

  {
    label: 'Payments',
    description: 'Fee tracking',
    href: ROUTES.rm.payments,
    icon: FiCreditCard,
  },

  // {
  //   label: 'Reports',
  //   description: 'MIS reports',
  //   href: ROUTES.rm.reports,
  //   icon: FiFileText,
  // },
],

 CM: [

  {
    label: 'Facility Reviews',
    description: 'Review facilities',
    href: ROUTES.cm.facilityReviews,
    icon: FiBriefcase,
  },

  {
    label: 'Valuation Reports',
    description: 'Review reports',
    href: ROUTES.cm.reportReviews,
    icon: FiFileText,
  },
  {
    label: 'Payments',
    description: 'Valuers Payments',
    href: ROUTES.cm.valuersPayment,
    icon: FiCreditCard,
  },

],
 CMS: [
  {
    label: 'Assignments',
    description: 'Operations overview',
    href: ROUTES.cms.dashboard,
    icon: FiGrid,
    exact: true,
  },

  {
    label: 'Payments',
    description: 'Valuer Payments',
    href: ROUTES.cms.valuerPayments,
    icon: FiCreditCard,
  },

],
BM: [
  {
    label: 'Dashboard',
    description: 'Branch overview',
    href: ROUTES.bm.dashboard,
    icon: FiGrid,
    exact: true,
  },

  {
    label: 'Facilities',
    description: 'Branch facilities',
    href: ROUTES.bm.facilities,
    icon: FiBriefcase,
  },

  {
    label: 'Reports',
    description: 'Branch reports',
    href: ROUTES.bm.reports,
    icon: FiBarChart2,
  },
],

VALUER: [
  {
    label: 'Dashboard',
    description: 'Valuation overview',
    href: ROUTES.valuer.dashboard,
    icon: FiGrid,
    exact: true,
  },

  // {
  //   label: 'Assignments',
  //   description: 'Assigned jobs',
  //   href: ROUTES.valuer.assignments,
  //   icon: FiUsers,
  // },

  {
    label: 'Reports',
    description: 'Submitted reports',
    href: ROUTES.valuer.reports,
    icon: FiFileText,
  },
]
,
AUDIT: [
  {
    label: 'Dashboard',
    description: 'Audit overview',
    href: ROUTES.audit.dashboard,
    icon: FiGrid,
    exact: true,
  },

  {
    label: 'Reports',
    description: 'Audit reports',
    href: ROUTES.audit.reports,
    icon: FiBarChart2,
  },
]
,
  ADMIN: [
    {
      label: 'Dashboard',
      description: 'System overview',
      href: ROUTES.admin.dashboard,
      icon: FiGrid,
      exact: true
    },

    {
      label: 'Users',
      description: 'Manage users',
      href: ROUTES.admin.users,
      icon: FiUsers,
    },

    {
      label: 'Settings',
      description: 'System settings',
      href: ROUTES.admin.settings,
      icon: FiSettings,
    },

    {
      label: 'Reports',
      description: 'Audit and reporting',
      href: ROUTES.admin.reports,
      icon: FiBarChart2,
    },
  ],
}