export type ApiResponse = {
  success: boolean
  message: string
}

export interface ApproveFacilityRequest {
  facilityReference: string
  username: string
}

export type RejectFacilityRequest = {
  facilityReference: string
  username: string
  comment: string
}


export interface ApproveReportRequest {
  facilityReference: string
  username: string
}

export interface RejectReportRequest {
  facilityReference: string
  username: string
  comment: string
}