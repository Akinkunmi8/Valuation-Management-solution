import type { Column } from "@/shared/ui/table/types";
import type { NavigateFunction } from "react-router";

import type {
  ReportDashboardRow,
} from "../types/reportDashboardTypes";

import {
  FiDownload,
  FiEdit3,
  FiEye,
} from "react-icons/fi";


import Button from "@/shared/ui/button/Button";

import { ROUTES } from "@/shared/constants/routes";

import StatusBadge from "@/shared/ui/badge/Badge";

export const getReportColumns = (navigate: NavigateFunction): Column<ReportDashboardRow>[] => [
  {
    key: "facilityReference",
    header: "Facility Ref",
  },

  {
    key: "customerName",
    header: "Customer",
  },

  {
    key: "valuerName",
    header: "Valuer",
  },

  {
    key: "reportStatus",
    header: "Report Status",

    render: (row) => (
      <StatusBadge
        label={row.reportStatus}
        variant={
          row.reportStatus === "Completed"
            ? "success"
            : row.reportStatus === "Reviewing"
              ? "info"
              : "warning"
        }
      />

    ),
  },

  {
    key: "reportApprovalStatus",
    header: "Approval",

    render: (row) => (
      <StatusBadge
        label={row.reportApprovalStatus}
        variant={
          row.reportApprovalStatus === "Approved"
            ? "success"
            : row.reportApprovalStatus === "Rejected"
              ? "danger"
              : "warning"
        }
      />
    ),
  },

  {
    key: "paymentStatus",
    header: "Payment",
    render: (row) => (
      <StatusBadge
        label={
          row.paymentStatus === "Successful"
            ? "Paid"
            : row.paymentStatus === "UnProcessed"
              ? "Pending"
              : row.paymentStatus
        }
        variant={
          row.paymentStatus === "Successful"
            ? "success"
            : row.paymentStatus === "UnProcessed"
              ? "warning"
              : "neutral"
        }
      />
    ),
  },


  {
    key: "dateAssigned",
    header: "Date Assigned",

    render: (row) =>
      row.dateAssigned
        ? new Date(row.dateAssigned).toLocaleDateString()
        : "--",
  },

  {
    key: "reportId",
    header: "Action",

    render: (row) => {

      switch (row.reportStatus) {
        case "Ongoing":
          return (
            <Button
              size="sm"
              leftIcon={<FiEdit3 />}
              onClick={(e) => {
                e.stopPropagation();

                navigate(
                  ROUTES.valuer.reportsSubmitEdit.replace(
                    ":facilityReference",
                    row.facilityReference,
                  ),
                );
              }}
            >
              Create Report
            </Button>
          );

        case "Reviewing":
          return (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FiEye />}
            >
              View
            </Button>
          );

        case "Completed":
          return (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<FiEye />}
              >
                View
              </Button>

              <Button
                size="sm"
                leftIcon={<FiDownload />}
              >
                Download
              </Button>
            </div>
          );

        default:
          return "--";
      }
    },
  },
];