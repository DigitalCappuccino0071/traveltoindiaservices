'use client';
import { useFormContext } from '@/context/formContext';
import usePostUserLogin from '@/hooks/usePostUserLogin';
import apiEndpoint from '@/services/apiEndpoint';
import { Dialog, Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { BiArrowBack, BiLoaderAlt } from 'react-icons/bi';
import * as Yup from 'yup';
import Highlight from '../common/Highlight';

const partiallyFormSchema = Yup.object().shape({
  formId: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]*$/,
      'Application id must but combination of number and string'
    )
    .required('Application id is required'),
});
export default function VisaStatusForm({ isFormModalOpen, handleFormModal }) {
  const { dispatch } = useFormContext();
  const router = useRouter();
  const [isFormOpen, setFormOpen] = useState(false);
  const postUserLogin = usePostUserLogin({
    apiEndpointUrl: apiEndpoint.EVISA_USER_LOGIN,
    queryKey: ['make payment for completed form'],
    successMessage: 'Application id fetched successfully',
  });

  const handleBackToForm = () => {
    setFormOpen(prev => !prev);
  };

  useEffect(() => {
    localStorage.removeItem('formId');
  }, [dispatch, isFormOpen]);

  return (
    <>
      <Transition appear show={isFormModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleFormModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <div className="px-4 pt-3 pb-4 -mx-4 ">
                    <div className="max-w-xl mx-auto">
                      <h2 className="inline-block text-xl font-semibold text-left text-gray-800">
                        Visa Status
                      </h2>
                      <p className="pl-px text-xs text-gray-700">
                        Enter Temporary Application ID
                      </p>

                      <Formik
                        initialValues={{ formId: '' }}
                        validationSchema={partiallyFormSchema}
                        validateOnChange={true}
                        validateOnMount={true}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          postUserLogin.mutate(values);
                          setSubmitting(false);
                          resetForm();
                        }}
                      >
                        {({ values, isValid, handleSubmit }) => (
                          <>
                            <Form onSubmit={handleSubmit} className="mt-2">
                              <div className="flex flex-col gap-2 formMain">
                                <Field
                                  type="text"
                                  placeholder="Enter Temporary Application ID"
                                  className="form-input"
                                  name="formId"
                                />
                                <ErrorMessage
                                  name="formId"
                                  component="div"
                                  className="text-red-600"
                                />

                                {postUserLogin.error ? (
                                  <div className="text-red-600">
                                    {postUserLogin?.error['response']?.data
                                      ?.error ?? 'something goes wrong'}
                                    {/* <Link href="/visa/step-one">Create</Link> */}
                                  </div>
                                ) : null}
                                <div className="flex flex-col gap-3 mt-3">
                                  <button
                                    type="submit"
                                    disabled={!isValid}
                                    className={`formbtn w-full justify-center cursor-pointer inline-flex items-center gap-3 ${
                                      !isValid
                                        ? 'cursor-not-allowed opacity-50'
                                        : ''
                                    }`}
                                  >
                                    {postUserLogin.isPending ? (
                                      <>
                                        <BiLoaderAlt className="w-4 h-4 animate-spin" />
                                        Loading...
                                      </>
                                    ) : (
                                      'Submit'
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    className="flex items-center justify-center w-full formbtnBorder"
                                    onClick={handleFormModal}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </Form>
                          </>
                        )}
                      </Formik>

                      {postUserLogin.isSuccess &&
                        postUserLogin?.data?.data?.data?.visaStatus ===
                          'visa sent' && (
                          <div
                            className={`
                            absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-3 p-5 mt-3 text-center text-red-600 bg-white`}
                          >
                            {/* <button
                              type="button"
                              className="flex items-center gap-2 text-secondary"
                              onClick={handleBackToForm}
                            >
                              <BiArrowBack /> Go Back To Form
                            </button> */}
                            <p>
                              Visa Status for this application Id : {''}
                              <Highlight
                                text={postUserLogin?.data?.data?.data?._id}
                                className="font-semibold"
                              />
                            </p>
                            <p>
                              Visa Status:{' '}
                              <Highlight
                                text={
                                  postUserLogin?.data?.data?.data?.visaStatus
                                }
                                className="font-semibold"
                              />
                            </p>
                          </div>
                        )}
                      {postUserLogin.isSuccess &&
                        postUserLogin?.data?.data?.data?.visaStatus !==
                          'visa sent' && (
                          <div
                            className={`
                            absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full gap-3 p-5 mt-3 text-center text-red-600 bg-white`}
                          >
                            <p>
                              Visa Status for this application Id : {''}
                              <Highlight
                                text={postUserLogin?.data?.data?.data?._id}
                                className="font-semibold"
                              />
                            </p>
                            <p>
                              Visa Status:{' '}
                              <Highlight
                                text="Pending"
                                className="font-semibold"
                              />
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
