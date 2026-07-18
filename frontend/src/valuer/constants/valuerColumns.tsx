import type { Column } from '@/shared/ui/table/types'
import StatusBadge from '@/shared/ui/badge/Badge'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatDate } from '@/shared/utils/formatDate'

import {
  getPaymentStatus,
  getReportStatus,
  getValuationStatus,
} from '@/features/facilities/utils/status'

import type {
  ValuerFacilityTableRow,
} from '../api/valuerDashboardApi'

export const valuerColumns: Column<ValuerFacilityTableRow>[] = [
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
    key: 'collateralValue',
    header: 'Collateral Value',
    render: row =>
      formatCurrency(row.collateralValue),
  },

  {
    key: 'valuerPaymentStatus',
    header: 'Payment',
    render: row => {
      const payment = getPaymentStatus(
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
    key: 'valuationStatus',
    header: 'Valuation',
    render: row => {
      const valuation = getValuationStatus(
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
      const report = getReportStatus(
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
      formatDate(row.dateAdded),
  },
]