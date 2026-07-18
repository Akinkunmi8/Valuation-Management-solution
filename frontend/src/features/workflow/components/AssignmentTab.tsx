import { useState } from 'react'

import Button from '@/shared/ui/button/Button'
// import Select, { type SelectOption } from '@/shared/ui/select/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card/Card'
import { useGetValuerDropdownQuery } from '@/valuer/api/valuerApi'
import { useAssignValuerMutation } from '../api/cmsActionApi'

import type { FacilityDetailsResponse } from '@/features/facilities/types/facilityTypes'
import { notify } from '@/shared/lib/toast'
import { useAppSelector } from '@/app/store/hooks'
import Select from '@/shared/ui/select/Select'
// import { getMockValuerOptions } from '@/features/facilities/services/mockValuers'

type AssignmentTabProps = {
  facility: FacilityDetailsResponse
}

const AssignmentTab = (
  {
    facility,
  }: AssignmentTabProps
) => {

  const { email } = useAppSelector(state => state.auth)

  const [selectedValuer, setSelectedValuer] = useState<{
    id: number
    name: string
  } | null>(null)

  const {
    data: valuers = [],
  } = useGetValuerDropdownQuery();

  const valuerOptions = valuers.map(v => ({
    label: v.valuerName,
    value: String(v.valuerId),
  }));

  const [
    assignValuer,
    {
      isLoading: isAssigning,
    },
  ] = useAssignValuerMutation();


  const handleAssign = async () => {
    if (!selectedValuer) return

    try {
      await assignValuer({
        facilityReference:
          facility.facilityReference,
        valuerId: selectedValuer.id,
        valuerName: selectedValuer.name,
        username: email!,
      }).unwrap()

      notify.success(
        "Success",
        "Valuer assigned successfully",
      )
    } catch (error) {
      notify.apiError(error, "Assignment Failed")
    }
  }

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
            options={valuerOptions}
            value={selectedValuer?.id.toString() ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value)

              const valuer = valuers.find(
                (v) => v.valuerId === id,
              )

              if (!valuer) return

              setSelectedValuer({
                id: valuer.valuerId,
                name: valuer.valuerName,
              })
            }}
          />

          <Button
            disabled={!selectedValuer || isAssigning}
            isLoading={isAssigning}
            className="w-full"
            onClick={handleAssign}
          >
            Assign Valuer
          </Button>

        </div>

      </CardContent>
    </Card>
  )
}

export default AssignmentTab