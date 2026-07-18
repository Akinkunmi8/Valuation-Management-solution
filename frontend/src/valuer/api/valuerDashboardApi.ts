import { baseApi } from '@/shared/api/baseApi'

export type ValuerDashboardResponse = {
  metrics: {
    assignedFacilityCount: number
    ongoingReportCount: number
    awaitingCompletedReportCount: number
    approvedCompletedReportCount: number
    returnedReportCount: number
    beyondTatCount: number
  }

  assignedFacilities: ValuerFacilityTableRow[]
  ongoingReports: ValuerFacilityTableRow[]
  awaitingCompletedReports: ValuerFacilityTableRow[]
  approvedCompletedReports: ValuerFacilityTableRow[]
  returnedReports: ValuerFacilityTableRow[]
  beyondTat: ValuerFacilityTableRow[]
}

export type ValuerFacilityTableRow = {
  facilityReference: string
  customerName: string
  accountNumber: string
  facilityPurpose: string
  collateralValue: number

  approvalStatus: string
  valuerPaymentStatus: string
  valuationStatus: string
  reportStatus: string

  dateAdded: string
}

export const valuerDashboardApi =
  baseApi.injectEndpoints({
    endpoints: builder => ({
      getValuerDashboardMetrics:
        builder.query<
          ValuerDashboardResponse,
          number
        >({
          query: valuerId => ({
            url: `api/ValuerDashboard/metrics/${valuerId}`,
          }),

          providesTags: ['ValuerDashboard'],
        }),
    }),
  })

export const {
  useGetValuerDashboardMetricsQuery,
} = valuerDashboardApi