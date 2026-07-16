import { baseApi } from '@/shared/api/baseApi'

export const authApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      registerStaff:
        builder.mutation({
          query: (payload) => ({
            url: 'api/Account/register/staff',
            method: 'POST',
            body: payload,
          }),
        }),

      loginStaff:
        builder.mutation({
          query: (payload) => ({
            url: 'api/Account/login/staff',
            method: 'POST',
            body: payload,
          }),
        }),
    }),
  })

export const {
  useRegisterStaffMutation,
  useLoginStaffMutation,
} = authApi