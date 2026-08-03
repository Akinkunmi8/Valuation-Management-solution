import { FiCheckCircle, FiClock, 
    // FiPlus, 
    FiSearch } from "react-icons/fi";
import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router";

// import Button from "@/shared/ui/button/Button";
import MetricCard from "@/features/dashboard/components/MetricCard";
import { MetricCardSkeleton } from "@/shared/ui/loader";
import DataTable from "@/shared/ui/table/DataTable";

// import { ROUTES } from "@/shared/constants/routes";

import { useMetricFilter } from "@/shared/hooks/useMetricFilter";

import { useGetReportDashboardQuery } from "../api/reportApi";
import { getReportColumns } from "../constants/reportColumns";

const ValuerReportDashboardPage = () => {
    const navigate = useNavigate();

    const columns = useMemo(
        () => getReportColumns(navigate),
        [navigate]
    )

    const { data, isLoading } =
        useGetReportDashboardQuery();

    const metrics = data?.metrics;

    useEffect(() => {
  if (!data) return;

  console.table(
    data.reports.map(r => ({
      facility: r.facilityReference,
      status: r.reportStatus,
      reportId: r.reportId,
    }))
  );
}, [data]);

    const {
        selectedFilter,
        setFilter,
        tableRef,
    } = useMetricFilter<"ongoing" | "completed">(
        "ongoing",
    );

    const reportCards = [
        {
            title: "Ongoing",
            key: "ongoing",
            count: metrics?.ongoingCount ?? 0,
            theme: "warning",
            icon: <FiClock size={20} />,
        },
        {
            title: "Completed",
            key: "completed",
            count: metrics?.completedCount ?? 0,
            theme: "completed",
            icon: <FiCheckCircle size={20} />,
        },
    ] as const;

    const tableData = useMemo(() => {
        if (!data) return [];

        return data.reports.filter((report) =>
            selectedFilter === "ongoing"
                ? report.reportStatus === "Ongoing"
                : report.reportStatus === "Completed",
        );
    }, [data, selectedFilter]);

    // console.log(data?.reports);

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">
                        Valuation Reports
                    </h1>

                    <p className="mt-2 text-sm text-text-secondary">
                        Create, manage and submit valuation reports.
                    </p>
                </div>

                {/* <Button
                    leftIcon={<FiPlus />}
                    // onClick={() =>
                    //     navigate(ROUTES.valuer.assignments)
                    // }
                >
                    Create Report
                </Button> */}
            </div>

            {/* Metrics */}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 fade-up">
                {reportCards.map((card) =>
                    isLoading ? (
                        <MetricCardSkeleton key={card.key} />
                    ) : (
                        <MetricCard
                            key={card.key}
                            title={card.title}
                            value={card.count}
                            theme={card.theme}
                            icon={card.icon}
                            active={selectedFilter === card.key}
                            onClick={() => setFilter(card.key)}
                        />
                    ),
                )}
            </div>

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
                        placeholder="Search by facility reference, customer or status..."
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

            {/* Table */}

            <div
                ref={tableRef}
                className="rounded-2xl border border-border bg-surface shadow-sm"
            >
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={tableData}
                        rowKey="reportId"
                        loading={isLoading}
                        emptyTitle="No Reports"
                        emptyMessage="No valuation reports found."
                    />
                </div>

                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                    <p className="text-sm text-text-muted">
                        Showing {tableData.length} report(s)
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
        </div>
    );
};

export default ValuerReportDashboardPage;