import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import Spinner from '../spinner/Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-primary bg-primary text-white hover:bg-primary-hover focus:ring-emerald-600/25',
  secondary: 'border-border-strong bg-surface text-zinc-900 hover:bg-background focus:ring-zinc-500/20',
  danger: 'border-red-700 bg-red-700 text-white hover:bg-red-800 focus:ring-red-600/25',
  ghost: 'border-transparent bg-transparent text-zinc-700 hover:bg-background hover:text-text-primary focus:ring-zinc-500/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 gap-2 px-3 text-sm',
  md: 'h-10 gap-2.5 px-4 text-sm',
  lg: 'h-11 gap-3 px-5 text-base',
}

const spinnerSize: Record<ButtonSize, 'sm' | 'md'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      isLoading = false,
      leftIcon,
      rightIcon,
      size = 'md',
      type = 'button',
      variant = 'primary',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={clsx(
          'inline-flex shrink-0 items-center justify-center rounded-md border font-semibold transition outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        disabled={disabled || isLoading}
        ref={ref}
        type={type}
        {...props}
      >
        {isLoading ? <Spinner size={spinnerSize[size]} label="Processing" /> : leftIcon}
        <span className="truncate">{children}</span>
        {!isLoading ? rightIcon : null}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
