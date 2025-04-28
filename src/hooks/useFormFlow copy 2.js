'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from '@/context/formContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';

export const useFormFlow = currentStep => {
  const { state, dispatch } = useFormContext();

  // Fetch form data
  const { data, isLoading, isError, error, isPending, refetch } = useQuery({
    queryKey: [`formdata${currentStep}`],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
    // retry: false,
    // staleTime: 0,
    // gcTime: 0,
  });

  return {
    formData: data?.data,
    isLoading,
    isError,
    error,
    isPending,
    refetch,
    formId: state.formId,
  };
};
