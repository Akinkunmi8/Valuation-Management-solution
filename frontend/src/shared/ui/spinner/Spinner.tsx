import { clsx } from 'clsx'

type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-3',
}

const Spinner = ({ size = 'md', label = 'Loading', className }: SpinnerProps) => {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
      <span
        aria-hidden="true"
        className={clsx(
          'inline-block animate-spin rounded-full border-current border-r-transparent text-current',
          sizeClasses[size],
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export default Spinner
