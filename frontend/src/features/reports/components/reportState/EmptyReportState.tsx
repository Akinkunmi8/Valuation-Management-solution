// EmptyReportState.tsx

import { Card, CardContent } from "@/shared/ui/card/Card";

const EmptyReportState = () => {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-700">
          No Report Available
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          There is currently no report available for this valuation request.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyReportState;