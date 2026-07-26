import type { StatusBadgeProps } from "@/shared/ui/badge/Badge";

export const getApprovalStatus = (
  status: string,
): StatusBadgeProps => {
  switch (status) {
    case "Approved":
      return {
        label: "Approved",
        variant: "success",
      };

    case "Pending":
      return {
        label: "Pending",
        variant: "warning",
      };

    case "Rejected":
      return {
        label: "Rejected",
        variant: "danger",
      };

    default:
      return {
        label: status,
        variant: "neutral",
      };
  }
};

export const getReportStatus = (
  status: string,
) => {
  switch (status) {
    case "Completed":
      return {
        variant: "success",
        label: "Completed",
      };

    case "Reviewing":
      return {
        variant: "info",
        label: "Reviewing",
      };

    case "Ongoing":
      return {
        variant: "warning",
        label: "Ongoing",
      };

    default:
      return {
        variant: "neutral",
        label: status,
      };
  }
};

export const getPaymentStatus = (
  status: string,
) => {
  switch (status) {
    case "Successful":
      return {
        variant: "success",
        label: "Paid",
      };

    case "UnProcessed":
      return {
        variant: "warning",
        label: "Pending",
      };

    default:
      return {
        variant: "neutral",
        label: status,
      };
  }
};