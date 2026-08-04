import { baseApi } from "@/shared/api/baseApi";

export const cmsActionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignValuer: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        facilityReference: string;
        valuerId: number;
        valuerName: string;
        username: string;
      }
    >({
      query: ({ facilityReference, valuerId, valuerName, username }) => ({
        url: `/api/CmsAction/assign-valuer/${facilityReference}`,
        method: "POST",
        params: {
          valuerId,
          valuerName,
          username,
        },
      }),

      invalidatesTags: (_result, _error, arg) => [
        "CmsDashboard",
        "ValuerDashboard",
        "CmDashboard",
        "RmDashboard",
        {
          type: "Facility",
          id: arg.facilityReference,
        },
      ],
    }),

    cancelFacility: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        facilityReference: string;
        username: string;
      }
    >({
      query: ({ facilityReference,
        // reason,
        username }) => ({
        url: `/api/CmsAction/cancel-facility/${facilityReference}`,
        method: "POST",
        params: {
          Username: username,
        },
        // body: {reason}
      }),

      invalidatesTags: (_result, _error, arg) => [
        "CmsDashboard",
        "CmDashboard",
        "RmDashboard",
        "ValuerDashboard",
        "CmDashboard",
        "RmDashboard",
        {
          type: "Facility",
          id: arg.facilityReference,
        },
      ],
    }),
  }),
});

export const { useAssignValuerMutation, useCancelFacilityMutation } =
  cmsActionApi;
