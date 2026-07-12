import type { ReactNode } from 'react'

export type Column<T> = {
  key: keyof T
  header: string
  align?: 'left' | 'center' | 'right'
  render?: (
    row: T,
  ) => ReactNode
}

export type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  loading?: boolean
  emptyTitle?: string
  emptyMessage?: string
}