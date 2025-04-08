import axiosInstance from '@/services/api';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function useDelete(
  apiEndpointUrl,
  refetch,
  queryKey,
  successMessage,
  routeUrl
) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: deleteId => {
      return axiosInstance.delete(`${apiEndpointUrl}/${deleteId}`);
    },
    onSuccess: data => {
      toast.success(successMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 500,
      });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      router.refresh();
      if (refetch) {
        refetch();
      }
      if (routeUrl) {
        router.push(routeUrl);
      }
    },
    onError: error => {
      toast.error(
        'An error occurred while processing your request. Please try again later.',
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 500,
        }
      );
    },
    // enabled: !!deleteId,
  });

  return deleteMutation;
}
