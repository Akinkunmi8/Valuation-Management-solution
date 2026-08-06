import { baseApi } from "@/shared/api/baseApi";

export type AdminDashboardMetrics = {
  totalUsersCount: number;
  totalActiveUsersCount: number;
  totalValuersCount: number;
};

export type AdminDashboardResponse = {
  metrics: AdminDashboardMetrics;
};

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardMetrics: builder.query<
      AdminDashboardResponse,
      void
    >({
      query: () => ({
        url: "api/AdminDashboard/system-metrics",
      }),

      providesTags: ["AdminDashboard"],
    }),
  }),
});

export const {
  useGetAdminDashboardMetricsQuery,
} = adminDashboardApi;