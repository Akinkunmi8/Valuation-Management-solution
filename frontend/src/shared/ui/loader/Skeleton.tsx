import './loader.css'

type SkeletonProps = {
    className?: string
}

export const Skeleton = ({
    className = '',
}: SkeletonProps) => {
    return (
        <div
            className={`vh-skeleton ${className}`}
        />
    )
}

export const MetricCardSkeleton =
    () => {

        return (

            <div
                className="
rounded-2xl
border
border-border
bg-surface
p-5
space-y-4
"
            >

                <Skeleton className="h-3 w-24 rounded" />

                <Skeleton className="h-10 w-20 rounded" />

                <Skeleton className="h-4 w-40 rounded" />

            </div>

        )

    }



//     {
// isLoading
// ?

// <div className="space-y-3">

// <Skeleton className="h-12 rounded"/>

// <Skeleton className="h-12 rounded"/>

// <Skeleton className="h-12 rounded"/>

// <Skeleton className="h-12 rounded"/>

// </div>

// :

// <Table/>
// }