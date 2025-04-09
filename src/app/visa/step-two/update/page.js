'use client';
import Link from 'next/link';

import { Formik, Form, ErrorMessage } from 'formik';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { ImSpinner2 } from 'react-icons/im';
import { Country } from 'country-state-city';
import useUpdate from '@/hooks/useUpdate';
import { BsQuestionCircleFill } from 'react-icons/bs';
import {
  educationalQualificationList,
  nationalityRegionData,
  religionNames,
  step2ValidationSchema,
} from '@/constant/indiaConstant';
import { useFormContext } from '@/context/formContext';
import BannerPage from '@/components/india/common/BannerPage';
import { CiCalendarDate } from 'react-icons/ci';
import ReactDatePickerInput from '@/components/common/ReactDatePickerInput';
import TextInputField from '@/components/common/TextInputField';
import SelectField from '@/components/common/SelectField';

export default function StepTwoUpdate() {
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
    apiEndpoint.UPDATE_VISA_ADD_STEP2,
    getAllStepsData?.data?.step2Data?._id,
    2,
    '/visa/step-three',
    refetch
  );

  if (getAllStepsDataIsSuccess) {
    if (getAllStepsData.data.step2Data) {
      const { __v, _id, createdAt, updatedAt, ...cleanedStep2Data } =
        getAllStepsData?.data?.step2Data;

      return (
        <>
          <BannerPage heading="Applicant Detail Form" />

          <Formik
            initialValues={cleanedStep2Data}
            validationSchema={step2ValidationSchema.yupSchema}
            validateOnChange={true}
            validateOnMount={true}
            onSubmit={(values, { setSubmitting }) => {
              updateMutation.mutate({ ...values, formId: state.formId });
              setSubmitting(false);
            }}
          >
            {({ values, isValid, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit} className="container py-16">
                <div>
                  <h2 className="text-3xl font-semibold">Applicant Details</h2>
                  <hr className="h-1 text-primary bg-primary w-36" />
                </div>
                <div className="grid grid-cols-12 gap-8 ">
                  <div className="col-span-8">
                    <div>
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <label className="form-label">First Name*</label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="firstName"
                              placeholder="Enter your first name"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">Last Name*</label>
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
                          <label className="form-label">Gender*</label>
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
                          <label className="form-label">Date Of Birth</label>
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
                          </label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="citizenshipNationalID"
                              placeholder="Enter your Citizenship/National ID"
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">Religion</label>
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
                          <label className="form-label">Nationality</label>
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
                  <div className="col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
                    <h2 className="py-5 sidetext ">
                      First name (Exactly as in passport)
                    </h2>
                    <h2 className="py-4 sidetext ">
                      Last name (Exactly as in passport)
                    </h2>
                    <h2 className="py-3 sidetext ">
                      If you have ever changes your name <br /> please tell us.
                    </h2>

                    <h2 className="py-3 sidetext ">Fill your gender</h2>

                    <h2 className="py-3 sidetext ">
                      Date of birth as in passport in dd/mm/yyyy format
                    </h2>

                    <h2 className="py-4 sidetext ">
                      Province/town/city of birth
                    </h2>

                    <h2 className="py-5 sidetext ">Country/Region of birth</h2>

                    <h2 className="py-3 sidetext ">
                      If not applicable please type NA
                    </h2>
                    <h2 className="py-6 sidetext ">
                      If Others. Please specify
                    </h2>

                    <h2 className="py-3 sidetext ">
                      Visible identification marks
                    </h2>

                    <h2 className="py-6 sidetext ">
                      Educational Qualification
                    </h2>

                    <h2 className="py-4 sidetext ">Nationality/Region</h2>
                    <h2 className="sidetext py-7 ">Nationality/Region</h2>
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
                <div className="grid grid-cols-12 gap-8 ">
                  <div className="col-span-8">
                    <div>
                      <div className="formMain">
                        <div className="form-input-main-div">
                          <label className="form-label">Passport Number*</label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="passportNumber"
                              placeholder="Enter passport number"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          <label className="form-label">Place of Issue*</label>
                          <div className="input-error-wrapper">
                            <TextInputField
                              name="placeOfIssue"
                              placeholder="Enter place of issue"
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="form-input-main-div">
                          {/* <label className="form-label">Date of Issue*</label> */}
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
                          {/* <label className="form-label">Date of Expiry*</label> */}
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
                              </label>
                              <div className="input-error-wrapper">
                                <TextInputField
                                  name="passportICNumber"
                                  placeholder="Enter passport/IC number"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              {/* <label className="form-label">
                                Date of Issue*
                              </label> */}
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
                  <div className="col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
                    <h2 className="py-5 sidetext ">
                      Applicant's Passport Number
                    </h2>
                    <h2 className="py-4 sidetext ">Place of Issue</h2>
                    <h2 className="py-5 sidetext ">In dd/mm/yyyy format</h2>

                    <h2 className="py-2 sidetext ">
                      In dd/mm/yyyy format. minimum six months validity is from
                      journey date.
                    </h2>

                    <h2 className="py-4 sidetext ">
                      If yes please give details
                    </h2>

                    <h2 className="py-5 sidetext ">Country/Region of Issue</h2>

                    <h2 className="py-4 sidetext ">Passport No.</h2>
                    <h2 className="py-5 sidetext ">
                      Date of Issue (In dd/mm/yyyy format)
                    </h2>

                    <h2 className="py-5 sidetext ">Place of Issue</h2>
                    <h2 className="py-3 sidetext ">
                      Nationality described therein.
                    </h2>
                  </div>
                </div>
                <p className="font-semibold">Mandatory Fields*</p>

                <div className="space-x-4 text-center">
                  {updateMutation.isError ? (
                    <div className="text-red-500">
                      An error occurred: {updateMutation.error.message}
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

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full pt-20">
        <ImSpinner2 className="w-4 h-4 text-black animate-spin" />
        loading
      </div>
    );
  }
}
