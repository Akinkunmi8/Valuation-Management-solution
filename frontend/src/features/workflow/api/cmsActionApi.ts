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
      query: ({
        facilityReference,
        valuerId,
        valuerName,
        username,
      }) => ({
        url: `/api/CmsAction/assign-valuer/${facilityReference}`,
        method: "POST",
        params: {
          valuerId,
          valuerName,
          username,
        },
      }),

      invalidatesTags: [
        "CmsDashboard",
        "ValuerDashboard",
        "Facility",
      ],
    }),
  }),
});

export const {
  useAssignValuerMutation,
} = cmsActionApi;