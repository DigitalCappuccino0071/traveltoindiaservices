'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ImSpinner2 } from 'react-icons/im';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaHome,
} from 'react-icons/fa';

import usePaymentVerification from '@/hooks/usePaymentVerification';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  const {
    verificationStatus,
    paymentData,
    error,
    retryCount,
    verifyPayment,
    redirectToApplication,
  } = usePaymentVerification(
    sessionId,
    orderId,
    process.env.NEXT_PUBLIC_API_URL
  );

  // Rendering logic based on the success parameter
  if (success !== 'true') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Unsuccessful
            </h1>
            <p className="text-gray-600 mb-6">
              It seems there was an issue with your payment. Please try again or
              contact support.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg"
            >
              <FaHome className="mr-2" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Status alert component
  const StatusAlert = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <FaCheckCircle className="text-green-500 mr-3 mt-0.5" />
              <p className="text-green-700">
                Payment successful! Your application has been received.
              </p>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <FaExclamationTriangle className="text-red-500 mr-3 mt-0.5" />
              <p className="text-red-700">
                {error ||
                  "We couldn't verify your payment. Please contact support."}
              </p>
            </div>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <ImSpinner2 className="animate-spin text-blue-500 mr-3 mt-0.5" />
              <p className="text-blue-700">
                Verifying your payment... (Attempt {retryCount + 1})
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Thank You for Your Payment
            </h1>

            <StatusAlert />

            {verificationStatus === 'pending' && (
              <div className="flex justify-center my-6">
                <ImSpinner2 className="animate-spin text-primary text-3xl" />
              </div>
            )}

            <p className="text-gray-600 mb-6">
              {verificationStatus === 'success'
                ? 'Your India eVisa application has been submitted successfully. We will process your application and send you updates via email.'
                : 'We are processing your payment. Please wait while we verify your transaction.'}
            </p>

            <div className="mt-6">
              {verificationStatus === 'success' && (
                <button
                  onClick={redirectToApplication}
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg"
                >
                  <FaArrowRight className="mr-2" /> View Your Application
                </button>
              )}

              {verificationStatus === 'error' && (
                <button
                  onClick={verifyPayment}
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg"
                >
                  Retry Verification
                </button>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
              Application ID: <span className="font-mono">{orderId}</span>
              {sessionId && (
                <div className="mt-1">
                  Session ID: <span className="font-mono">{sessionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
