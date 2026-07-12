export type FacilityStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'PAYMENT_PENDING'
    | 'PAID'
    | 'CM_REVIEW'
    | 'FACILITY_APPROVED'
    | 'FACILITY_REJECTED'
    | 'VALUER_ASSIGNED'
    | 'VALUATION_IN_PROGRESS'
    | 'REPORT_SUBMITTED'
    | 'REPORT_APPROVED'
    | 'REPORT_REJECTED'
    | 'COMPLETED'

export type PaymentStatus =
    | 'PENDING'
    | 'SUCCESS'
    | 'FAILED'
    | 'REVERSED'
    | 'REFUNDED'

export interface Facility {
    id: string

    referenceNo: string

    customerName: string

    cifNumber: string

    accountNumber: string

    customerType: 'INDIVIDUAL' | 'CORPORATE'

    facilityType: string

    facilityAmount: number

    currency: string

    purpose: string

    collateralType: string

    branchName: string

    solId: string

    rmName: string

    rmStaffId: string

    status: FacilityStatus

    paymentStatus: PaymentStatus

    createdAt: string

    updatedAt: string
}


export type CreateFacilityRequest = {
    accountNumber: string
    solid: string

    customerName: string
    city: string
    country: string

    facilityPurpose: string
    facilityAddress: string

    rmsNumber: string
    createdBy: string

    collateralOwner: string
    collateralType: string
    stateOfCollateral: string
    location: string
    otherDetails: string

    collateralValue: number
    valuationsFees: number

    titleDocument: File | null
    approvalFile: File | null
    indemnityLetter: File | null
}

export type CreateFacilityResponse = {
    success: boolean
    message: string
    facilityReference: string
}


export type FacilityTableRow = {
  facilityReference: string
  customerName: string
  accountNumber: string
  facilityPurpose: string
  collateralValue: number
  valuationChargeFees: number
  approvalStatus: string
  paymentStatus: string
  valuationStatus: string
  reportStatus: string
  rejectionComment: string | null
  dateAdded: string
}

export type FacilityDetailsResponse = {
  facilityReference: string
  accountNumber: string
  solId: string

  facilityPurpose: string

  customerName: string
  city: string
  country: string

  facilityAddress: string

  rMsNumber: string
  createdBy: string

  collateraOwener: string | null

  collateralType: string
  stateOfCollateral: string
  location: string
  otherDetails: string

  collateralValue: number
  valuationsFees: number

  dateAdded: string

  approvalStatus: number
  valuationStatus: number

  savedTitleDocumentPath: string
  savedApprovalFilePath: string
  savedIndemnityLetterPath: string
}