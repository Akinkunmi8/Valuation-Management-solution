import type { Column } from "@/shared/ui/table/types";

import StatusBadge from "@/shared/ui/badge/Badge";

import { formatCurrency } from "@/shared/utils/formatCurrency";
import { formatDate } from "@/shared/utils/formatDate";

import type { ValuationReportDashboardRow } from "../types/valuationReportTypes";
// coreModule

import {
  getApprovalStatus,
  getPaymentStatus,
  getReportStatus,
} from "@/features/facilities/utils/status";


export const valuationReportColumns: Column<ValuationReportDashboardRow>[] = [
  {
    key: "facilityReference",
    header: "Reference",
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
    key: "openMarketValue",
    header: "OMV",
    render: row =>
      formatCurrency(row.openMarketValue),
  },

  {
    key: "reportStatus",
    header: "Report",
    render: row => {
      const report = getReportStatus(
        row.reportStatus
      );

      return (
        <StatusBadge
          label={report.label}
          variant={report.variant}
        />
      );
    },
  },

  {
    key: "reportApprovalStatus",
    header: "Approval",
    render: row => {
      const approval =
        getApprovalStatus(
          row.reportApprovalStatus
        );

      return (
        <StatusBadge
          label={approval.label}
          variant={approval.variant}
        />
      );
    },
  },

  {
    key: "paymentStatus",
    header: "Payment",
    render: row => {
      const payment =
        getPaymentStatus(
          row.paymentStatus
        );

      return (
        <StatusBadge
          label={payment.label}
          variant={payment.variant}
        />
      );
    },
  },

  {
    key: "dateAssigned",
    header: "Assigned",

    render: row =>
      row.dateAssigned
        ? formatDate(row.dateAssigned)
        : "--",
  },
];