import { useFormContext } from '@/context/formContext';
import axiosInstance from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

// Use the appropriate Stripe key based on environment
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
);

export default function useVisaBookingPaymentPost({
  apiEndpointUrl,
  isDispatch = false,
  routeUrl = false,
  queryKey,
  successMessage,
}) {
  const queryClient = useQueryClient();
  const { dispatch } = useFormContext();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async formData => {
      // Add additional metadata for better tracking
      const enhancedFormData = {
        ...formData,
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      try {
        const response = await axiosInstance.post(
          apiEndpointUrl,
          enhancedFormData
        );
        return response;
      } catch (error) {
        console.error('Payment API error:', error);

        // Enhance error details for better debugging
        if (error.response) {
          throw new Error(
            `Server error: ${error.response.status} - ${
              error.response.data?.message || 'Unknown error'
            }`
          );
        } else if (error.request) {
          throw new Error('Network error: No response received from server');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
    },

    onSuccess: async data => {
      try {
        if (!data?.data?.session?.id) {
          throw new Error('Invalid session data received from server');
        }

        const stripe = await stripePromise;

        // Redirect to checkout and handle result
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.data.session.id,
        });

        if (error) {
          console.error('Stripe redirect error:', error);
          throw new Error(error.message);
        }

        // This code runs after successful redirect - but likely won't execute
        // since the page will redirect away
        if (isDispatch) {
          dispatch({
            type: 'SET_FORM_ID',
            payload: data?.data?._id,
          });
        }

        queryClient.invalidateQueries({ queryKey: [queryKey] });

        if (routeUrl) {
          router.push(`${routeUrl}`);
        }
      } catch (stripeError) {
        console.error('Stripe processing error:', stripeError);
        toast.error(`Payment processing error: ${stripeError.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
        });
      }
    },

    onError: error => {
      console.error('Payment mutation error:', error.message);

      toast.error(
        `Payment setup failed: ${error.message}. Please try again later.`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
        }
      );
    },
  });

  return mutation;
}
