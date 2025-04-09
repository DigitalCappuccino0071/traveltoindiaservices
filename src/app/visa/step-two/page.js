'use client';
import BannerPage from '@/components/india/common/BannerPage';
import SavedFormId from '@/components/india/common/SavedFormId';
import {
  educationalQualificationList,
  religionNames,
  step2ValidationSchema,
} from '@/constant/indiaConstant';
import { useFormContext } from '@/context/formContext';
import usePost from '@/hooks/usePost';
import useUpdate from '@/hooks/useUpdate';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { useQuery } from '@tanstack/react-query';
import { Country } from 'country-state-city';
import { ErrorMessage, Form, Formik } from 'formik';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { CiCalendarDate } from 'react-icons/ci';
import { ImSpinner2 } from 'react-icons/im';
import ReactDatePickerInput from '@/components/common/ReactDatePickerInput';
import TextInputField from '@/components/common/TextInputField';
import SelectField from '@/components/common/SelectField';

const StepTwo = () => {
  const pathName = usePathname();
  const { state } = useFormContext();
  const router = useRouter();

  const {
    isPending,
    error,
    data: step1Data,
    isSuccess: getStep1DataIsSuccess,
    refetch,
  } = useQuery({
    queryKey: ['getStep1Data'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_VISA_STEP1_BY_ID}${state.formId}`),
    enabled: !!state.formId,
  });
  const postMutation = usePost(
    apiEndpoint.VISA_ADD_STEP2,
    2,
    '/visa/step-three',
    false,
    'getAllStepsDataStep3'
  );
  const temporaryExitUpdateMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP1_LAST_EXIT_STEP_URL,
    state.formId,
    'temporary step 2 saved successfully',
    '/',
    refetch
  );

  const handleTemporaryExit = () => {
    temporaryExitUpdateMutation.mutate({
      lastExitStepUrl: pathName,
    });
    localStorage.clear();
  };

  if (error) {
    return router.push('/visa/step-one');
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full pt-20">
        <ImSpinner2 className="w-4 h-4 text-black animate-spin" />
        loading
      </div>
    );
  }

  if (getStep1DataIsSuccess) {
    return (
      <>
        <BannerPage heading="Applicant Detail Form" />

        <Formik
          initialValues={{
            ...step2ValidationSchema.initialValues,
            dateOfBirth: step1Data.data ? step1Data.data.dateOfBirth : '',
            nationalityRegion: step1Data.data
              ? step1Data.data.nationalityRegion
              : '',
          }}
          validationSchema={step2ValidationSchema.yupSchema}
          validateOnChange={true}
          validateOnMount={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            postMutation.mutate({
              ...values,
              formId: state.formId,
              lastExitStepUrl: '/visa/step-three',
            });
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ values, isValid, handleSubmit, setFieldValue }) => (
            <>
              <SavedFormId />
              <Form onSubmit={handleSubmit} className="container pt-4 pb-16">
                <div>
                  <h2 className="text-3xl font-semibold">Applicant Details</h2>
                  <hr className="h-1 text-primary bg-primary w-36" />
                </div>
                <div className="grid-cols-12 gap-8 md:grid ">
                  <div className="col-span-8">
                    <div>
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <label className="form-label">
                            First Name*{' '}
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                First name (Exactly as in passport)
                              </div>
                            </div>
                          </label>

                          <div className="input-error-wrapper">
                            <TextInputField
                              name="firstName"
                              placeholder="Enter your first name"
                              required={true}
                            />
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <label className="form-label">
                            Last Name*{' '}
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Last name (Exactly as in passport)
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="lastName"
                              placeholder="Enter your last name"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            id="changedName"
                            name="changedName"
                            onChange={e =>
                              setFieldValue('changedName', e.target.checked)
                            }
                            checked={values.changedName}
                          />
                          <label className="text-xs">
                            Have you ever changed your name? If yes click the
                            box
                          </label>
                        </div>
                        {values.changedName && (
                          <>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Previous Name*
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Enter your previous name
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <TextInputField
                                  name="previousName"
                                  placeholder="Enter your previous name"
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Previous Last Name*
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Enter your previous last name
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <TextInputField
                                  name="previousLastName"
                                  placeholder="Enter your previous last name"
                                  required={true}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="form-input-main-div">
                          <label className="form-label">
                            Gender*
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Select your gender
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <SelectField
                              name="gender"
                              placeholder="Select Gender"
                              required={true}
                              options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                              ]}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Date Of Birth
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Date of birth as in passport in dd/mm/yyyy
                                format
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <ReactDatePickerInput
                              className="new-form-input"
                              name="dateOfBirth"
                              selected={
                                values.dateOfBirth
                                  ? new Date(values.dateOfBirth)
                                  : null
                              }
                              setFieldValue={setFieldValue}
                              variant="dob"
                              disabled={true}
                              label="Date of Birth"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Town/City of birth
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Province/town/city of birth
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="townCityOfBirth"
                              placeholder="Enter your town/city of birth"
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Country/Region of birth
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Country/Region of birth
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <SelectField
                              name="countryRegionOfBirth"
                              placeholder="Select Country"
                              required={true}
                              options={Country?.getAllCountries()?.map(
                                country => ({
                                  value: country?.name,
                                  label: country?.name,
                                })
                              )}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Citizenship/National ID no.
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Citizenship/National ID no.
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="citizenshipNationalID"
                              placeholder="Enter your Citizenship/National ID"
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Religion
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Please select your religion
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <SelectField
                              name="religion"
                              placeholder="Select Religion"
                              required={true}
                              options={religionNames?.map(religion => ({
                                value: religion,
                                label: religion,
                              }))}
                            />
                          </div>
                        </div>
                        {values.religion === 'other' && (
                          <div className="form-input-main-div">
                            <label className="form-label">
                              Religion (Other)
                            </label>
                            <div className="input-error-wrapper">
                              <TextInputField
                                name="religionOther"
                                placeholder="Enter your religion"
                              />
                            </div>
                          </div>
                        )}
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Visible identification marks
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Visible identification marks
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="visibleIdentificationMarks"
                              placeholder="Enter visible identification marks"
                            />
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <label className="form-label">
                            Educational Qualification
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Educational Qualification
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <SelectField
                              name="educationalQualification"
                              placeholder="Select Educational Qualification"
                              required={true}
                              options={educationalQualificationList?.map(
                                education => ({
                                  value: education,
                                  label: education,
                                })
                              )}
                            />
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <label className="form-label">
                            Nationality
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Nationality/Region
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="nationalityRegion"
                              disabled={true}
                              className="input-disabled"
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Did you acquire nationality by birth or by
                            naturalization?
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -left-32 group-hover:scale-100 ">
                                Did you acquire Nationality by birth or by
                                naturalization?
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <SelectField
                              name="acquireNationality"
                              placeholder="Select"
                              options={[
                                { value: 'birth', label: 'By Birth' },
                                {
                                  value: 'naturalization',
                                  label: 'By Naturalization',
                                },
                              ]}
                            />
                          </div>
                        </div>

                        {values.acquireNationality === 'naturalization' ? (
                          <div className="form-input-main-div">
                            <label className="form-label">
                              Previous Nationality*
                              <div className="relative group">
                                <BsQuestionCircleFill
                                  className="text-primary info-icon"
                                  size={20}
                                />
                                <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                  Please select previous nationality
                                </div>
                              </div>
                            </label>
                            <div className="input-error-wrapper">
                              <SelectField
                                name="previousNationality"
                                placeholder="Select"
                                required={true}
                                options={Country?.getAllCountries()?.map(
                                  country => ({
                                    value: country?.name,
                                    label: country?.name,
                                  })
                                )}
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>

                  {/* col span code end here */}
                  <div className="hidden col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl md:block">
                    <h2 className="py-4 sidetext ">
                      First name (Exactly as in passport)
                    </h2>
                    <h2 className="py-4 sidetext ">
                      Last name (Exactly as in passport)
                    </h2>
                    <h2 className="py-2 sidetext ">
                      If you have ever changes your name <br /> please tell us.
                    </h2>

                    <h2 className="py-2 sidetext ">Gender</h2>

                    <h2 className="py-3 sidetext ">
                      Date of birth as in passport in dd/mm/yyyy format
                    </h2>

                    <h2 className="py-4 sidetext ">
                      Province/town/city of birth
                    </h2>

                    <h2 className="py-5 sidetext ">Country/Region of birth</h2>

                    <h2 className="py-3 sidetext ">
                      Citizenship/National ID no.
                    </h2>
                    <h2 className="py-6 sidetext ">
                      Please select your religion
                    </h2>

                    <h2 className="py-3 sidetext ">
                      Visible identification marks
                    </h2>

                    <h2 className="py-6 sidetext ">
                      Educational Qualification
                    </h2>

                    <h2 className="py-4 sidetext ">Nationality/Region</h2>
                    <h2 className="sidetext py-7 ">
                      Did you acquire Nationality by birth or by naturalization?
                    </h2>
                  </div>
                </div>

                {/* check box  */}
                <div className="flex items-start py-2 space-x-2">
                  <label className="font-semibold">
                    Have you lived for at least two years in the country where
                    you are applying visa?
                  </label>

                  <div className="flex space-x-4">
                    <div className="px-2 space-x-2">
                      <input
                        type="radio"
                        id="haveLivedInApplyingCountryYes"
                        name="haveLivedInApplyingCountry"
                        className="mt-1"
                        value="yes"
                        checked={values.haveLivedInApplyingCountry === 'yes'}
                        onChange={() =>
                          setFieldValue('haveLivedInApplyingCountry', 'yes')
                        }
                      />
                      <label
                        htmlFor="haveLivedInApplyingCountryYes"
                        className="font-semibold"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="px-2 space-x-2">
                      <input
                        type="radio"
                        id="haveLivedInApplyingCountryNo"
                        name="haveLivedInApplyingCountry"
                        className="mt-1"
                        value="no"
                        checked={values.haveLivedInApplyingCountry === 'no'}
                        onChange={() =>
                          setFieldValue('haveLivedInApplyingCountry', 'no')
                        }
                      />
                      <label
                        htmlFor="haveLivedInApplyingCountryNo"
                        className="font-semibold"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* passport details code start here */}
                <div className="text-2xl font-semibold text-primary md:pt-6">
                  Passport Details
                </div>
                <div className="grid-cols-12 gap-8 md:grid ">
                  <div className="col-span-8">
                    <div>
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Passport Number*
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Applicant's Passport Number
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="passportNumber"
                              placeholder="Enter passport number"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">
                            Place of Issue*
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                Please enter the place of Issue
                              </div>
                            </div>
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="placeOfIssue"
                              placeholder="Enter place of issue"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          {/* <label className="form-label">
                            Date of Issue*
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                In dd/mm/yyyy format
                              </div>
                            </div>
                          </label> */}
                          <div className="input-error-wrapper">
                            <ReactDatePickerInput
                              className="new-form-input"
                              name="dateOfIssue"
                              selected={
                                values.dateOfIssue
                                  ? new Date(values.dateOfIssue)
                                  : null
                              }
                              setFieldValue={setFieldValue}
                              maxDate={new Date()}
                              label="Date of Issue"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          {/* <label className="form-label">
                            Date of Expiry*
                            <div className="relative group">
                              <BsQuestionCircleFill
                                className="text-primary info-icon"
                                size={20}
                              />
                              <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                In dd/mm/yyyy format. minimum six months
                                validity is from journey date.
                              </div>
                            </div>
                          </label> */}
                          <div className="input-error-wrapper">
                            <ReactDatePickerInput
                              className="new-form-input"
                              name="dateOfExpiry"
                              selected={
                                values.dateOfExpiry
                                  ? new Date(values.dateOfExpiry)
                                  : null
                              }
                              setFieldValue={setFieldValue}
                              variant="passport-expiry"
                              label="Date of Expiry"
                              required={true}
                            />
                          </div>
                        </div>

                        {/* check box  */}
                        <div className="flex items-start py-2 space-x-2">
                          <label className="font-semibold">
                            Any other valid Passport/Identity Certificate(IC)
                            held,
                          </label>

                          <div className="flex space-x-4">
                            <div className="px-2 space-x-2">
                              <input
                                type="radio"
                                id="anyOtherPassportYes"
                                name="anyOtherPassport"
                                className="mt-1"
                                value="yes"
                                checked={values.anyOtherPassport === 'yes'}
                                onChange={() =>
                                  setFieldValue('anyOtherPassport', 'yes')
                                }
                              />
                              <label
                                htmlFor="anyOtherPassportYes"
                                className="font-semibold"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="px-2 space-x-2">
                              <input
                                type="radio"
                                id="anyOtherPassportNo"
                                name="anyOtherPassport"
                                className="mt-1"
                                value="no"
                                checked={values.anyOtherPassport === 'no'}
                                onChange={() =>
                                  setFieldValue('anyOtherPassport', 'no')
                                }
                              />
                              <label
                                htmlFor="anyOtherPassportNo"
                                className="font-semibold"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>

                        {values.anyOtherPassport === 'yes' && (
                          <>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Country of Issue*
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Please select country of issue
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <SelectField
                                  name="countryOfIssue"
                                  placeholder="Select"
                                  required={true}
                                  options={Country?.getAllCountries()?.map(
                                    country => ({
                                      value: country?.name,
                                      label: country?.name,
                                    })
                                  )}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Passport/IC No.
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Enter your passport IC number
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <TextInputField
                                  name="passportICNumber"
                                  placeholder="Enter passport/IC number"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Date of Issue*
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Please select Date of issue
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <ReactDatePickerInput
                                  className="new-form-input"
                                  name="dateOfIssuePassportIC"
                                  selected={
                                    values.dateOfIssuePassportIC
                                      ? new Date(values.dateOfIssuePassportIC)
                                      : null
                                  }
                                  setFieldValue={setFieldValue}
                                  maxDate={new Date()}
                                  label="Date of Issue"
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Place of Issue*
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Please select place of issue
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <TextInputField
                                  name="placeOfIssuePassportIC"
                                  placeholder="Enter place of issue"
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Nationality mentioned therein*
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Please select your nationality
                                  </div>
                                </div>
                              </label>
                              <div className="input-error-wrapper">
                                <SelectField
                                  name="passportNationalityMentionedTherein"
                                  placeholder="Select"
                                  required={true}
                                  options={Country?.getAllCountries()?.map(
                                    country => ({
                                      value: country?.name,
                                      label: country?.name,
                                    })
                                  )}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl md:block">
                    <h2 className="py-5 sidetext ">
                      Applicant's Passport Number
                    </h2>
                    <h2 className="py-4 sidetext ">Place of Issue</h2>
                    <h2 className="py-5 sidetext ">In dd/mm/yyyy format</h2>

                    <h2 className="py-2 sidetext ">
                      In dd/mm/yyyy format. minimum six months validity is from
                      journey date.
                    </h2>

                    <div className="pt-16">
                      <h2 className="py-5 sidetext ">Country of Issue</h2>
                      <h2 className="py-4 sidetext ">Passport IC Number</h2>
                      <h2 className="py-5 sidetext ">Date of issue</h2>
                      <h2 className="py-4 sidetext ">Place of issue</h2>

                      <h2 className="py-4 sidetext ">
                        Please Enter your nationality
                      </h2>
                    </div>
                  </div>
                </div>
                <p className="font-semibold">Mandatory Fields*</p>

                <div className="space-x-4 space-y-4 text-center md:space-y-0">
                  {postMutation.isError ? (
                    <div className="text-red-500">
                      An error occurred: {postMutation.error.message}
                    </div>
                  ) : null}
                  <Link href="/visa/step-one/update">
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
                    {postMutation.isPending ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Loading
                      </>
                    ) : (
                      'Save and Continue'
                    )}
                  </button>
                  {/* save and temporary exit button  */}
                  <button
                    disabled={temporaryExitUpdateMutation.isPending}
                    className={`formbtnDark cursor-pointer inline-flex items-center gap-3 ${
                      temporaryExitUpdateMutation.isPending
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                    }`}
                    type="button"
                    onClick={handleTemporaryExit}
                  >
                    {temporaryExitUpdateMutation.isPending ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Loading
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
};

export default StepTwo;
