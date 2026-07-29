import type { ReportFormValues } from "../schemas/reportSchemas";

const API_FIELDS = {

  facilityReference: "FacilityReference",

  customerName: "CustomerName",

  collateralValue: "CollateralValue",

  owner: "Owner",

  city: "City",

  state: "State",

  localGov: "LocalGov",

  propertyDescription: "PropertyDescription",

  landSize: "Landsize",

  assetCategoryId: "AssetCategoryId",

  dateAssigned: "DateAssigned",

  valuationDate: "ValuationDate",

  valuerId: "ValuerId",

  openMarketValue: "OpenMarketValue",

  forceSalesValue: "ForceSalesValue",

  insuranceValue: "InsuranceValue",

  salesLocation: "SalesLocation",

  salesDate: "SalesDate",

  valuationReport: "ValuatioinReport", // backend spelling

} as const;



export const createReportFormData = (
  values: ReportFormValues,
): FormData => {

  const formData = new FormData();

  formData.append(
    API_FIELDS.facilityReference,
    values.facilityReference,
  );

  formData.append(
    API_FIELDS.customerName,
    values.customerName,
  );

  formData.append(
    API_FIELDS.collateralValue,
    values.collateralValue.toString(),
  );

  formData.append(
    API_FIELDS.owner,
    values.owner,
  );

  formData.append(
    API_FIELDS.city,
    values.city,
  );

  formData.append(
    API_FIELDS.state,
    values.state,
  );

  formData.append(
    API_FIELDS.localGov,
    values.localGov,
  );

  formData.append(
    API_FIELDS.propertyDescription,
    values.propertyDescription,
  );

  formData.append(
    API_FIELDS.landSize,
    values.landSize,
  );

  formData.append(
    API_FIELDS.assetCategoryId,
    values.assetCategoryId.toString(),
  );

  formData.append(
    API_FIELDS.dateAssigned,
    values.dateAssigned.toISOString(),
  );

  formData.append(
    API_FIELDS.valuationDate,
    values.valuationDate.toISOString(),
  );

  formData.append(
    API_FIELDS.valuerId,
    values.valuerId.toString(),
  );

  formData.append(
    API_FIELDS.openMarketValue,
    values.openMarketValue.toString(),
  );

  formData.append(
    API_FIELDS.forceSalesValue,
    values.forceSalesValue.toString(),
  );

  formData.append(
    API_FIELDS.insuranceValue,
    values.insuranceValue.toString(),
  );

  formData.append(
    API_FIELDS.salesLocation,
    values.salesLocation,
  );

  formData.append(
    API_FIELDS.salesDate,
    values.salesDate.toISOString(),
  );

  formData.append(
    API_FIELDS.valuationReport,
    values.valuationReport,
  );

  return formData;

};