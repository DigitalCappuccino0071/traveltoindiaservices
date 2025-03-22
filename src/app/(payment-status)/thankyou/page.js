'use client';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { ImSpinner2 } from 'react-icons/im';
import Highlight from '@/components/common/Highlight';
import { FaCheckCircle } from 'react-icons/fa';

export default function ThankyouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const success = searchParams.get('success');

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

    if (!orderId || !success) {
      return notFound();
    }

    console.log('orderid available');

    if (!data.paid) return notFound();
    return (
      <div class="bg-gray-100 flex-1 pt-20">
        <div class="bg-white p-6  md:mx-auto">
          <FaCheckCircle class="text-green-600 w-16 h-16 mx-auto my-6" />
          <div class="text-center">
            <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">
              Payment Done!
            </h3>
            <p class="text-gray-600 my-2">
              Thank you{' '}
              <Highlight
                className="font-bold text-primary"
                text={data?.step2?.firstName}
              />{' '}
              for completing your secure online payment. Your order id is{' '}
              <Highlight
                className="font-bold text-primary"
                text={orderId || ''}
              />
            </p>
            <p> Have a great day! </p>
            <div class="py-10 text-center">
              <Link
                href="/"
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
