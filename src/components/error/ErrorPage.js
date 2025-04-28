'use client';
import React from 'react';
import Link from 'next/link';
import { BiErrorAlt } from 'react-icons/bi';

export default function ErrorPage({
  errorMessage,
  buttonText = 'Try Again',
  buttonLink = '/',
  refetch,
}) {
  return (
    <div className="container pt-32 pb-24">
      <div className="grid md:grid-cols-2 gap-10 items-center justify-between">
        <div className="md:order-2 flex justify-center">
          <BiErrorAlt className="text-red-500 w-64 h-64" />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold">Something Went Wrong</h2>
          <p className="text-xl">
            {errorMessage ||
              'We encountered an issue while processing your request. Please try again later or contact our support team if the problem persists.'}
          </p>
          <div className="py-8">
            {refetch ? (
              <button
                className="cursor-pointer w-fit items-center gap-3 rounded-lg font-semibold text-white bg-primaryMain px-8 py-3"
                onClick={() => refetch()}
              >
                {buttonText}
              </button>
            ) : (
              <Link href={buttonLink}>
                <button
                  className="cursor-pointer w-fit items-center gap-3 rounded-lg font-semibold text-white bg-primaryMain px-8 py-3"
                  type="submit"
                >
                  {buttonText}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
