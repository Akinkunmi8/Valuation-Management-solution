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
  ],

  [
    'collateralOwner',
    'collateralType',
    'collateralValue',
    'valuationsFees',
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