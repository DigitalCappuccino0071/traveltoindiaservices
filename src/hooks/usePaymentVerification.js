import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * DEPRECATED: This hook is maintained for backward compatibility only.
 * The thank you page now handles verification directly.
 */
export default function usePaymentVerification(
  sessionId,
  orderId,
  apiEndpoint
) {
  // Use TanStack Query for a cleaner approach to data fetching
  const {
    data: paymentData,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['paymentVerification', sessionId, orderId],
    queryFn: async () => {
      if (!sessionId && !orderId) {
        throw new Error('Session ID or Order ID is required for verification');
      }

      // Construct the verification URL
      const verificationUrl = `${apiEndpoint}/api/v1/india-visa/payments/verify-payment?sessionId=${sessionId}${
        orderId ? `&orderId=${orderId}` : ''
      }`;

      console.log('Verifying payment with:', verificationUrl);
      const response = await axios.get(verificationUrl);
      return response.data;
    },
    enabled: !!(sessionId || orderId),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Determine verification status based on query results
  let verificationStatus = 'pending';
  if (isLoading) verificationStatus = 'loading';
  if (isError) verificationStatus = 'error';
  if (isSuccess && paymentData?.status === 'success')
    verificationStatus = 'success';

  return {
    verificationStatus,
    paymentData: paymentData?.data || null,
    error: error || null,
    isLoading,
    isSuccess,
    refetch,
  };
}
