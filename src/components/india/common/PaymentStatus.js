'use client';

import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentStatus() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center bg-gray-50">
      <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
          <FaCheck className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Payment Successful!
        </h2>

        <p className="mb-6 text-gray-600">
          Your form has been submitted successfully and is now being processed.
        </p>

        <div className="p-4 mb-6 text-sm border rounded-md border-blue-100 bg-blue-50 text-blue-700">
          <p>To check your application status, please visit the home page.</p>
        </div>

        <Link
          href="/"
          className="inline-block w-full px-6 py-3 text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary/90"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
