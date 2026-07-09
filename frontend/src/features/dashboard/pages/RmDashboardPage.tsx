import {
  FiBriefcase,
  FiClock,
  FiCreditCard,
  FiCheckCircle,
} from 'react-icons/fi'

import { useNavigate } from 'react-router'
import MetricCard from '../components/MetricCard'
import { ROUTES } from '../../../shared/constants/routes'
import { getCreatedBy } from '../../auth/utils/createdBy'
import { useAppSelector } from '../../../app/store/hooks'
import { useGetRmDashboardMetricsQuery } from '../api/rmApiDashboardApi'




const RmDashboardPage = () => {
  const navigate = useNavigate()

  const {
    email,
    solId,
  } = useAppSelector(
    state => state.auth,
  )

  const createdBy = getCreatedBy(email!);


  const {
    data,
    // isLoading,
    // error,
  } = useGetRmDashboardMetricsQuery({
    createdBy,
    solId: solId!,
  })

  const metrics = data?.metrics

  const totalFacilities = metrics
    ? metrics.awaitingPaymentCount +
    metrics.pendingWithSuccessfulPaymentCount +
    metrics.approvedCount +
    metrics.rejectedCount +
    metrics.completedCount +
    metrics.expiredCount
    : 0



  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          RM Dashboard
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Overview of your valuation activities.
        </p>
      </div>


      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Facilities"
          value={totalFacilities}
          description="Total credit facilities"
          // description="Active credit facilities"
          // trend="+12% this month"
          accent="primary"
          icon={<FiBriefcase size={22} />}
          onClick={() => navigate(ROUTES.rm.facilities)}
        />

        <MetricCard
          title="Valuations"
          value={12}
          description="Total Valuations"
          // description="Awaiting CMU processing"
          trend="+3 new today"
          accent="warning"
          icon={<FiClock size={22} />}
        />

        <MetricCard
          title="Payments"
          // value={data?.metrics?.awaitingPaymentCount ?? 0}
          value={10}
          description="Everything payment"
          trend="Needs follow-up"
          accent="info"
          icon={<FiCreditCard size={22} />}
        />

        <MetricCard
          title="Reports"
          value={2}
          description="Everything Report"
          trend="+5 this week"
          accent="success"
          icon={<FiCheckCircle size={22} />}
        />
      </div>
    </section>
  )
}

export default RmDashboardPage