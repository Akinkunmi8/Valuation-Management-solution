import DetailItem from './DetailItem'
import {Card, CardHeader, CardContent } from '@/shared/ui/card/Card'

import type { FacilityDetailsResponse } from '../types/facilityTypes'

type CustomerTabProps = {
    facility: FacilityDetailsResponse
}

const CustomerTab = ({
    facility,
}: CustomerTabProps) => {
    return (
        <Card>
            <CardHeader
                title="Customer Information"/>
            <CardContent>
                <div className="grid gap-5 md:grid-cols-2">
                    <DetailItem
                        label="Customer Name"
                        value={facility.customerName}
                    />

                    <DetailItem
                        label="Account Number"
                        value={facility.accountNumber}
                    />

                    <DetailItem
                        label="SOL ID"
                        value={facility.solId}
                    />

                    <DetailItem
                        label="City"
                        value={facility.city}
                    />

                    <DetailItem
                        label="Country"
                        value={facility.country}
                    />

                    <DetailItem
                        label="RM Number"
                        value={facility.rMsNumber}
                    />

                    <DetailItem
                        label="Created By"
                        value={facility.createdBy}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default CustomerTab