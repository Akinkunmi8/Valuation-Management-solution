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