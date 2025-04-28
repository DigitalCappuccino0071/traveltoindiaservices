'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from '@/context/formContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';

export const useVisaApplication = currentStep => {
  const { state } = useFormContext();

  // Fetch form data
  const { data, isLoading, isError, error, isPending, isFetching, refetch } =
    useQuery({
      queryKey: [`formdata${currentStep}`],
      queryFn: () =>
        axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
      enabled: !!state.formId,
    });

  return {
    formData: data?.data || {},
    isLoading,
    isError,
    error,
    isPending,
    isFetching,
    refetch,
    formId: state.formId,
  };
};
