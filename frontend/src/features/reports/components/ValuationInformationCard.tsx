import { useFormContext } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card/Card";

import Input from "@/shared/ui/input/Input";

import type { ReportFormValues } from "../schemas/reportSchemas";

const ValuationInformationCard = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation Details</CardTitle>
      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Valuation Date"
            type="date"
            error={errors.valuationDate?.message}
            // {...register("valuationDate")}
            {...register("valuationDate", {
              valueAsDate: true,
            })}
          />

          <Input
            label="Date Assigned"
            type="date"
            error={errors.dateAssigned?.message}
            {...register("dateAssigned", {
              valueAsDate: true,
            })}
          />

          <Input
            label="Open Market Value"
            type="number"
            inputMode="numeric"
            error={errors.openMarketValue?.message}
            {...register("openMarketValue", {
              valueAsNumber: true,
            })}
          />

          <Input
            label="Forced Sale Value"
            type="number"
            inputMode="numeric"
            error={errors.forceSalesValue?.message}
            {...register("forceSalesValue", {
              valueAsNumber: true,
            })}
          />

          <Input
            label="Insurance Value"
            type="number"
            inputMode="numeric"
            error={errors.insuranceValue?.message}
            {...register("insuranceValue", {
              valueAsNumber: true,
            })}
          />

          <Input
            label="Sales Date"
            type="date"
            error={errors.salesDate?.message}
            {...register("salesDate", {
              valueAsDate: true,
            })}
          />

          <Input
            label="Sales Location"
            error={errors.salesLocation?.message}
            {...register("salesLocation")}
          />

        </div>

      </CardContent>
    </Card>
  );
};

export default ValuationInformationCard;