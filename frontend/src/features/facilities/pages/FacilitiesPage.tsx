import { FiPlus, FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router'

import Button from '../../../shared/ui/button/Button'

import MetricCard from '../../dashboard/components/MetricCard'
import { ROUTES } from '../../../shared/constants/routes'
// import { useState } from 'react'
import { useGetRmDashboardMetricsQuery } from '../../dashboard/api/rmDashboardApi'
import { useAppSelector } from '../../../app/store/hooks'
// import { getCreatedBy } from '../../auth/utils/createdBy'
import { MetricCardSkeleton } from '../../../shared/ui/loader'
import DataTable from '../../../shared/ui/table/DataTable'
import { facilityColumns } from '../constants/facilityColumns'
import { useMetricFilter } from '@/shared/hooks/useMetricFilter'





const FacilitiesPage = () => {
  const navigate = useNavigate()

  const {
    email,
    solId,
  } = useAppSelector(
    state => state.auth,
  )

  // const createdBy = getCreatedBy(email!);


  const {
    data,
    isLoading,
    // error,
  } = useGetRmDashboardMetricsQuery({
    createdBy: email!,
    solId: solId!,
  })

  const metrics = data?.metrics
  // console.log("data", data);

  const totalFacilities = metrics
    ? metrics.awaitingPaymentCount +
    metrics.pendingWithSuccessfulPaymentCount +
    metrics.approvedCount +
    metrics.rejectedCount +
    metrics.completedCount +
    metrics.expiredCount
    : 0



  type Workflow =
    | 'all'
    | 'awaitingPayment'
    | 'pendingWithSuccessfulPayment'
    | 'approved'
    | 'rejected'
    | 'completed'
    | 'expired'

  const {
    selectedFilter:
    selectedWorkflow,
    setFilter:
    setSelectedWorkflow,
    tableRef,
  } =
    useMetricFilter<Workflow>(
      'all',
    )


  const workflowCards: {
    title: string
    key: Workflow
    count: number
  }[] = [
    {
      title: 'All',
      key: 'all',
      count: totalFacilities,
    },
    {
      title: 'Awaiting Payment',
      key: 'awaitingPayment',
      count: metrics?.awaitingPaymentCount ?? 0,
    },
    {
      title: 'Payment Successful',
      key: 'pendingWithSuccessfulPayment',
      count: metrics?.pendingWithSuccessfulPaymentCount ??
        0,
    },
    {
      title: 'Approved',
      key: 'approved',
      count: metrics?.approvedCount ?? 0,
    },
    {
      title: 'Rejected',
      key: 'rejected',
      count: metrics?.rejectedCount ?? 0,
    },
    {
      title: 'Completed',
      key: 'completed',
      count: metrics?.completedCount ?? 0,
    },
    {
      title: 'Expired',
      key: 'expired',
      count: metrics?.expiredCount ?? 0,
    },
  ] as const;


  const tableData =
    selectedWorkflow === 'all'
      ? [
        ...(data?.awaitingPayment ?? []),
        ...(data?.pendingWithSuccessfulPayment ?? []),
        ...(data?.approved ?? []),
        ...(data?.rejected ?? []),
        ...(data?.completed ?? []),
        ...(data?.expired ?? []),
      ]
      : data?.[selectedWorkflow] ?? []

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Facilities
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Manage customer facilities and collateral valuation requests.
          </p>
        </div>

        <Button
          leftIcon={<FiPlus />}
          onClick={() =>
            navigate(ROUTES.rm.createFacility)
          }
        >
          Create Facility
        </Button>

      </div>

      {/* Metrics */}

      {/* <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="All"
          value={totalFacilities}
          description="Work in progress"
          accent='primary'
          active={activeMetric === 'DRAFT'}
          onClick={() => setActiveMetric('DRAFT')}
        />

        <MetricCard
          title="Awaiting Payment"
          value={metrics.awaitingPaymentCount ?? 0}
          description="Awaiting payment"
          accent="info"
          active={activeMetric === 'SUBMITTED'}
          onClick={() => setActiveMetric('SUBMITTED')}
        />

        <MetricCard
          title="Payment Successful"
          value={metrics?.pendingWithSuccessfulPaymentCount ?? 0}
          description="Customer debit pending"
          accent="warning"
          active={activeMetric === 'PAYMENT_PENDING'}
          onClick={() =>
            setActiveMetric('PAYMENT_PENDING')
          }
        />

        <MetricCard
          title="Approved"
          value={metrics?.pendingWithSuccessfulPaymentCount ?? 0}
          description="Successfully processed"
          accent="success"
          active={activeMetric === 'COMPLETED'}
          onClick={() =>
            setActiveMetric('COMPLETED')
          }
        />
        <MetricCard
          title="Completed"
          value={25}
          description="Successfully processed"
          accent="success"
          active={activeMetric === 'COMPLETED'}
          onClick={() =>
            setActiveMetric('COMPLETED')
          }
        />

      </div> */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6 fade-up">
        {workflowCards.map((card) =>
          isLoading ? <MetricCardSkeleton key={card.key} /> :
            <MetricCard
              key={card.key}
              title={card.title}
              value={card.count}
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
              placeholder="Search reference no, CIF or customer..."
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
      </>

      {/* Facility Table */}

      <>
        <div 
        ref={tableRef}
        className="rounded-2xl border border-border bg-surface shadow-sm">

          <div className="overflow-x-auto">



            <DataTable
              columns={facilityColumns}
              data={tableData}
              rowKey="facilityReference"
              loading={isLoading}
              emptyTitle="No Facilities"
              emptyMessage="There are no facilities matching this workflow."

              onRowClick={(facility) =>
                navigate(
                  `/dashboard/rm/facilities/${facility.facilityReference}`,
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

export default FacilitiesPage