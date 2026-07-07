import clsx from 'clsx'

import type { Step } from './types'

type StepperProps = {
  steps: Step[]
  currentStep: number
}

const Stepper = ({
  steps,
  currentStep,
}: StepperProps) => {
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed =
            index < currentStep

          const active =
            index === currentStep

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',

                    completed &&
                      'border-primary bg-primary text-white',

                    active &&
                      'border-primary text-primary',

                    !completed &&
                      !active &&
                      'border-border text-text-muted',
                  )}
                >
                  {completed
                    ? '✓'
                    : index + 1}
                </div>

                <p className="mt-2 text-sm font-medium">
                  {step.title}
                </p>

                {step.description && (
                  <p className="text-xs text-text-secondary">
                    {step.description}
                  </p>
                )}
              </div>

              {index !==
                steps.length - 1 && (
                <div
                  className={clsx(
                    'mx-3 h-0.5 flex-1',

                    completed
                      ? 'bg-primary'
                      : 'bg-border',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper