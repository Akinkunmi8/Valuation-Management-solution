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

import { FACILITY_STEP_FIELDS } from '../constants/facilityStepFields'

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
import { useAppSelector } from '@/app/store/hooks'
import { notify } from '@/shared/lib/toast'




const CreateFacilityPage = () => {

    const {
        email,
        solId,
    } = useAppSelector(
        (state) => state.auth,
    )

    const createdBy =
        email!
    // const createdBy =

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
            const formData = createFacilityFormData(values,
                {
                    createdBy,
                    solId: solId!,
                },
            )

            await createFacility(formData).unwrap()
            notify.success("Facility Created Successfully");

            navigate(
                ROUTES.rm.facilities,
                {
                    replace: true,
                },
            )
        } catch (error) {
            console.log(error)
            notify.error("Error Creating Facility");
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

        const valid = await trigger(
            FACILITY_STEP_FIELDS[currentStep]
        )

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