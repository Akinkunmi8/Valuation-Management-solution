
export type StatusBadgeProps = {
  label: string

  variant:
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
}

const variantStyles = {

  success: 'bg-success-soft text-success',

  warning: 'bg-warning-soft text-warning',

  danger: 'bg-danger-soft text-danger',

  info: 'bg-info-soft text-info',

  neutral: 'bg-slate-100 text-slate-700',

} as const

const StatusBadge = ({
  label,
  variant,
}: StatusBadgeProps) => {

  return (

    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]}`}>
      <span className="mr-2 h-2 w-2 rounded-full bg-current" />
      {label}
    </span>

  )

}

export default StatusBadge