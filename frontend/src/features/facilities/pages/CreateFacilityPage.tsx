import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'

import {
    Stepper,
    StepperNavigation,
} from '../../../shared/ui/stepper'

import { ROUTES } from '../../../shared/constants/routes'

import { FACILITY_STEPS } from '../constants/facilitySteps'

import {
    createFacilitySchema,
    type CreateFacilityFormValues,
} from '../schemas/facilitySchemas'

import CustomerInformationCard from '../components/CustomerInformationCard'
import FacilityDetailsCard from '../components/FacilityDetailsCard'
import CollateralCard from '../components/CollateralCard'
import DocumentsCard from '../components/DocumentCard'

import { createFacilityFormData } from '../utils/formData'
import { useCreateFacilityMutation } from '../api/facilityApi'






const CreateFacilityPage = () => {

    const methods =
        useForm<CreateFacilityFormValues>({
            resolver: zodResolver(createFacilitySchema),
            mode: 'onTouched',
        })

    const {
        trigger,
        handleSubmit,
    } = methods


    const [currentStep, setCurrentStep] = useState(0);

    const [createFacility, { isLoading }] =
        useCreateFacilityMutation()

    const navigate = useNavigate();


    const onSubmit = async (
        values: CreateFacilityFormValues,
    ) => {
        try {
            const formData =
                createFacilityFormData(values)

            await createFacility(formData).unwrap()

            navigate(
                ROUTES.rm.facilities,
                {
                    replace: true,
                },
            )
        } catch (error) {
            console.error(error)
        }
    }


    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CustomerInformationCard />

            case 1:
                return <FacilityDetailsCard />

            case 2:
                return <CollateralCard />

            case 3:
                return <DocumentsCard />

            default:
                return null
        }
    }


    const handleNext = async () => {
        const isLastStep =
            currentStep ===
            FACILITY_STEPS.length - 1

        if (isLastStep) {
            handleSubmit(onSubmit)()
            return
        }

        const valid =
            await trigger()

        if (valid) {
            setCurrentStep((step) => step + 1)
        }
    }


    const handleBack = () => {
        setCurrentStep((step) =>
            Math.max(step - 1, 0),
        )
    }

    return (
        <FormProvider {...methods}>
            <div className="space-y-8">

                <Stepper
                    steps={FACILITY_STEPS}
                    currentStep={currentStep}
                />

                {renderStep()}

                <StepperNavigation
                    isFirstStep={currentStep === 0}
                    isLastStep={
                        currentStep ===
                        FACILITY_STEPS.length - 1
                    }
                    onBack={handleBack}
                    onNext={handleNext}
                    isSubmitting={isLoading}
                />

            </div>
        </FormProvider>
    )
}

export default CreateFacilityPage;