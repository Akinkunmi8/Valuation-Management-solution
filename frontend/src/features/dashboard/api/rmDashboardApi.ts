import { baseApi } from "@/shared/api/baseApi";

export const rmDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRmDashboardMetrics: builder.query({
      query: ({ createdBy, solId }) => ({
        url: "api/RmDashboard/metrics",
        params: {
          createdBy,
           solId,
        },
      }),

      providesTags: ["RmDashboard"],
    }),
  }),
});

export const { useGetRmDashboardMetricsQuery } = rmDashboardApi;
