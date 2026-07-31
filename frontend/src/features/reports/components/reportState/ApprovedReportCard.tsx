import {
    // FiCheckCircle,
    FiDownload,
    FiDollarSign,
    FiEye,
    FiMapPin,
    FiHome,
} from "react-icons/fi";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/ui/card/Card";

import Button from "@/shared/ui/button/Button";
import StatusBadge from "@/shared/ui/badge/Badge";

import type { ValuationReportDetails } from "@/features/valuations/types/valuationReportTypes";
type Props = {
    report: ValuationReportDetails;
};

const ApprovedReportCard = ({
    report,
}: Props) => {

    return (

        <div className="space-y-6">

            {/* Approval Summary */}

            <Card>

                <CardHeader>

                    <div className="flex items-center justify-between">

                        <CardTitle>

                            Report Approved

                        </CardTitle>

                        <StatusBadge
                            label="Approved"
                            variant="success"
                        />

                    </div>

                </CardHeader>

                <CardContent>

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>

                            <p className="text-xs text-text-muted">
                                Facility Reference
                            </p>

                            <p className="font-semibold">
                                {report.facilityReference}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-text-muted">
                                Customer
                            </p>

                            <p className="font-semibold">
                                {report.customerName}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-text-muted">
                                Collateral Location
                            </p>

                            <div className="flex items-center gap-2">

                                <FiMapPin />

                                {report.collateralLocation}

                            </div>

                        </div>

                        <div>

                            <p className="text-xs text-text-muted">
                                Asset Category
                            </p>

                            <div className="flex items-center gap-2">

                                <FiHome />

                                {report.assetCategoryId}

                            </div>

                        </div>

                    </div>

                </CardContent>

            </Card>

            {/* Payment */}

            <Card>

                <CardHeader>

                    <CardTitle>

                        Payment Status

                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <FiDollarSign
                                size={24}
                                className="text-amber-500"
                            />

                            <div>

                                <p className="font-semibold">

                                    {report.paymentStatus}

                                </p>

                                <p className="text-sm text-text-secondary">

                                    Waiting for payment processing.

                                </p>

                            </div>

                        </div>

                        <StatusBadge
                            label={report.paymentStatus}
                            variant={
                                report.paymentStatus === "Processed"
                                    ? "success"
                                    : "warning"
                            }
                        />

                    </div>

                </CardContent>

            </Card>

            {/* Actions */}

            <Card>

                <CardHeader>

                    <CardTitle>

                        Actions

                    </CardTitle>

                </CardHeader>

                <CardContent>

                    <div className="flex flex-wrap gap-3">

                        <Button
                            leftIcon={<FiEye />}
                            variant="secondary"
                        >
                            View Report
                        </Button>

                        <Button
                            leftIcon={<FiDownload />}
                        >
                            Download Report
                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>

    );

};

export default ApprovedReportCard;