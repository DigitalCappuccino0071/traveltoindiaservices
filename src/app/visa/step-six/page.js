'use client';
import BannerPage from '@/components/india/common/BannerPage';
import SavedFormId from '@/components/india/common/SavedFormId';
import FileUploadMain from '@/components/india/FileUploadMain';
import SingleFileUpload from '@/components/india/SingleFileUpload';
import { useFormContext } from '@/context/formContext';
import usePost from '@/hooks/usePost';
import useUpdate from '@/hooks/useUpdate';
import { useImageUpload } from '@/hooks/useImageUpload';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import { ImSpinner2 } from 'react-icons/im';
import { LuImagePlus } from 'react-icons/lu';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';

export default function StepSix() {
  const pathName = usePathname();
  const { state } = useFormContext();
  const router = useRouter();
  const { uploadSingleImage, uploadMultipleImages } = useImageUpload();
  const [uploadedPublicIds, setUploadedPublicIds] = useState({
    profilePicture: '',
    passport: [],
    businessCard: [],
    eMedicalCard: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [activeUpload, setActiveUpload] = useState(null);

  // Define validation schema directly in the component
  const validationSchema = Yup.object().shape({
    passport: Yup.array()
      .of(Yup.mixed())
      .test('fileFormat', 'Only PNG and JPG files are allowed', value => {
        if (!value || !value.length) return true;
        return value.every(file => {
          if (typeof file === 'string') return true;
          return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
        });
      })
      .min(1, 'At least one passport image is required')
      .required('Passport is required'),
    profilePicture: Yup.mixed()
      .test('fileFormat', 'Only PNG and JPG files are allowed', value => {
        if (!value) return true;
        if (typeof value === 'string') return true;
        return ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type);
      })
      .required('Profile picture is required'),
    businessCard: Yup.array()
      .of(Yup.mixed())
      .test('fileFormat', 'Only PNG and JPG files are allowed', value => {
        if (!value || !value.length) return true;
        return value.every(file => {
          if (typeof file === 'string') return true;
          return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
        });
      }),
    eMedicalCard: Yup.array()
      .of(Yup.mixed())
      .test('fileFormat', 'Only PNG and JPG files are allowed', value => {
        if (!value || !value.length) return true;
        return value.every(file => {
          if (typeof file === 'string') return true;
          return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
        });
      }),
  });

  const initialValues = {
    passport: [],
    profilePicture: null,
    businessCard: [],
    eMedicalCard: [],
  };

  const {
    isPending,
    error,
    data: getAllStepsData,
    isSuccess: getAllStepsDataIsSuccess,
    refetch,
  } = useQuery({
    queryKey: ['getAllStepsData6'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
  });

  const postMutation = usePost(
    apiEndpoint.VISA_ADD_STEP6,
    6,
    '/visa/step-seven',
    false,
    'getAllStepsDataStep7'
  );

  const temporaryExitUpdateMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP1_LAST_EXIT_STEP_URL,
    state.formId,
    'temporary step 6 saved successfully',
    '/',
    refetch
  );

  const updatePaymentStatusMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP1,
    state.formId,
    'Payment status updated successfully',
    '/visa/step-seven',
    false
  );

  const handleTemporaryExit = () => {
    temporaryExitUpdateMutation.mutate({
      lastExitStepUrl: pathName,
    });
    localStorage.clear();
  };

  const handleImageUpload = useCallback(
    async (file, fieldName) => {
      if (!file) return;

      setIsUploading(true);
      setActiveUpload(fieldName);
      try {
        if (fieldName === 'profilePicture') {
          const result = await uploadSingleImage.mutateAsync(file);
          if (result && result.public_id) {
            setUploadedPublicIds(prev => ({
              ...prev,
              [fieldName]: result.public_id,
            }));

            toast.success('Profile picture uploaded successfully', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 2000,
            });
          } else {
            throw new Error('No public_id received from upload');
          }
        } else {
          const result = await uploadMultipleImages.mutateAsync([file]);
          if (result && result.length > 0 && result[0].public_id) {
            setUploadedPublicIds(prev => ({
              ...prev,
              [fieldName]: [...prev[fieldName], result[0].public_id],
            }));

            toast.success(
              `${fieldName
                .replace(/([A-Z])/g, ' $1')
                .trim()} uploaded successfully`,
              {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
              }
            );
          } else {
            throw new Error('No public_id received from upload');
          }
        }
      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
        toast.error(
          `Failed to upload ${fieldName}: ${error.message || 'Unknown error'}`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          }
        );
      } finally {
        setIsUploading(false);
        setActiveUpload(null);
      }
    },
    [uploadSingleImage, uploadMultipleImages]
  );

  // Check if all required files are uploaded based on visa type
  const validateRequiredFiles = useCallback(() => {
    let isValid = true;
    const visaService = getAllStepsData?.data?.step1Data?.visaService || '';

    // Profile picture is always required
    if (!uploadedPublicIds.profilePicture) {
      toast.error('Profile picture is required', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      isValid = false;
    }

    // Passport is always required
    if (uploadedPublicIds.passport.length === 0) {
      toast.error('Passport is required', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      isValid = false;
    }

    // Business card is required only for business visa
    if (
      visaService === 'eBUSINESS VISA' &&
      uploadedPublicIds.businessCard.length === 0
    ) {
      toast.error('Business card is required for business visa', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      isValid = false;
    }

    // Medical card is required only for medical visa
    if (
      visaService === 'eMEDICAL VISA' &&
      uploadedPublicIds.eMedicalCard.length === 0
    ) {
      toast.error('Medical card is required for medical visa', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      isValid = false;
    }

    return isValid;
  }, [uploadedPublicIds, getAllStepsData]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full pt-20">
        <ImSpinner2 className="w-6 h-6 text-primary animate-spin mr-3" />
        <span className="text-lg">Loading your application information...</span>
      </div>
    );
  }

  if (error) {
    return router.push('/visa/step-five');
  }

  if (getAllStepsDataIsSuccess) {
    if (!getAllStepsData?.data?.step5Data) {
      return router.push('/visa/step-five');
    }

    if (getAllStepsData?.data?.step6Data) {
      return router.push('/visa/step-seven');
    }
    const visaService = getAllStepsData?.data?.step1Data?.visaService || '';

    return (
      <>
        <BannerPage heading="Upload Your Documents" />
        <SavedFormId />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnMount={false}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            // Validate all required files are uploaded based on visa type
            if (!validateRequiredFiles()) {
              setSubmitting(false);
              return;
            }

            try {
              const formData = new FormData();
              formData.append('formId', state.formId);
              formData.append('lastExitStepUrl', pathName);

              // Add profile picture public ID
              formData.append(
                'profilePicture',
                uploadedPublicIds.profilePicture
              );

              // Add passport public IDs
              uploadedPublicIds.passport.forEach(id => {
                formData.append('passport', id);
              });

              // Add business card public IDs if applicable
              if (visaService === 'eBUSINESS VISA') {
                uploadedPublicIds.businessCard.forEach(id => {
                  formData.append('businessCard', id);
                });
              }

              // Add medical card public IDs if applicable
              if (visaService === 'eMEDICAL VISA') {
                uploadedPublicIds.eMedicalCard.forEach(id => {
                  formData.append('eMedicalCard', id);
                });
              }

              // Submit form data
              await postMutation.mutateAsync(formData, {
                onSuccess: () => {
                  updatePaymentStatusMutation.mutate({
                    paymentStatus: 'pendingPayment',
                  });
                  toast.success('Files uploaded successfully!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  });
                },
                onError: error => {
                  toast.error(
                    `Submission error: ${error.message || 'Unknown error'}`,
                    {
                      position: toast.POSITION.BOTTOM_RIGHT,
                    }
                  );
                },
              });

              setSubmitting(false);
              resetForm();
            } catch (error) {
              console.error('Form submission error:', error);
              toast.error(
                `Error submitting form: ${error.message || 'Unknown error'}`,
                {
                  position: toast.POSITION.BOTTOM_RIGHT,
                }
              );
              setSubmitting(false);
            }
          }}
        >
          {({ values, isValid, handleSubmit, setFieldValue, isSubmitting }) => (
            <>
              <Form onSubmit={handleSubmit} className="container pt-4 pb-16">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <FaInfoCircle className="text-primary mr-2 text-xl" />
                    <h2 className="text-2xl font-semibold">
                      Application Information
                    </h2>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-md mb-6 border border-blue-200">
                    <p className="mb-2 font-semibold">
                      Temporary Application ID:{' '}
                      <span className="text-primary bg-blue-100 px-2 py-1 rounded">
                        {state?.formId}
                      </span>
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Important:</span> Ensure
                      that your photo meets the specifications below.
                    </p>
                    <p className="mb-1">
                      If you're{' '}
                      <span className="font-semibold">
                        not ready to upload your photo now
                      </span>
                      , you can complete this step later.
                    </p>
                    <p>
                      Note your Temporary Application ID and use the{' '}
                      <span className="font-bold text-primary">
                        Save and Temporarily Exit
                      </span>{' '}
                      button. You can resume your application using the
                      "Complete Partially Filled Form" option on the home page.
                    </p>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold">
                        Upload Your Profile Picture
                      </h3>
                      {uploadedPublicIds.profilePicture && (
                        <span className="ml-2 text-green-500 flex items-center text-sm">
                          <FaCheckCircle className="mr-1" /> Uploaded
                        </span>
                      )}
                    </div>

                    <div className="rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary bg-gray-50">
                      <div className="p-4">
                        <SingleFileUpload
                          id="uploadPicture"
                          name="profilePicture"
                          setFieldValue={setFieldValue}
                          value={values.profilePicture}
                          errorMessage={
                            <ErrorMessage
                              name="profilePicture"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          }
                          accept="image/png, image/jpeg"
                          onFileSelect={file =>
                            handleImageUpload(file, 'profilePicture')
                          }
                        />

                        {isUploading && activeUpload === 'profilePicture' && (
                          <div className="mt-2 flex items-center justify-center p-2 bg-blue-50 rounded-md text-primary text-sm">
                            <ImSpinner2 className="w-4 h-4 animate-spin mr-2" />
                            <span>Uploading your photo...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      Required Documents
                    </h2>
                    <hr className="h-0.5 text-primary bg-primary ml-4 w-16" />
                  </div>

                  <div className="space-y-6">
                    {/* Passport upload */}
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-base font-semibold">
                          Copy of Passport
                        </h3>
                        {uploadedPublicIds.passport.length > 0 && (
                          <span className="ml-2 text-green-500 flex items-center text-sm">
                            <FaCheckCircle className="mr-1" />
                            <span>
                              {uploadedPublicIds.passport.length} file(s)
                              uploaded
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary bg-gray-50">
                        <div className="p-4">
                          <FileUploadMain
                            name="passport"
                            id="passport-upload"
                            setFieldValue={setFieldValue}
                            values={values}
                            errorMessage={
                              <ErrorMessage
                                name="passport"
                                component="div"
                                className="text-red-500 mt-1 text-sm"
                              />
                            }
                            accept="image/png, image/jpeg"
                            multiple="multiple"
                            onFileSelect={file =>
                              handleImageUpload(file, 'passport')
                            }
                          />

                          {!values.passport || values.passport.length === 0 ? (
                            <label
                              htmlFor="passport-upload"
                              className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
                            >
                              <div className="text-center">
                                <div className="mb-2 flex justify-center">
                                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-primary">
                                    <LuImagePlus size={24} />
                                  </div>
                                </div>
                                <h4 className="text-sm font-medium text-gray-700">
                                  Click to select passport images
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Multiple pages allowed • JPG, PNG
                                </p>
                              </div>
                            </label>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700">
                                  Uploaded Files
                                </h4>
                                <label
                                  htmlFor="passport-upload"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                >
                                  <LuImagePlus size={16} />
                                  <span>Add More</span>
                                </label>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {values.passport.map((file, index) => (
                                  <div
                                    key={index}
                                    className="bg-white p-2 rounded-md border border-gray-200 flex items-center gap-2"
                                  >
                                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                      <LuImagePlus
                                        size={18}
                                        className="text-gray-400"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {typeof file === 'object'
                                          ? file.name
                                          : `File ${index + 1}`}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {typeof file === 'object'
                                          ? `${(file.size / 1024).toFixed(
                                              1
                                            )} KB`
                                          : 'Uploaded'}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {isUploading && activeUpload === 'passport' && (
                            <div className="mt-2 flex items-center justify-center p-2 bg-blue-50 rounded-md text-primary text-sm">
                              <ImSpinner2 className="w-4 h-4 animate-spin mr-2" />
                              <span>Uploading passport document...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Business visa specific documents */}
                    {visaService === 'eBUSINESS VISA' && (
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-base font-semibold">
                            Business Card
                          </h3>
                          {uploadedPublicIds.businessCard.length > 0 && (
                            <span className="ml-2 text-green-500 flex items-center text-sm">
                              <FaCheckCircle className="mr-1" />
                              <span>
                                {uploadedPublicIds.businessCard.length} file(s)
                                uploaded
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary bg-gray-50">
                          <div className="p-4">
                            <FileUploadMain
                              name="businessCard"
                              id="business-card-upload"
                              setFieldValue={setFieldValue}
                              values={values}
                              errorMessage={
                                <ErrorMessage
                                  name="businessCard"
                                  component="div"
                                  className="text-red-500 mt-1 text-sm"
                                />
                              }
                              accept="image/png, image/jpeg"
                              multiple="multiple"
                              onFileSelect={file =>
                                handleImageUpload(file, 'businessCard')
                              }
                            />

                            {!values.businessCard ||
                            values.businessCard.length === 0 ? (
                              <label
                                htmlFor="business-card-upload"
                                className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
                              >
                                <div className="text-center">
                                  <div className="mb-2 flex justify-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-primary">
                                      <LuImagePlus size={24} />
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Click to select business card
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Multiple images allowed • JPG, PNG
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Uploaded Files
                                  </h4>
                                  <label
                                    htmlFor="business-card-upload"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                  >
                                    <LuImagePlus size={16} />
                                    <span>Add More</span>
                                  </label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {values.businessCard.map((file, index) => (
                                    <div
                                      key={index}
                                      className="bg-white p-2 rounded-md border border-gray-200 flex items-center gap-2"
                                    >
                                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                        <LuImagePlus
                                          size={18}
                                          className="text-gray-400"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {typeof file === 'object'
                                            ? file.name
                                            : `File ${index + 1}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {typeof file === 'object'
                                            ? `${(file.size / 1024).toFixed(
                                                1
                                              )} KB`
                                            : 'Uploaded'}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {isUploading && activeUpload === 'businessCard' && (
                              <div className="mt-2 flex items-center justify-center p-2 bg-blue-50 rounded-md text-primary text-sm">
                                <ImSpinner2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Uploading business card...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical visa specific documents */}
                    {visaService === 'eMEDICAL VISA' && (
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-base font-semibold">
                            Medical Card
                          </h3>
                          {uploadedPublicIds.eMedicalCard.length > 0 && (
                            <span className="ml-2 text-green-500 flex items-center text-sm">
                              <FaCheckCircle className="mr-1" />
                              <span>
                                {uploadedPublicIds.eMedicalCard.length} file(s)
                                uploaded
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-primary bg-gray-50">
                          <div className="p-4">
                            <FileUploadMain
                              name="eMedicalCard"
                              id="medical-card-upload"
                              setFieldValue={setFieldValue}
                              values={values}
                              errorMessage={
                                <ErrorMessage
                                  name="eMedicalCard"
                                  component="div"
                                  className="text-red-500 mt-1 text-sm"
                                />
                              }
                              accept="image/png, image/jpeg"
                              multiple="multiple"
                              onFileSelect={file =>
                                handleImageUpload(file, 'eMedicalCard')
                              }
                            />

                            {!values.eMedicalCard ||
                            values.eMedicalCard.length === 0 ? (
                              <label
                                htmlFor="medical-card-upload"
                                className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
                              >
                                <div className="text-center">
                                  <div className="mb-2 flex justify-center">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-primary">
                                      <LuImagePlus size={24} />
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Click to select medical card
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Multiple images allowed • JPG, PNG
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Uploaded Files
                                  </h4>
                                  <label
                                    htmlFor="medical-card-upload"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                  >
                                    <LuImagePlus size={16} />
                                    <span>Add More</span>
                                  </label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {values.eMedicalCard.map((file, index) => (
                                    <div
                                      key={index}
                                      className="bg-white p-2 rounded-md border border-gray-200 flex items-center gap-2"
                                    >
                                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                        <LuImagePlus
                                          size={18}
                                          className="text-gray-400"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {typeof file === 'object'
                                            ? file.name
                                            : `File ${index + 1}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {typeof file === 'object'
                                            ? `${(file.size / 1024).toFixed(
                                                1
                                              )} KB`
                                            : 'Uploaded'}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {isUploading && activeUpload === 'eMedicalCard' && (
                              <div className="mt-2 flex items-center justify-center p-2 bg-blue-50 rounded-md text-primary text-sm">
                                <ImSpinner2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Uploading medical card...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Navigation Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Link href="/visa/step-five/update">
                    <button className="formbtnBorder px-8 py-3">Back</button>
                  </Link>

                  <button
                    type="submit"
                    disabled={isUploading || isSubmitting}
                    className={`formbtn px-8 py-3 inline-flex items-center gap-3 ${
                      isUploading || isSubmitting
                        ? 'cursor-not-allowed opacity-70'
                        : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Uploading...
                      </>
                    ) : isSubmitting ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Continue to Next Step'
                    )}
                  </button>

                  <button
                    disabled={
                      temporaryExitUpdateMutation.isPending || isUploading
                    }
                    className={`formbtnDark px-8 py-3 inline-flex items-center gap-3 ${
                      temporaryExitUpdateMutation.isPending || isUploading
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
              </Form>
            </>
          )}
        </Formik>
        <Script id="anayltics">
          {`window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};heap.load("2659842454");`}
        </Script>
      </>
    );
  }
}
