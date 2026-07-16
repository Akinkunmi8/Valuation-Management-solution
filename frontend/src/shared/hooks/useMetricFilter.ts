import { useRef, useState } from 'react'

export const useMetricFilter = <
  T extends string,
>(
  initialFilter: T,
) => {

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState<T>(initialFilter)

  const tableRef =
    useRef<HTMLDivElement>(null)

  const setFilter = (
    filter: T,
  ) => {

    setSelectedFilter(filter)

    requestAnimationFrame(() => {

      tableRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

    })

  }

  return {

    selectedFilter,

    setFilter,

    tableRef,

  }

}