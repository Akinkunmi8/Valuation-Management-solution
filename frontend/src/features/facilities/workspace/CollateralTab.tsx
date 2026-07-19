import DetailItem from './DetailItem'

import { Card, CardContent, CardHeader } from '@/shared/ui/card/Card'

import { formatCurrency } from '@/shared/utils/formatCurrency'

import type { FacilityDetailsResponse } from '../types/facilityTypes'

type CollateralTabProps = {
  facility: FacilityDetailsResponse
}



const CollateralTab = ({
  facility,
}: CollateralTabProps) => {

  return (
    <Card>
      <CardHeader title="Collateral Information" />
      <CardContent>
        <div className="grid gap-5 md:grid-cols-2">
          <DetailItem
            label="Collateral Type"
            value={facility.collateralType}
          />

          {/* <DetailItem
            label="Collateral Owner"
            value={
              // facility.collateraOwener ??
              // '-'
              facility.collateraOwener
            }
          /> */}

          <DetailItem
            label="Collateral Value"
            value={
              formatCurrency(
                facility.collateralValue,
              )
            }
          />

          <DetailItem
            label="State"
            value={facility.stateOfCollateral}
          />

          <DetailItem
            label="Location"
            value={facility.location}
          />

          <DetailItem
            label="Other Details"
            value={
              facility.otherDetails || '-'
            }
          />
        </div>
      </CardContent>
    </Card>
  )

}

export default CollateralTab