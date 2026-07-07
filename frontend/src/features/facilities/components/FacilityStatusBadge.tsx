import Badge from '../../../shared/ui/badge/Badge'
import { FACILITY_STATUS_CONFIG } from '../../../shared/constants/statusConfig'
import type { FacilityStatus } from '../types/facilityTypes'

type Props = {
  status: FacilityStatus
}

const FacilityStatusBadge = ({ status }: Props) => {
  const config = FACILITY_STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}

export default FacilityStatusBadge