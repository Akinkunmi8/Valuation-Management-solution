import {
  FiBriefcase,
  FiClock,
  FiCreditCard,
  FiCheckCircle,
} from 'react-icons/fi'

import { useNavigate } from 'react-router'
import MetricCard from '../components/MetricCard'
import { ROUTES } from '../../../shared/constants/routes'

const RmDashboardPage = () => {
  const navigate = useNavigate()
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
          value={48}
          description="Active credit facilities"
          // trend="+12% this month"
          accent="primary"
          icon={<FiBriefcase size={22} />}
          onClick={() => navigate(ROUTES.rm.facilities)}
        />

        <MetricCard 
          title="Pending Valuations"
          value={12}
          description="Awaiting CMU processing"
          trend="+3 new today"
          accent="warning"
          icon={<FiClock size={22} />}
        />

        <MetricCard 
          title="Awaiting Payment"
          value={7}
          description="Customer payment pending"
          trend="Needs follow-up"
          accent="info"
          icon={<FiCreditCard size={22} />}
        />

        <MetricCard 
          title="Completed"
          value={29}
          description="Successfully completed"
          trend="+5 this week"
          accent="success"
          icon={<FiCheckCircle size={22} />}
        />
      </div>
    </section>
  )
}

export default RmDashboardPage