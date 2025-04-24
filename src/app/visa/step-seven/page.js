'use client';
import BannerPage from '@/components/india/common/BannerPage';
import { useFormContext } from '@/context/formContext';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { CldImage } from 'next-cloudinary';
import { format } from 'date-fns';
import Loading from '@/components/india/common/Loading';
import useUpdate from '@/hooks/useUpdate';
import PaymentStatus from '@/components/india/common/PaymentStatus';

const StepSeven = () => {
  const pathName = usePathname();
  const { state } = useFormContext();
  const router = useRouter();

  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const {
    isPending,
    error,
    data: getAllStepsData,
    isSuccess: getAllStepsDataIsSuccess,
    refetch,
  } = useQuery({
    queryKey: ['getAllStepsData7'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
  });

  const temporaryExitUpdateMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP1_LAST_EXIT_STEP_URL,
    state.formId,
    'temporary step 7 saved successfully',
    '/',
    refetch
  );

  const handleTemporaryExit = () => {
    temporaryExitUpdateMutation.mutate({
      lastExitStepUrl: pathName,
    });
    localStorage.clear();
  };

  useEffect(() => {
    if (!state?.formId) {
      router.push('/visa/step-one');
      return;
    }

    if (error && error?.response?.status !== 404) {
      console.log('error', error);
      router.push('/visa/step-seven');
      return;
    }

    if (getAllStepsDataIsSuccess) {
      if (!getAllStepsData?.data?.step6Data) {
        router.push('/visa/step-six');
        return;
      }

      if (getAllStepsData?.data?.step1Data?.paid) {
        return <PaymentStatus />;
      }
    }
  }, [state?.formId, error, getAllStepsDataIsSuccess, getAllStepsData, router]);

  if (isPending) {
    return <Loading />;
  }

  // if (getAllStepsDataIsSuccess && getAllStepsData?.data?.step6Data) {
  const { step1Data, step2Data, step3Data, step4Data, step5Data, step6Data } =
    getAllStepsData.data;

  return (
    <div>
      <BannerPage heading="E-VISA APPLICATION FORM" />

      <div className="container py-12 text-sm">
        <h2 className="py-3 text-lg font-semibold text-center text-white rounded-t bg-secondary">
          Confirm Details
        </h2>

        <div className="flex px-4 pt-5">
          <div className="space-y-3">
            <p className="font-bold text-center">
              The applicant is requested to verify the particulars filled in the
              application Form. The applicant may face legal action (including
              refusal to enter India or deportation) in case of provision of
              wrong information.
            </p>
            <p className="text-center">
              Please verify your Registration Details. If all details are
              correct please Press{' '}
              <span className="text-primary">
                &quot;Verified and Continue&quot;.
              </span>
            </p>
            <p className="text-center">
              For any corrections press{' '}
              <span className="text-primary">&quot;Modify/Edit&quot;</span>
            </p>
            <p className="text-center">
              Please note down the Temporary Application ID:
              <span className="text-primary">{state?.formId}</span>
            </p>
          </div>
          {step6Data ? (
            // <Image
            //   src={step6Data?.profilePicture}
            //   width={140}
            //   height={100}
            //   className="object-cover"
            //   alt="profile picture"
            // />
            <CldImage
              width="100"
              height="100"
              className="rounded-md"
              src={`${step6Data?.profilePicture}`}
              sizes="100vw"
              alt="profile image"
            />
          ) : null}
        </div>

        <div className="px-4 pt-5">
          <h2 className="text-3xl font-semibold">Applicant Detail</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                FirstName
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.firstName}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                LastName
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.lastName}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you ever changed your name? *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.changedName ? 'YES' : 'NO'}
              </p>
            </div>
            {step2Data?.changedName ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Previous Name
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  <span> {step2Data?.previousName}</span>
                  <span> {step2Data?.previousLastName}</span>
                </p>
              </div>
            ) : null}
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Gender
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                gender
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Date of Birth*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {formatDate(step1Data?.dateOfBirth)}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Town/City of birth*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.townCityOfBirth}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Country of birth*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.countryRegionOfBirth}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Citizenship/National Id No.*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.citizenshipNationalID}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Religion
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.religion}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Visible identification marks*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.visibleIdentificationMarks}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Educational Qualification *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.educationalQualification}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Nationality*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.nationalityRegion}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Did you acquire Nationality by birth or by By Birth
                naturalization? *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.acquireNationality}
              </p>
            </div>
            {step2Data?.acquireNationality === 'naturalization' && (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Previous Nationality
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step2Data?.previousNationality}
                </p>
              </div>
            )}
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you lived for at least two years in the country where you
                are applying visa?
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.haveLivedInApplyingCountry}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-10 ">
          <h2 className="text-3xl font-semibold">Passport Details</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Passport Number *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.passportNumber}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Place of Issue *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.placeOfIssue}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Date of Issue *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {formatDate(step2Data?.dateOfIssue)}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Date of Expiry *
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {formatDate(step2Data?.dateOfExpiry)}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Any other valid Passport/Identity Certificate (IC) held,
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step2Data?.anyOtherPassport}
              </p>
            </div>
            {step2Data?.anyOtherPassport === 'yes' && (
              <>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Country of Issue
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step2Data?.countryOfIssue}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Passport/IC No.
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step2Data?.passportICNumber}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Date of Issue*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {formatDate(step2Data?.dateOfIssuePassportIC)}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Place of Issue
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step2Data?.placeOfIssuePassportIC}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Nationality mentioned therein
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step2Data?.passportNationalityMentionedTherein}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">
            Applicant&apos;s Address Details
          </h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                House No./Street*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.houseNoStreet}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Village/Town/City*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.villageTownCity}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                State/Province/District*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.stateProvinceDistrict}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Postal/Zip Code
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.postalZipCode}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Country*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.country}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Phone No.
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.phoneNo}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Mobile No.
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.mobileNo}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Email Address
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.emailAddress}
              </p>
            </div>

            <div className="pt-5 text-2xl font-semibold text-primary">
              Permanent Address
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                House No./Street*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.permanentAddressHouseNoStreet}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Village/Town/City*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.permanentAddressVillageTownCity}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                State/Province/District*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.permanentAddressStateProvinceDistrict}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">Father's Details</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Name*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.fatherFullName}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Nationality*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.fatherNationality}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Previous Nationality
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.fatherPreviousNationality}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Place of Birth
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.fatherPlaceOfBirth}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Country of birth*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.fatherCountry}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">Mother's Details</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Name*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.motherFullName}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Nationality*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.motherNationality}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Previous Nationality
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.motherPreviousNationality}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Place of birth*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.motherPlaceOfBirth}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Country of birth*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.motherCountryOfBirth}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">Spouse Details</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Applicant&apos;s Marital Status
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.applicantMaritalStatus}
              </p>
            </div>

            {step3Data?.applicantMaritalStatus === 'married' ? (
              <>
                {' '}
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Name*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.spouseFullName}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Nationality*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.spouseNationality}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Previous Nationality
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.spousePreviousNationality}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Place of birth*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.spousePlaceOfBirth}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Country of birth*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.spouseCountryOfBirth}
                  </p>
                </div>
              </>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Were your parents/Grandparents (paternal/maternal) Pakistan
                Nationals or belong to Pakistan held area.
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.parentsPakistanNational}
              </p>
            </div>

            {step3Data?.parentsPakistanNational === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  If Yes, give details*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step3Data?.parentDetails}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">
            Profession/Occupation Details of Applicant
          </h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Present Occupation*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.presentOccupation}
              </p>
            </div>
            {step3Data?.presentOtherOccupation === null ? (
              ''
            ) : (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Present Occupation*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step3Data?.presentOccupation}
                </p>
              </div>
            )}
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Employer Name/business*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.employerName}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Designation
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.designation}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Address
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.address}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Phone
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.applicantPhone}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Past Occupation, if any
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.pastOccupationIfAny}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Are/were you in a Military?Semi-Military/Police /Security
                Organization?
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step3Data?.militaryOrganization}
              </p>
            </div>
            {step3Data?.militaryOrganization === 'yes' ? (
              <>
                {' '}
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Organization*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.organization}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Designation
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.militaryDesignation}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Rank
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.militaryRank}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Place of Posting
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step3Data?.placeOfPosting}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">Details of Visa Sought</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Type of Visa*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.visaType}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Visa Service*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.visaService}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Contact No.
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.contactNo}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Places to be Visited 1*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.placesToVisit}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Places to be Visited 2*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.placesToVisit2}
              </p>
            </div>
            {step4Data?.bookedHotel === 'yes' ? (
              <>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Name of the tour operator
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step4Data?.bookedHotelTourOperatorName}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Address of the tour operator
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step4Data?.bookedHotelTourOperatorAddress}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Name of Hotel/Resort etc.
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step4Data?.bookedHotelName}
                  </p>
                </div>
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Place/City of Hotel/Resort etc.
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step4Data?.bookedHotelPlace}
                  </p>
                </div>
              </>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Duration of Visa*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.durationOfVisa}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                No. of Entries*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.numberOfEntries}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                portOfArrival
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.portOfArrival}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                expectedPortOfExit
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.expectedPortOfExit}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Visa Service Selected
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.visaServiceSelectedValueValidation}
              </p>
            </div>
          </div>
        </div>

        {step4Data?.visitedIndiaBefore === 'yes' ? (
          <div className="px-4 pt-10">
            <h2 className="text-3xl font-semibold">
              Previous Visa/Currently valid Visa Details
            </h2>
            <hr className="w-full h-1 text-primary bg-primary" />

            <div className="space-y-2 divide-y-[1px] pt-5">
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Have you ever visited India before?
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBefore}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Address
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBeforeVisaAddress}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Cities previously visited in India
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBeforeCitiesVisitedInIndia}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Last Indian Visa no./Currently valid Indian Visa no.
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBeforeLastIndianVisaNo}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Type of Visa
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBeforeTypeOfVisa}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Place of Issue
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBeforePlaceOfIssue}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Date of Issue
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.visitedIndiaBeforeDateOfIssue}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 border-t mx-4">
          <h2 className="py-1 text-sm font-semibold text-secondary">
            Have you ever visited India before?
          </h2>
          <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
            {step4Data?.permissionRefused}
          </p>
        </div>

        {step4Data?.permissionRefused === 'yes' ? (
          <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 border-t mx-4">
            <h2 className="py-1 text-sm font-semibold text-secondary">
              when and by whom (Mention Control No. and date also)
            </h2>
            <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
              {step4Data?.refusalDetails}
            </p>
          </div>
        ) : null}

        {step1Data?.visaService === 'eMEDICAL VISA' ? (
          <div className="px-4 pt-10">
            <h2 className="text-3xl font-semibold">
              Details of Purpose{' '}
              <span className="text-lg">
                (SHORT TERM MEDICAL TREATMENT OF SELF)
              </span>
            </h2>
            <hr className="w-full h-1 text-primary bg-primary" />
            <div className="space-y-2 divide-y-[1px] pt-5">
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Name Of Hospital
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalNameOfHospital}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Address Of Hospital
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAddressOfHospital}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Phone Of Hospital
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalPhoneOfHospital}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  State Of Hospital
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalStateOfHospital}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  District Of Hospital
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalDistrictOfHospital}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Type Of Medical Treatment
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalTypeOfMedicalTreatment}
                </p>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {step1Data?.visaService === 'eCONFERENCE VISA' ? (
          <div className="px-4 pt-10">
            <h2 className="text-3xl font-semibold">
              Details of Purpose{' '}
              <span className="text-lg">
                (TO ATTEND A CONFERENCE/SEMINAR/WORKSHOP ORGANIZED BY A MINISTRY
                OR DEPARTMENT OF THE GOVERNMENT OF INDIA,STATE GOVERNMENTS OR UT
                ADMINISTRATIONS AND THEIR SUBORDINATE/ ATTACHED ORGANIZATIONS
                AND PSUS)
              </span>
            </h2>
            <hr className="w-full h-1 text-primary bg-primary" />
            <div className="space-y-2 divide-y-[1px] pt-5">
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Name/subject of the conference
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceNameOfConference}
                </p>
              </div>
              <div className="pt-5 text-2xl font-semibold text-primary">
                Duration of conference
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Start date
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceStartDate}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  End date
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceEndDate}
                </p>
              </div>
              <div className="pt-5 text-2xl font-semibold text-primary">
                Venue of conference
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Address
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceAddress}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  State
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceState}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Ditrict
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceDistrict}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Pincode
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferencePincode}
                </p>
              </div>

              <div className="pt-5 text-2xl font-semibold text-primary">
                Details of organizer of conference
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Name of organizer
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceNameOfOrganizer}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Address
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceAddressOfOrganizer}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Phone no
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferencePhoneOfOrganizer}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Email id
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eConferenceEmailOfOrganizer}
                </p>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {step1Data?.visaService === 'eMEDICAL ATTENDANT VISA' ? (
          <div className="px-4 pt-10">
            <h2 className="text-3xl font-semibold">
              Details of Purpose
              <span className="text-lg">
                (TO ACCOMPANY PATIENT TRAVELLING TO INDIA ON EMEDICAL VISA)
              </span>
            </h2>
            <hr className="w-full h-1 text-primary bg-primary" />
            <div className="space-y-2 divide-y-[1px] pt-5">
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Name of the principal e-Medical Visa holder (i.e. the patient)
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantNameVisaHolder}
                </p>
              </div>

              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  App Or Visa
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantAppOrVisa}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Visa No. / Application id of principal e-Medical Visa holder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantVisaNumberOfVisaHolder}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Application Id Of VisaHolder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantApplicationIdOfVisaHolder}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Passport Number Of VisaHolder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantPassportNumberOfVisaHolder}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Dob Of Visa Holder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantDobOfVisaHolder}
                </p>
              </div>

              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Nationality Of Visa Holder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantNationalityOfVisaHolder}
                </p>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}

        {step1Data?.eBusinessVisa ===
        'TO DELIVER LECTURE/S UNDER GLOBAL INITIATIVE FOR ACADEMIC NETWORKS (GIAN)' ? null : step1Data?.eBusinessVisa ===
          'CONDUCTING TOURS' ? (
          <div className="px-4 pt-10">
            <h2 className="text-3xl font-semibold">
              Details of Purpose
              <span className="text-lg">(CONDUCTING TOURS)</span>
            </h2>
            <hr className="w-full h-1 text-primary bg-primary" />
            <div className="space-y-2 divide-y-[1px] pt-5">
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Name And Address
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eBusinessConductingToursNameAndAddress}
                </p>
              </div>

              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Cities
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eBusinessConductingToursCities}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Agency Name
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eBusinessConductingToursTravelAgencyName}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Agency Phone
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eBusinessConductingToursTravelAgencyPhone}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Agency Address
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eBusinessConductingToursTravelAgencyAddress}
                </p>
              </div>
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Dob Of Visa Holder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantDobOfVisaHolder}
                </p>
              </div>

              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Nationality Of Visa Holder
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step4Data?.eMedicalAttendantNationalityOfVisaHolder}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-10">
            <div className="space-y-2 divide-y-[1px] pt-5">
              {step2Data?.visaService === 'eBusinessVisa' ? (
                <>
                  <h2 className="text-3xl font-semibold">
                    Details of Purpose
                    <span className="text-lg">
                      ({step1Data?.eBusinessVisa})
                    </span>
                  </h2>
                  <hr className="w-full h-1 text-primary bg-primary" />
                  <div className="pt-5 text-2xl font-semibold text-primary">
                    Detials of the Applicants Company
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Name*
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessCompanyName}
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Address*
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessCompanyAddress}
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Phone No.*
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessCompanyPhone}
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Website*
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessCompanyWebsite}
                    </p>
                  </div>
                </>
              ) : null}
              {step1Data?.eBusinessVisa ===
                'TO SET UP INDUSTRIAL/BUSINESS VENTURE' ||
              step1Data?.eBusinessVisa === 'SALE/PURCHASE/TRADE' ? (
                <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                  <h2 className="py-1 text-sm font-semibold text-secondary">
                    Nature of Business/Product*
                  </h2>
                  <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                    {step4Data?.eBusinessCompanyNatures}
                  </p>
                </div>
              ) : (
                ''
              )}

              {step1Data?.eBusinessVisa ===
                'ATTEND TECHNICAL/BUSINESS MEETINGS' ||
              step1Data?.eBusinessVisa ===
                'EXPERT/SPECIALIST IN CONNECTION WITH AN ONGOING PROJECT' ? (
                <>
                  <div className="pt-5 text-2xl font-semibold text-primary">
                    Detials of Indian Firm
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      eBusinessAttendTechMeetingName
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessAttendTechMeetingName}
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      eBusinessAttendTechMeetingAddress
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessAttendTechMeetingAddress}
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      eBusinessAttendTechMeetingPhone
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessAttendTechMeetingPhone}
                    </p>
                  </div>
                </>
              ) : (
                ''
              )}

              {step1Data?.eBusinessVisa === 'TO RECRUIT MANPOWER' ? (
                <>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Name and contact number of the company representative in
                      India
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {
                        step4Data?.eBusinessRecruitManpowerNamecontactCompanyRepresentative
                      }
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Nature of Job for which recruiting
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {step4Data?.eBusinessRecruitManpowerNatureOfJob}
                    </p>
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Places where recruitment is to be conducted
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {
                        step4Data?.eBusinessRecruitManpowerPlacesRecruitmentConducted
                      }
                    </p>
                  </div>
                </>
              ) : (
                ''
              )}

              {step1Data?.eBusinessVisa ===
              'PARTICIPATION IN EXHIBITIONS,BUSINESS/TRADE FAIRS' ? (
                <>
                  <div className="pt-5 text-sm text-black">
                    for PARTICIPATION IN EXHIBITIONS,BUSINESS/TRADE FAIRS (text
                    for your reference)
                  </div>
                  <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                    <h2 className="py-1 text-sm font-semibold text-secondary">
                      Name and address of the exhibition/trade fair
                    </h2>
                    <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                      {
                        step4Data?.eBusinessParticipationInExhibitionsNameAndAddress
                      }
                    </p>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        )}

        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">Other Information</h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Countries Visited in Last 10 Years
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.countryVisitedInLast10Years.length > 0
                  ? step4Data?.countryVisitedInLast10Years.map(
                      (country, index) => <span key={index}>{country}, </span>
                    )
                  : null}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">
            SAARC Country Visit Details{' '}
          </h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you visited SAARC countries (except your country) during
                last 3 years?
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.visitedSAARCCountries}
              </p>
            </div>

            {step4Data?.visitedSAARCCountries === 'yes' ? (
              <table className="w-full table-auto">
                <thead className="border-b">
                  <tr className="bg-gray-100">
                    <th className="p-4 font-medium text-left">
                      Name of SAARC Country*
                    </th>
                    <th className="p-4 font-medium text-left">Select Year*</th>
                    <th className="p-4 font-medium text-left">No. of Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {step4Data?.visitedSAARCCountriesLists.length > 0
                    ? step4Data?.visitedSAARCCountriesLists.map(country => (
                        <tr
                          className="border-b hover:bg-gray-50"
                          key={country._id}
                        >
                          <td className="p-4">{country?.saarcCountryName}</td>
                          <td className="p-4">{country?.selectYear}</td>
                          <td className="p-4">{country?.numberOfVisits}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>

        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">Reference </h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Reference Name in India*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.referenceNameInIndia}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Address*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.referenceAddress}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Phone*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.referencePhone}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Reference Name in FRANCE*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.referenceNameInHomeCountry}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Address*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.referenceAddressInHomeCountry}
              </p>
            </div>
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Phone No.*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step4Data?.referencePhoneInHomeCountry}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-10">
          <h2 className="text-3xl font-semibold">
            Additional Question Details{' '}
          </h2>
          <hr className="w-full h-1 text-primary bg-primary" />
          <div className="space-y-2 divide-y-[1px] pt-5">
            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you ever been arrested/ prosecuted/ convicted by Court of
                Law of any country?*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step5Data?.haveYouBeenArrested}
              </p>
            </div>
            {step5Data?.haveYouBeenArrested === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Detail*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step5Data?.haveYouBeenArrestedInput}
                </p>
              </div>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you ever been refused entry / deported by any country
                including India?*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step5Data?.haveYouBeenRefusedEntry}
              </p>
            </div>

            {step5Data?.haveYouBeenRefusedEntry === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Detail*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step5Data?.haveYouBeenRefusedEntryInput}
                </p>
              </div>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you ever been engaged in Human trafficking/ Drug
                trafficking/ Child abuse/ Crime against women/ Economic offense/
                Financial fraud?*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step5Data?.haveYouBeenEngagedInTrafficking}
              </p>
            </div>
            {step5Data?.haveYouBeenEngagedInTrafficking === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Detail*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step5Data?.haveYouBeenEngagedInTraffickingInput}
                </p>
              </div>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you ever been engaged in Cyber crime/ Terrorist activities
                / Sabotage/ Espionage/ Genocide/ Political Killing/ other act of
                violence?*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step5Data?.haveYouBeenEngagedInCrime}
              </p>
            </div>
            {step5Data?.haveYouBeenEngagedInCrime === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Detail*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step5Data?.haveYouBeenEngagedInCrimeInput}
                </p>
              </div>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you ever by any means or medium, expressed views that
                justify or glorify terrorist violence or that may encourage
                others to terrorist acts or other serious criminal acts?*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step5Data?.haveYouExpressedViews}
              </p>
            </div>
            {step5Data?.haveYouExpressedViews === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Detail*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step5Data?.haveYouExpressedViewsInput}
                </p>
              </div>
            ) : null}

            <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
              <h2 className="py-1 text-sm font-semibold text-secondary">
                Have you sought asylum (political or otherwise) in any country?*
              </h2>
              <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                {step5Data?.haveYouSoughtAsylum}
              </p>
            </div>
            {step5Data?.haveYouSoughtAsylum === 'yes' ? (
              <div className="grid pt-5 md:items-center md:justify-between md:grid-cols-2 md:space-x-20 md:pt-0 ">
                <h2 className="py-1 text-sm font-semibold text-secondary">
                  Detail*
                </h2>
                <p className="font-bold leading-relaxed tracking-wide text-justify capitalize ">
                  {step5Data?.haveYouSoughtAsylumInput}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pt-5 mt-4 space-x-4 space-y-4 text-center md:space-y-0">
          <Link href="/visa/step-one/update">
            <button className="formbtnBorder" type="button">
              Modify
            </button>
          </Link>
          <Link href="/visa/step-eight">
            <button
              type="submit"
              className="inline-flex gap-3 cursor-pointer md:items-center formbtn "
            >
              Continue
            </button>
          </Link>
          {/* save and temporary exit button  */}
          <button
            disabled={temporaryExitUpdateMutation.isPending}
            className={`formbtnDark px-8 py-3 inline-flex items-center gap-3 ${
              temporaryExitUpdateMutation.isPending
                ? 'cursor-not-allowed opacity-70'
                : ''
            }`}
            type="button"
            onClick={handleTemporaryExit}
          >
            {temporaryExitUpdateMutation.isPending ? (
              <>
                <ImSpinner2 className="animate-spin" /> Saving...
              </>
            ) : (
              'Save and Temporarily Exit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
  // }
};

export default StepSeven;
