import type { ReportFormValues } from "../schemas/reportSchemas";

export const REPORT_STEP_FIELDS: Array<
  Array<keyof ReportFormValues>
> = [
  [
    "customerName",
    "owner",
    "city",
    "state",
    "localGov",
    "propertyDescription",
    "landSize",
    "assetCategoryId",
  ],

  [
    "valuationDate",
    "openMarketValue",
    "forceSalesValue",
    "insuranceValue",
  ],

  [
    "salesLocation",
    "salesDate",
  ],

  [
    "valuationReport",
  ],
];