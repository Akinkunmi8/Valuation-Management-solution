import { useState } from "react";

import Button from "@/shared/ui/button/Button";
import StatusBadge from "@/shared/ui/badge/Badge";
import { Card, CardContent } from "@/shared/ui/card/Card";

import CommentModal from "@/shared/ui/modal/CommentModal";

import {
    useApproveReportMutation,
    useRejectReportMutation,
    useValidateApprovalQuery,
} from "@/features/workflow/api/cmActionApi";

import {
    getReportApprovalStatus,
    getReportStatus,
} from "../utilis/status";

import type { ValuationReportDetails } from "../types/valuationReportTypes";
import { useAppSelector } from "@/app/store/hooks";
import { notify } from "@/shared/lib/toast";
import { NOTIFY_TITLES } from "@/shared/constants/notifyTitles";

type Props = {
    report: ValuationReportDetails;
};

export default function WorkflowTab({ report }: Props) {
    const [openReject, setOpenReject] = useState(false);

    const username = useAppSelector((state) => state.auth.email);

    // Fetch the current validation status
    const {
        data: validation,
        isLoading: isValidating,
    } = useValidateApprovalQuery(report.facilityReference);

    const [approveReport, { isLoading: approving }] =
        useApproveReportMutation();

    const [rejectReport, { isLoading: rejecting }] =
        useRejectReportMutation();

    // Combine prop checks and API validation flags
    const isReportFinalised =
        report.reportApprovalStatus === "Approved" ||
        report.reportApprovalStatus === "Rejected" ||
        Boolean(validation?.isReportApproved) ||
        Boolean(validation?.isReportRejected) ||
        Boolean(validation?.isFullyApproved);

    const isActionDisabled =
        isReportFinalised || approving || rejecting || isValidating;

    const handleApprove = async () => {
        try {
            await approveReport({
                facilityReference: report.facilityReference,
                username: username!,
            }).unwrap();

            notify.success(NOTIFY_TITLES.REPORT_APPROVED);
        } catch (error) {
            notify.apiError(error, "Error Approving Report");
        }
    };

    const handleReject = async (comment: string) => {
        try {
            await rejectReport({
                facilityReference: report.facilityReference,
                username: username!,
                comment,
            }).unwrap();

            notify.success(NOTIFY_TITLES.REPORT_REJECTED);
        } catch (error) {
            notify.apiError(error, "Error Rejecting Report");
        }
        setOpenReject(false);
    };

    return (
        <>
            <Card>
                <CardContent className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-text-muted">Report Status</p>
                            <div className="mt-2">
                                <StatusBadge {...getReportStatus(report.reportStatus)} />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-text-muted">Approval Status</p>
                            <div className="mt-2">
                                <StatusBadge
                                    {...getReportApprovalStatus(report.reportApprovalStatus)}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-text-muted">Payment Status</p>
                            <p className="mt-2 font-medium">{report.paymentStatus}</p>
                        </div>

                        <div>
                            <p className="text-sm text-text-muted">Assigned Valuer</p>
                            <p className="mt-2 font-medium">{report.valuerName}</p>
                        </div>
                    </div>

                    {report.reportApprovalStatus === "Pending" && (
                        <div className="flex flex-wrap justify-end gap-4 border-t border-border pt-6">
                            <Button
                                onClick={() => setOpenReject(true)}
                                disabled={isActionDisabled}
                            >
                                Reject Report
                            </Button>

                            <Button
                                isLoading={approving || isValidating}
                                onClick={handleApprove}
                                disabled={isActionDisabled}
                            >
                                {isReportFinalised ? "Report Processed" : "Approve Report"}
                            </Button>
                        </div>
                    )}

                    {report.reportApprovalStatus === "Approved" &&
                        report.paymentStatus === "UnProcessed" && (
                            <div className="flex justify-end border-t border-border pt-6">
                                <Button>Initiate Valuer Payment</Button>
                            </div>
                        )}
                </CardContent>
            </Card>

            {isReportFinalised && (
                <p className="mt-4 text-sm text-text-muted">
                    This report has already been processed. No further CM action is required.
                </p>
            )}

            <CommentModal
                open={openReject}
                loading={rejecting}
                title="Reject Valuation Report"
                description="Provide a reason for rejecting this valuation report."
                confirmText="Reject Report"
                onClose={() => setOpenReject(false)}
                onSubmit={handleReject}
            />
        </>
    );
}