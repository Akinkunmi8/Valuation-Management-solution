import { baseApi } from "@/shared/api/baseApi";

import type {
  CreateFacilityResponse,
  FacilityDetailsResponse,
} from "../types/facilityTypes";

export const facilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFacility: builder.mutation<CreateFacilityResponse, FormData>({
      query: (body) => ({
        url: "/api/Facilities/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Facility", "RmDashboard", "CmDashboard"],
    }),
    getFacilityDetails: builder.query<FacilityDetailsResponse, string>({
      query: (facilityReference) => ({
        url: `/api/Facilities/getFacilityDetails/${facilityReference}`,

        params: {
          facilityRef: facilityReference,
        },
      }),

      providesTags: (
        _result, 
        _error, 
        facilityReference) => [
        {
          type: "Facility",
          id: facilityReference,
        },
      ],
    }),
  }),
});

export const { useCreateFacilityMutation, useGetFacilityDetailsQuery } =
  facilityApi;
