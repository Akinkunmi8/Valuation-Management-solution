import {
  FiBarChart2,
  FiGrid,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
// import { useNavigate } from "react-router";

import MetricCard from "@/features/dashboard/components/MetricCard";
import { MetricCardSkeleton } from "@/shared/ui/loader";
// import { ROUTES } from "@/shared/constants/routes";

import { useGetAdminDashboardMetricsQuery } from "../api/adminDashboardApi";

const AdminDashboardPage = () => {
  // const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = useGetAdminDashboardMetricsQuery();

  const metrics = data?.metrics;

  return (
    <section className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Monitor users and manage the valuation platform.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-3 fade-up">

        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Users"
              value={metrics?.totalUsersCount ?? 0}
              description="Registered system users"
              theme="approved"
              icon={<FiUsers size={20} />}
            />

            <MetricCard
              title="Active Users"
              value={metrics?.totalActiveUsersCount ?? 0}
              description="Currently active users"
              theme="payment"
              icon={<FiGrid size={20} />}
            />

            <MetricCard
              title="Valuers"
              value={metrics?.totalValuersCount ?? 0}
              description="Registered valuers"
              theme="awaiting"
              icon={<FiBarChart2 size={20} />}
            />
          </>
        )}

      </div>

      <div>

        <h2 className="mb-4 text-xl font-semibold text-text-primary">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <button
            // onClick={() => navigate(ROUTES.admin.users)}
            className="rounded-xl border border-border bg-surface p-6 text-left transition hover:shadow-md"
          >
            <FiUsers
              size={26}
              className="mb-4 text-primary"
            />

            <h3 className="font-semibold">
              Manage Users
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              Create, activate and manage users.
            </p>
          </button>

          <button
            // onClick={() => navigate(ROUTES.admin.settings)}
            className="rounded-xl border border-border bg-surface p-6 text-left transition hover:shadow-md"
          >
            <FiSettings
              size={26}
              className="mb-4 text-primary"
            />

            <h3 className="font-semibold">
              Settings
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              Configure system settings.
            </p>
          </button>

          <button
            // onClick={() => navigate(ROUTES.admin.reports)}
            className="rounded-xl border border-border bg-surface p-6 text-left transition hover:shadow-md"
          >
            <FiBarChart2
              size={26}
              className="mb-4 text-primary"
            />

            <h3 className="font-semibold">
              Reports
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              View audit and management reports.
            </p>
          </button>

        </div>

      </div>

    </section>
  );
};

export default AdminDashboardPage;