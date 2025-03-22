'use client';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { ImSpinner2 } from 'react-icons/im';
import Highlight from '@/components/common/Highlight';
import { MdCancel } from 'react-icons/md';

export default function CancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const cancel = searchParams.get('cancel');

  const {
    isPending,
    error,
    data: userData,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['getUserData'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_VISA_STEP1_BY_ID}${orderId}`),
    enabled: !!orderId,
  });

  if (!orderId || !cancel) {
    return notFound();
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full pt-24">
        <ImSpinner2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isSuccess) {
    const { data } = userData;

    return (
      <div class="bg-gray-100 flex-1 pt-20">
        <div class="bg-white p-6  md:mx-auto">
          <MdCancel class="text-red-600 w-16 h-16 mx-auto my-6" />

          <div class="text-center">
            <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">
              Payment is Cancelled!
            </h3>
            <p class="text-gray-600 my-2">
              Unfortunately, your payment has been cancelled. Your order ID is{' '}
              <Highlight
                className="font-bold text-primary"
                text={orderId || ''}
              />{' '}
              and the name on the order is{' '}
              <Highlight
                className="font-bold text-primary"
                text={data?.step2?.firstName}
              />
              . If you have any questions, please contact our support team or go
              back to the payment page.
            </p>
            <p> Have a great day! </p>
            <div class="py-10 text-center">
              <Link
                href={data?.lastExitStepUrl ?? '/'}
                class="px-12  bg-primary hover:bg-primary/80 text-white font-semibold py-3"
              >
                GO BACK
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
