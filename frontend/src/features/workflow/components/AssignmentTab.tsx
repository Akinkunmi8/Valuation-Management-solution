import { useState } from 'react'

import Button from '@/shared/ui/button/Button'
// import Select, { type SelectOption } from '@/shared/ui/select/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card/Card'
import { useGetValuerDropdownQuery } from '@/valuer/api/valuerApi'
import { useAssignValuerMutation, useCancelFacilityMutation } from '../api/cmsActionApi'

import type { FacilityDetailsResponse } from '@/features/facilities/types/facilityTypes'
import { notify } from '@/shared/lib/toast'
import { useAppSelector } from '@/app/store/hooks'
import Select from '@/shared/ui/select/Select'
import { FacilityApprovalStatus, ValuationStatus } from '@/shared/constants/workflowStatus'

import CommentModal from '@/shared/ui/modal/CommentModal'
// import StatusBadge from '@/shared/ui/badge/Badge'
// import { getMockValuerOptions } from '@/features/facilities/services/mockValuers'

// type AssignmentTabProps = {
//   facility: FacilityDetailsResponse
// }

type AssignmentTabProps = {
  facility: FacilityDetailsResponse;
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


  const [
    cancelFacility,
    {
      isLoading: isCancelling,
    },
  ] = useCancelFacilityMutation();

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
        "Assignment Successful",
        `${selectedValuer.name} has been assigned to this facility.`,
      );
    } catch (error) {
      notify.apiError(error, "Assignment Failed");
    }
  };


  const handleCancelFacility = async () => {
    if (!email) {
      notify.error(
        "Authentication Error",
        "Unable to identify the current user.",
      );
      return;
    }

    try {
      await cancelFacility({
        facilityReference: facility.facilityReference,
        username: email,
        // comment will be added once the backend supports it
      }).unwrap();

      setShowCancelModal(false);

      notify.success(
        "Facility Cancelled",
        "The facility workflow has been cancelled successfully.",
      );
    } catch (error) {
      notify.apiError(error, "Cancellation Failed");
    }
  };

  const canAssign =
    facility.approvalStatus === FacilityApprovalStatus.Approved &&
    facility.valuationStatus === ValuationStatus.UnAssigned;

  const alreadyAssigned =
    facility.valuationStatus === ValuationStatus.Assigned;

  const completed =
    facility.valuationStatus === ValuationStatus.Completed;

  const canCancel = alreadyAssigned;

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Assign Valuer
          </CardTitle>
        </CardHeader>
        <CardContent>

          <div className="space-y-6">

            {canAssign && (
              <>
                <Select
                  label="Valuer"
                  placeholder="Select Valuer"
                  options={valuerOptions}
                  value={selectedValuer?.id.toString() ?? ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);

                    const valuer = valuers.find(
                      v => v.valuerId === id,
                    );

                    if (!valuer) return;

                    setSelectedValuer({
                      id: valuer.valuerId,
                      name: valuer.valuerName,
                    });
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
              </>
            )}

            {alreadyAssigned && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="font-semibold text-blue-700">
                  Valuer Assigned
                </p>

                <p className="mt-1 text-sm text-blue-600">
                  This facility has already been assigned to a valuer.
                </p>
              </div>
            )}

            {completed && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-semibold text-emerald-700">
                  Workflow Completed
                </p>

                <p className="mt-1 text-sm text-emerald-600">
                  This valuation workflow has been completed successfully.
                </p>
              </div>
            )}

          </div>

        </CardContent>
      </Card>

      {canCancel && (
        <>

          <hr className="border-border" />

          <Card className="border-red-200 bg-red-50 mt-6">
            <CardHeader>
              <CardTitle className="text-red-700">
                Danger Zone
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <p className="text-sm text-red-600">
                Cancelling a facility permanently stops the valuation workflow.
                This action should only be used when the valuation process
                must be terminated.
              </p>

              <Button
                variant="danger"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Facility
              </Button>

            </CardContent>
          </Card>

        </>
      )}

      <CommentModal
        open={showCancelModal}
        loading={isCancelling}
        title="Cancel Facility"
        description="Please provide a reason for cancelling this facility workflow."
        confirmText="Cancel Facility"
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleCancelFacility}
      />

    </>
  )
}

export default AssignmentTab