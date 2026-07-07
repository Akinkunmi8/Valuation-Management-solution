import { clsx } from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

type CardTone = 'default' | 'muted' | 'elevated'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone
}

const toneClasses: Record<CardTone, string> = {
 default: 'border-border bg-surface shadow-sm',
  muted: 'border-border bg-surface-hover',
  elevated: 'border-border bg-surface shadow-md',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone = 'default', ...props }, ref) => {
    return (
      <div
        className={clsx('rounded-xl border text-text-primary', toneClasses[tone], className)}
        ref={ref}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={clsx('border-b border-border px-5 py-4', className)} ref={ref} {...props} />
  },
)

CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 className={clsx('text-base font-semibold text-text-primary', className)} ref={ref} {...props} />
  },
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={clsx('mt-1 text-sm leading-6 text-text-secondary', className)} ref={ref} {...props} />
  },
)

CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={clsx('px-5 py-4', className)} ref={ref} {...props} />
  },
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className={clsx('flex items-center justify-end gap-3 border-t border-border px-5 py-4', className)} ref={ref} {...props} />
    )
  },
)

CardFooter.displayName = 'CardFooter'

export default Card
