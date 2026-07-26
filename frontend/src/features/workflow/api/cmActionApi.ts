import { baseApi } from "@/shared/api/baseApi";

import type {
  ApiResponse,
  ApproveFacilityRequest,
  RejectFacilityRequest,
  ApproveReportRequest,
  RejectReportRequest,
} from "@/features/approvals/types/cmActionTypes";

export const cmActionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //--------------------------------------
    // APPROVE FACILITY
    //--------------------------------------

    approveFacility: builder.mutation<ApiResponse, ApproveFacilityRequest>({
      query: ({ facilityReference, username }) => ({
        url: `/api/CmAction/approve-facility/${facilityReference}`,
        method: "POST",

        params: {
          Username: username,
        },
      }),

      invalidatesTags: (_result, _error, { facilityReference }) => [
        { type: "Facility", id: facilityReference },
        "RmDashboard",
        "CmDashboard",
      ],
    }),

    //--------------------------------------
    // REJECT FACILITY
    //--------------------------------------

    rejectFacility: builder.mutation<ApiResponse, RejectFacilityRequest>({
      query: ({ facilityReference, username, comment }) => ({
        url: `/api/CmAction/reject-facility/${facilityReference}`,
        method: "POST",

        body: {
          facilityReference,
          username,
          comment,
        },
      }),

      invalidatesTags: (_result, _error, { facilityReference }) => [
        { type: "Facility", id: facilityReference },
        "RmDashboard",
        "CmDashboard",
      ],
    }),

    //--------------------------------------
    // APPROVE REPORT
    //--------------------------------------

    approveReport: builder.mutation<ApiResponse, ApproveReportRequest>({
      query: ({ facilityReference, username }) => ({
        url: `/api/CmAction/approve-report/${facilityReference}`,
        method: "POST",

        params: {
          Username: username,
        },
      }),

      invalidatesTags: (_result, _error, { facilityReference }) => [
        { type: "ValuationReport", id: facilityReference },
        "ValuationReports",
      ],
    }),

    //--------------------------------------
    // REJECT REPORT
    //--------------------------------------

    rejectReport: builder.mutation<ApiResponse, RejectReportRequest>({
      query: ({ facilityReference, username, comment }) => ({
        url: `/api/CmAction/reject-report/${facilityReference}`,
        method: "POST",

        body: {
          facilityReference,
          username,
          comment,
        },
      }),

      invalidatesTags: (_result, _error, { facilityReference }) => [
        { type: "ValuationReport", id: facilityReference },
        "ValuationReports",
      ],
    }),
  }),
});

export const {
  useApproveFacilityMutation,
  useRejectFacilityMutation,
  useApproveReportMutation,
  useRejectReportMutation,
} = cmActionApi;
