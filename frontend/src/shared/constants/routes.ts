import type { AuthRole } from "../../features/auth/types/authTypes";

export const ROUTES = {
  welcome: "/",

  auth: {
    login: "/auth/login",
    verify: "/auth/verify",
    register: "/auth/register",
  },

  rm: {
    dashboard: "/dashboard/rm",
    facilities: "/dashboard/rm/facilities",
    createFacility: "/dashboard/rm/facilities/create",
    facilityDetails: "/dashboard/rm/facilities/:facilityReference",
    payments: "/dashboard/rm/payments",
    reports: "/dashboard/rm/reports",
  },

  cm: {
    dashboard: "/dashboard/cm",
    facilityReviews: "/dashboard/cm/facility-reviews",
    reportReviews: "/dashboard/cm/report-reviews",
  },

  cms: {
    dashboard: "/dashboard/cms",
    assignments: "/dashboard/cms/assignments",
    monitoring: "/dashboard/cms/monitoring",
  },

  bm: {
    dashboard: "/dashboard/bm",
    facilities: "/dashboard/bm/facilities",
    reports: "/dashboard/bm/reports",
  },

  valuer: {
    dashboard: "/dashboard/valuer",
    assignments: "/dashboard/valuer/assignments",
    reports: "/dashboard/valuer/reports",
  },

  audit: {
    dashboard: "/dashboard/audit",
    reports: "/dashboard/audit/reports",
  },

  admin: {
    dashboard: "/dashboard/admin",
    users: "/dashboard/admin/users",
    settings: "/dashboard/admin/settings",
    reports: "/dashboard/admin/reports",
  },
} as const;

export const getDashboardRouteForRole = (role: AuthRole) => {
  switch (role) {
    case "RM":
      return ROUTES.rm.dashboard;

    case "CM":
      return ROUTES.cm.dashboard;

    case "CMS":
      return ROUTES.cms.dashboard;

    case "BM":
      return ROUTES.bm.dashboard;

    case "VALUER":
      return ROUTES.valuer.dashboard;

    case "AUDIT":
      return ROUTES.audit.dashboard;

    case "ADMIN":
      return ROUTES.admin.dashboard;

    default:
      return ROUTES.welcome;
  }
};
