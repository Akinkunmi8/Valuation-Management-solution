import type { FacilityTableRow } from "../../facilities/types/facilityTypes"

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

  pendingReview: FacilityTableRow[]
  approved: FacilityTableRow[]
  rejected: FacilityTableRow[]
  awaitingValuerAssignment: FacilityTableRow[]
  completed: FacilityTableRow[]
  beyondTat: FacilityTableRow[]
  pendingReportReview: FacilityTableRow[]
}