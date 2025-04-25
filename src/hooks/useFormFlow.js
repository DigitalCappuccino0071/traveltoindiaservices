'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from '@/context/formContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';

export const useFormFlow = currentStep => {
  const router = useRouter();
  const { state, dispatch } = useFormContext();
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch form data
  const { data: formData, isLoading } = useQuery({
    queryKey: ['formData', state.formId],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
    retry: false,
  });

  useEffect(() => {
    // Initialize state from localStorage
    if (!isInitialized) {
      const storedFormId = localStorage.getItem('formId');
      const storedSteps = localStorage.getItem('formSteps');

      if (storedFormId) {
        dispatch({
          type: 'SET_FORM_ID',
          payload: storedFormId,
        });
      }

      if (storedSteps) {
        try {
          const parsedSteps = JSON.parse(storedSteps);
          Object.entries(parsedSteps).forEach(([step, completed]) => {
            if (completed) {
              dispatch({
                type: 'SET_STEP_COMPLETED',
                payload: step,
              });
            }
          });
        } catch (error) {
          console.error('Error parsing stored steps:', error);
        }
      }

      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    // If no formId, handle based on current step
    if (!state.formId) {
      if (currentStep === 'step-one') {
        return;
      }
      router.push('/visa/step-one');
      return;
    }

    // If form is paid, show payment status
    if (formData?.data?.step1Data?.paid) {
      return;
    }

    // Get current step key
    const stepKey = currentStep.replace('-', '');
    const isUpdatePage = window.location.pathname.includes('/update');

    // Handle step-one
    if (currentStep === 'step-one') {
      if (state.steps.step1 && !isUpdatePage) {
        router.push('/visa/step-one/update');
        return;
      }
    }

    // Handle step-two
    if (currentStep === 'step-two') {
      // If step1 is not completed, redirect to step-one
      if (!state.steps.step1) {
        router.push('/visa/step-one');
        return;
      }
      // If step2 is completed and not on update page, redirect to update
      if (state.steps.step2 && !isUpdatePage) {
        router.push('/visa/step-two/update');
        return;
      }
    }

    // Handle step-three
    if (currentStep === 'step-three') {
      // If step2 is not completed, redirect to step-two
      if (!state.steps.step2) {
        router.push('/visa/step-two');
        return;
      }
      // If step3 is completed and not on update page, redirect to update
      if (state.steps.step3 && !isUpdatePage) {
        router.push('/visa/step-three/update');
        return;
      }
    }

    // Handle step-four
    if (currentStep === 'step-four') {
      // If step3 is not completed, redirect to step-three
      if (!state.steps.step3) {
        router.push('/visa/step-three');
        return;
      }
      // If step4 is completed and not on update page, redirect to update
      if (state.steps.step4 && !isUpdatePage) {
        router.push('/visa/step-four/update');
        return;
      }
    }

    // Handle step-five
    if (currentStep === 'step-five') {
      // If step4 is not completed, redirect to step-four
      if (!state.steps.step4) {
        router.push('/visa/step-four');
        return;
      }
      // If step5 is completed and not on update page, redirect to update
      if (state.steps.step5 && !isUpdatePage) {
        router.push('/visa/step-five/update');
        return;
      }
    }

    // Handle step-six
    if (currentStep === 'step-six') {
      // If step5 is not completed, redirect to step-five
      if (!state.steps.step5) {
        router.push('/visa/step-five');
        return;
      }
      // If step6 is completed, redirect to step-seven (no update page for step-six)
      if (state.steps.step6) {
        router.push('/visa/step-seven');
        return;
      }
    }

    // Handle step-seven
    if (currentStep === 'step-seven') {
      // If step6 is not completed, redirect to step-six
      if (!state.steps.step6) {
        router.push('/visa/step-six');
        return;
      }
    }
  }, [state.formId, state.steps, currentStep, router, formData, isInitialized]);

  // Determine if we should show the form
  const shouldShowForm = () => {
    if (!isInitialized) return false;

    // If we're on an update page, show the form
    if (window.location.pathname.includes('/update')) {
      return true;
    }

    // For step-one
    if (currentStep === 'step-one') {
      return !state.formId || (state.formId && !state.steps.step1);
    }

    // For other steps
    const stepKey = currentStep.replace('-', '');
    return state.formId && !state.steps[stepKey];
  };

  // Determine if we should show loading
  const shouldShowLoading = () => {
    return !isInitialized || (state.formId && isLoading);
  };

  return {
    shouldShowForm: shouldShowForm(),
    shouldShowLoading: shouldShowLoading(),
    formData: formData?.data,
  };
};
