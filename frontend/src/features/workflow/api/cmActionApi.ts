import { baseApi } from "@/shared/api/baseApi";

import type {
  ApiResponse,
  ApproveFacilityRequest,
  RejectFacilityRequest,
  ApproveReportRequest,
  RejectReportRequest,
} from "@/features/approvals/types/cmActionTypes";

export interface ValidateApprovalResponse {
  facilityReference: string;
  isFacilityApproved: boolean;
  isFacilityRejected: boolean;
  isReportApproved: boolean;
  isReportRejected: boolean;
  isFullyApproved: boolean;
  isAnyRejected: boolean;
}

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
        "CmsDashboard",
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
        "CmsDashboard",
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
        "ValuationReports",
        "CmDashboard",
        "CmsDashboard",
        "Payment",
        "ValuerPayments",
        "ValuerDashboard",
        { type: "Facility", id: facilityReference },
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
        "CmDashboard",
        "ValuerDashboard",
        { type: "Facility", id: facilityReference },
      ],
    }),

    validateApproval: builder.query<ValidateApprovalResponse, string>({
      query: (facilityReference) => ({
        url: `/api/ValuationReport/validate-approval/${facilityReference}`,
        method: "GET",
      }),
      providesTags: (_result, _error, facilityReference) => [
        { type: "ValuationReport", id: facilityReference },
      ],
    }),
  }),
});

export const {
  useApproveFacilityMutation,
  useRejectFacilityMutation,
  useApproveReportMutation,
  useRejectReportMutation,
  useValidateApprovalQuery,
} = cmActionApi;
