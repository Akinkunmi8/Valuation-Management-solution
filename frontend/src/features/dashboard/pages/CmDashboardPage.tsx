import {
  FiAlertCircle,
  FiCheck,
  // FiCheckCircle,
  FiSearch,
  FiUserCheck,
  FiXCircle,
} from 'react-icons/fi'
import { useNavigate } from 'react-router'
// 
// import Button from '../../../shared/ui/button/Button'

import MetricCard from '../../dashboard/components/MetricCard'
// import { ROUTES } from '../../../shared/constants/routes'
import {
  // useState,
  useMemo
} from 'react'
import { useGetCmDashboardMetricsQuery } from '../api/cmDashboardApi'

import { MetricCardSkeleton } from '@/shared/ui/loader'
import DataTable from '@/shared/ui/table/DataTable'
import { cmColumns } from '../../facilities/constants/cmColumns'
import { mergeUniqueByKey } from '@/shared/utils/mergeUniqueByKeys'
import { useMetricFilter } from '@/shared/hooks/useMetricFilter'



const CmDashboardPage = () => {
  const navigate = useNavigate()


  const {
    data,
    isLoading,
  } =
    useGetCmDashboardMetricsQuery()

  const metrics = data?.metrics

  // TODO:
  // Confirm with backend that these
  // workflow buckets are mutually exclusive.



  type Workflow =
    | 'pendingReview'
    | 'approved'
    | 'rejected'
    | 'awaitingValuerAssignment'
    | 'pendingReportReview'
    | 'completed'
    | 'beyondTat'

  // const [selectedWorkflow, setSelectedWorkflow] =
  //   useState<Workflow>('pendingReview')

  const {
    selectedFilter: selectedWorkflow,
    setFilter: setSelectedWorkflow,
    tableRef,
  } = useMetricFilter<Workflow>('pendingReview')


  const workflowCards = [
    {
      title: 'Pending Review',
      key: 'pendingReview',
      count: metrics?.pendingReviewCount ?? 0,
      description: 'Facilities awaiting your decision',
      theme: 'pending',
      icon: <FiSearch size={18} />,
    },
    {
      title: 'Awaiting Valuer',
      key: 'awaitingValuerAssignment',
      count: metrics?.awaitingValuerAssignmentCount ?? 0,
      description: 'Awaiting valuer assignment',
      theme: 'info',
      icon: <FiUserCheck size={18} />,
    },
    {
      title: 'Approved',
      key: 'approved',
      count: metrics?.approvedCount ?? 0,
      description: 'Approved facilities and reports',
      theme: 'approved',
      icon: <FiCheck size={18} />,
    },
    {
      title: 'Rejected',
      key: 'rejected',
      count: metrics?.rejectedCount ?? 0,
      description: 'Rejected items requiring attention',
      theme: 'rejected',
      icon: <FiXCircle size={18} />,
    },
    // {
    //   title: 'Completed',
    //   key: 'completed',
    //   count: metrics?.completedCount ?? 0,
    //   description: 'Completed valuation workflows',
    //   theme: 'completed',
    //   icon: <FiCheckCircle size={18} />,
    // },
    {
      title: 'Beyond TAT',
      key: 'beyondTat',
      count: metrics?.beyondTatCount ?? 0,
      description: 'Workflows exceeding turnaround time',
      theme: 'overdue',
      icon: <FiAlertCircle size={18} />,
    },
  ] as const

  // Temporary till backend addresses duplicate data
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
            Facility Reviews Queue
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Manage facilities awaiting collateral review and approval before valuer assignment.
          </p>
        </div>

      </div>

      {/* Metrics */}


      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 xl:grid-cols-5 fade-up">
        {workflowCards.map((card) =>
          isLoading ? <MetricCardSkeleton key={card.key} /> :
            <MetricCard
              key={card.key}
              title={card.title}
              value={card.count}
              description={card.description}
              theme={card.theme}
              icon={card.icon}
              active={selectedWorkflow === card.key}
              onClick={() => setSelectedWorkflow(card.key)}
            />
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
          className="rounded-2xl border border-border bg-surface shadow-sm">

          <div className="overflow-x-auto">

            <DataTable
              columns={cmColumns}
              data={tableData}
              rowKey="facilityReference"
              loading={isLoading}
              emptyTitle="No Facilities"
              emptyMessage="There are no facilities matching this workflow."

              onRowClick={(facility) =>
                navigate(
                  `/dashboard/cm/facility-reviews-details/${facility.facilityReference}`
                  // `/dashboard/cm/facilities/${facility.facilityReference}`,
                )
              }
            />

          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-4">

            <p className="text-sm text-text-muted">
              Showing 1–10 of 48 facilities
            </p>

            <div className="flex gap-2">

              <button className="rounded-lg border border-border px-3 py-2 text-sm">
                Previous
              </button>

              <button className="rounded-lg bg-primary px-3 py-2 text-sm text-white">
                1
              </button>

              <button className="rounded-lg border border-border px-3 py-2 text-sm">
                2
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

export default CmDashboardPage