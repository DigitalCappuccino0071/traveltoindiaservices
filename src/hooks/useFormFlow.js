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
    queryKey: [`formdata${currentStep}`],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
    retry: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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

    const isUpdatePage = window.location.pathname.includes('/update');
    const stepKey = currentStep.replace('-', '');
    const currentStepNumber = parseInt(currentStep.split('-')[1]);

    // Handle redirects based on step completion
    const handleRedirect = () => {
      // For step-one
      if (currentStep === 'step-one' && state.steps.step1 && !isUpdatePage) {
        router.push('/visa/step-one/update');
        return;
      }

      // For other steps
      if (currentStepNumber > 1) {
        const previousStep = `step${currentStepNumber - 1}`;
        if (!state.steps[previousStep]) {
          router.push(`/visa/step-${currentStepNumber - 1}`);
          return;
        }
      }

      // Handle completed steps
      if (state.steps[stepKey] && !isUpdatePage) {
        if (currentStep === 'step-six') {
          router.push('/visa/step-seven');
        } else {
          router.push(`/visa/${currentStep}/update`);
        }
      }
    };

    handleRedirect();
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
