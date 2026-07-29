import { Controller, useFormContext } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card/Card";

import {
  FileUpload,
  DOCUMENT_TYPES,
} from "@/shared/file-upload";

import type { ReportFormValues } from "../schemas/reportSchemas";

const UploadReportCard = () => {

  const {
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          Upload Valuation Report
        </CardTitle>

      </CardHeader>

      <CardContent>

        <Controller
          name="valuationReport"
          control={control}
          render={({ field }) => (

            <FileUpload
              label="Valuation Report (PDF)"
              value={field.value}
              onChange={field.onChange}
              error={errors.valuationReport?.message}
              {...DOCUMENT_TYPES.valuationReport}
            />

          )}
        />

      </CardContent>

    </Card>

  );
};

export default UploadReportCard;