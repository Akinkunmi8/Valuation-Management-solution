import { clsx } from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
  leftAdornment?: ReactNode
  rightAdornment?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled,
      error,
      hint,
      id,
      label,
      leftAdornment,
      rightAdornment,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label ? (
          <label className="mb-1.5 block text-sm font-semibold text-text-primary" htmlFor={inputId}>
            {label}
            {required ? <span className="ml-1 text-red-600">*</span> : null}
          </label>
        ) : null}

        <div className="relative">
          {leftAdornment ? (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
              {leftAdornment}
            </span>
          ) : null}

          <input
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : undefined}
            className={clsx(
              'h-10 w-full rounded-md border bg-surface px-3 text-sm text-text-primary outline-none transition placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-text-muted',
              leftAdornment && 'pl-10',
              rightAdornment && 'pr-10',
              error
                ? 'border-danger-border focus:border-danger focus:ring-danger/20'
                : 'border-border-strong focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20',
              className,
            )}
            disabled={disabled}
            id={inputId}
            ref={ref}
            required={required}
            {...props}
          />

          {rightAdornment ? (
            <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">{rightAdornment}</span>
          ) : null}
        </div>

        {error ? (
          <p className="mt-1.5 text-sm font-medium text-red-600" id={errorId}>
            {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-sm text-text-muted" id={hintId}>
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
