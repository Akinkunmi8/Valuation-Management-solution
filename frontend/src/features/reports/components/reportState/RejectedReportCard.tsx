import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/ui/card/Card";

import { useNavigate } from "react-router";
import { ROUTES } from "@/shared/constants/routes";

import StatusBadge from "@/shared/ui/badge/Badge";
import Button from "@/shared/ui/button/Button";
import { FiRefreshCw } from "react-icons/fi";

import type { ValuationReportDetails } from "@/features/valuations/types/valuationReportTypes";

type Props = {
    report: ValuationReportDetails;
};

const RejectedReportCard = ({ report }: Props) => {

    const navigate = useNavigate();

    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>
                    Report Rejected
                </CardTitle>

                <StatusBadge
                    label="Rejected"
                    variant="danger"
                />

            </CardHeader>

            <CardContent className="space-y-6">
                <p>
                    Report Status:
                    <strong> {report.reportStatus}</strong>
                </p>

                <p>
                    Approval Status:
                    <strong> {report.reportApprovalStatus}</strong>
                </p>
            </CardContent>

            <CardContent className="space-y-6">

                <p className="text-sm text-text-secondary">
                    Your valuation report was rejected and requires
                    correction before it can be approved.
                </p>

                <Button
                    leftIcon={<FiRefreshCw />}
                    onClick={() =>
                        navigate(
                            ROUTES.valuer.reportsSubmitEdit.replace(
                                ":facilityReference",
                                report.facilityReference,
                            ),
                            {
                                state: {
                                    isResubmission: true,
                                },
                            },
                        )
                    }
                >
                    Resubmit Report
                </Button>

            </CardContent>

        </Card>

    );

};

export default RejectedReportCard;