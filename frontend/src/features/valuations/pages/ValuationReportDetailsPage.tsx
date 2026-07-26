import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import Button from "@/shared/ui/button/Button";
import StatusBadge from "@/shared/ui/badge/Badge";
import { Card, CardContent } from "@/shared/ui/card/Card";
import { AppLoader } from "@/shared/ui/loader";

import { getHomeRoute } from "@/shared/utils/getHomeRoute";
import { useAppSelector } from "@/app/store/hooks";

import { useGetValuationReportDetailsQuery } from "../api/valuationReportApi";

import {
    valuationReportTabs,
 type ValuationReportTab,
} from "../constants/valuationReportTabs";

import OverviewTab from "../components/OverviewTab";
import PropertyTab from "../components/PropertyTab";
import ValuationTab from "../components/ValuationTab";
import DocumentTab from "../components/DocumentTab";
import WorkflowTab from "../components/WorkflowTab";

const ValuationReportDetailsPage = () => {

    const navigate = useNavigate();

    const { facilityReference } = useParams();

    const {
        roles,
    } = useAppSelector(state => state.auth);

    const activeRole = roles[0];

    const [activeTab, setActiveTab] =
        useState<ValuationReportTab>("overview");

    const {
        data: report,
        isLoading,
        isError,
    } =
        useGetValuationReportDetailsQuery(
            facilityReference!,
        );

    if (isLoading) {
        return <AppLoader />;
    }

    if (isError || !report) {
        return (
            <Card>

                <CardContent className="py-12 text-center">

                    <h2 className="text-xl font-semibold">
                        Report not found
                    </h2>

                    <p className="mt-2 text-text-secondary">
                        Unable to load valuation report.
                    </p>

                    <Button
                        className="mt-6"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                </CardContent>

            </Card>
        );
    }

    const renderContent = () => {

        switch (activeTab) {

            case "overview":
                return <OverviewTab report={report} />;

            case "property":
                return <PropertyTab report={report} />;

            case "valuation":
                return <ValuationTab report={report} />;

            case "document":
                return <DocumentTab report={report} />;

            case "workflow":
                return <WorkflowTab report={report} />;

            default:
                return null;
        }
    };

    return (

        <div className="space-y-6">

            <Link
                to={getHomeRoute(activeRole)}
                className="flex items-center gap-2"
            >
                <IoArrowBackCircleOutline />
                Back
            </Link>

            <div className="space-y-2">

                <h1 className="text-3xl font-bold">
                    Valuation Report
                </h1>

                <p className="text-sm text-text-muted">
                    Facility Reference
                </p>

                <h2 className="text-xl font-semibold">
                    {report.facilityReference}
                </h2>

                <div className="flex gap-6 pt-2 text-sm">

                    <div>
                        <span className="font-semibold">
                            Customer:
                        </span>{" "}
                        {report.customerName}
                    </div>

                    <div>
                        <span className="font-semibold">
                            Valuer:
                        </span>{" "}
                        {report.valuerName}
                    </div>

                </div>

                <div className="pt-2">

                    <StatusBadge
                        label={report.reportApprovalStatus}
                        variant={
                            report.reportApprovalStatus === "Approved"
                                ? "success"
                                : report.reportApprovalStatus === "Rejected"
                                    ? "danger"
                                    : "warning"
                        }
                    />

                </div>

            </div>

            <div className="flex gap-2 border-b border-border">

                {valuationReportTabs.map(tab => (

                    <button
                        key={tab.id}
                        onClick={() =>
                            setActiveTab(tab.id)
                        }
                        className={`
                        px-4
                        py-3
                        text-sm
                        font-medium
                        transition
                        ${activeTab === tab.id
                                ? "border-b-2 border-primary text-primary"
                                : "text-text-secondary hover:text-text-primary"}
                    `}
                    >
                        {tab.label}
                    </button>

                ))}

            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">

                {renderContent()}

            </div>

        </div>

    );
};

export default ValuationReportDetailsPage;