import { useFormContext } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card/Card";

import Input from "@/shared/ui/input/Input";

import type { ReportFormValues } from "../schemas/reportSchemas";

const PropertyInformationCard = () => {

  const {
    register,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  return (

    <Card>

      <CardHeader>
        <CardTitle>
          Property Information
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Facility Reference"
            disabled
            {...register("facilityReference")}
          />

          <Input
            label="Customer Name"
            disabled
            {...register("customerName")}
          />

          <Input
            label="Collateral Value"
            disabled
            {...register("collateralValue")}
          />

          <Input
            label="Owner"
            disabled
            {...register("owner")}
          />

          <Input
            label="City"
            disabled
            {...register("city")}
          />

          <Input
            label="State"
            disabled
            {...register("state")}
          />

          <Input
            label="Local Government"
            error={errors.localGov?.message}
            {...register("localGov")}
          />

          <Input
            label="Land Size"
            error={errors.landSize?.message}
            {...register("landSize")}
          />

        </div>

        <div className="mt-5">

          <Input
            label="Property Description"
            error={errors.propertyDescription?.message}
            {...register("propertyDescription")}
          />

        </div>

      </CardContent>

    </Card>

  );
};

export default PropertyInformationCard;