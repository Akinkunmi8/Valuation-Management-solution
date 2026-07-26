import { useState } from "react";

import Button from "@/shared/ui/button/Button";
import StatusBadge from "@/shared/ui/badge/Badge";
import { Card, CardContent } from "@/shared/ui/card/Card";

import CommentModal from "@/shared/ui/modal/CommentModal";

import {
    useApproveReportMutation,
    useRejectReportMutation
} from "@/features/workflow/api/cmActionApi";

import { getApprovalStatus } from "../utilis/status";

import type { ValuationReportDetails } from "../types/valuationReportTypes";
import { useAppSelector } from "@/app/store/hooks";
import { notify } from "@/shared/lib/toast";
import { NOTIFY_TITLES } from "@/shared/constants/notifyTitles";

type Props = {
    report: ValuationReportDetails;
};

export default function WorkflowTab({
    report,
}: Props) {
    const [openReject, setOpenReject] = useState(false);

    const username = useAppSelector(state => state.auth.email)

    const [approveReport, { isLoading: approving }] =
        useApproveReportMutation();

    const [rejectReport, { isLoading: rejecting }] =
        useRejectReportMutation();

    const handleApprove = async () => {
        try {


            await approveReport({
                facilityReference: report.facilityReference,
                username: username!,
            }).unwrap();

            notify.success(NOTIFY_TITLES.REPORT_APPROVED)

        } catch (error) {
            notify.apiError(error, "Error Approving Report")
        }
    };

    const handleReject = async (comment: string) => {
        try {

            await rejectReport({
                facilityReference: report.facilityReference,
                username: username!,
                comment,
            }).unwrap();
            notify.success(NOTIFY_TITLES.REPORT_REJECTED)

        } catch (error) {
            notify.apiError(error, "Error Rejecting Report")
        }
        setOpenReject(false);
    };

    return (
        <>
            <Card>

                <CardContent className="space-y-8">

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>

                            <p className="text-sm text-text-muted">
                                Report Status
                            </p>

                            <div className="mt-2">
                                <StatusBadge
                                    {...getApprovalStatus(report.reportStatus)}
                                />
                            </div>

                        </div>

                        <div>

                            <p className="text-sm text-text-muted">
                                Approval Status
                            </p>

                            <div className="mt-2">
                                <StatusBadge
                                    {...getApprovalStatus(report.reportApprovalStatus)}
                                />
                            </div>

                        </div>

                        <div>

                            <p className="text-sm text-text-muted">
                                Payment Status
                            </p>

                            <p className="mt-2 font-medium">
                                {report.paymentStatus}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-text-muted">
                                Assigned Valuer
                            </p>

                            <p className="mt-2 font-medium">
                                {report.valuerName}
                            </p>

                        </div>

                    </div>

                    {report.reportApprovalStatus === "Pending" && (
                        <div className="flex flex-wrap justify-end gap-4 border-t border-border pt-6">

                            <Button
                                // variant="outline"
                                onClick={() => setOpenReject(true)}
                            >
                                Reject Report
                            </Button>

                            <Button
                                isLoading={approving}
                                onClick={handleApprove}
                            >
                                Approve Report
                            </Button>

                        </div>
                    )}

                    {report.reportApprovalStatus === "Approved" &&
                        report.paymentStatus === "UnProcessed" && (
                            <div className="flex justify-end border-t border-border pt-6">

                                <Button>
                                    Initiate Valuer Payment
                                </Button>

                            </div>
                        )}

                </CardContent>

            </Card>

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