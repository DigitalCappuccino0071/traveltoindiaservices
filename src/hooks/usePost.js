import { useFormContext } from '@/context/formContext';
import axiosInstance from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function usePost(
  apiEndpointUrl,
  step,
  routeUrl,
  isDispatch = false,
  queryKey
) {
  const queryClient = useQueryClient();
  const { dispatch } = useFormContext();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: formData => {
      return axiosInstance.post(apiEndpointUrl, formData);
    },
    onSuccess: data => {
      console.log('Post success data:', data?.data);

      // Set formId and mark step as completed
      if (isDispatch) {
        console.log('Setting formId:', data?.data?._id);
        dispatch({
          type: 'SET_FORM_ID',
          payload: data?.data?._id,
        });
      }

      dispatch({
        type: 'SET_STEP_COMPLETED',
        payload: `step${step}`,
      });

      // Save to localStorage immediately
      if (data?.data?._id) {
        localStorage.setItem('formId', data.data._id);
      }

      const currentSteps = JSON.parse(
        localStorage.getItem('formSteps') || '{}'
      );
      currentSteps[`step${step}`] = true;
      localStorage.setItem('formSteps', JSON.stringify(currentSteps));

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

        toast.success(`step ${step} completed successfully`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });

        if (queryKey) {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        }

        if (routeUrl) {
          console.log('Redirecting to:', routeUrl);
          // Force a hard navigation to ensure the page reloads
          window.location.href = routeUrl;
        }
      }, 1000); // Increased timeout to ensure state updates are complete
    },
    onError: error => {
      console.error('Post error:', error);
      toast.error('An error occurred while submitting the form', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    },
  });

  return mutation;
}
