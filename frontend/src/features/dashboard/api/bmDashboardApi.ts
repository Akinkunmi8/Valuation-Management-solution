// src/features/bm/api/bmApi.ts
import { baseApi } from "@/shared/api/baseApi";
import type { BmDashboardResponse } from "../types/bmDashboardTypes";

export const bmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBmBranchMetrics: builder.query<BmDashboardResponse, string>({
      query: (solId) => `/api/BmDashboard/branch-metrics?solId=${solId}`,
      providesTags: [
        // 'BmMetrics',
        "Facility",
      ],
    }),
  }),
});

export const { useGetBmBranchMetricsQuery } = bmApi;
