'use client';
import BannerPage from '@/components/india/common/BannerPage';
import Loading from '@/components/india/common/Loading';
import PaymentStatus from '@/components/india/common/PaymentStatus';
import { step5ValidationSchema, step5data } from '@/constant/indiaConstant';
import { useFormContext } from '@/context/formContext';
import useUpdate from '@/hooks/useUpdate';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ImSpinner2 } from 'react-icons/im';

export default function Step5Update() {
  const router = useRouter();
  const { state } = useFormContext();

  const {
    isPending,
    error,
    data: getAllStepsData,
    isSuccess: getAllStepsDataIsSuccess,
    refetch,
  } = useQuery({
    queryKey: ['getAllStepsData'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
  });

  const updateMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP5,
    getAllStepsData?.data?.step5Data?._id,
    5,
    '/visa/step-six',
    refetch
  );

  useEffect(() => {
    if (!state?.formId) {
      router.push('/visa/step-one');
      return;
    }

    if (error && error?.response?.status !== 404) {
      console.log('error', error);
      router.push('/visa/step-one');
      return;
    }

    if (getAllStepsDataIsSuccess) {
      if (!getAllStepsData?.data?.step4Data) {
        router.push('/visa/step-four');
        return;
      }

      if (getAllStepsData?.data?.step5Data) {
        router.push('/visa/step-five/update');
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

  if (getAllStepsDataIsSuccess) {
    getAllStepsData?.data?.step5Data;
    if (getAllStepsData.data.step5Data) {
      const { __v, _id, createdAt, updatedAt, ...cleanedStep55Data } =
        getAllStepsData?.data?.step5Data;

      return (
        <>
          <BannerPage heading="Applicant Detail Form" />

          <Formik
            initialValues={cleanedStep55Data}
            validationSchema={step5ValidationSchema.yupSchema}
            validateOnChange={true}
            validateOnMount={true}
            onSubmit={(values, { setSubmitting }) => {
              updateMutation.mutate({ ...values, formId: state.formId });
              setSubmitting(false);
            }}
          >
            {({ values, isValid, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="container py-16">
                <div>
                  <div>
                    <h2 className="text-3xl font-semibold">
                      Details of Visa Sought
                    </h2>
                    <hr className="h-1 text-primary bg-primary w-36" />
                  </div>
                  <div>
                    {step5data.map((e, i) => (
                      <div key={i}>
                        <div className="grid grid-cols-12 gap-8 py-8">
                          <div className="col-span-8">
                            <label>
                              <span className="pr-2">{e.id}.</span>
                              {e.question}
                            </label>
                          </div>

                          <div className="flex col-span-4 space-x-4">
                            <div className="px-2 space-x-2">
                              <Field
                                type="radio"
                                id={`${e.name}`}
                                name={`${e.name}`}
                                value="yes"
                              />
                              <label htmlFor={`question${e.name}Yes`}>
                                Yes
                              </label>
                            </div>
                            <div className="px-2 space-x-2">
                              <Field
                                type="radio"
                                name={`${e.name}`}
                                value="no"
                              />
                              <label htmlFor={`${e.name}`}>No</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          {values[e.name] === 'yes' && (
                            <>
                              <Field
                                type="text"
                                placeholder="Enter Text"
                                className="form-input"
                                name={e.inputName}
                              />
                              <ErrorMessage
                                name={e.inputName}
                                component="div"
                                className="text-red-600"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* checkbox content start  */}
                  <div className="flex items-start justify-start py-8 space-x-2">
                    <Field type="checkbox" name="declaration" />

                    <p className="font-semibold">
                      I FREDDY, hereby declare that the information furnished
                      above is correct to the best of my knowledge and belief.
                      In case the information is found false at any stage, I am
                      liable for legal action/deportation /blacklisting or any
                      other as deemed fit by the Government of India.
                    </p>
                  </div>
                  <ErrorMessage
                    name="declaration"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div className="space-x-4 text-center">
                  <Link href="/visa/step-four/update">
                    <button className="formbtnBorder" type="button">
                      Back
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`formbtn cursor-pointer inline-flex items-center gap-3 ${
                      !isValid ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Loading
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      );
    }
  }
}
