import { baseApi } from "@/shared/api/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitValuationReport: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "api/ValuationReport/submit",

        method: "POST",

        body: formData,
      }),

      invalidatesTags: ["ValuerDashboard", "Facility"],
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

      invalidatesTags: ["ValuerDashboard", "Facility"],
    }),
  }),
});

export const {
  useSubmitValuationReportMutation,
  useEditResubmitValuationReportMutation,
} = reportApi;
