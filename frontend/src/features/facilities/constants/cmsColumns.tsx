import type { Column } from '@/shared/ui/table/types'
import StatusBadge from '@/shared/ui/badge/Badge'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatDate } from '@/shared/utils/formatDate'

import {
  getApprovalStatus,
  getPaymentStatus,
  getReportStatus,
  getValuationStatus,
} from '@/features/facilities/utils/status'

import type { CmsFacilityTableRow } from '@/features/dashboard/types/cmsDashboardTypes'

export const cmsColumns: Column<CmsFacilityTableRow>[] = [
  {
    key: 'facilityReference',
    header: 'Reference',
  },
  {
    key: 'customerName',
    header: 'Customer',
  },
  {
    key: 'facilityPurpose',
    header: 'Purpose',
  },
  {
    key: 'updatedValuationFees',
    header: 'Fee',
    render: row =>
      formatCurrency(
        row.updatedValuationFees,
      ),
  },
  {
    key: 'valuerPaymentStatus',
    header: 'Valuer Payment',
    render: row => {

      const payment =
        getPaymentStatus(
          row.valuerPaymentStatus,
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
    key: 'reportApprovalStatus',
    header: 'Approval',
    render: row => {

      const approval =
        getApprovalStatus(
          row.reportApprovalStatus,
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
    key: 'valuationStatus',
    header: 'Valuation',
    render: row => {

      const valuation =
        getValuationStatus(
          row.valuationStatus,
        )

      return (
        <StatusBadge
          label={valuation.label}
          variant={valuation.variant}
        />
      )

    },
  },
  {
    key: 'reportStatus',
    header: 'Report',
    render: row => {

      const report =
        getReportStatus(
          row.reportStatus,
        )

      return (
        <StatusBadge
          label={report.label}
          variant={report.variant}
        />
      )

    },
  },
  {
    key: 'dateAdded',
    header: 'Created',
    render: row =>
      formatDate(
        row.dateAdded,
      ),
  },
]