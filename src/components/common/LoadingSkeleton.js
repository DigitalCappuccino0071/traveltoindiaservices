'use client';

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse pt-20">
      {/* Banner Skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Note Text Skeleton */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded" />
      </div>

      {/* Form Container */}
      <div className="max-w-4xl px-5 py-4 mx-auto md:px-12">
        {/* Form Fields */}
        <div className="space-y-6">
          {/* Application Type */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Passport Type */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Port of Arrival */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Email Fields */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Visa Service Section */}
          <div className="space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full" />
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Expected Date of Arrival */}
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <div className="h-12 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
