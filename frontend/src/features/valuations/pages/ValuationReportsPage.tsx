import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import MetricCard from "@/features/dashboard/components/MetricCard";
import { MetricCardSkeleton } from "@/shared/ui/loader";
import DataTable from "@/shared/ui/table/DataTable";

import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiSearch
} from "react-icons/fi";

import {
    useGetValuationReportDashboardQuery,
} from "../api/valuationReportApi";

import { valuationReportColumns } from "../constants/valuationReportColumns";

type Workflow =
    | "ongoing"
    | "reviewing"
    | "completed"
    | "approved"
    | "rejected";

export const ValuationReportPage = () => {
    const navigate = useNavigate();

    const { data, isLoading } =
        useGetValuationReportDashboardQuery();


    // console.log("data: ", data);

    const reports = useMemo(
        () => data?.reports ?? [],
        [data]
    );


    const reportCounts = useMemo(() => {
        const counts = {
            ongoing: 0,
            reviewing: 0,
            completed: 0,
            approved: 0,
            rejected: 0,

        };

        reports.forEach(report => {
            if (report.reportStatus === "Ongoing")
                counts.ongoing++;

            if (report.reportStatus === "Reviewing")
                counts.reviewing++;

            if (report.reportStatus === "Completed")
                counts.completed++;

            if (
                report.reportApprovalStatus ===
                "Approved"
            )
                counts.approved++;

            if (
                report.reportApprovalStatus ===
                "Rejected"
            )
                counts.rejected++;

       });

        return counts;
    }, [reports]);



    const [selectedWorkflow, setSelectedWorkflow] =
        useState<Workflow>("ongoing");

    const workflowCards = [

        {
            title: "Ongoing",
            key: "ongoing",
            count: reportCounts.ongoing,
            theme: "awaiting",
            icon: <FiClock size={18} />,
        },

        {
            title: "Reviewing",
            key: "reviewing",
            count: reportCounts.reviewing,
            theme: "payment",
            icon: <FiClock size={18} />,
        },

        {
            title: "Completed",
            key: "completed",
            count: reportCounts.completed,
            theme: "completed",
            icon: <FiCheckCircle size={18} />,
        },

        {
            title: "Approved",
            key: "approved",
            count: reportCounts.approved,
            theme: "approved",
            icon: <FiCheckCircle size={18} />,
        },

        {
            title: "Rejected",
            key: "rejected",
            count: reportCounts.rejected,
            theme: "rejected",
            icon: <FiXCircle size={18} />,
        },

     ] as const;

    const tableData = useMemo(() => {
        switch (selectedWorkflow) {
            case "ongoing":
                return reports.filter(
                    x => x.reportStatus === "Ongoing"
                );

            case "reviewing":
                return reports.filter(
                    x => x.reportStatus === "Reviewing"
                );

            case "completed":
                return reports.filter(
                    x => x.reportStatus === "Completed"
                );

            case "approved":
                return reports.filter(
                    x =>
                        x.reportApprovalStatus ===
                        "Approved"
                );

            case "rejected":
                return reports.filter(
                    x =>
                        x.reportApprovalStatus ===
                        "Rejected"
                );

            default:
                return reports.filter(
                    x => x.reportStatus === "Ongoing"
                );
        }
    }, [reports, selectedWorkflow]);

    console.log(valuationReportColumns);
    console.log("PAGE COLUMNS", valuationReportColumns);
    console.log(
        "PAYMENT COLUMN",
        valuationReportColumns.find(
            c => c.key === "paymentStatus",
        ),
    );

    console.log("Zup")


    return (
        <div className="space-y-6 ">
            <div>
                <h1 className="text-3xl font-bold">
                    Valuation Reports
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    Review submitted valuation reports,
                    approve or reject reports and
                    initiate valuer payment.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5 fade-up">
                {workflowCards.map(card =>
                    isLoading ? (
                        <MetricCardSkeleton
                            key={card.key}
                        />
                    ) : (
                        <MetricCard
                            key={card.key}
                            title={card.title}
                            value={card.count}
                            theme={card.theme}
                            icon={card.icon}
                            active={
                                selectedWorkflow ===
                                card.key
                            }
                            onClick={() =>
                                setSelectedWorkflow(
                                    card.key
                                )
                            }
                        />
                    )
                )}
            </div>

            <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                    placeholder="Search facility, customer or valuer..."
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
            </div>

            <DataTable
                columns={valuationReportColumns}
                data={tableData}
                rowKey="reportId"
                loading={isLoading}
                emptyTitle="No Reports"
                emptyMessage="There are no valuation reports for this category."
                onRowClick={row =>
                    navigate(
                        `/dashboard/cm/valuation-report-details/${row.facilityReference}`
                    )
                }
            />


        </div>
    );
}

export default ValuationReportPage;