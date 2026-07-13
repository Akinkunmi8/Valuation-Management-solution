import type { Column } from "../../../shared/ui/table/types";
import type { FacilityTableRow } from "../types/facilityTypes";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";

import { getApprovalStatus, getPaymentStatus } from "../utils/status";
import StatusBadge from "../../../shared/ui/badge/Badge";

export const facilityColumns: Column<FacilityTableRow>[] = [
  {
    key: "facilityReference",
    header: "Reference",
  },
  {
    key: "customerName",
    header: "Customer",
  },
  {
    key: "accountNumber",
    header: "Account",
  },
  {
    key: "facilityPurpose",
    header: "Purpose",
  },
  {
    key: 'approvalStatus',
    header: 'Approval',

    render: row => {
      const approval =
        getApprovalStatus(
          row.approvalStatus,
        )
      return (
        <StatusBadge
          label={approval.label}
          variant={approval.variant}
        />
      )
    },
  },
  {
    key: "valuationChargeFees",
    header: "Valuation Fee",

    render: (row) => formatCurrency(row.valuationChargeFees),
  },

  {
    key: 'paymentStatus',
    header: 'Payment',

    render: row => {
      const payment =
        getPaymentStatus(
          row.paymentStatus,
        )
      return (
        <StatusBadge
          label={payment.label}
          variant={payment.variant}
        />
      )
    },
  },
  {
    key: "dateAdded",
    header: "Created",

    render: (row) => formatDate(row.dateAdded),
  },
];
