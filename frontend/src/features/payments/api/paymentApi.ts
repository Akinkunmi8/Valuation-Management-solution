import { baseApi } from '../../../shared/api/baseApi'
import type { PaymentResponse } from '../types/paymentTypes'

export const paymentApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    processFacilityPayment: builder.mutation<
      PaymentResponse,
      string
    >({

      query: facilityRef => ({
        url: `/api/Payment/facility-fees/process/${facilityRef}`,
        method: 'POST',
      }),

      invalidatesTags: [
        'RmDashboard',
        'Facility',
      ],

    }),

  }),
})

export const {
  useProcessFacilityPaymentMutation,
} = paymentApi