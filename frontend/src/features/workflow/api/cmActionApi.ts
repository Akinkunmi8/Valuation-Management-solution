import type { ApiResponse, RejectFacilityRequest } from "@/features/approvals/types/cmActionTypes";
import { baseApi } from "@/shared/api/baseApi";

export const cmActionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Approve Facility
    approveFacility: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (facilityReference) => ({
        url: `/api/CmAction/approve-facility/${facilityReference}`,

        method: "POST",
      }),

      invalidatesTags: (
        _result, 
        _error, 
        facilityReference) => [
        {
          type: "Facility",
          id: facilityReference,
        },

        "RmDashboard",

        "CmDashboard",
      ],
    }),

    // Reject Facility
    rejectFacility:
        builder.mutation<
          ApiResponse,
          RejectFacilityRequest
        >({

          query: ({
            facilityReference,
            username,
            comment,
          }) => ({

            url: `/api/CmAction/reject-facility/${facilityReference}`,

            method: 'POST',

            body: {
              facilityReference,
              username,
              comment,
            },

          }),

          invalidatesTags: (
            _result,
            _error,
            { facilityReference },
          ) => [
            {
              type: 'Facility',
              id: facilityReference,
            },
            'RmDashboard',
            'CmDashboard',
          ],

        }),

  }),
});

export const { useApproveFacilityMutation, useRejectFacilityMutation } = cmActionApi;
