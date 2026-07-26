import { baseApi } from "@/shared/api/baseApi";
import type {
  ValuationReportDashboardResponse,
  ValuationReportDetails,
} from "../types/valuationReportTypes";

export const valuationReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getValuationReportDashboard: builder.query<
      ValuationReportDashboardResponse,
      void
    >({
      query: () => ({
        url: "/api/ValuationReport/dashboard",
      }),

      providesTags: ["ValuationReport"],
    }),

    // getValuationReportDetails:
    //   builder.query<
    //     ValuationReport,
    //     string
    //   >({

    //     query: facilityReference => ({
    //       url:
    //         `/api/ValuationReport/details/${facilityReference}`,
    //     }),

    //     providesTags: (
    //       _,
    //       __,
    //       facilityReference,
    //     ) => [

    //       {
    //         type: "ValuationReport",
    //         id: facilityReference,
    //       },

    //     ],

    //   }),

    getValuationReportDetails: builder.query<ValuationReportDetails, string>({
      query: (facilityRef) => ({
        url: `/api/ValuationReport/details/${facilityRef}`,
      }),

      providesTags: (_result, _error, facilityReference) => [
        {
          type: "ValuationReport",
          id: facilityReference,
        },
      ],
    }),
  }),
});

export const {
  useGetValuationReportDashboardQuery,
  useGetValuationReportDetailsQuery,
} = valuationReportApi;
