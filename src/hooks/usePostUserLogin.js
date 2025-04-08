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
          payload: data?.data?._id,
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
