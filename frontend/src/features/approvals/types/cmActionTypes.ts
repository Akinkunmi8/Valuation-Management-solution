export type ApiResponse = {
  success: boolean
  message: string
}

export type RejectFacilityRequest = {
  facilityReference: string
  username: string
  comment: string
}