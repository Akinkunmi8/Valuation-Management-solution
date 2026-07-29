import { useFormContext } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card/Card";

import Input from "@/shared/ui/input/Input";

import type { ReportFormValues } from "../schemas/reportSchemas";

const ComparableSalesCard = () => {

  const {
    register,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Comparable Sales
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Sales Location"
            error={errors.salesLocation?.message}
            {...register("salesLocation")}
          />

          <Input
            label="Sales Date"
            type="date"
            error={errors.salesDate?.message}
            {...register("salesDate", {
              valueAsDate: true,
            })}
          />

        </div>

      </CardContent>

    </Card>

  );
};

export default ComparableSalesCard;