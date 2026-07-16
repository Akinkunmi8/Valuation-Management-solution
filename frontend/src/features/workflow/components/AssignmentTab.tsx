import { useEffect, useState } from 'react'

import Button from '@/shared/ui/button/Button'
import Select, { type SelectOption } from '@/shared/ui/select/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card/Card'

// import type { FacilityDetailsResponse } from '@/features/facilities/types/facilityTypes'
import { getMockValuerOptions } from '@/features/facilities/services/mockValuers'

// type AssignmentTabProps = {
//   facility: FacilityDetailsResponse
// }

const AssignmentTab = (
//     {
//   facility,
// }: AssignmentTabProps
) => {

  const [valuerId, setValuerId] =
    useState('')

  // TODO:
  // Replace with useGetValuerDropdownQuery()
  const [valuerOptions, setValuerOptions] =
  useState<SelectOption[]>([])

  useEffect(() => {
  getMockValuerOptions()
    .then(setValuerOptions)
}, [])

  return (

    <Card>
      <CardHeader>
        <CardTitle>
          Assign Valuer
        </CardTitle>
      </CardHeader>
      <CardContent>

        <div className="space-y-6">

          <Select
            label="Valuer"
            placeholder="Select Valuer"
            // options={valuers}
            options={valuerOptions}
            value={valuerId}
            onChange={e =>
              setValuerId(
                e.target.value,
              )
            }
          />

          <Button
            disabled={!valuerId}
            className="w-full"
          >
            Assign Valuer
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

export default AssignmentTab