import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router'
// 
// import Button from '../../../shared/ui/button/Button'

import MetricCard from '../../dashboard/components/MetricCard'
// import { ROUTES } from '../../../shared/constants/routes'
import { useState } from 'react'
import { useGetCmsDashboardMetricsQuery } from '../api/cmsDashboardApi'

import { MetricCardSkeleton } from '../../../shared/ui/loader'
import DataTable from '../../../shared/ui/table/DataTable'
import { cmsColumns } from '../../facilities/constants/cmsColumns'




const CmsDashboardPage = () => {
  const navigate = useNavigate()

  const {
    data,
    isLoading,
  } =
    useGetCmsDashboardMetricsQuery()

  const metrics = data?.metrics

  const totalFacilities =
    metrics
      ? metrics.awaitingAssignmentCount +
      metrics.ongoingFacilityCount +
      metrics.completedFacilityCount +
      metrics.pendingValuerPaymentCount +
      metrics.overdueFacilityCount
      : 0

  // TODO:
  // Confirm with backend that these
  // workflow buckets are mutually exclusive.


  type Workflow =
    | 'all'
    | 'awaitingAssignment'
    | 'ongoingFacility'
    | 'completedFacility'
    | 'pendingValuerPayment'
    | 'overdueFacility'

  const [selectedWorkflow, setSelectedWorkflow] =
    useState<Workflow>('all')


  const workflowCards = [
    {
      title: 'All',
      key: 'all',
      count: totalFacilities,
      accent: 'primary',
    },
    {
      title: 'Awaiting Assignment',
      key: 'awaitingAssignment',
      count:
        metrics?.awaitingAssignmentCount ?? 0,
      accent: 'warning',
    },
    {
      title: 'Ongoing',
      key: 'ongoingFacility',
      count:
        metrics?.ongoingFacilityCount ?? 0,
      accent: 'info',
    },
    {
      title: 'Completed',
      key: 'completedFacility',
      count:
        metrics?.completedFacilityCount ?? 0,
      accent: 'success',
    },
    {
      title: 'Pending Valuer Payment',
      key: 'pendingValuerPayment',
      count:
        metrics?.pendingValuerPaymentCount ?? 0,
      accent: 'primary',
    },
    {
      title: 'Overdue',
      key: 'overdueFacility',
      count:
        metrics?.overdueFacilityCount ?? 0,
      accent: 'danger',
    },
  ] as const

  const tableData =
    selectedWorkflow === 'all'
      ? [
        ...(data?.awaitingAssignment ?? []),
        ...(data?.ongoingFacility ?? []),
        ...(data?.completedFacility ?? []),
        ...(data?.pendingValuerPayment ?? []),
        ...(data?.overdueFacility ?? []),
      ]
      : data?.[selectedWorkflow] ?? []

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            CMS Dashboard
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Assign valuers, monitor valuation progress and manage supervisor workflow.
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
              accent={card.accent}
              onClick={() =>
                setSelectedWorkflow(card.key)
              }
              active={
                selectedWorkflow === card.key
              }
            />
        )}



      </div>

      {/* Search */}

      <>
        <div className="flex items-center justify-between">

          <div className="relative w-full max-w-md flex items-center justify-between">
            <FiSearch className="absolute left-3 top-1/2 translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search facility reference or customer..."
              className=" h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />

          </div>
        </div>
      </>

      {/* Facility Table */}

      <>
        <div className="rounded-2xl border border-border bg-surface shadow-sm">

          <div className="overflow-x-auto">

            <DataTable
              columns={cmsColumns}
              data={tableData}
              rowKey="facilityReference"
              loading={isLoading}
              emptyTitle="No Facilities"
              emptyMessage="There are no facilities matching this workflow."

              onRowClick={(facility) =>
                navigate(
                  `/dashboard/cm/facility-reviews/${facility.facilityReference}`
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

export default CmsDashboardPage