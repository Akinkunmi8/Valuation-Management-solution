import StatusBadge from "@/shared/ui/badge/Badge";
import {
    Card,
    CardContent,
} from "@/shared/ui/card/Card";

import { formatDate } from "@/shared/utils/formatDate";

import type {
    ValuationReportDetails,
} from "../types/valuationReportTypes";

type Props = {
    report: ValuationReportDetails;
};

const statusVariant = (
    status: string,
):
    | "success"
    | "warning"
    | "danger"
    | "info" => {

    switch (status.toLowerCase()) {

        case "approved":
        case "completed":
        case "successful":
            return "success";

        case "reviewing":
        case "pending":
        case "unprocessed":
            return "warning";

        case "rejected":
            return "danger";

        default:
            return "info";
    }
};

export default function OverviewTab({
    report,
}: Props) {

    return (

        <div className="space-y-6">

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <Card>

                    <CardContent className="space-y-2 py-4">

                        <p className="text-sm text-text-muted">
                            Customer
                        </p>

                        <h3 className="text-lg font-semibold">
                            {report.customerName}
                        </h3>

                    </CardContent>

                </Card>

                <Card>

                    <CardContent className="space-y-2 py-4">

                        <p className="text-sm text-text-muted">
                            Assigned Valuer
                        </p>

                        <h3 className="text-lg font-semibold">
                            {report.valuerName}
                        </h3>

                    </CardContent>

                </Card>

                <Card>

                    <CardContent className="space-y-2 py-4">

                        <p className="text-sm text-text-muted">
                            Assigned Date
                        </p>

                        <h3 className="text-lg font-semibold">

                            {report.dateAssigned
                                ? formatDate(report.dateAssigned)
                                : "-"}

                        </h3>

                    </CardContent>

                </Card>

                <Card>

                    <CardContent className="space-y-2 py-4">

                        <p className="text-sm text-text-muted">
                            Valuation Date
                        </p>

                        <h3 className="text-lg font-semibold">

                            {formatDate(
                                report.valuationDate,
                            )}

                        </h3>

                    </CardContent>

                </Card>

            </div>

            <Card>

                <CardContent className="grid gap-8 md:grid-cols-2">

                    <div className="space-y-4 py-4">

                        <h3 className="text-lg font-semibold">
                            Report Status
                        </h3>

                        <div className="flex items-center justify-between">

                            <span>
                                Report
                            </span>

                            <StatusBadge
                                label={report.reportStatus}
                                variant={statusVariant(
                                    report.reportStatus,
                                )}
                            />

                        </div>

                        <div className="flex items-center justify-between">

                            <span>
                                Approval
                            </span>

                            <StatusBadge
                                label={report.reportApprovalStatus}
                                variant={statusVariant(
                                    report.reportApprovalStatus,
                                )}
                            />

                        </div>

                        <div className="flex items-center justify-between">

                            <span>
                                Payment
                            </span>

                            <StatusBadge
                                label={report.paymentStatus}
                                variant={statusVariant(
                                    report.paymentStatus,
                                )}
                            />

                        </div>

                    </div>

                  

                </CardContent>

            </Card>

        </div>

    );
}