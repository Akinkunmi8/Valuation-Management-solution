import Button from '@/shared/ui/button/Button'
import { Card, CardHeader, CardContent } from '@/shared/ui/card/Card'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import type {
  FacilityDetailsResponse,
} from '@/features/facilities/types/facilityTypes'
import DetailItem from '@/features/facilities/workspace/DetailItem'
import { useProcessFacilityPaymentMutation } from '../api/paymentApi'

import { notify } from '@/shared/lib/toast'
import { NOTIFY_TITLES } from '@/shared/constants/notifyTitles'

type PaymentTabProps = {
  facility: FacilityDetailsResponse
}



const PaymentTab = ({
  facility }: PaymentTabProps
) => {

  const [
    processFacilityPayment,
    {
      isLoading,
      // isSuccess,
    },
  ] = useProcessFacilityPaymentMutation();

  const handleCollectCharges = async () => {

    try {
      const response = await processFacilityPayment(
        facility.facilityReference,
      ).unwrap()

      notify.success(
        NOTIFY_TITLES.PAYMENT_SUCCESS,
        response.message,
      )
    } catch (error) {
      notify.apiError(
        error,
        NOTIFY_TITLES.PAYMENT_FAILED,
      )
    }
  }

  
  return (
    <>
      <Card>
        <CardHeader
          title="Facility Charges"
        // description="Collect valuation charges before the facility proceeds for review."
        />

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <DetailItem
              label="Customer"
              value={facility.customerName}
            />

            <DetailItem
              label="Facility Reference"
              value={facility.facilityReference}
            />

            <DetailItem
              label="Valuation Charges"
              value={formatCurrency(facility.valuationsFees)}
            />

            <DetailItem
              label="Payment Status"
              value="Awaiting Collection"
            />

          </div>

          <div className="mt-8 flex justify-end">

            <Button
              onClick={handleCollectCharges}
              isLoading={isLoading}
            >
              Collect Charges
            </Button>
          </div>
        </CardContent>

      </Card>
    </>

  )
}

export default PaymentTab


