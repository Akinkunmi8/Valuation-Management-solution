export type CmFacilityTableRow = {
  facilityReference: string
  customerName: string
  accountNumber: string
  facilityPurpose: string
  collateralValue: number
  valuationFees: number
  valuerId: number
  openMarketValue: number
  forceSalesValue: number
  insuranceValue: number
  facilityApprovalStatus: number | string
  reportApprovalStatus: number | string
  customerPaymentStatus: number | string
  valuationStatus: number | string
  reportStatus: number | string
  dateAdded: string
}

export interface CmDashboardResponse {
  metrics: {
    pendingReviewCount: number
    approvedCount: number
    rejectedCount: number
    awaitingValuerAssignmentCount: number
    completedCount: number
    beyondTatCount: number
    pendingReportReviewCount: number
  }

  pendingReview: CmFacilityTableRow[]
  approved: CmFacilityTableRow[]
  rejected: CmFacilityTableRow[]
  awaitingValuerAssignment: CmFacilityTableRow[]
  completed: CmFacilityTableRow[]
  beyondTat: CmFacilityTableRow[]
  pendingReportReview: CmFacilityTableRow[]
}


