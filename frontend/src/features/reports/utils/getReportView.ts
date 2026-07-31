import type { ValuationReportDetails } from "@/features/valuations/types/valuationReportTypes";

export type ReportView =
    | "create"
    | "review"
    | "approved"
    | "rejected"
    | "empty";

export const getReportView = (
    report: ValuationReportDetails,
): ReportView => {

    if (report.reportStatus === "Ongoing") {
        return "create";
    }

    if (report.reportStatus === "Reviewing") {
        return "review";
    }

    if (report.reportApprovalStatus === "Approved") {
        return "approved";
    }

    if (report.reportApprovalStatus === "Rejected") {
        return "rejected";
    }

    return "empty";
};