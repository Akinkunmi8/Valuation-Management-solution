import type {
  ApiResponse,
  RejectFacilityRequest,
} from "@/features/approvals/types/cmActionTypes";
import { baseApi } from "@/shared/api/baseApi";

export interface ApproveFacilityRequest {
  facilityReference: string;
  username: string;
}

export const cmActionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Approve Facility
    approveFacility: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      ApproveFacilityRequest
    >({
      query: ({ facilityReference, username }) => ({
        url: `/api/CmAction/approve-facility/${facilityReference}`,
        method: "POST",
        body: {
          username,
          facilityReference,
        },
      }),

      invalidatesTags: (_result, _error, { facilityReference }) => [
        {
          type: "Facility",
          id: facilityReference,
        },
        "RmDashboard",
        "CmDashboard",
      ],
    }),

    // Reject Facility
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
        {
          type: "Facility",
          id: facilityReference,
        },
        "RmDashboard",
        "CmDashboard",
      ],
    }),
  }),
});

export const { useApproveFacilityMutation, useRejectFacilityMutation } =
  cmActionApi;
