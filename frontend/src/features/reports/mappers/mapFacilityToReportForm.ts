import type { FacilityDetailsResponse } from "@/features/facilities/types/facilityTypes";

import type { ReportFormValues } from "../schemas/reportSchemas";

type CurrentValuer = {
  valuerId: number;
};

export const mapFacilityToReportForm = (
  facility: FacilityDetailsResponse,
  currentValuer: CurrentValuer,
): Omit<ReportFormValues, "valuationReport"> => {

  return {

    facilityReference:
      facility.facilityReference,

    customerName:
      facility.customerName,

    collateralValue:
      facility.collateralValue,

    owner:
      facility.collateraOwener ?? "",

    city:
      facility.city,

    state:
      facility.stateOfCollateral,

    localGov:
      facility.location,

    propertyDescription:
      facility.otherDetails,

    landSize: "",

    assetCategoryId: 0,

    dateAssigned:
      new Date(facility.dateAdded),

    valuationDate:
      new Date(),

    valuerId:
      currentValuer.valuerId,

    openMarketValue: 0,

    forceSalesValue: 0,

    insuranceValue: 0,

    salesLocation: "",

    salesDate:
      new Date(),
  };
};