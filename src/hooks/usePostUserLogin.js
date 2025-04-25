import { useFormContext } from '@/context/formContext';
import axiosInstance from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function usePostUserLogin({
  apiEndpointUrl,
  isDispatch = false,
  queryKey,
  successMessage,
}) {
  const queryClient = useQueryClient();
  const { dispatch } = useFormContext();
  const mutation = useMutation({
    mutationFn: formData => {
      return axiosInstance.post(apiEndpointUrl, formData);
    },
    onSuccess: data => {
      console.log('data', data);
      const formId = data?.data?.data?._id;
      const visaStatus = data?.data?.data?.visaStatus;

      // Set form ID
      if (isDispatch) {
        dispatch({
          type: 'SET_FORM_ID',
          payload: formId,
        });
      }

      // Initialize steps based on form state
      const steps = {
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
        step6: false,
      };

      // Handle special cases
      if (visaStatus === 'pending document') {
        // For pending documents, set all steps up to step5 as completed
        steps.step1 = true;
        steps.step2 = true;
        steps.step3 = true;
        steps.step4 = true;
        steps.step5 = true;
      }

      // Update steps in context
      dispatch({
        type: 'SET_MULTIPLE_STEPS_COMPLETED',
        payload: steps,
      });

      // Save to localStorage immediately
      if (formId) {
        localStorage.setItem('formId', formId);
      }

      // Update steps in localStorage
      localStorage.setItem('formSteps', JSON.stringify(steps));

      // Wait for state updates to complete
      setTimeout(() => {
        console.log(
          'After setTimeout - formId in localStorage:',
          localStorage.getItem('formId')
        );
        console.log(
          'After setTimeout - steps in localStorage:',
          localStorage.getItem('formSteps')
        );

        toast.success(successMessage ?? 'Form Submitted successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });

        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }, 1000); // Increased timeout to ensure state updates are complete
    },
    onError: error => {
      console.error(error.message);

      toast.error(
        'An error occurred while processing your request. Please try again later.',
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        }
      );
    },
  });

  return mutation;
}
