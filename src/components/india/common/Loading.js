import React from 'react';

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-10 px-4">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6">
        {/* Form Group 1 */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={`field-${i}`} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-md w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Group 2 */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={`field2-${i}`} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-md w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-between mt-8">
          <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          <div className="h-10 bg-primary/20 rounded-md w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
