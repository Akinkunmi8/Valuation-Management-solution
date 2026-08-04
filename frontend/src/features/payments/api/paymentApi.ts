import { baseApi } from "@/shared/api/baseApi";
import type { PaymentResponse } from "../types/paymentTypes";

export type FacilityPaymentValidationResponse = {
  facilityReference: string;
  isPaid: boolean;
};

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    processFacilityPayment: builder.mutation<PaymentResponse, string>({
      query: (facilityRef) => ({
        url: `/api/Payment/facility-fees/process/${facilityRef}`,
        method: "POST",
      }),

      invalidatesTags: ["RmDashboard", "Facility", "CmDashboard"],
    }),

    // Validate Facility Payment

    validateFacilityPayment: builder.query<
      FacilityPaymentValidationResponse,
      string
    >({
      query: (facilityRef) => ({
        url: `/api/Payment/validate-facility-fee/${facilityRef}`,
      }),

      providesTags: (_, __, facilityRef) => [
        {
          type: "Facility",
          id: facilityRef,
        },
      ],
    }),
  }),
});

export const { useProcessFacilityPaymentMutation,
  useValidateFacilityPaymentQuery
 } = paymentApi;
