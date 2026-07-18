import { useMemo } from 'react'

import { useAppSelector } from '@/app/store/hooks'

import { useGetValuerDropdownQuery } from '../api/valuerApi'

export const useCurrentValuer = () => {
  const fullName = useAppSelector(
    state => state.auth.fullName,
  )

  const {
    data,
    isLoading,
    isError,
  } = useGetValuerDropdownQuery()

  const currentValuer = useMemo(() => {
    if (!data || !fullName) {
      return undefined
    }

    return data.find(
      valuer =>
        valuer.valuerName.trim().toLowerCase() ===
        fullName.trim().toLowerCase(),
    )
  }, [data, fullName])

  return {
    currentValuer,
    valuerId: currentValuer?.valuerId,
    isLoading,
    isError,
  }
}