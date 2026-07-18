import { baseApi } from '@/shared/api/baseApi'

export type ValuerDropdownItem = {
  valuerId: number
  valuerName: string
}

export const valuerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getValuerDropdown: builder.query<
      ValuerDropdownItem[],
      void
    >({
      query: () => ({
        url: 'api/Valuer/dropdown',
      }),

      providesTags: ['Valuer'],
    }),
  }),
})

export const {
  useGetValuerDropdownQuery,
} = valuerApi