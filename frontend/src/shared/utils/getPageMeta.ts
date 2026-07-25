type PageMeta = {
  title: string;
  description: string;
};

export function getPageMeta(
  pathname: string,
): PageMeta {
  // ================= RM =================

  if (pathname === "/dashboard/rm")
    return {
      title: "Dashboard",
      description:
        "Overview of today's valuation activities.",
    };

  if (pathname === "/dashboard/rm/facilities")
    return {
      title: "Facilities",
      description:
        "Manage customer facilities and valuation requests.",
    };

  if (
    pathname ===
    "/dashboard/rm/facilities/create"
  )
    return {
      title: "Create Facility",
      description:
        "Register a new collateral valuation request.",
    };

  if (
    pathname.startsWith(
      "/dashboard/rm/facilities/",
    )
  )
    return {
      title: "Facility Details",
      description:
        "Review collateral information and workflow progress.",
    };

  // ================= CM =================

  if (pathname === "/dashboard/cm")
    return {
      title: "Dashboard",
      description:
        "Monitor approvals awaiting your attention.",
    };

  if (
    pathname.startsWith(
      "/dashboard/cm/facility-reviews/",
    )
  )
    return {
      title: "Facility Review",
      description:
        "Approve or reject submitted facilities.",
    };

  // ================= CMS =================

  if (pathname === "/dashboard/cms")
    return {
      title: "Dashboard",
      description:
        "Assign valuers and monitor ongoing valuations.",
    };

  if (
    pathname.startsWith(
      "/dashboard/cms/assignValuer/",
    )
  )
    return {
      title: "Assign Valuer",
      description:
        "Assign a qualified valuer to this facility.",
    };

  // ================= Valuer =================

  if (pathname === "/dashboard/valuer")
    return {
      title: "Dashboard",
      description:
        "View assignments and submit valuation reports.",
    };

  // ================= ADMIN =================

  if (pathname === "/dashboard/admin")
    return {
      title: "Dashboard",
      description:
        "Manage users, roles and system configuration.",
    };

  return {
    title: "Valuation Management",
    description:
      "Enterprise Collateral Management Platform.",
  };
}