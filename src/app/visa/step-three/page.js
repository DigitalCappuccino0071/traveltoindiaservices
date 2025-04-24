'use client';
import PhoneInputField from '@/components/common/PhoneInputField';
import SelectField from '@/components/common/SelectField';
import TextInputField from '@/components/common/TextInputField';
import MyDependentField from '@/components/india/MyFields';
import BannerPage from '@/components/india/common/BannerPage';
import Loading from '@/components/india/common/Loading';
import SavedFormId from '@/components/india/common/SavedFormId';
import {
  occupationList,
  step3ValidationSchema,
} from '@/constant/indiaConstant';
import { useFormContext } from '@/context/formContext';
import usePost from '@/hooks/usePost';
import useUpdate from '@/hooks/useUpdate';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { useQuery } from '@tanstack/react-query';
import { Country } from 'country-state-city';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect } from 'react';
import PaymentStatus from '@/components/india/common/PaymentStatus';

const StepThree = () => {
  const pathName = usePathname();
  const { state } = useFormContext();
  const router = useRouter();

  const {
    isPending: getAllStepsDataIsPending,
    error: getAllStepsDataError,
    data: getAllStepsData,
    isSuccess: getAllStepsDataIsSuccess,
    refetch,
  } = useQuery({
    queryKey: ['getAllStepsDataStep3'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
  });

  const postMutation = usePost(
    apiEndpoint.VISA_ADD_STEP3,
    3,
    '/visa/step-four',
    false,
    'getAllStepsDataStep4'
  );
  const temporaryExitUpdateMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP1_LAST_EXIT_STEP_URL,
    state.formId,
    'temporary step 3 saved successfully',
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

    if (
      getAllStepsDataError &&
      getAllStepsDataError?.response?.status !== 404
    ) {
      console.log('getAllStepsDataError', getAllStepsDataError);
      router.push('/visa/step-one');
      return;
    }

    if (getAllStepsDataIsSuccess) {
      if (!getAllStepsData?.data?.step2Data) {
        router.push('/visa/step-two');
        return;
      }

      if (getAllStepsData?.data?.step3Data) {
        router.push('/visa/step-three/update');
        return;
      }

      if (getAllStepsData?.data?.step1Data?.paid) {
        return <PaymentStatus />;
      }
    }
  }, [
    state?.formId,
    getAllStepsDataError,
    getAllStepsDataIsSuccess,
    getAllStepsData,
    router,
  ]);

  if (getAllStepsDataIsPending) {
    return <Loading />;
  }

  // if (
  //   getAllStepsDataIsSuccess &&
  //   getAllStepsData?.data?.step2Data &&
  //   !getAllStepsData?.data?.step3Data
  // ) {
  return (
    <>
      <BannerPage heading="Applicant Detail Form" />
      <Formik
        initialValues={{
          ...step3ValidationSchema.initialValues,
          emailAddress: getAllStepsData?.data
            ? getAllStepsData?.data.step1Data.emailId
            : '',
        }}
        validationSchema={step3ValidationSchema.yupSchema}
        validateOnChange={true}
        validateOnMount={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          postMutation.mutate({
            ...values,
            formId: state.formId,
            lastExitStepUrl: '/visa/step-four',
          });
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ values, isValid, handleSubmit, setFieldValue, handleChange }) => (
          <>
            <SavedFormId />
            <Form onSubmit={handleSubmit} className="container pt-4 pb-16">
              <div>
                <div>
                  <h2 className="text-3xl font-semibold">
                    Applicant&apos;s Address Details
                  </h2>
                  <hr className="h-1 text-primary bg-primary w-36" />
                </div>
                {/* Present Address
                  code start here */}
                <div className="pt-5 text-2xl font-semibold text-primary">
                  Present Address
                </div>
                <div className="grid gap-8 md:grid-cols-12 ">
                  <div className="col-span-8">
                    <div>
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="House No. Street"
                              name="houseNoStreet"
                              placeholder="Enter your house no. and street"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Village/Town/City"
                              name="villageTownCity"
                              placeholder="Enter your village/town/city"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Country"
                              name="country"
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
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="State/Province/District"
                              name="stateProvinceDistrict"
                              placeholder="Enter your State/Province/District"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Postal/Zip Code"
                              name="postalZipCode"
                              placeholder="Enter your Postal/Zip Code"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <Field name="phoneNo">
                              {({ field, form }) => (
                                <PhoneInputField
                                  label="Phone No."
                                  name="phoneNo"
                                  placeholder="Enter phone number"
                                  value={field.value}
                                  onChange={value => {
                                    form.setFieldValue(field.name, value);
                                  }}
                                  onBlur={field.onBlur}
                                  error={form.errors.phoneNo}
                                  touched={form.touched.phoneNo}
                                  required={true}
                                  form={form}
                                />
                              )}
                            </Field>
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <Field name="mobileNo">
                              {({ field, form }) => (
                                <PhoneInputField
                                  label="Mobile No."
                                  name="mobileNo"
                                  placeholder="Enter mobile number"
                                  value={field.value}
                                  onChange={value => {
                                    form.setFieldValue(field.name, value);
                                  }}
                                  onBlur={field.onBlur}
                                  error={form.errors.mobileNo}
                                  touched={form.touched.mobileNo}
                                  required={true}
                                  form={form}
                                />
                              )}
                            </Field>
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              required={true}
                              label="Email Address"
                              name="emailAddress"
                              disabled={true}
                              className="input-disabled"
                            />
                          </div>
                        </div>

                        <div className="flex items-center w-full py-2 space-x-3 font-medium">
                          <p>Click here for the same address</p>
                          <Field
                            type="checkbox"
                            id="sameAddress"
                            name="sameAddress"
                            className="w-4 h-4"
                          />
                        </div>

                        {/* Present Address
                  code end here */}

                        {/* permanent address code start here */}
                        <div className="text-2xl font-semibold text-primary">
                          Permanent Address
                        </div>

                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <MyDependentField
                              required={true}
                              label="House No. Street"
                              name="permanentAddressHouseNoStreet"
                              dependentFields={values.houseNoStreet}
                              sameAddress={values.sameAddress}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <MyDependentField
                              required={true}
                              label="Village/Town/City"
                              name="permanentAddressVillageTownCity"
                              dependentFields={values.villageTownCity}
                              sameAddress={values.sameAddress}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <MyDependentField
                              required={true}
                              label="State/Province/District"
                              name="permanentAddressStateProvinceDistrict"
                              dependentFields={values.stateProvinceDistrict}
                              sameAddress={values.sameAddress}
                            />
                          </div>
                        </div>
                        {/* permanent address code end here */}
                      </div>
                    </div>
                  </div>

                  <div className="flex-col justify-between hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                    <div>
                      <h2 className="py-2 sidetext ">
                        Applicant's permanent address (with postal/zip code)
                      </h2>
                      <h2 className="py-5 sidetext ">Village/Town/City</h2>
                      <h2 className="py-5 sidetext ">Country</h2>

                      <h2 className="py-3 sidetext ">State/Province/City</h2>

                      <h2 className="py-4 sidetext ">Postal Zip Code</h2>

                      <h2 className="py-5 sidetext ">Phone Number</h2>

                      <h2 className="py-4 sidetext ">Mobile Number</h2>
                      <h2 className="py-4 pt-24 sidetext">
                        Click here for same address
                      </h2>
                    </div>

                    <div>
                      <h2 className="py-2 sidetext">
                        Applicant's present address, maximum 35 characters (each
                        line)
                      </h2>
                      <h2 className="py-5 sidetext ">Village/Town/City</h2>
                      <h2 className="py-4 sidetext ">
                        State/Province/District
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <h2 className="text-3xl font-semibold">Family Details</h2>
                  <hr className="h-1 text-primary bg-primary w-36" />
                </div>
                <div className="pt-5 text-2xl font-semibold text-primary">
                  Father's Details
                </div>
                <div className="grid gap-8 md:grid-cols-12 ">
                  <div className="col-span-8">
                    <div>
                      {/* father mothers details */}
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Full Name"
                              name="fatherFullName"
                              placeholder="Enter your full name"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Nationality/Region"
                              name="fatherNationality"
                              placeholder="Select Nationality"
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
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Previous Nationality/Region"
                              name="fatherPreviousNationality"
                              placeholder="Select Previous Nationality"
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
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Place of birth"
                              name="fatherPlaceOfBirth"
                              placeholder="Enter your place of birth"
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Country of Birth"
                              name="fatherCountry"
                              placeholder="Select Country"
                              options={Country?.getAllCountries()?.map(
                                country => ({
                                  value: country?.name,
                                  label: country?.name,
                                })
                              )}
                            />
                          </div>
                        </div>
                        <div className="text-2xl font-semibold text-primary">
                          Mother's Details
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Full Name"
                              name="motherFullName"
                              placeholder="Enter your full name"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Nationality/Region"
                              name="motherNationality"
                              placeholder="Select Nationality"
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
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Previous Nationality/Region"
                              name="motherPreviousNationality"
                              placeholder="Select Previous Nationality"
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
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Place of birth"
                              name="motherPlaceOfBirth"
                              placeholder="Enter your place of birth"
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Country of Birth"
                              name="motherCountryOfBirth"
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
                      </div>
                      {/* father mothers details code end here */}
                    </div>
                  </div>

                  <div className="flex-col justify-between hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                    <div>
                      <h2 className="py-4 sidetext ">
                        Applicant's father name
                      </h2>
                      <h2 className="py-5 sidetext ">
                        Nationality / region of father
                      </h2>
                      <h2 className="py-4 sidetext ">
                        Previous nationality / Region of Father
                      </h2>
                      <h2 className="py-5 sidetext ">Place of birth</h2>
                      <h2 className="py-4 sidetext ">
                        Country / region of birth
                      </h2>
                    </div>

                    <div>
                      <h2 className="py-3 sidetext ">
                        Applicant's mother name
                      </h2>
                      <h2 className="py-5 sidetext ">
                        Nationality / region of mother
                      </h2>
                      <h2 className="py-4 sidetext ">
                        Previous nationality / Region of Mother
                      </h2>
                      <h2 className="py-5 sidetext ">Place of birth</h2>
                      <h2 className="py-4 sidetext ">
                        Country / region of birth
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="pt-5 text-2xl font-semibold text-primary">
                  Marital Status
                </div>
                <div className="grid gap-8 md:grid-cols-12 ">
                  <div className="col-span-8">
                    <div>
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Marital Status"
                              name="applicantMaritalStatus"
                              placeholder="Select Marital Status"
                              required={true}
                              options={[
                                { value: 'single', label: 'Single' },
                                { value: 'married', label: 'Married' },
                                { value: 'divorced', label: 'Divorced' },
                              ]}
                            />
                          </div>
                        </div>

                        {values.applicantMaritalStatus === 'married' && (
                          <div className="space-y-4">
                            <div className="pt-5 text-2xl font-semibold text-primary">
                              Spouse's Details
                            </div>

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Full Name"
                                  name="spouseFullName"
                                  placeholder="Enter your full name"
                                  required={true}
                                />
                              </div>
                            </div>

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <SelectField
                                  label="Nationality/Region"
                                  name="spouseNationality"
                                  placeholder="Select Nationality"
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
                              <div className="input-error-wrapper">
                                <SelectField
                                  label="Previous Nationality/Region"
                                  name="spousePreviousNationality"
                                  placeholder="Select Previous Nationality"
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
                              <div className="input-error-wrapper">
                                <TextInputField
                                  required={true}
                                  label="Place of birth"
                                  name="spousePlaceOfBirth"
                                  placeholder="Enter your place of birth"
                                />
                              </div>
                            </div>

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <SelectField
                                  label="Country of Birth"
                                  name="spouseCountryOfBirth"
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
                          </div>
                        )}

                        <div className="flex items-start py-2 space-x-2">
                          <label className="font-semibold">
                            Were your parents/Grandparents (paternal/maternal)
                            Pakistan Nationals or belong to Pakistan-held area.
                          </label>

                          <div className="flex space-x-4">
                            <div className="px-2 space-x-2">
                              <Field
                                type="radio"
                                id="parentsPakistanNationalYes"
                                name="parentsPakistanNational"
                                value="yes"
                              />
                              <label
                                htmlFor="parentsPakistanNationalYes"
                                className="font-semibold"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="px-2 space-x-2">
                              <Field
                                type="radio"
                                id="parentsPakistanNationalNo"
                                name="parentsPakistanNational"
                                value="no"
                              />
                              <label
                                htmlFor="parentsPakistanNationalNo"
                                className="font-semibold"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <ErrorMessage
                          name="parentsPakistanNational"
                          component="div"
                          className="text-red-500"
                        />

                        {values.parentsPakistanNational === 'yes' && (
                          <div className="form-input-main-div">
                            <div className="input-error-wrapper">
                              <TextInputField
                                label="If Yes, give details"
                                name="parentDetails"
                                placeholder="Enter details"
                                required={true}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-col justify-between hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                    <div>
                      <h2 className="py-4 sidetext ">
                        Applicant's Marital Status
                      </h2>
                      <h2 className="py-4 sidetext ">
                        Were your Parents/Grandparents (paternal/maternal)
                        Pakistan Nationals or belong to Pakistan held area? Yes
                        / No
                      </h2>
                      <h2 className="py-2 sidetext ">If Yes, give details</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="pt-5 text-2xl font-semibold text-primary">
                  Profession / Occupation Details of Applicant
                </div>
                <div className="grid gap-8 md:grid-cols-12 ">
                  <div className="col-span-8">
                    <div>
                      {/* profession occupation */}
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <SelectField
                              label="Present Occupation"
                              name="presentOccupation"
                              placeholder="Select Occupation"
                              required={true}
                              options={occupationList?.map(occupation => ({
                                value: occupation,
                                label: occupation,
                              }))}
                            />
                          </div>
                        </div>

                        {values.presentOccupation === 'Others' ? (
                          <div className="form-input-main-div">
                            <div className="input-error-wrapper">
                              <TextInputField
                                label="Present Other Occupation"
                                name="presentOtherOccupation"
                                placeholder="Enter occupation"
                                required={true}
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                        {values.presentOccupation === 'House Wife' ? (
                          <div className="form-input-main-div">
                            <div className="input-error-wrapper">
                              <SelectField
                                label="House Wife Occupation Details"
                                name="houseWifeOccupationDetails"
                                placeholder="Select Occupation"
                                required={true}
                                options={[
                                  { value: 'father', label: 'Father' },
                                  { value: 'spouse', label: 'Spouse' },
                                ]}
                              />
                            </div>
                          </div>
                        ) : (
                          ''
                        )}

                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Employer Name"
                              name="employerName"
                              placeholder="Enter employer name"
                              required={true}
                            />
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Designation"
                              name="designation"
                              placeholder="Enter designation"
                              required={true}
                            />
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Address"
                              name="address"
                              placeholder="Enter address"
                              required={true}
                            />
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <Field name="applicantPhone">
                              {({ field, form }) => (
                                <PhoneInputField
                                  label="Phone Number"
                                  name="applicantPhone"
                                  placeholder="Enter phone number"
                                  value={field.value}
                                  onChange={value => {
                                    form.setFieldValue(field.name, value);
                                  }}
                                  onBlur={field.onBlur}
                                  error={form.errors.applicantPhone}
                                  touched={form.touched.applicantPhone}
                                  required={true}
                                  form={form}
                                />
                              )}
                            </Field>
                          </div>
                        </div>

                        <div className="form-input-main-div">
                          <div className="input-error-wrapper">
                            <TextInputField
                              label="Past Occupation, if any"
                              name="pastOccupationIfAny"
                              placeholder="Enter past occupation"
                            />
                          </div>
                        </div>

                        <div className="flex items-start py-2 space-x-2">
                          <label className="font-semibold">
                            Are/were you in a
                            Military?Semi-Military/Police/Security Organization?
                          </label>

                          <div className="flex space-x-4">
                            <div className="px-2 space-x-2">
                              <Field
                                type="radio"
                                id="militaryYes"
                                name="militaryOrganization"
                                value="yes"
                              />
                              <label
                                htmlFor="militaryYes"
                                className="font-semibold"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="px-2 space-x-2">
                              <Field
                                type="radio"
                                id="militaryNo"
                                name="militaryOrganization"
                                value="no"
                              />
                              <label
                                htmlFor="militaryNo"
                                className="font-semibold"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>

                        {values.militaryOrganization === 'yes' && (
                          <>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Organization"
                                  name="organization"
                                  placeholder="Enter organization"
                                  required={true}
                                />
                              </div>
                            </div>

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Designation"
                                  name="militaryDesignation"
                                  placeholder="Enter designation"
                                  required={true}
                                />
                              </div>
                            </div>

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Rank"
                                  name="militaryRank"
                                  placeholder="Enter rank"
                                  required={true}
                                />
                              </div>
                            </div>

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Place of posting"
                                  name="placeOfPosting"
                                  placeholder="Enter place of posting"
                                  required={true}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {/* profession occupation code end here */}
                    </div>
                  </div>

                  <div className="flex-col justify-between hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                    <div>
                      <h2 className="py-4 sidetext ">
                        Please select your present occupation
                      </h2>
                      <h2 className="py-5 sidetext ">
                        Employer Name / Business
                      </h2>
                      <h2 className="py-4 sidetext ">Designation</h2>
                      <h2 className="py-5 sidetext ">Address</h2>
                      <h2 className="py-5 sidetext ">Phone Number</h2>
                      <h2 className="py-3 sidetext ">
                        Past Occupation, if any
                      </h2>
                      <h2 className="pt-6 sidetext ">If yes, give details</h2>
                    </div>

                    <div>
                      <h2 className="py-5 sidetext ">Organization</h2>
                      <h2 className="py-5 sidetext ">Designation</h2>
                      <h2 className="py-4 sidetext ">Rank</h2>
                      <h2 className="py-5 sidetext ">Place of posting</h2>
                    </div>
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
                <Link href="/visa/step-two/update">
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
  // }
};

export default StepThree;
