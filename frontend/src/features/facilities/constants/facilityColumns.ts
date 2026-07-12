import type { Column } from "../../../shared/ui/table/types";
import type { FacilityTableRow } from "../types/facilityTypes";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";

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
    key: "valuationChargeFees",
    header: "Valuation Fee",

    render: (row) => formatCurrency(row.valuationChargeFees),
  },

  {
    key: "approvalStatus",
    header: "Approval",
  },

  {
    key: "paymentStatus",
    header: "Payment",
  },

  {
    key: "dateAdded",
    header: "Created",

    render: (row) => formatDate(row.dateAdded),
  },
];
