import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card/Card'

import DetailItem from './DetailItem'

import {
    formatCurrency,
} from '@/shared/utils/formatCurrency'

import {
    formatDate,
} from '@/shared/utils/formatDate'

import {
    getApprovalStatus,
    VALUATION_STATUS,
} from '../utils/status'

import type {
    FacilityDetailsResponse,
} from '../types/facilityTypes'
import StatusBadge from '@/shared/ui/badge/Badge'

type Props = {
    facility: FacilityDetailsResponse
}



const OverviewTab = ({
    facility,
}: Props) => {

    const approval =
        getApprovalStatus(
            facility.approvalStatus,
        )

    return (
        <div className="space-y-6">
            <Card>

                <CardHeader>
                    <CardTitle>
                        Facility Summary
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-5 md:grid-cols-2">
                        <DetailItem
                            label="Reference"
                            value={facility.facilityReference}
                        />

                        <DetailItem
                            label="Customer"
                            value={facility.customerName}
                        />

                        <DetailItem
                            label="Account Number"
                            value={facility.accountNumber}
                        />

                        <DetailItem
                            label="Purpose"
                            value={facility.facilityPurpose}
                        />

                        <DetailItem
                            label="Valuation Fee"
                            value={formatCurrency(facility.valuationsFees)}
                        />

                        <DetailItem
                            label="Created"
                            value={formatDate(facility.dateAdded)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Workflow Status
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-5 md:grid-cols-2">
                        <DetailItem
                            label="Approval"
                            value={
                                <StatusBadge
                                    label={approval.label}
                                    variant={approval.variant}
                                />
                            }
                        />

                        <DetailItem
                            label="Valuation"
                            value={
                                VALUATION_STATUS[
                                facility.valuationStatus as keyof typeof VALUATION_STATUS
                                ]
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OverviewTab