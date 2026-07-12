import type { CreateFacilityFormValues } from "../schemas/facilitySchemas"

const API_FIELDS = {
  accountNumber: 'AccountNumber',
  solId: 'Solid',
  facilityPurpose: 'FacilityPurpose',
  customerName: 'CustomerName',
  city: 'City',
  country: 'Country',
  facilityAddress: 'FacilityAddress',
  rmsNumber: 'RMSNumber',
  createdBy: 'CreatedBy',

  collateralOwner: 'CollateralOwner',
  collateralType: 'collateralType', // Backend currently expects lowercase

  stateOfCollateral: 'StateOfCollateral',
  location: 'Location',
  otherDetails: 'OtherDetails',

  collateralValue: 'CollateralValue',
  valuationsFees: 'ValuationsFees',

  titleDocument: 'TitleDocument',
  approvalFile: 'ApprovalFile',
  indemnityLetter: 'IndemityLetter', // Backend typo - send exactly as expected
} as const

export const createFacilityFormData = (
  values: CreateFacilityFormValues,
  auth:{
    createdBy: string
    solId: string
  }
): FormData => {
  const formData = new FormData()

  formData.append(API_FIELDS.accountNumber, values.accountNumber)
  formData.append(API_FIELDS.solId, auth.solId)

  formData.append(API_FIELDS.facilityPurpose, values.facilityPurpose)

  formData.append(API_FIELDS.customerName, values.customerName)
  formData.append(API_FIELDS.city, values.city)
  formData.append(API_FIELDS.country, values.country)

  formData.append(API_FIELDS.facilityAddress, values.facilityAddress)

  formData.append(API_FIELDS.rmsNumber, values.rmsNumber)
  formData.append(API_FIELDS.createdBy, auth.createdBy)

  formData.append(API_FIELDS.collateralOwner, values.collateralOwner)
  formData.append(API_FIELDS.collateralType, values.collateralType)

  formData.append(
    API_FIELDS.stateOfCollateral,
    values.stateOfCollateral,
  )

  formData.append(API_FIELDS.location, values.location)

  formData.append(
    API_FIELDS.otherDetails,
    values.otherDetails,
  )

  formData.append(
    API_FIELDS.collateralValue,
    (values.collateralValue ?? 0).toString(),
  )

  formData.append(
    API_FIELDS.valuationsFees,
    values.valuationsFees.toString(),
  )

  formData.append(
    API_FIELDS.titleDocument,
    values.titleDocument,
  )

  formData.append(
    API_FIELDS.approvalFile,
    values.approvalFile,
  )

  formData.append(
    API_FIELDS.indemnityLetter,
    values.indemnityLetter,
  )

  return formData
}