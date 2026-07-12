import type {
    DataTableProps,
} from './types'

import { Skeleton } from '../loader'

export default function DataTable<T>({
    columns,
    data,
    rowKey,
    loading = false,
    emptyTitle = 'No Records',
    emptyMessage = 'No records found.',
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-border bg-surface">
                <div className="space-y-3 p-5">

                    {Array.from({
                        length: 8,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-12 rounded-xl"
                        />
                    ))}

                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-surface py-20 text-center">

                <h3 className="text-lg font-semibold">
                    {emptyTitle}
                </h3>

                <p className="mt-2 text-sm text-text-secondary">
                    {emptyMessage}
                </p>

            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="border-b border-border bg-background">

                        <tr>

                            {columns.map(column => (

                                <th
                                    key={String(column.key)}
                                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary"
                                >
                                    {column.header}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {data.map((row,) => (

                            <tr
                                key={String(row[rowKey])}
                                className="border-b border-border transition-colors hover:bg-primary-soft"
                            >

                                {columns.map(column => (

                                    <td
                                        key={String(column.key)}
                                        className="px-5 py-4 text-sm text-text-primary"
                                    >

                                        {column.render
                                            ? column.render(row)
                                            : String(
                                                row[
                                                column.key as keyof T
                                                ] ?? '',
                                            )}

                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}