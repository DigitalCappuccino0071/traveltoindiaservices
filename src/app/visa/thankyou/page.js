'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import apiEndpoint from '@/services/apiEndpoint';
import { ImSpinner2 } from 'react-icons/im';
import { toast } from 'react-toastify';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');

  // Get parameters from URL
  const isSuccess = searchParams.get('success') === 'true';
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  // Query to get application data
  const {
    isPending,
    error,
    data: applicationData,
    refetch,
  } = useQuery({
    queryKey: ['getApplication', orderId],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_VISA_STEP1_BY_ID}${orderId}`),
    enabled: !!orderId,
  });

  // Effect to handle payment verification
  useEffect(() => {
    const verifyPayment = async () => {
      if (!isSuccess || !orderId || verificationAttempted) {
        return;
      }

      try {
        setVerificationAttempted(true);

        // First check if payment is already marked as paid in our system
        if (applicationData?.data?.paid) {
          console.log('Payment already verified in database');
          setVerificationStatus('success');
          return;
        }

        // If we have a session ID and the payment isn't already marked as paid, try manual verification
        if (sessionId) {
          console.log('Attempting manual payment verification');
          setVerificationStatus('verifying');

          const result = await axiosInstance.get(
            `api/v1/india-visa/payments/verify-payment/${sessionId}`
          );

          if (result.data.status === 'success') {
            setVerificationStatus('success');
            toast.success('Payment verified successfully');
            // Refresh application data
            refetch();
          } else {
            setVerificationStatus('failed');
            toast.error('Payment verification failed');
          }
        } else {
          // If no session ID but payment not in database, wait for webhook
          console.log(
            'No session ID available, waiting for webhook to process payment'
          );
          setVerificationStatus('waiting');

          // Set a timeout to check again after 5 seconds
          setTimeout(() => {
            refetch();
            setVerificationAttempted(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('error');
        toast.error('Error verifying payment');
      }
    };

    if (applicationData && isSuccess) {
      verifyPayment();
    }
  }, [
    applicationData,
    isSuccess,
    orderId,
    sessionId,
    verificationAttempted,
    refetch,
  ]);

  if (!isSuccess) {
    // If not a success redirect, send user back to step eight
    router.push('/visa/step-eight');
    return null;
  }

  if (isPending) {
    return (
      <div className="container py-16 text-center">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <ImSpinner2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          <h1 className="mb-4 text-2xl font-bold">Processing your payment</h1>
          <p>Please wait while we confirm your payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Error Loading Application
          </h1>
          <p className="mb-4">
            We couldn&apos;t find your application details.
          </p>
          <button
            onClick={() => router.push('/visa/step-eight')}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show different views based on payment status
  if (applicationData?.data?.paid) {
    return (
      <div className="container py-16 text-center">
        <div className="p-8 bg-green-50 rounded-lg shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 text-white bg-green-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-green-700">
            Payment Successful!
          </h1>
          <p className="mb-6 text-lg">
            Your India e-Visa application has been received and is now being
            processed.
          </p>

          <div className="p-4 mb-6 bg-white rounded-lg">
            <p className="text-lg font-semibold">
              Your Application ID:{' '}
              <span className="font-bold text-primary">{orderId}</span>
            </p>
            <p className="text-sm text-gray-600">
              Please keep this ID for future reference and status inquiries.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            You will receive a confirmation email shortly with further
            instructions.
          </p>

          <div className="mt-8">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment not confirmed yet
  return (
    <div className="container py-16 text-center">
      <div className="p-8 bg-gray-50 rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-blue-700">
          Payment Processing
        </h1>

        {verificationStatus === 'verifying' && (
          <>
            <ImSpinner2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <p className="mb-6">Verifying your payment...</p>
          </>
        )}

        {verificationStatus === 'waiting' && (
          <>
            <ImSpinner2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <p className="mb-6">Waiting for payment confirmation...</p>
            <p className="text-sm text-gray-600">
              This may take a moment. Please do not close this page.
            </p>
          </>
        )}

        {verificationStatus === 'failed' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-white bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="mb-6">
              We couldn&apos;t verify your payment automatically.
            </p>
            <p className="mb-4 text-sm">
              Your payment may still be processing. Please check your email for
              confirmation.
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setVerificationAttempted(false);
                  refetch();
                }}
                className="px-4 py-2 mx-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 mx-2 text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
              >
                Return Home
              </button>
            </div>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-white bg-red-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="mb-6">
              An error occurred while checking your payment status.
            </p>
            <p className="mb-4 text-sm">
              If you completed payment, please check your email for confirmation
              or contact support.
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setVerificationAttempted(false);
                  refetch();
                }}
                className="px-4 py-2 mx-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/visa/step-eight')}
                className="px-4 py-2 mx-2 text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
              >
                Return to Payment
              </button>
            </div>
          </>
        )}

        <div className="p-4 mt-8 text-left bg-gray-100 rounded-lg">
          <p className="font-semibold">
            Application ID:{' '}
            <span className="font-bold text-primary">{orderId}</span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
