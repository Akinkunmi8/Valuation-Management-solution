export interface ValuationReportDetails {
  reportId: string;

  facilityReference: string;

  valuerName: string;

  customerName: string;

  dateAssigned: string;

  reportStatus: string;

  reportApprovalStatus: string;

  paymentStatus: string;

  reportFileName: string | null;

  fileDownloadUrl: string;

  city: string;

  localGov: string;

  state: string;

  salesLocation: string;

  collateralLocation: string;

  collateralOwner: string;

  otherDetails: string;

  assetCategoryId: number;

  openMarketValue: number;

  forceSalesValue: number;

  insuranceValue: number;

  branchValuationSum: number;

  valuationDate: string;
}

export interface ValuationReportDashboardRow {
  reportId: string;

  facilityReference: string;

  customerName: string;

  valuerName: string;

  valuerId: number;

  paymentStatus: string;

  reportStatus: string;

  reportApprovalStatus: string;

  openMarketValue: number;

  forceSalesValue: number;

  insuranceValue: number;

  dateAssigned: string | null;

  reportFileName: string;
}

export interface ValuationReportDashboardResponse {
  metrics: {
    ongoingCount: number;
    completedCount: number;
  };

  reports: ValuationReportDashboardRow[];
}
