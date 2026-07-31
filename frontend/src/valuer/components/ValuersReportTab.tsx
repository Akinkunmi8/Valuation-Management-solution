import { useParams } from "react-router";

import { AppLoader } from "@/shared/ui/loader";

import { useGetValuationReportDetailsQuery } from "@/features/valuations/api/valuationReportApi";
import { getReportView } from "@/features/reports/utils/getReportView";

import CreateReportPrompt from "@/features/reports/components/reportState/CreateReportPrompt";
import ReviewingReportCard from "@/features/reports/components/reportState/ReviewingReportCard";
import ApprovedReportCard from "@/features/reports/components/reportState/ApprovedReportCard";
import RejectedReportCard from "@/features/reports/components/reportState/RejectedReportCard";
import EmptyReportState from "@/features/reports/components/reportState/EmptyReportState";

const ValuersReportTab = () => {
  const { facilityReference } = useParams();

  const {
    data: report,
    isLoading,
    isError,
  } = useGetValuationReportDetailsQuery(facilityReference!);

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError || !report) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        Unable to load valuation report.
      </div>
    );
  }

  const view = getReportView(report);

  switch (view) {
    case "create":
      return <CreateReportPrompt 
      facilityReference={report.facilityReference}
      />;

    case "review":
      return <ReviewingReportCard report={report} />;

    case "approved":
      return <ApprovedReportCard report={report} />;

    case "rejected":
      return <RejectedReportCard report={report} />;

    default:
      return <EmptyReportState />;
  }
};

export default ValuersReportTab;