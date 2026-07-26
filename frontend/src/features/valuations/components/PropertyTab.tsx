import { Card, CardContent } from "@/shared/ui/card/Card";
import type { ValuationReportDetails } from "../types/valuationReportTypes";

type Props = {
  report: ValuationReportDetails;
};

const Item = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="space-y-1">
    <p className="text-sm text-text-muted">{label}</p>
    <p className="font-medium text-text-primary">
      {value || "-"}
    </p>
  </div>
);

export default function PropertyTab({
  report,
}: Props) {
  return (
    <Card>

      <CardContent className="grid gap-6 md:grid-cols-2">

        <Item
          label="Collateral Owner"
          value={report.collateralOwner}
        />

        <Item
          label="State"
          value={report.state}
        />

        <Item
          label="Local Government"
          value={report.localGov}
        />

        <Item
          label="City"
          value={report.city}
        />

        <Item
          label="Sales Location"
          value={report.salesLocation}
        />

        <Item
          label="Collateral Location"
          value={report.collateralLocation}
        />

        <div className="md:col-span-2">

          <Item
            label="Other Details"
            value={report.otherDetails}
          />

        </div>

      </CardContent>

    </Card>
  );
}