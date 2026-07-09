import { baseApi } from "../../../shared/api/baseApi";

import type { CreateFacilityResponse } from "../types/facilityTypes";

export const facilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFacility: builder.mutation<CreateFacilityResponse, FormData>({
      query: (body) => ({
        url: "/api/Facilities/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Facility", "RmDashboard"],
    }),
  }),
});

export const { useCreateFacilityMutation } = facilityApi;
