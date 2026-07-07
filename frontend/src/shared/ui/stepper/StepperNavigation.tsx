import Button from '../button/Button'

type Props = {
  isFirstStep: boolean
  isLastStep: boolean

  onBack: () => void
  onNext: () => void

  isSubmitting?: boolean
}

const StepperNavigation = ({
  isFirstStep,
  isLastStep,
  onBack,
  onNext,
  isSubmitting = false,
}: Props) => {
  return (
    <div className="mt-10 flex justify-between">
      <Button
        // variant="outline"
        disabled={isFirstStep}
        onClick={onBack}
      >
        Back
      </Button>

      <Button
        onClick={onNext}
        isLoading={isSubmitting}
      >
        {isLastStep
          ? 'Create Facility'
          : 'Next'}
      </Button>
    </div>
  )
}

export default StepperNavigation