import { clsx } from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
type BadgeSize = 'sm' | 'md'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-border bg-background text-text-secondary',
 success: 'border-success/20 bg-success-soft text-success',
 warning: 'border-amber-200 bg-amber-50 text-amber-800',
danger: 'border-danger/20 bg-danger-soft text-danger',
info: 'border-info/20 bg-info-soft text-info',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, size = 'sm', variant = 'neutral', ...props }, ref) => {
    return (
      <span
        className={clsx(
          'inline-flex max-w-full items-center rounded-lg border font-semibold leading-none',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

Badge.displayName = 'Badge'

export default Badge
