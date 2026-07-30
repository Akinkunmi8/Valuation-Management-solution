import type { StatusBadgeProps } from "@/shared/ui/badge/Badge";
import { FacilityApprovalStatus } from "@/shared/constants/workflowStatus";

export const getApprovalStatus = (status: number): StatusBadgeProps => {
  switch (status) {
    case FacilityApprovalStatus.Pending:
      return {
        label: "Pending",
        variant: "warning",
      };

    case FacilityApprovalStatus.Approved:
      return {
        label: "Approved",
        variant: "success",
      };

    case FacilityApprovalStatus.Rejected:
      return {
        label: "Rejected",
        variant: "danger",
      };

    default:
      return {
        label: "Unknown",
        variant: "neutral",
      };
  }
};

export const getReportStatus = (status: string): StatusBadgeProps => {
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

// export const getPaymentStatus = (
//   status: string,
// ): StatusBadgeProps => {
//   switch (status.trim().toLowerCase()) {
//     case "successful":
//       return {
//         label: "Paid",
//         variant: "success",
//       };

//     case "unprocessed":
//       return {
//         label: "Pending",
//         variant: "warning",
//       };

//     default:
//       return {
//         label: status,
//         variant: "neutral",
//       };
//   }
// };

export const getPaymentStatus = (
  status: string,
): StatusBadgeProps => {
  console.log("Payment Status =>", status);

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


export const getReportApprovalStatus = (
  status: string,
): StatusBadgeProps => {
  switch (status) {
    case "Approved":
      return {
        variant: "success",
        label: "Approved",
      };

    case "Rejected":
      return {
        variant: "danger",
        label: "Rejected",
      };

    case "Pending":
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
