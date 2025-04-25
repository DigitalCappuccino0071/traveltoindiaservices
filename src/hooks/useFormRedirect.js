'use client';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from '@/context/formContext';

export const useFormRedirect = (currentStep, previousStep, nextStep) => {
  const router = useRouter();
  const { state } = useFormContext();

  // Memoize the state checks to prevent infinite loops
  const { shouldShowForm, shouldShowLoading } = useMemo(() => {
    // For step-one, show form if no formId or if formId exists but step not completed
    if (currentStep === 'step-one') {
      return {
        shouldShowForm: !state?.formId || (state?.formId && !state.steps.step1),
        shouldShowLoading: state?.formId && !state.steps.step1,
      };
    }

    // For other steps, show form only if formId exists and step not completed
    return {
      shouldShowForm:
        state?.formId && !state.steps[currentStep.replace('-', '')],
      shouldShowLoading:
        state?.formId && !state.steps[currentStep.replace('-', '')],
    };
  }, [state?.formId, state?.steps, currentStep]);

  useEffect(() => {
    // If no formId, show new form (for step-one)
    if (!state?.formId && currentStep === 'step-one') {
      return;
    }

    // If no formId, redirect to step one (for other steps)
    if (!state?.formId) {
      router.push('/visa/step-one');
      return;
    }

    // Check if previous step is completed
    if (previousStep && !state.steps[previousStep.replace('-', '')]) {
      router.push(`/visa/${previousStep}`);
      return;
    }

    // Check if current step is already completed
    if (state.steps[currentStep.replace('-', '')]) {
      router.push(`/visa/${currentStep}/update`);
      return;
    }

    // If we have a paid form, show payment status
    if (state.steps.step1 && state.steps.step2 && state.steps.step3) {
      return;
    }
  }, [state?.formId, state?.steps, currentStep, previousStep, router]);

  return { shouldShowForm, shouldShowLoading };
};
