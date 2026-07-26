import { Card, CardContent } from "@/shared/ui/card/Card";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { ValuationReportDetails } from "../types/valuationReportTypes";

type Props = {
  report: ValuationReportDetails;
};

const ValuationTab = ({ report }: Props) => {
  return (
    <div className="space-y-6">

      {/* Valuation Figures */}
      <Card>
        <CardContent className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">

          <div>
            <p className="text-sm text-text-muted">
              Open Market Value
            </p>

            <h3 className="mt-1 text-xl font-bold text-emerald-600">
              {formatCurrency(report.openMarketValue)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-text-muted">
              Forced Sale Value
            </p>

            <h3 className="mt-1 text-xl font-bold text-amber-600">
              {formatCurrency(report.forceSalesValue)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-text-muted">
              Insurance Value
            </p>

            <h3 className="mt-1 text-xl font-bold text-sky-600">
              {formatCurrency(report.insuranceValue)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-text-muted">
              Branch Valuation
            </p>

            <h3 className="mt-1 text-xl font-bold text-primary">
              {formatCurrency(report.branchValuationSum)}
            </h3>
          </div>

        </CardContent>
      </Card>

      {/* Valuer Notes */}

      <Card>

        <CardContent className="p-6">

          <h3 className="mb-3 text-lg font-semibold">
            Other Details
          </h3>

          <div className="rounded-xl bg-background p-4 leading-7 text-text-secondary">

            {report.otherDetails || "No additional details provided."}

          </div>

        </CardContent>

      </Card>

    </div>)

}

export default ValuationTab