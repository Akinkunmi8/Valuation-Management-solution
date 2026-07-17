import { type AuthRole } from "@/features/auth/types/authTypes"


export const PERMISSIONS = {
  // Facilities
  FACILITY_VIEW: 'facility:view',
  FACILITY_CREATE: 'facility:create',
  FACILITY_EDIT: 'facility:edit',
  FACILITY_REVIEW: 'facility:review',
  FACILITY_APPROVE: 'facility:approve',
  FACILITY_REJECT: 'facility:reject',

  // Collateral
  COLLATERAL_VIEW: 'collateral:view',

  // Valuation
  VALUATION_VIEW: 'valuation:view',
  VALUATION_CREATE: 'valuation:create',
  VALUER_ASSIGN: 'valuer:assign',
  VALUER_REASSIGN: 'valuer:reassign',

  // Reports
  REPORT_VIEW: 'report:view',
  REPORT_REVIEW: 'report:review',
  REPORT_APPROVE: 'report:approve',
  REPORT_REJECT: 'report:reject',

  // Payments
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_INITIATE: 'payment:initiate',

  // Users
  USER_MANAGE: 'user:manage',
} as const




export const ROLE_PERMISSIONS: Record<
  AuthRole,
  readonly string[]
> = {
  RM: [
    PERMISSIONS.FACILITY_VIEW,
    PERMISSIONS.FACILITY_CREATE,
    PERMISSIONS.FACILITY_EDIT,

    PERMISSIONS.COLLATERAL_VIEW,

    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_INITIATE,

    PERMISSIONS.REPORT_VIEW,
  ],

  CM: [
    PERMISSIONS.FACILITY_VIEW,
    PERMISSIONS.FACILITY_REVIEW,
    PERMISSIONS.FACILITY_APPROVE,
    PERMISSIONS.FACILITY_REJECT,

    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_REVIEW,
    PERMISSIONS.REPORT_APPROVE,
    PERMISSIONS.REPORT_REJECT,
  ],

  CMS: [
    PERMISSIONS.FACILITY_VIEW,
    PERMISSIONS.REPORT_VIEW,

    PERMISSIONS.VALUER_ASSIGN,
    PERMISSIONS.VALUER_REASSIGN,
  ],

  BM: [
    PERMISSIONS.FACILITY_VIEW,
    PERMISSIONS.REPORT_VIEW,
  ],

  VALUER: [
    PERMISSIONS.VALUATION_VIEW,
    PERMISSIONS.REPORT_VIEW,
  ],

  AUDIT: [
    PERMISSIONS.FACILITY_VIEW,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.PAYMENT_VIEW,
  ],

  ADMIN: Object.values(PERMISSIONS),
}

export type Permission =
  typeof PERMISSIONS[
    keyof typeof PERMISSIONS
  ]