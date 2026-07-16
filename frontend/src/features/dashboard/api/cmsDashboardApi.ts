import { baseApi } from "@/shared/api/baseApi"
import type { CmsDashboardResponse } from "../types/cmsDashboardTypes"

export const cmsDashboardApi =
  baseApi.injectEndpoints({
    endpoints: builder => ({
      getCmsDashboardMetrics:
        builder.query<
          CmsDashboardResponse,
          void
        >({
          query: () => ({
            url:
              "/api/CmsDashboard/supervisor-metrics",
          }),

          providesTags: [
            "CmsDashboard",
          ],
        }),
    }),
  })

export const {
  useGetCmsDashboardMetricsQuery,
} = cmsDashboardApi