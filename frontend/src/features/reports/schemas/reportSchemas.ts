import { z } from "zod";

export const reportSchema = z.object({
  facilityReference: z.string(),

  customerName: z.string().min(1),

  collateralValue: z.number().nonnegative(),

  owner: z.string().min(1),

  city: z.string().min(1),

  state: z.string().min(1),

  localGov: z.string().min(1),

  propertyDescription: z.string().min(1),

  landSize: z.string().min(1),

  assetCategoryId: z.number(),

  dateAssigned: z.date(),

  valuationDate: z.date(),

  valuerId: z.number(),

  openMarketValue: z.number().positive(),

  forceSalesValue: z.number().positive(),

  insuranceValue: z.number().positive(),

  salesLocation: z.string().min(1),

  salesDate: z.date(),

  valuationReport: z.instanceof(File, {
    message: "Valuation report is required",
  }),
});

export type ReportFormValues = z.infer<typeof reportSchema>;