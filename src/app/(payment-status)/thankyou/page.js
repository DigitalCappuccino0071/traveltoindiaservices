'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaHome,
  FaClipboardCheck,
  FaEnvelope,
  FaDownload,
  FaRedoAlt,
} from 'react-icons/fa';

export default function ThankyouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetriesReached, setMaxRetriesReached] = useState(false);

  const MAX_AUTO_RETRIES = 2;

  // Fetch application data with TanStack Query
  const {
    data: userData,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['getUserData', orderId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `${apiEndpoint.GET_VISA_STEP1_BY_ID}${orderId}`
        );

        return response;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!orderId,
    refetchOnWindowFocus: false,
    retry: 1,
    refetchInterval: data => {
      // Only auto-refresh twice if not paid yet
      if (!data?.data?.paid && retryCount < MAX_AUTO_RETRIES) {
        setRetryCount(prev => prev + 1);
        return 6000; // Check every 6 seconds
      }

      // Set flag when max retries reached
      if (retryCount >= MAX_AUTO_RETRIES && !maxRetriesReached) {
        setMaxRetriesReached(true);
      }

      return false; // Stop polling
    },
    staleTime: 10000,
    onSuccess: data => {
      if (data?.data?.paid) {
        setShowConfetti(true);
        toast.success('Payment successful!');
      }
    },
  });

  // Manual retry handler
  const handleManualRetry = () => {
    toast.info('Checking payment status...');
    setRetryCount(prev => prev + 1);
    refetch();
  };

  // Load confetti effect when payment is successful
  useEffect(() => {
    if (showConfetti) {
      import('canvas-confetti').then(confetti => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
          confetti.default({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FF4136', '#2ECC40', '#0074D9', '#FF851B', '#B10DC9'],
          });

          confetti.default({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FF4136', '#2ECC40', '#0074D9', '#FF851B', '#B10DC9'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      });
    }
  }, [showConfetti]);

  // Show loading state while initial data loads
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <ImSpinner2 className="w-12 h-12 text-primary animate-spin inline-block mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Verifying Your Payment
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we check your payment status...
          </p>

          {orderId && (
            <div className="bg-gray-100 rounded-lg p-3 mt-3 text-center">
              <p className="text-gray-500 text-sm">Application ID:</p>
              <p className="font-mono text-primary text-sm">{orderId}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show error state if application not found
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Application Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {!orderId
                ? 'Missing application ID. Please check your payment confirmation email for the correct link.'
                : `We couldn't find your application details. Please check your application ID.`}
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg"
              >
                <FaHome className="mr-2" /> Return to Home
              </Link>

              {orderId && (
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg"
                >
                  <FaSpinner className="mr-2" /> Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for payment confirmation in database
  if (isSuccess && !userData?.data?.paid) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-100 p-4 rounded-full">
                <ImSpinner2 className="w-10 h-10 text-yellow-500 animate-spin" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Processing Payment
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-yellow-700">
                {isFetching
                  ? 'Checking payment status...'
                  : maxRetriesReached
                  ? "We've checked your payment status twice but haven't seen confirmation from our payment processor yet."
                  : 'Your payment is being processed. This page will automatically check your payment status.'}
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-gray-700 font-medium">Application ID</p>
              <p className="font-mono text-primary">{orderId || 'N/A'}</p>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Status check attempts:{' '}
                  <span className="font-medium">{retryCount}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              {maxRetriesReached && (
                <button
                  onClick={handleManualRetry}
                  disabled={isFetching}
                  className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-150 disabled:opacity-70"
                >
                  {isFetching ? (
                    <>
                      <ImSpinner2 className="mr-2 animate-spin" /> Checking...
                    </>
                  ) : (
                    <>
                      <FaRedoAlt className="mr-2" /> Check Payment Status
                    </>
                  )}
                </button>
              )}

              <Link
                href="/"
                className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow transition duration-150 ${
                  !maxRetriesReached ? 'sm:mt-3' : ''
                }`}
              >
                <FaHome className="mr-2" /> Return Home
              </Link>
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
              {maxRetriesReached
                ? "If you've just completed your payment, it might take a moment to process. You can check again manually."
                : 'It may take a few moments for your payment to be processed. This page will update automatically.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - when payment is confirmed in database
  if (isSuccess && userData?.data?.paid) {
    const data = userData?.data || {};
    const paymentDate = new Date(
      data?.paymentDate || new Date()
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Standard success page
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="md:flex">
              <div className="p-8 md:p-12 bg-gradient-to-br from-primary to-primary/80 text-white md:w-2/5">
                <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mx-auto md:mx-0">
                  <FaCheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mt-6 text-center md:text-left">
                  Payment Successful!
                </h2>
                <p className="mt-4 opacity-90 text-center md:text-left">
                  Thank you for your India eVisa application. Your payment has
                  been confirmed.
                </p>
              </div>

              <div className="p-8 md:p-12 md:w-3/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Payment Receipt
                  </h3>
                  <button
                    onClick={() => window.print()}
                    className="text-primary hover:text-primary/80 flex items-center text-sm"
                  >
                    <FaDownload className="mr-1" /> Save Receipt
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600">
                    Hello{' '}
                    <span className="font-semibold text-primary">
                      {data?.step2?.firstName} {data?.step2?.lastName}
                    </span>
                    ,
                  </p>
                  <p className="text-gray-600 mt-2">
                    Your payment for India eVisa application has been
                    successfully processed. We've sent a confirmation email to{' '}
                    <span className="font-medium">{data?.emailId}</span>.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="text-gray-600">Application ID:</div>
                    <div className="font-mono font-semibold text-primary">
                      {orderId}
                    </div>

                    <div className="text-gray-600">Payment ID:</div>
                    <div
                      className="font-mono text-sm text-gray-800 truncate"
                      title={data?.paymentId}
                    >
                      {data?.paymentId
                        ? data.paymentId.substring(0, 18) + '...'
                        : 'N/A'}
                    </div>

                    <div className="text-gray-600">Status:</div>
                    <div className="bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded text-sm inline-block">
                      Paid
                    </div>

                    <div className="text-gray-600">Payment Date:</div>
                    <div className="text-gray-800">{paymentDate}</div>

                    <div className="text-gray-600">Amount Paid:</div>
                    <div className="text-gray-800 font-medium">
                      $
                      {data?.price?.toFixed(2) ||
                        data?.paymentAmount?.toFixed(2) ||
                        'N/A'}
                    </div>

                    <div className="text-gray-600">Payment Method:</div>
                    <div className="text-gray-800 capitalize">
                      {data?.paymentMethod || 'Credit Card'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/visa/application/${orderId}`}
                    className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-150 w-full"
                  >
                    <FaClipboardCheck className="mr-2" /> View Your Application
                  </Link>
                  <button
                    onClick={() => {
                      router.push('/');
                    }}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-150 w-full"
                  >
                    <FaHome className="mr-2" /> Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                What happens next?
              </h3>

              <div className="relative pl-8 space-y-10 before:absolute before:left-4 before:top-2 before:h-[calc(100%-20px)] before:w-0.5 before:bg-blue-100">
                <div className="relative">
                  <div className="absolute -left-8 top-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Application Review{' '}
                    <span className="text-sm text-blue-600 font-normal">
                      (1-2 days)
                    </span>
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Our team will review your application and supporting
                    documents for completeness and accuracy.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Processing{' '}
                    <span className="text-sm text-blue-600 font-normal">
                      (3-5 days)
                    </span>
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Your application will be processed by the Indian
                    authorities. Processing times vary based on visa type and
                    nationality.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Visa Approval
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Once approved, you'll receive your eVisa by email. You
                    should print this document and carry it when traveling to
                    India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-blue-500 w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Stay Updated
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                We'll send you email notifications at each stage of your
                application process. Make sure to check your inbox regularly.
              </p>
              <p className="text-sm text-gray-500">
                If you don't receive any emails, please check your spam folder
                or contact our support team.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-50 p-3 rounded-full mr-4">
                  <FaClipboardCheck className="text-green-500 w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Need Help?
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                If you have any questions about your application or need
                assistance, our support team is here to help.
              </p>
              <a
                href="mailto:support@example.com"
                className="text-primary hover:underline flex items-center"
              >
                <FaEnvelope className="mr-2" />
                support@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should never reach here
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ImSpinner2 className="w-12 h-12 text-primary animate-spin inline-block" />
        <p className="text-gray-600 mt-4">Loading application data...</p>
      </div>
    </div>
  );
}
