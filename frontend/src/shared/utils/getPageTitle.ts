export function getPageTitle(pathname: string): string {
  // ================= RM =================

  if (pathname === "/dashboard/rm")
    return "Dashboard";

  if (pathname === "/dashboard/rm/facilities")
    return "Facilities";

  if (
    pathname ===
    "/dashboard/rm/facilities/create"
  )
    return "Create Facility";

  if (
    pathname.startsWith(
      "/dashboard/rm/facilities/"
    )
  )
    return "Facility Details";

  // ================= CM =================

  if (pathname === "/dashboard/cm")
    return "Dashboard";

  if (
    pathname.startsWith(
      "/dashboard/cm/facility-reviews/"
    )
  )
    return "Facility Review";

  if (
    pathname.startsWith(
      "/dashboard/cm/report-reviews"
    )
  )
    return "Report Reviews";

  // ================= CMS =================

  if (pathname === "/dashboard/cms")
    return "Dashboard";

  if (
    pathname.startsWith(
      "/dashboard/cms/assignValuer/"
    )
  )
    return "Assign Valuer";

  if (
    pathname.startsWith(
      "/dashboard/cms/assignments"
    )
  )
    return "Assignments";

  if (
    pathname.startsWith(
      "/dashboard/cms/monitoring"
    )
  )
    return "Monitoring";

  // ================= BM =================

  if (pathname === "/dashboard/bm")
    return "Dashboard";

  // ================= Valuer =================

  if (pathname === "/dashboard/valuer")
    return "Dashboard";

  if (
    pathname.startsWith(
      "/dashboard/valuer/assignments"
    )
  )
    return "Assignments";

  if (
    pathname.startsWith(
      "/dashboard/valuer/reports"
    )
  )
    return "Reports";

  // ================= Audit =================

  if (pathname === "/dashboard/audit")
    return "Dashboard";

  // ================= Admin =================

  if (pathname === "/dashboard/admin")
    return "Dashboard";

  if (
    pathname.startsWith(
      "/dashboard/admin/users"
    )
  )
    return "Users";

  if (
    pathname.startsWith(
      "/dashboard/admin/settings"
    )
  )
    return "Settings";

  if (
    pathname.startsWith(
      "/dashboard/admin/reports"
    )
  )
    return "Reports";

  return "Valuation Management";
}