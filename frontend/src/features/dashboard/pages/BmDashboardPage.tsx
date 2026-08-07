import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiSearch,
  FiXCircle,
} from 'react-icons/fi'
import { useNavigate } from 'react-router'
import { useMemo } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import MetricCard from '@/features/dashboard/components/MetricCard'
import { MetricCardSkeleton } from '@/shared/ui/loader'
import DataTable from '@/shared/ui/table/DataTable'

import { mergeUniqueByKey } from '@/shared/utils/mergeUniqueByKeys'
import { useMetricFilter } from '@/shared/hooks/useMetricFilter'
import { useGetBmBranchMetricsQuery } from '../api/bmDashboardApi'
import { bmColumns } from '@/features/facilities/constants/bmColumns'

const BmDashboardPage = () => {
  const navigate = useNavigate()

  const { solId } = useAppSelector(state => state.auth)

  const { data, isLoading } = useGetBmBranchMetricsQuery(
    solId!,
    { skip: !solId }
  )

  const metrics = data?.metrics

  type BmWorkflow =
    | 'submitted'
    | 'pendingPayment'
    | 'approved'
    | 'rejected'
    | 'completed'

  const {
    selectedFilter: selectedWorkflow,
    setFilter: setSelectedWorkflow,
    tableRef,
  } = useMetricFilter<BmWorkflow>('submitted')

  const workflowCards = [
    {
      title: 'Submitted',
      key: 'submitted',
      count: metrics?.totalSubmittedCount ?? 0,
      description: 'Total submitted facilities',
      theme: 'info',
      icon: <FiFileText size={18} />,
    },
    {
      title: 'Pending Payment',
      key: 'pendingPayment',
      count: metrics?.totalPendingPaymentCount ?? 0,
      description: 'Facilities awaiting fee payment',
      theme: 'payment',
      icon: <FiCreditCard size={18} />,
    },
    {
      title: 'Approved',
      key: 'approved',
      count: metrics?.totalApprovedCount ?? 0,
      description: 'Approved valuation requests',
      theme: 'approved',
      icon: <FiCheck size={18} />,
    },
    {
      title: 'Rejected',
      key: 'rejected',
      count: metrics?.totalRejectedCount ?? 0,
      description: 'Rejected valuation requests',
      theme: 'rejected',
      icon: <FiXCircle size={18} />,
    },
    {
      title: 'Completed',
      key: 'completed',
      count: metrics?.totalCompletedCount ?? 0,
      description: 'Completed valuation reports',
      theme: 'completed',
      icon: <FiClock size={18} />,
    },
    {
      title: 'Beyond TAT',
      key: 'beyondTat',
      count: metrics?.totalBeyondTatCount ?? 0,
      description: 'Workflows exceeding turnaround time',
      theme: 'overdue',
      icon: <FiAlertCircle size={18} />,
    },
  ] as const

  const tableData = useMemo(() => {
    const rows = data?.[selectedWorkflow] ?? []

    return mergeUniqueByKey(
      rows,
      row => row.facilityReference,
    )
  }, [data, selectedWorkflow])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Branch Manager Dashboard
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Branch overview and facility valuation metrics for SOL: {solId}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4 fade-up">
        {workflowCards.map((card) =>
          isLoading ? (
            <MetricCardSkeleton key={card.key} />
          ) : (
            <MetricCard
              key={card.key}
              title={card.title}
              value={card.count}
              description={card.description}
              theme={card.theme}
              icon={card.icon}
              active={selectedWorkflow === card.key}
              onClick={() => setSelectedWorkflow(card.key as BmWorkflow)}
            />
          )
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search facility reference or customer..."
            className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Facility Table */}
      <>
        <div
          ref={tableRef}
          className="rounded-2xl border border-border bg-surface shadow-sm"
        >
          <div className="overflow-x-auto">
            <DataTable
              columns={bmColumns}
              data={tableData}
              rowKey="facilityReference"
              loading={isLoading}
              emptyTitle="No Facilities"
              emptyMessage="There are no facilities matching this workflow."
              onRowClick={(facility) =>
                navigate(
                  `/dashboard/bm/facilities/${facility.facilityReference}`
                )
              }
            />
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <p className="text-sm text-text-muted">
              Showing 1–{tableData.length} of {tableData.length} facilities
            </p>

            <div className="flex gap-2">
              <button className="rounded-lg border border-border px-3 py-2 text-sm">
                Previous
              </button>

              <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white">
                1
              </button>

              <button className="rounded-lg border border-border px-3 py-2 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  )
}

export default BmDashboardPage