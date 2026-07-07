import type { ReactNode } from 'react'

type MetricCardProps = {
  title: string
  value: string | number
  subtitle: string
  icon: ReactNode
  onClick?: () => void
}

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  onClick,
}: MetricCardProps) => {
  return (
    <button
      onClick={onClick}
      className="
      w-full
      rounded-2xl
      border
      border-border
      bg-surface
      p-5
      text-left
      shadow-sm
      transition-all
      hover:-translate-y-1
      hover:shadow-md
      cursor-pointer
    "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-bold text-text-primary">
            {value}
          </h3>

          <p className="mt-2 text-sm text-text-muted">
            {subtitle}
          </p>
        </div>

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-teal-50
          text-teal-700
        "
        >
          {icon}
        </div>
      </div>
    </button>
  )
}

export default MetricCard