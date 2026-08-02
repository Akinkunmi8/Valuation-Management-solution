import { useMemo, useRef, useState } from "react";
import {
    FiCheckCircle,
    FiClock,
    FiRefreshCcw,
    FiSearch,
    FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router";

import MetricCard from "@/features/dashboard/components/MetricCard";
import { MetricCardSkeleton, Skeleton } from "@/shared/ui/loader";
import DataTable from "@/shared/ui/table/DataTable";
import type { Column } from "@/shared/ui/table/types";
import { ROUTES } from "@/shared/constants/routes";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { formatDate } from "@/shared/utils/formatDate";

import { useGetReportDashboardQuery } from "@/features/reports/api/reportApi";
import { useGetValuerPaymentDashboardQuery } from "../api/cmValuersPaymentApi";

type PaymentFilter = "AwaitingPayment" | "Successful" | "Failed" | "Reversed";

type UnifiedPaymentRow = {
    facilityReference: string;
    customerName: string;
    accountNumber: string;
    amount: number;
    transactionType: string;
    status: "Awaiting Payment" | "Successful" | "Failed" | "Reversed";
    transDate: string;
    rowId: string;
};

const PaymentStatusBadge = ({
    status,
}: {
    status: UnifiedPaymentRow["status"];
}) => {
    const styles: Record<UnifiedPaymentRow["status"], string> = {
        "Awaiting Payment": "bg-amber-100 text-amber-700",
        Successful: "bg-emerald-100 text-emerald-700",
        Failed: "bg-rose-100 text-rose-700",
        Reversed: "bg-slate-100 text-slate-700",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {status}
        </span>
    );
};

const TableSkeleton = () => (
    <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
    </div>
);

const CmValuersPaymentPage = () => {
    const navigate = useNavigate();
    const tableRef = useRef<HTMLDivElement>(null);

    const [selectedFilter, setSelectedFilter] =
        useState<PaymentFilter>("AwaitingPayment");
    const [searchQuery, setSearchQuery] = useState("");

    // RTK Query Hooks
    const {
        data: paymentData,
        isLoading: isPaymentLoading,
        isError: isPaymentError,
        refetch: refetchPayments,
    } = useGetValuerPaymentDashboardQuery();

    const {
        data: reportData,
        isLoading: isReportLoading,
        isError: isReportError,
        refetch: refetchReports,
    } = useGetReportDashboardQuery();

    const isLoading = isPaymentLoading || isReportLoading;
    const isError = isPaymentError || isReportError;

    const handleFilterChange = (filter: PaymentFilter) => {
        setSelectedFilter(filter);

        requestAnimationFrame(() => {
            tableRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };

    // Derive pending reports awaiting valuer payment
    const pendingPayments = useMemo(() => {
        return (
            reportData?.reports.filter(
                (report) =>
                    report.reportApprovalStatus === "Approved" &&
                    report.paymentStatus === "UnProcessed"
            ) ?? []
        );
    }, [reportData]);

    // Combine and normalize rows based on active filter
    const filteredRows = useMemo(() => {
        const rawList: UnifiedPaymentRow[] =
            selectedFilter === "AwaitingPayment"
                ? pendingPayments.map((report, index) => ({
                    facilityReference: report.facilityReference,
                    customerName: report.customerName,
                    accountNumber: report.valuerName ?? "N/A",
                    amount: report.openMarketValue ?? 0,
                    transactionType: "Valuation Fee",
                    status: "Awaiting Payment",
                    transDate: report.dateAssigned ?? new Date().toISOString(),
                    rowId: `awaiting-${report.facilityReference}-${index}`,
                }))
                : (paymentData?.transactions ?? [])
                    .filter((tx) => tx.status === selectedFilter)
                    .map((tx, index) => ({
                        facilityReference: tx.facilityReference,
                        customerName: tx.customerName,
                        accountNumber: tx.accountNumber,
                        amount: tx.amount,
                        transactionType: tx.transactionType,
                        status: tx.status,
                        transDate: tx.transDate,
                        rowId: `${tx.facilityReference}-${tx.transDate}-${index}`,
                    }));

        // Apply search query filter
        const query = searchQuery.trim().toLowerCase();
        if (!query) return rawList;

        return rawList.filter(
            (row) =>
                row.facilityReference.toLowerCase().includes(query) ||
                row.customerName.toLowerCase().includes(query) ||
                row.accountNumber.toLowerCase().includes(query)
        );
    }, [selectedFilter, pendingPayments, paymentData, searchQuery]);

    // Handle navigation to details page for processing/reversing
    const goToReviewDetails = (
        e: React.MouseEvent,
        facilityReference: string,
        actionType: "pay" | "retry" | "reverse" | "view"
    ) => {
        e.preventDefault();
        e.stopPropagation();

        navigate(
            ROUTES.cm.cmFacilityReviewsDetails.replace(
                ":facilityReference",
                facilityReference
            ),
            { state: { actionType } }
        );
    };

    const columns: Column<UnifiedPaymentRow>[] = [
        {
            key: "facilityReference",
            header: "Facility Reference",
        },
        {
            key: "customerName",
            header: "Customer",
        },
        {
            key: "accountNumber",
            header: "Valuer / Account",
        },
        {
            key: "amount",
            header: "Amount",
            render: (row) => formatCurrency(row.amount),
        },
        {
            key: "transactionType",
            header: "Type",
        },
        {
            key: "status",
            header: "Status",
            render: (row) => <PaymentStatusBadge status={row.status} />,
        },
        {
            key: "transDate",
            header: "Date",
            render: (row) => formatDate(row.transDate),
        },
        {
            key: "facilityReference" as keyof UnifiedPaymentRow,
            header: "Actions",
            render: (row) => (
                <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    {row.status === "Awaiting Payment" && (
                        <button
                            type="button"
                            onClick={(e) =>
                                goToReviewDetails(e, row.facilityReference, "pay")
                            }
                            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700"
                        >
                            Pay Valuer
                        </button>
                    )}

                    {row.status === "Failed" && (
                        <button
                            type="button"
                            onClick={(e) =>
                                goToReviewDetails(e, row.facilityReference, "retry")
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Retry Payout
                        </button>
                    )}

                    {row.status === "Successful" && (
                        <button
                            type="button"
                            onClick={(e) =>
                                goToReviewDetails(e, row.facilityReference, "reverse")
                            }
                            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
                        >
                            Reverse
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const handleRowClick = (row: UnifiedPaymentRow) => {
        navigate(
            ROUTES.cm.cmFacilityReviewsDetails.replace(
                ":facilityReference",
                row.facilityReference
            )
        );
    };

    const handleRefetchAll = () => {
        refetchPayments();
        refetchReports();
    };

    return (
        <section className="space-y-7">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary">
                    Valuer Payments
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                    Manage and process professional valuer fee disbursements.
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 fade-up">
                {isLoading ? (
                    <>
                        <MetricCardSkeleton />
                        <MetricCardSkeleton />
                        <MetricCardSkeleton />
                        <MetricCardSkeleton />
                    </>
                ) : (
                    <>
                        <MetricCard
                            title="Awaiting Payment"
                            value={pendingPayments.length}
                            description="Approved reports pending payout"
                            theme="pending"
                            icon={<FiClock size={20} />}
                            active={selectedFilter === "AwaitingPayment"}
                            onClick={() => handleFilterChange("AwaitingPayment")}
                        />

                        <MetricCard
                            title="Successful"
                            value={paymentData?.metrics.successfulCount ?? 0}
                            description="Disbursed valuer payments"
                            theme="payment"
                            icon={<FiCheckCircle size={20} />}
                            active={selectedFilter === "Successful"}
                            onClick={() => handleFilterChange("Successful")}
                        />

                        <MetricCard
                            title="Failed"
                            value={paymentData?.metrics.failedCount ?? 0}
                            description="Failed payment transfers"
                            theme="rejected"
                            icon={<FiXCircle size={20} />}
                            active={selectedFilter === "Failed"}
                            onClick={() => handleFilterChange("Failed")}
                        />

                        <MetricCard
                            title="Reversed"
                            value={paymentData?.metrics.reversedCount ?? 0}
                            description="Reversed valuer payouts"
                            theme="expired"
                            icon={<FiRefreshCcw size={20} />}
                            active={selectedFilter === "Reversed"}
                            onClick={() => handleFilterChange("Reversed")}
                        />
                    </>
                )}
            </div>

            {/* Search Input */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search facility ref, customer, or valuer..."
                        className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div ref={tableRef} className="scroll-mt-6 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-text-primary">
                        Valuer Transactions
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                        Fee disbursement breakdown and status logs.
                    </p>
                </div>

                {isError ? (
                    <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        <span>Unable to load valuer payment records.</span>
                        <button
                            type="button"
                            onClick={handleRefetchAll}
                            className="font-semibold underline hover:no-underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : isLoading ? (
                    <TableSkeleton />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        rowKey="rowId"
                        loading={isLoading}
                        emptyTitle={`No ${selectedFilter.replace(/([A-Z])/g, " $1").trim().toLowerCase()} records`}
                        emptyMessage="No valuer payment transactions match your current selection or search term."
                        onRowClick={handleRowClick}
                    />
                )}
            </div>
        </section>
    );
};

export default CmValuersPaymentPage;