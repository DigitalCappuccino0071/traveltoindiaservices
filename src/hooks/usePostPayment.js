import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function usePostPayment(
  apiEndpointUrl,
  successMessage,
  routeUrl,
  queryKey
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: formData => {
      return axiosInstance.put(apiEndpointUrl, formData);
    },
    onSuccess: async data => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      toast.success(successMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });

      if (routeUrl) {
        router.push(`${routeUrl}`);
      }
    },
    onError: error => {
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
