import type {
    DataTableProps,
} from './types'

// import { Skeleton } from '../loader'



export default function DataTable<T>({
    columns,
    data,
    rowKey,
    loading = false,
    emptyTitle = 'No Records',
    emptyMessage = 'No records found.',
    onRowClick,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="p-4">
                    <div className="mb-4 h-10 w-full rounded-xl bg-slate-100 animate-pulse" />

                    <div className="space-y-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-16 rounded-xl bg-slate-50 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 text-center shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-lg text-slate-400">∅</span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                    {emptyTitle}
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                    {emptyMessage}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

            <div className="overflow-x-auto">

                <table className="min-w-full border-collapse">

                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70">

                            {columns.map(column => (
                                <th
                                    key={String(column.key)}
                                    className={`
                                        whitespace-nowrap
                                        px-5
                                        py-3.5
                                        text-left
                                        text-[11px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-slate-500
                                    `}
                                >
                                    {column.header}
                                </th>
                            ))}

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                        {data.map(row => (

                            <tr
                                key={String(row[rowKey])}
                                onClick={() => onRowClick?.(row)}
                                className={`
                                    group
                                    transition-colors
                                    duration-150
                                    odd:bg-white
even:bg-slate-50/40

                                    ${onRowClick
                                        ? `
                                                cursor-pointer
                                                hover:bg-slate-50/80
                                            `
                                        : ''
                                    }
                                `}
                            >

                                {columns.map(column => (

                                    <td
                                        key={String(column.key)}
                                        className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                            text-sm
                                            text-slate-700
                                        "
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
















// export default function DataTable<T>({
//     columns,
//     data,
//     rowKey,
//     loading = false,
//     emptyTitle = 'No Records',
//     emptyMessage = 'No records found.',
//     onRowClick,
// }: DataTableProps<T>) {
//     if (loading) {
//         return (
//             <div className="rounded-2xl border border-border bg-surface">
//                 <div className="space-y-3 p-5">

//                     {Array.from({
//                         length: 8,
//                     }).map((_, index) => (
//                         <Skeleton
//                             key={index}
//                             className="h-12 rounded-xl"
//                         />
//                     ))}

//                 </div>
//             </div>
//         )
//     }

//     if (data.length === 0) {
//         return (
//             <div className="rounded-2xl border border-border bg-surface py-20 text-center">

//                 <h3 className="text-lg font-semibold">
//                     {emptyTitle}
//                 </h3>

//                 <p className="mt-2 text-sm text-text-secondary">
//                     {emptyMessage}
//                 </p>

//             </div>
//         )
//     }

//     return (
//         <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

//             <div className="overflow-x-auto">

//                 <table className="min-w-full">

//                     <thead className="border-b border-border bg-background">

//                         <tr>

//                             {columns.map(column => (

//                                 <th
//                                     key={String(column.key)}
//                                     className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary"
//                                 >
//                                     {column.header}
//                                 </th>

//                             ))}

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {data.map((row,) => (

//                             <tr
//                                 key={String(row[rowKey])}
//                                 onClick={() => onRowClick?.(row)}
//                                 className={`
//                                         border-b
//                                         border-border
//                                         transition-all
//                                         duration-150
//                                         ${onRowClick
//                                         ? 'cursor-pointer hover:bg-primary-soft'
//                                         : ''
//                                     }
//     `}
//                             >

//                                 {columns.map(column => (

//                                     <td
//                                         key={String(column.key)}
//                                         className="px-5 py-4 text-sm text-text-primary"
//                                     >

//                                         {column.render
//                                             ? column.render(row)
//                                             : String(
//                                                 row[
//                                                 column.key as keyof T
//                                                 ] ?? '',
//                                             )}

//                                     </td>

//                                 ))}

//                             </tr>

//                         ))}

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     )
// }