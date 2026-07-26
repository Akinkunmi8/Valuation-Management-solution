import { FiDownload, FiEye, FiFileText } from "react-icons/fi";

import Button from "@/shared/ui/button/Button";
import { Card, CardContent } from "@/shared/ui/card/Card";

import type { ValuationReportDetails } from "../types/valuationReportTypes";

type Props = {
  report: ValuationReportDetails;
};

export default function DocumentTab({
  report,
}: Props) {
  const hasDocument =
    !!report.reportFileName &&
    !!report.fileDownloadUrl;

  return (
    <Card>

      <CardContent className="space-y-6 p-8">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">

            <FiFileText size={22} />

          </div>

          <div>

            <h3 className="font-semibold">
              Valuation Report
            </h3>

            <p className="text-sm text-text-muted">
              Download or preview the uploaded valuation report.
            </p>

          </div>

        </div>

        {hasDocument ? (
          <>
            <div className="rounded-xl border border-border bg-background p-4">

              <p className="text-sm text-text-muted">
                Uploaded File
              </p>

              <p className="mt-1 break-all font-medium">

                {report.reportFileName
                  ?.split("/")
                  .pop()}

              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Button
                leftIcon={<FiEye />}
                onClick={() =>
                  window.open(
                    report.fileDownloadUrl,
                    "_blank",
                  )
                }
              >
                View Report
              </Button>

              <Button
                // variant="outline"
                leftIcon={<FiDownload />}
                onClick={() =>
                  window.open(
                    report.fileDownloadUrl,
                    "_blank",
                  )
                }
              >
                Download
              </Button>

            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border py-12 text-center">

            <FiFileText
              className="mx-auto mb-4 text-text-muted"
              size={40}
            />

            <h4 className="font-semibold">
              No Report Uploaded
            </h4>

            <p className="mt-2 text-sm text-text-muted">
              The assigned valuer has not uploaded a valuation report yet.
            </p>

          </div>
        )}

      </CardContent>

    </Card>
  );
}