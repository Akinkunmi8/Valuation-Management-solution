import type { ReportFormValues } from "../schemas/reportSchemas";
import type { ValuationReportDetails } from "@/features/valuations/types/valuationReportTypes";

export const mapReportDetailsToReportForm = (
  report: ValuationReportDetails,
  valuerId: number,
): ReportFormValues => ({
  facilityReference: report.facilityReference,

  customerName: report.customerName,

  collateralValue: report.branchValuationSum,

  collateralOwner: report.collateralOwner ?? "",

  city: report.city,

  state: report.state,

  localGov: report.localGov,

  propertyDescription: report.otherDetails,

  landSize: "", // Backend doesn't return this

  assetCategoryId: report.assetCategoryId,

  dateAssigned: report.dateAssigned
    ? new Date(report.dateAssigned)
    : new Date(),

  valuationDate: report.valuationDate
    ? new Date(report.valuationDate)
    : new Date(),

  valuerId,

  openMarketValue: report.openMarketValue,

  forceSalesValue: report.forceSalesValue,

  insuranceValue: report.insuranceValue,

  salesLocation: report.salesLocation,

  salesDate: report.valuationDate ? new Date(report.valuationDate) : new Date(),

  valuationReport: undefined as unknown as File,
});
