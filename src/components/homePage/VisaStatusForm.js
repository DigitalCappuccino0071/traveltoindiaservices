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
  const [checkedIds, setCheckedIds] = useState([]);
  const postUserLogin = usePostUserLogin({
    apiEndpointUrl: apiEndpoint.EVISA_USER_LOGIN,
    queryKey: ['make payment for completed form'],
    isDispatch: true,
    successMessage: 'Application id fetched successfully',
  });

  const handleBackToForm = () => {
    setFormOpen(prev => !prev);
  };

  useEffect(() => {
    localStorage.removeItem('formId');
    localStorage.removeItem('formSteps');
    // }, [dispatch, isFormOpen]);
  }, [dispatch, isFormOpen]);

  const handleCheckAnotherId = () => {
    postUserLogin.reset();
    setCheckedIds(prev => [...prev, postUserLogin?.data?.data?.data?._id]);
  };

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
                  <div className="px-4 pt-3 pb-4 -mx-4">
                    <div className="max-w-xl mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Check Visa Status
                        </h2>
                        <button
                          onClick={handleFormModal}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Enter Temporary Application ID to check status
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
                              <div className="flex flex-col gap-2">
                                <Field
                                  type="text"
                                  placeholder="Enter Temporary Application ID"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                  name="formId"
                                />
                                <ErrorMessage
                                  name="formId"
                                  component="div"
                                  className="text-sm text-red-600"
                                />

                                {postUserLogin.error && (
                                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                    {postUserLogin?.error['response']?.data
                                      ?.error ?? 'Something went wrong'}
                                  </div>
                                )}

                                <div className="flex flex-col gap-3 mt-3">
                                  <button
                                    type="submit"
                                    disabled={
                                      !isValid || postUserLogin.isPending
                                    }
                                    className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                                      !isValid || postUserLogin.isPending
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                  >
                                    {postUserLogin.isPending ? (
                                      <span className="flex items-center justify-center gap-2">
                                        <BiLoaderAlt className="w-4 h-4 animate-spin" />
                                        Loading...
                                      </span>
                                    ) : (
                                      'Check Status'
                                    )}
                                  </button>
                                </div>
                              </div>
                            </Form>
                          </>
                        )}
                      </Formik>

                      {postUserLogin.isSuccess && (
                        <div className="mt-4 space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800">
                              Application ID:{' '}
                              <Highlight
                                text={postUserLogin?.data?.data?.data?._id}
                                className="font-semibold"
                              />
                            </p>
                            <p className="mt-2 text-blue-800">
                              Status:{' '}
                              {postUserLogin?.data?.data?.data?.visaStatus ===
                              'hold on' ? (
                                <span className="text-purple-800">
                                  Payment Required - Please complete payment to
                                  proceed
                                </span>
                              ) : (
                                <Highlight
                                  text={
                                    postUserLogin?.data?.data?.data?.visaStatus
                                  }
                                  className="font-semibold"
                                />
                              )}
                            </p>
                            {postUserLogin?.data?.data?.data?.visaStatus ===
                              'hold on' && (
                              <button
                                onClick={() => {
                                  router.push('/visa/step-eight');
                                }}
                                className="w-full mt-3 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                              >
                                Complete Payment Now
                              </button>
                            )}
                            {postUserLogin?.data?.data?.data?.paid && (
                              <Link
                                href={`/thankyou?success=true&orderId=${postUserLogin?.data?.data?.data?._id}&session_id=${postUserLogin?.data?.data?.data?.paymentId}`}
                                className="block w-full mt-3 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                              >
                                View Application Details
                              </Link>
                            )}
                          </div>

                          <button
                            onClick={handleCheckAnotherId}
                            className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            Check Another ID
                          </button>
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
