import type { FacilityTableRow } from "@/features/facilities/types/facilityTypes"

export interface CmsDashboardResponse {
  metrics: {
    awaitingAssignmentCount: number
    ongoingFacilityCount: number
    completedFacilityCount: number
    pendingValuerPaymentCount: number
    overdueFacilityCount: number
  }

  awaitingAssignment: CmsFacilityTableRow[]
  ongoingFacility: CmsFacilityTableRow[]
  completedFacility: CmsFacilityTableRow[]
  pendingValuerPayment: CmsFacilityTableRow[]
  overdueFacility: CmsFacilityTableRow[]
}

export type CmsFacilityTableRow = FacilityTableRow & {
  updatedValuationFees: number
  valuerPaymentStatus: number | string
}