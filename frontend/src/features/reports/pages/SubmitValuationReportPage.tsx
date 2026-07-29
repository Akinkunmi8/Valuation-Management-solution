import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Stepper,
    StepperNavigation,
} from "@/shared/ui/stepper";

import {
    reportSchema,
    type ReportFormValues,
} from "../schemas/reportSchemas";

import {
    REPORT_STEPS,
} from "../constants/reportSteps";

import {
    REPORT_STEP_FIELDS,
} from "../constants/reportStepFields";

import PropertyInformationCard from "../components/PropertyInformationCard";
import ValuationInformationCard from "../components/ValuationInformationCard";
import ComparableSalesCard from "../components/ComparableSalesCard";
import UploadReportCard from "../components/UploadReportCard";
import { useGetFacilityDetailsQuery } from "@/features/facilities/api/facilityApi";
import { useCurrentValuer } from "@/valuer/hooks/useCurrentValuer";
import { useNavigate, useParams } from "react-router";
import { mapFacilityToReportForm } from "../mappers/mapFacilityToReportForm";
import { AppLoader } from "@/shared/ui/loader";
import { createReportFormData } from "../utils/createReportFormData";
import {
    useSubmitValuationReportMutation,
    useEditResubmitValuationReportMutation
} from "../api/reportApi";
import { notify } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/constants/routes";




const SubmitValuationReportPage = () => {

    const navigate = useNavigate();

    const isResubmission = false;

    const methods =
        useForm<ReportFormValues>({
            resolver: zodResolver(reportSchema),
            mode: "onTouched",
        });

    const {
        reset,
        trigger,
        handleSubmit,
    } = methods;

    const { facilityReference } = useParams();

    const {
        data: facility,
        isLoading: facilityLoading,
        isError
    } = useGetFacilityDetailsQuery(
        facilityReference!,
    );

    const { currentValuer, isLoading: valuerLoading } =
        useCurrentValuer();


    useEffect(() => {

        if (!facility || !currentValuer) {
            return;
        }

        reset({
            ...mapFacilityToReportForm(
                facility,
                currentValuer,
            ),

            valuationReport: undefined as unknown as File,
        });

    }, [
        facility,
        currentValuer,
        reset,
    ]);

    const [
        submitReport,
        {
            isLoading: submitting,
        },
    ] =
        useSubmitValuationReportMutation();

    const [
        resubmitReport,
        {
            isLoading: resubmitting,
        },
    ] =
        useEditResubmitValuationReportMutation();

    const [currentStep, setCurrentStep] =
        useState(0);

    const renderStep = () => {

        switch (currentStep) {

            case 0:
                return <PropertyInformationCard />;

            case 1:
                return <ValuationInformationCard />;

            case 2:
                return <ComparableSalesCard />;

            case 3:
                return <UploadReportCard />;

            default:
                return null;
        }
    };

    const handleNext = async () => {

        const isLastStep =
            currentStep === REPORT_STEPS.length - 1;

        if (isLastStep) {

            handleSubmit(onSubmit)();

            return;
        }

        const valid =
            await trigger(
                REPORT_STEP_FIELDS[currentStep],
            );

        if (valid) {
            setCurrentStep(step => step + 1);
        }
    };

    const handleBack = () => {

        setCurrentStep(step =>
            Math.max(step - 1, 0),
        );

    };

    const onSubmit = async (
        values: ReportFormValues,
    ) => {

        try {

            const formData =
                createReportFormData(values);

            if (isResubmission) {

                await resubmitReport({

                    facilityReference:
                        values.facilityReference,

                    formData,

                }).unwrap();

                notify.success(
                    "Report Resubmitted Successfully",
                );

            } else {

                await submitReport(
                    formData,
                ).unwrap();

                notify.success(
                    "Report Submitted Successfully",
                );

            }

            navigate(
                ROUTES.valuer.dashboard,
            );

        } catch (error) {

            notify.apiError(
                error,
                isResubmission
                    ? "Unable to Resubmit Report"
                    : "Unable to Submit Report",
            );

        }

    };


    if (
        facilityLoading || valuerLoading
    ) {
        return <AppLoader />;
    }

    if (
        isError || !facility
    ) {
        return (
            <div>
                Unable to load facility.
            </div>
        );
    }

    return (

        <FormProvider {...methods}>

            <div className="space-y-8">

                <Stepper
                    steps={REPORT_STEPS}
                    currentStep={currentStep}
                />

                {renderStep()}

                <StepperNavigation
                    isFirstStep={currentStep === 0}
                    isLastStep={
                        currentStep === REPORT_STEPS.length - 1
                    }
                    onBack={handleBack}
                    onNext={handleNext}
                    isSubmitting={
                        submitting || resubmitting
                    }
                />
            </div>

        </FormProvider>
    );
};

export default SubmitValuationReportPage;