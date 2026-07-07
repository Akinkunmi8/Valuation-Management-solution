import type { CreateFacilityFormValues } from '../schemas/facilitySchemas'

export const FACILITY_STEP_FIELDS: Array<
  Array<keyof CreateFacilityFormValues>
> = [
  [
    'accountNumber',
    'customerName',
    'solid',
    'city',
    'country',
  ],

  [
    'facilityPurpose',
    'facilityAddress',
    'rmsNumber',
    'createdBy',
    'valuationsFees',
  ],

  [
    'collateralOwner',
    'collateralType',
    'collateralValue',
    'stateOfCollateral',
    'location',
    'otherDetails',
  ],

  [
    'titleDocument',
    'approvalFile',
    'indemnityLetter',
  ],
]