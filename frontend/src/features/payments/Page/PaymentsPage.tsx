import {
  useRef,
  //  useMemo, 
  useState
} from 'react'
import {
  FiCheckCircle,
  // FiCreditCard,
  FiRefreshCcw,
  FiSearch,
  FiXCircle,
} from 'react-icons/fi'
import { useNavigate } from 'react-router'

import MetricCard from '@/features/dashboard/components/MetricCard'
import { MetricCardSkeleton } from '@/shared/ui/loader'
import DataTable from '@/shared/ui/table/DataTable'
import type { Column } from '@/shared/ui/table/types'
import { ROUTES } from '@/shared/constants/routes'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatDate } from '@/shared/utils/formatDate'

import {
  useGetPaymentDashboardQuery,
  type PaymentStatus,
  type PaymentTransaction,
} from '../api/getFacilityPaymentApi'

type PaymentFilter =
  | 'Successful'
  | 'Failed'
  | 'Reversed'

const PaymentStatusBadge = ({
  status,
}: {
  status: PaymentStatus
}) => {
  const styles: Record<PaymentStatus, string> = {
    Successful: 'bg-emerald-100 text-emerald-700',
    Failed: 'bg-rose-100 text-rose-700',
    Reversed: 'bg-amber-100 text-amber-700',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  )
}

const PaymentsPage = () => {
  const navigate = useNavigate()

  const tableRef = useRef<HTMLDivElement>(null)

  const [selectedFilter, setSelectedFilter] =
    useState<PaymentFilter>('Successful')

    const handleFilterChange = (filter: PaymentFilter) => {
  setSelectedFilter(filter)

  requestAnimationFrame(() => {
    tableRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}

  const {
    data,
    isLoading,
    isError,
  } = useGetPaymentDashboardQuery()

  const metrics = data?.metrics

  const transactions = data?.transactions ?? []

  const rows = transactions.map((row, index) => ({
    ...row,
    rowId: `${row.facilityReference}-${row.transDate}-${row.amount}-${index}`,
  }))

  const tableData =
    rows.filter(
      (row) => row.status === selectedFilter,
    )

  const columns: Column<PaymentTransaction>[] = [
    {
      key: 'facilityReference',
      header: 'Facility Reference',
    },
    {
      key: 'customerName',
      header: 'Customer',
    },
    {
      key: 'accountNumber',
      header: 'Account Number',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: row => formatCurrency(row.amount),
    },
    {
      key: 'transactionType',
      header: 'Type',
    },
    {
      key: 'status',
      header: 'Status',
      render: row => (
        <PaymentStatusBadge status={row.status} />
      ),
    },
    {
      key: 'transDate',
      header: 'Transaction Date',
      render: row => formatDate(row.transDate),
    },
  ]

  const handleRowClick = (row: PaymentTransaction) => {
    navigate(
      ROUTES.rm.facilityDetails.replace(
        ':facilityReference',
        row.facilityReference,
      ),
    )
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Payments
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Monitor facility fee payments and transaction activity.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Unable to load payment information.
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Payments
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Monitor facility fee payments and transaction activity.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4 fade-up">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Successful"
              value={metrics?.successfulCount ?? 0}
              description="Successful fee payments"
              theme="payment"
              icon={<FiCheckCircle size={20} />}
              active={selectedFilter === 'Successful'}
              // onClick={() => setSelectedFilter('Successful')}
              onClick={() => handleFilterChange('Successful')}
            />

            <MetricCard
              title="Failed"
              value={metrics?.failedCount ?? 0}
              description="Failed payment attempts"
              theme="rejected"
              icon={<FiXCircle size={20} />}
              active={selectedFilter === 'Failed'}
              // onClick={() => setSelectedFilter('Failed')}
              onClick={() => handleFilterChange('Failed')}
            />

            <MetricCard
              title="Reversed"
              value={metrics?.reversedCount ?? 0}
              description="Reversed transactions"
              theme="expired"
              icon={<FiRefreshCcw size={20} />}
              active={selectedFilter === 'Reversed'}
              // onClick={() => setSelectedFilter('Reversed')}
              onClick={() => handleFilterChange('Reversed')}
            />

            {/* <MetricCard
              title="Total Received"
              value={metrics?.totalSuccessfulAmount ?? 0}
              description="Successful payment value"
              theme="approved"
              icon={<FiCreditCard size={20} />}
            /> */}
          </>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search reference no, account or customer..."
            className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </div>


      <div 
      ref={tableRef}
      className="scroll-mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            Payment Transactions
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Facility fee payment activity.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={tableData}
          rowKey="rowId"
          loading={isLoading}
          emptyTitle={`No ${selectedFilter.toLowerCase()} payments`}
          emptyMessage="No transactions match the selected payment status."
          onRowClick={handleRowClick}
        />
      </div>
    </section>
  )
}

export default PaymentsPage