import type {
  FacilityDetailsResponse,
} from '../types/facilityTypes'

type Props = {
  facility: FacilityDetailsResponse
}

const CollateralTab = ({
  facility,
}: Props) => {
  return (
    <div>
      Customer Tab
    </div>
  )
}

export default CollateralTab