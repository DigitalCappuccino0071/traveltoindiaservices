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

      // Display success toast
      toast.success(`step ${step} completed successfully`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });

      // Invalidate queries if needed
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }

      // Prioritize the next step navigation
      if (routeUrl) {
        console.log('Redirecting to:', routeUrl);

        // Force redirect to the next step with a small delay to ensure state updates complete
        setTimeout(() => {
          router.push(routeUrl);
        }, 100);
      }
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
