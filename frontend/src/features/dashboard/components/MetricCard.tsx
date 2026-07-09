import type { ReactNode } from 'react'
// import { FiArrowRight } from 'react-icons/fi'

type MetricCardProps = {
  title: string
  value: number
  description?: string
  trend?: string
  icon?: ReactNode
  accent?: 'primary' | 'warning' | 'info' | 'success'
  active?: boolean
  onClick?: () => void
}


const accentStyles = {
  primary: {
    border: 'border-primary/10',
    bg: 'bg-primary-soft',
    trend: 'text-primary',
  },

  warning: {
    border: 'border-warning/10',
    bg: 'bg-warning-soft',
    trend: 'text-warning',
  },

  info: {
    border: 'border-info/10',
    bg: 'bg-info-soft',
    trend: 'text-info',
  },

  success: {
    border: 'border-success/10',
    bg: 'bg-success-soft',
    trend: 'text-success',
  },
}

const MetricCard = ({
  title,
  value,
  description,
  // trend,
  icon,
  accent = 'primary',
  active = false,
  onClick,
}: MetricCardProps) => {

  const style = accentStyles[accent] ??
    accentStyles.primary

  return (
    <button
      onClick={onClick}
      type="button"
      className={`
  group
  text-left
  rounded-2xl
  border
  p-5
  transition-all
  duration-200
  cursor-pointer

  ${active
          ? 'border-primary bg-primary-soft shadow-md'
          : 'border-border bg-surface hover:border-primary/30 hover:-translate-y-1 hover:shadow-md'
        }
`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-text-primary">
            {value}
          </h3>
        </div>

        <div
          className={`
            rounded-xl
            p-3
             ${style.bg}
             ${style.border} 
          `}
        >

          <span className={style.trend}>
            {icon}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-secondary">
        {description}
      </p>

    </button>
  )
}

export default MetricCard