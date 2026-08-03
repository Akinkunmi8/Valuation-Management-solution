

export interface CmsDashboardResponse {
  metrics: {
    awaitingAssignmentCount: number;
    ongoingFacilityCount: number;
    completedFacilityCount: number;
    pendingValuerPaymentCount: number;
    overdueFacilityCount: number;
  };
  awaitingAssignment: CmsFacilityTableRow[];
  ongoingFacility: CmsFacilityTableRow[];
  completedFacility: CmsFacilityTableRow[];
  pendingValuerPayment: CmsFacilityTableRow[];
  overdueFacility: CmsFacilityTableRow[];
}

export interface CmsFacilityTableRow {
  facilityReference: string;
  customerName: string;
  accountNumber: string;
  facilityPurpose: string;
  collateralValue: number;
  updatedValuationFees: number;
  valuerId: number;
  openMarketValue: number | null;
  forceSalesValue: number | null;
  insuranceValue: number | null;
  facilityApprovalStatus: string;
  reportApprovalStatus: string;
  valuerPaymentStatus: string;
  valuationStatus: string;
  reportStatus: string;
  dateAdded: string;
}