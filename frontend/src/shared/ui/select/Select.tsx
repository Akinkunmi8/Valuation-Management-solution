import { clsx } from 'clsx'
import type { SelectHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { FiChevronDown } from 'react-icons/fi'

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label?: string
  labelClassName?: string
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, disabled, error, hint, id, label, labelClassName, options, placeholder, required, ...props },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const hintId = hint ? `${selectId}-hint` : undefined
    const errorId = error ? `${selectId}-error` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label ? (
          <label className={`mb-1.5 block text-sm font-semibold  ${labelClassName ||'text-text-primary' }`} htmlFor={selectId}>
            {label}
            {required ? <span className="ml-1 text-danger">*</span> : null}
          </label>
        ) : null}

        <div className="relative">
          <select
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : undefined}
            className={clsx(
              'h-10 w-full appearance-none rounded-lg border bg-surface px-3 pr-10 text-sm text-text-primary outline-none transition disabled:cursor-not-allowed disabled:bg-background disabled:text-text-muted',
              error
                ? 'border-danger focus:border-danger focus:ring-danger/20'
                : 'border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20',
              className,
            )}
            disabled={disabled}
            id={selectId}
            ref={ref}
            required={required}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option disabled={option.disabled} key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          />
        </div>

        {error ? (
          <p className="mt-1.5 text-sm font-medium text-danger" id={errorId}>
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

Select.displayName = 'Select'

export default Select
