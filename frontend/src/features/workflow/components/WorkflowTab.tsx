import { Card, CardHeader, CardContent } from '@/shared/ui/card/Card'

import type {
    FacilityDetailsResponse,
} from '@/features/facilities/types/facilityTypes'
import { getApprovalStatus } from '@/features/facilities/utils/status'
import StatusBadge from '@/shared/ui/badge/Badge'
import DetailItem from '@/features/facilities/workspace/DetailItem'
import Button from '@/shared/ui/button/Button'
import { useApproveFacilityMutation } from '../api/cmActionApi'
import { notify } from '@/shared/lib/toast'
import { NOTIFY_TITLES } from '@/shared/constants/notifyTitles'

type WorkflowTabProps = {
    facility: FacilityDetailsResponse
}

const WorkflowTab = ({
    facility,
}: WorkflowTabProps) => {


    const [
        approveFacility,
        {
            isLoading,
        },
    ] = useApproveFacilityMutation();

    const handleApprove = async () => {

        try {

            const response =
                await approveFacility(
                    facility.facilityReference,
                ).unwrap()

            notify.success(
                NOTIFY_TITLES.APPROVAL_SUCCESS,
                response.message,
            )

        } catch (error) {
            notify.apiError(
                error,
                NOTIFY_TITLES.REQUEST_FAILED,
            )

        }

    }

    return (
        <Card>
            <CardHeader
                title="Workflow Actions"
            // description="Perform workflow actions based on your role."
            />

            <CardContent>

                <div className="grid gap-5 md:grid-cols-2">

                    <DetailItem
                        label="Facility Reference"
                        value={facility.facilityReference}
                    />

                    <DetailItem
                        label="Customer"
                        value={facility.customerName}
                    />

                    <DetailItem
                        label="Approval Status"
                        value={
                            <StatusBadge
                                {...getApprovalStatus(
                                    facility.approvalStatus,
                                )}
                            />
                        }
                    />

                </div>


                <div className="mt-8 border-t pt-6">

                    <h3 className="text-lg font-semibold">
                        Available Actions
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Review the facility and choose an appropriate workflow action.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">

                        <Button
                            isLoading={isLoading}
                            onClick={handleApprove}
                        >
                            Approve Facility
                        </Button>

                        <Button
                            // variant="outline"
                            disabled
                        >
                            Reject Facility
                        </Button>

                    </div>
                </div>

            </CardContent>

            <CardContent>
            </CardContent>
        </Card>
    )
}

export default WorkflowTab