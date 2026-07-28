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
import { FacilityApprovalStatus, ValuationStatus } from '@/shared/constants/workflowStatus'
// import StatusBadge from '@/shared/ui/badge/Badge'
// import { getMockValuerOptions } from '@/features/facilities/services/mockValuers'

// type AssignmentTabProps = {
//   facility: FacilityDetailsResponse
// }

type AssignmentTabProps = {
    facility: FacilityDetailsResponse;
    canAssign: boolean;
    alreadyAssigned: boolean;
    completed: boolean;
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


  // const handleAssign = async () => {
  //   if (!selectedValuer) return

  //   try {
  //     await assignValuer({
  //       facilityReference:
  //         facility.facilityReference,
  //       valuerId: selectedValuer.id,
  //       valuerName: selectedValuer.name,
  //       username: email!,
  //     }).unwrap()

  //     notify.success(
  //       "Success",
  //       "Valuer assigned successfully",
  //     )
  //   } catch (error) {
  //     notify.apiError(error, "Assignment Failed")
  //   }
  // }

  const handleAssign = async () => {
    if (!selectedValuer) return;

    if (!email) {
      notify.error(
        "Authentication Error",
        "Unable to identify the current user.",
      );
      return;
    }

    try {
      await assignValuer({
        facilityReference: facility.facilityReference,
        valuerId: selectedValuer.id,
        valuerName: selectedValuer.name,
        username: email,
      }).unwrap();

      setSelectedValuer(null);

      notify.success(
        "Success",
        "Valuer assigned successfully.",
      );
    } catch (error) {
      notify.apiError(error, "Assignment Failed");
    }
  };

const canAssign =
    facility.approvalStatus === FacilityApprovalStatus.Approved &&
    facility.valuationStatus === ValuationStatus.UnAssigned;

const alreadyAssigned =
    facility.valuationStatus === ValuationStatus.Assigned;

const completed =
    facility.valuationStatus === ValuationStatus.Completed;

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
            disabled={!canAssign}
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
            disabled={
              !canAssign ||
              !selectedValuer ||
              isAssigning
            }
            isLoading={isAssigning}
            className="w-full"
            onClick={handleAssign}
          >
            {
              completed
                ? "Workflow Completed"
                : alreadyAssigned
                  ? "Valuer Assigned"
                  : "Assign Valuer"
            }
          </Button>

          {alreadyAssigned && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-sm text-blue-700">
              This facility has already been assigned to a valuer.
            </div>
          )}

          {completed && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700">
              This workflow has been completed.
            </div>
          )}

        </div>

      </CardContent>
    </Card>
  )
}

export default AssignmentTab