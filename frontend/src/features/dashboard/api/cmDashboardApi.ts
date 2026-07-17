import { baseApi } from '@/shared/api/baseApi'
import type { CmDashboardResponse } from '../types/cmDashboardTypes'

export const cmDashboardApi =
  baseApi.injectEndpoints({
    endpoints: builder => ({

      getCmDashboardMetrics:
        builder.query<
          CmDashboardResponse,
          void
        >({

          query: () => ({
            url:
              '/api/CmDashboard/global-metrics',
          }),

          providesTags: ['CmDashboard'],

        }),

        

    }),
  })

export const {
  useGetCmDashboardMetricsQuery,
} = cmDashboardApi