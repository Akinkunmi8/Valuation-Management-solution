import { clsx } from 'clsx'

type Metric = {
  label: string
  value: number
  key: string
}

type FacilityMetricsProps = {
  metrics: Metric[]
  activeMetric: string
  onSelect: (metric: string) => void
}

const FacilityMetrics = ({
  metrics,
  activeMetric,
  onSelect,
}: FacilityMetricsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => {
        const isActive =
          metric.key === activeMetric

        return (
          <button
            key={metric.key}
            type="button"
            onClick={() =>
              onSelect(metric.key)
            }
            className={clsx(
              'rounded-xl border bg-surface p-5 text-left transition-all duration-200',
              isActive
                ? 'border-primary bg-primary-soft ring-2 ring-primary/10 shadow-card'
                : 'border-border hover:border-primary/30 hover:bg-surface-hover'
            )}
          >
            <p className="text-sm font-medium text-text-muted">
              {metric.label}
            </p>

            <h3 className="mt-3 text-3xl font-bold text-text-primary">
              {metric.value}
            </h3>
          </button>
        )
      })}
    </div>
  )
}

export default FacilityMetrics