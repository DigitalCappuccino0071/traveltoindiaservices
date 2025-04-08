import axiosInstance from '@/services/api';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function useUpdatePatch(
  apiEndpointUrl,
  updateId,
  step,
  routeUrl,
  refetch,
  queryKey
) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const updateMutation = useMutation({
    mutationFn: formData => {
      return axiosInstance.put(`${apiEndpointUrl}/${updateId}`, formData);
    },
    onSuccess: data => {
      toast.success(`step ${step} Updated successfully`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 500,
      });
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['getAllStepsData'] });
      }
      // queryClient.invalidateQueries({ queryKey: [queryKey] });
      router.refresh();
      if (routeUrl) {
        router.push(`${routeUrl}`);
      }
      if (refetch) {
        refetch();
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
    enabled: !!updateId,
  });

  return updateMutation;
}
