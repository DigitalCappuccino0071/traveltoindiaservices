import { useFormContext } from '@/context/formContext';
import axiosInstance from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function usePostUserLogin({
  apiEndpointUrl,
  routeUrl,
  isDispatch = false,
  queryKey,
  successMessage,
}) {
  const queryClient = useQueryClient();
  const { dispatch } = useFormContext();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: formData => {
      return axiosInstance.post(apiEndpointUrl, formData);
    },
    onSuccess: data => {
      if (isDispatch) {
        dispatch({
          type: 'SET_FORM_ID',
          payload: data?.data?.data?._id,
        });
      }

      // pending document step 1,2,3,4,5
      if (data?.data?.data?.visaStatus === 'pending document') {
        dispatch({
          type: 'SET_MULTIPLE_STEPS_COMPLETED',
          payload: {
            step1: true,
            step2: true,
            step3: true,
            step4: true,
            step5: true,
          },
        });
      }

      // payment holdon

      if (data?.data?.data?.visaStatus === 'hold on') {
        dispatch({
          type: 'SET_MULTIPLE_STEPS_COMPLETED',
          payload: {
            step7: true,
          },
        });
      }

      // incomplete form

      if (data?.data?.data?.visaStatus === 'incomplete') {
        dispatch({
          type: 'SET_MULTIPLE_STEPS_COMPLETED',
          payload: {
            step1: true,
            step2: !!data?.data?.data?.step2,
            step3: !!data?.data?.data?.step3,
            step4: !!data?.data?.data?.step4,
            step5: !!data?.data?.data?.step5,
          },
        });
      }

      toast.success(successMessage ?? 'Form Submitted successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });

      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (routeUrl) {
        router.push(`${routeUrl}`);
      }
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
