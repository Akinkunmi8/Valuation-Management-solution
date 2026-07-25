import { baseApi } from '@/shared/api/baseApi'

export type PaymentStatus =
  | 'Successful'
  | 'Failed'
  | 'Reversed'

export type PaymentTransaction = {
  rowId: string
  facilityReference: string
  customerName: string
  accountNumber: string
  amount: number
  transactionType: string
  status: PaymentStatus
  narration: string
  transDate: string
}

export type PaymentDashboardMetrics = {
  successfulCount: number
  failedCount: number
  reversedCount: number
  totalSuccessfulAmount: number
}

export type PaymentDashboardResponse = {
  metrics: PaymentDashboardMetrics
  transactions: Omit<PaymentTransaction, 'rowId'>[]
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPaymentDashboard: builder.query<
      PaymentDashboardResponse,
      void
    >({
      query: () => ({
        url: '/api/Payment/dashboard/facility-fees',
      }),
      providesTags: ['Payment'],
    }),
  }),
})

export const {
  useGetPaymentDashboardQuery,
} = paymentApi