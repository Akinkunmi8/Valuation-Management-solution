import { baseApi } from "@/shared/api/baseApi";
import type { ReportDashboardResponse } from "../types/reportDashboardTypes";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitValuationReport: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "api/ValuationReport/submit",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: [
        "ValuerDashboard",
        "Facility",
        "CmDashboard",
        "ValuationReport",
        "ValuationReports",
      ],
    }),

    editResubmitValuationReport: builder.mutation<
      void,
      {
        facilityReference: string;
        formData: FormData;
      }
    >({
      query: ({ facilityReference, formData }) => ({
        url: `api/ValuationReport/edit-resubmit/${facilityReference}`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: [
        "ValuerDashboard",
        "Facility",
        "CmDashboard",
        "ValuationReport",
        "ValuationReports",
      ],
    }),

    getReportDashboard: builder.query<ReportDashboardResponse, void>({
      query: () => ({
        url: "api/ValuationReport/dashboard",
      }),

      providesTags: ["ValuationReport"],
    }),
  }),
});

export const {
  useSubmitValuationReportMutation,
  useEditResubmitValuationReportMutation,
  useGetReportDashboardQuery,
} = reportApi;
