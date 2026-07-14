import { baseApi } from "@/shared/api/baseApi";

export const cmActionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useApproveFacilityMutation } = cmActionApi;
