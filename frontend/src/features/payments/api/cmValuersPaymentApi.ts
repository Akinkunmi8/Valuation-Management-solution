import { baseApi } from "@/shared/api/baseApi";

export type ValuerPaymentMetrics = {
  successfulCount: number;
  failedCount: number;
  reversedCount: number;
  totalSuccessfulAmount: number;
};

export type ValuerPaymentTransaction = {
  facilityReference: string;
  customerName: string;
  accountNumber: string;
  amount: number;
  transactionType: string;
  status: "Successful" | "Failed" | "Reversed";
  narration: string;
  transDate: string;
};

export type ValuerPaymentDashboardResponse = {
  metrics: ValuerPaymentMetrics;
  transactions: ValuerPaymentTransaction[];
};

export interface ValidateValuerFeeResponse {
  facilityReference: string;
  isPaid: boolean;
  valuerName?: string;
  valuerBank?: string;
  accountNumber?: string;
  valuationFee?: number;
  totalAmount?: number;
  propertyAddress?: string;
}

export interface PayValuerRequest {
  facilityReference: string;
}

export const valuerPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getValuerPaymentDashboard: builder.query<
      ValuerPaymentDashboardResponse,
      void
    >({
      query: () => ({
        url: "api/Payment/dashboard/valuer-fees",
      }),

      providesTags: ["Payment"],
    }),

    processValuerPayment: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (facilityReference) => ({
        url: `api/Payment/valuer-fees/process/${facilityReference}`,
        method: "POST",
      }),

      invalidatesTags: [
        "Payment",
        "Facility",
        "ValuerDashboard",
        "CmsDashboard",
        "ValuerPayments",
      ],
    }),

    reverseValuerPayment: builder.mutation<void, string>({
      query: (facilityReference) => ({
        url: `api/Payment/valuer-fees/reverse/${facilityReference}`,
        method: "POST",
      }),

      invalidatesTags: [
        "Payment",
        "Facility",
        "ValuerDashboard",
        "CmsDashboard",
        "ValuerPayments",
      ],
    }),

    validateValuerFee: builder.query<ValidateValuerFeeResponse, string>({
      query: (facilityReference) => ({
        url: `/api/Payment/validate-valuer-fee/${facilityReference}`,
        method: "GET",
      }),
      providesTags: (_result, _error, facilityReference) => [
        { type: "Payment", id: facilityReference },
        "ValuerPayments",
      ],
    }),
  }),
});

export const {
  useGetValuerPaymentDashboardQuery,
  useProcessValuerPaymentMutation,
  useReverseValuerPaymentMutation,
  useValidateValuerFeeQuery,
} = valuerPaymentApi;
