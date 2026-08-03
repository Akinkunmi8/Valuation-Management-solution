import {
  FiSearch,
  FiClipboard,
  FiActivity,
  FiEye,
  FiCheckCircle,
  FiRotateCcw,
  FiAlertTriangle,
} from 'react-icons/fi'
import { useNavigate } from 'react-router'

import MetricCard from '@/features/dashboard/components/MetricCard'
// import { ROUTES } from '../../../shared/constants/routes'
import {
  //  useMemo,
  useState
} from 'react'
import { useGetValuerDashboardMetricsQuery } from '../api/valuerDashboardApi'

import { AppLoader, MetricCardSkeleton } from '@/shared/ui/loader'
import DataTable from '@/shared/ui/table/DataTable'
import { valuerColumns } from '../constants/valuerColumns'
import { useCurrentValuer } from '../hooks/useCurrentValuer'
// import { mergeUniqueByKey } from '@/shared/utils/mergeUniqueByKeys'





const ValuersDashboardPage = () => {
  const navigate = useNavigate()

  const { valuerId } = useCurrentValuer()
  const {
    data,
    isLoading,
  } =
    useGetValuerDashboardMetricsQuery(
      valuerId!,
      {
        skip: !valuerId,
      })


  const metrics = data?.metrics

  // console.log("data", data);

  // TODO:
  // Confirm with backend that these
  // workflow buckets are mutually exclusive.


  type Workflow =
    | 'assignedFacilities'
    | 'ongoingReports'
    | 'awaitingCompletedReports'
    | 'approvedCompletedReports'
    | 'returnedReports'
    | 'beyondTat'

  const [selectedWorkflow, setSelectedWorkflow] =
    useState<Workflow>('assignedFacilities')


  const workflowCards = [
    {
      title: 'Assigned',
      key: 'assignedFacilities',
      count: metrics?.assignedFacilityCount ?? 0,
      theme: 'awaiting',
      icon: <FiClipboard size={17} />,
    },
    {
      title: 'Ongoing',
      key: 'ongoingReports',
      count: metrics?.ongoingReportCount ?? 0,
      theme: 'pending',
      icon: <FiActivity size={17} />,
    },
    {
      title: 'Reviewing',
      key: 'awaitingCompletedReports',
      count: metrics?.awaitingCompletedReportCount ?? 0,
      theme: 'info',
      icon: <FiEye size={17} />,
    },
    {
      title: 'Completed',
      key: 'approvedCompletedReports',
      count: metrics?.approvedCompletedReportCount ?? 0,
      theme: 'completed',
      icon: <FiCheckCircle size={17} />,
    },
    {
      title: 'Returned',
      key: 'returnedReports',
      count: metrics?.returnedReportCount ?? 0,
      theme: 'rejected',
      icon: <FiRotateCcw size={17} />,
    },
    {
      title: 'Beyond TAT',
      key: 'beyondTat',
      count: metrics?.beyondTatCount ?? 0,
      theme: 'overdue',
      icon: <FiAlertTriangle size={17} />,
    },
  ] as const

  const tableData =
    data?.[selectedWorkflow] ?? []

  if (!valuerId) {
    return <AppLoader />
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Valuers Dashboard
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Overview of your valuation assignments.
          </p>
        </div>

      </div>

      {/* Metrics */}


      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 xl:grid-cols-5 fade-up">

        {workflowCards.map(card =>
          isLoading
            ? <MetricCardSkeleton key={card.key} />
            : (
              <MetricCard
                key={card.key}
                title={card.title}
                icon={card.icon}
                value={card.count}
                theme={card.theme}
                active={selectedWorkflow === card.key}
                onClick={() => setSelectedWorkflow(card.key)}
              />
            )
        )}

      </div>

      {/* Search */}

      {/* Search */}

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <FiSearch
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search facility reference or customer..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              focus:border-teal-500
              focus:ring-4
              focus:ring-teal-100
            "
          />
        </div>
      </div>


      {/* Facility Table */}

      <>
        <div className="rounded-2xl border border-border bg-surface shadow-sm">

          <div className="overflow-x-auto">

            <DataTable
              columns={valuerColumns}
              data={tableData}
              rowKey="facilityReference"
              loading={isLoading}
              emptyTitle="No Facilities"
              emptyMessage="There are no facilities matching this workflow."

              onRowClick={(facility) =>
                navigate(
                  `/dashboard/valuer/valuer-facilities-details/${facility.facilityReference}`
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

export default ValuersDashboardPage