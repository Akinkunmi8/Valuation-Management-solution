import {
    FiClock,
    FiFileText,
    FiUser,
    FiCalendar,
} from "react-icons/fi";

import StatusBadge from "@/shared/ui/badge/Badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/ui/card/Card";

import type { ValuationReportDetails } from "@/features/valuations/types/valuationReportTypes";

type Props = {
    report: ValuationReportDetails;
};

const ReviewingReportCard = ({
    report,
}: Props) => {

    return (

        <div className="space-y-6">

            <Card>

                <CardHeader>

                    <div className="flex items-center justify-between">

                        <CardTitle>
                            Submitted Valuation Report
                        </CardTitle>

                        <StatusBadge
                            label="Reviewing"
                            variant="info"
                        />

                    </div>

                </CardHeader>

                <CardContent>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div className="flex items-center gap-3">

                            <FiFileText className="text-primary" />

                            <div>

                                <p className="text-xs text-text-muted">
                                    Facility Reference
                                </p>

                                <p className="font-medium">
                                    {report.facilityReference}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <FiUser className="text-primary" />

                            <div>

                                <p className="text-xs text-text-muted">
                                    Customer
                                </p>

                                <p className="font-medium">
                                    {report.customerName}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <FiUser className="text-primary" />

                            <div>

                                <p className="text-xs text-text-muted">
                                    Valuer
                                </p>

                                <p className="font-medium">
                                    {report.valuerName}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-3">

                            <FiCalendar className="text-primary" />

                            <div>

                                <p className="text-xs text-text-muted">
                                    Submitted
                                </p>

                                <p className="font-medium">
                                    {
                                        report.dateAssigned
                                            ? new Date(
                                                report.dateAssigned,
                                            ).toLocaleDateString()
                                            : "--"
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </CardContent>

            </Card>

            <Card>

                <CardContent className="py-10 text-center">

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">

                        <FiClock
                            size={36}
                            className="text-blue-600"
                        />

                    </div>

                    <h3 className="text-xl font-semibold">

                        Awaiting Review

                    </h3>

                    <p className="mt-3 max-w-xl mx-auto text-sm text-text-secondary">

                        Your valuation report has been successfully submitted.
                        It is currently being reviewed by the Collateral
                        Management Unit. You will be notified once the review
                        is completed.

                    </p>

                </CardContent>

            </Card>

        </div>

    );

};

export default ReviewingReportCard;