'use client';
import React from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { ImSpinner2 } from 'react-icons/im';
import usePost from '@/hooks/usePost';
import { useQuery } from '@tanstack/react-query';
import lodash from 'lodash';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import useUpdate from '@/hooks/useUpdate';
import BannerPage from '@/components/india/common/BannerPage';
import {
  airportsSeaports,
  step4ValidationSchema,
  visaTypesList,
} from '@/constant/indiaConstant';
import axiosInstance from '@/services/api';
import { useFormContext } from '@/context/formContext';
import apiEndpoint from '@/services/apiEndpoint';
import SavedFormId from '@/components/india/common/SavedFormId';
import TextInputField from '@/components/common/TextInputField';
import SelectField from '@/components/common/SelectField';
import ReactDatePickerInput from '@/components/common/ReactDatePickerInput';
import PhoneInputField from '@/components/common/PhoneInputField';
import MultiReactSelectFormik from '@/components/india/MultiReactSelectFormik';
import { BsFillQuestionCircleFill, BsQuestionCircleFill } from 'react-icons/bs';
import MultiSelectField from '@/components/common/MultiSelectField';

const StepFour = () => {
  const { state } = useFormContext();

  const {
    isPending: getAllStepsDataIsPending,
    error: getAllStepsDataIsError,
    data: getAllStepsData,
    isSuccess: getAllStepsDataIsSuccess,
    refetch: getAllStepsDataRefetch,
  } = useQuery({
    queryKey: ['getAllStepsData'],
    queryFn: () =>
      axiosInstance.get(`${apiEndpoint.GET_ALL_STEPS_DATA}${state.formId}`),
    enabled: !!state.formId,
  });

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
    apiEndpoint.VISA_ADD_STEP4,
    4,
    '/visa/step-five'
  );

  const updateMutation = useUpdate(
    apiEndpoint.UPDATE_VISA_ADD_STEP4,
    getAllStepsData?.data?.step4Data?._id,
    4,
    '/visa/step-five',
    getAllStepsDataRefetch
  );

  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );
  if (getStep1DataIsSuccess && getAllStepsDataIsSuccess) {
    if (getAllStepsData.data.step4Data) {
      const { __v, _id, createdAt, updatedAt, ...cleanedStep4Data } =
        getAllStepsData?.data?.step4Data;
      const visaServiceSelected = step1Data?.data?.visaService
        ? lodash.camelCase(step1Data?.data?.visaService)
        : '';
      const visaServiceSelectedValue = step1Data?.data?.[visaServiceSelected];

      const getDurationOfVisa = (
        visaServiceSelected,
        visaServiceSelectedValue
      ) => {
        const value =
          visaServiceSelected === 'eTouristVisa'
            ? visaServiceSelectedValue
            : visaServiceSelected;

        switch (value) {
          case 'visa1Year':
          case 'eBusinessVisa':
            return '1 Year';
          case 'visa5Years':
            return '5 Years';
          case 'visa30days':
          case 'eConferenceVisa':
            return '30 Days';
          case 'eMedicalVisa':
          case 'eMedicalAttendantVisa':
            return '60 Days';

          default:
            return '6 Months';
        }
      };
      const getNumberOfEntries = (
        visaServiceSelected,
        visaServiceSelectedValue
      ) => {
        const value =
          visaServiceSelected === 'eTouristVisa'
            ? visaServiceSelectedValue
            : visaServiceSelected;

        switch (value) {
          case 'visa30days':
            return 'Double';
          case 'visa1Year':
          case 'visa5Years':
          case 'eBusinessVisa':
            return 'Multiple';
          case 'eConferenceVisa':
            return 'Single';
          case 'eMedicalVisa':
          case 'eMedicalAttendantVisa':
            return 'Triple';

          default:
            return 'Double';
        }
      };

      return (
        <>
          <BannerPage heading="Applicant Detail Form" />

          <Formik
            initialValues={{
              ...cleanedStep4Data,
              countryVisitedInLast10Years:
                cleanedStep4Data.countryVisitedInLast10Years
                  ? cleanedStep4Data.countryVisitedInLast10Years.map(
                      country => ({
                        label: country,
                        value: country,
                      })
                    )
                  : [],
              visaService: step1Data.data ? step1Data.data.visaService : '',
              portOfArrival: step1Data.data ? step1Data.data.portOfArrival : '',
              durationOfVisa: getDurationOfVisa(
                visaServiceSelected,
                visaServiceSelectedValue
              ),
              numberOfEntries: getNumberOfEntries(
                visaServiceSelected,
                visaServiceSelectedValue
              ),
              visaServiceSelectedValueValidation:
                visaServiceSelected !== 'eBusinessVisa'
                  ? visaServiceSelected
                  : visaServiceSelectedValue,
            }}
            validationSchema={step4ValidationSchema.yupSchema}
            validateOnChange={true}
            validateOnMount={true}
            onSubmit={(values, { setSubmitting }) => {
              updateMutation.mutate({
                ...values,
                formId: state.formId,
                countryVisitedInLast10Years:
                  values.countryVisitedInLast10Years.map(
                    option => option.value
                  ),
              });
              setSubmitting(false);
            }}
          >
            {({
              values,
              isValid,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              errors,
              touched,
            }) => (
              <>
                <SavedFormId />
                <Form onSubmit={handleSubmit} className="container pt-4 pb-16">
                  <div>
                    <div>
                      <h2 className="text-3xl font-semibold">
                        Details of Visa Sought
                      </h2>
                      <hr className="h-1 text-primary bg-primary w-36" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-12 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Type of Visa"
                                  name="visaType"
                                  placeholder="Enter type of visa"
                                  required={true}
                                  disabled={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Type of Visa Service"
                                  name="visaService"
                                  placeholder="Enter type of visa service"
                                  required={true}
                                  disabled={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <Field name="contactNo">
                                  {({ field, form }) => (
                                    <PhoneInputField
                                      label="Contact No."
                                      name="contactNo"
                                      placeholder="Enter contact number"
                                      value={field.value}
                                      onChange={value => {
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={field.onBlur}
                                      error={form.errors.contactNo}
                                      touched={form.touched.contactNo}
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
                                  label="Places to be visited"
                                  name="placesToVisit"
                                  placeholder="Enter places to be visited"
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Places to be visited"
                                  name="placesToVisit2"
                                  placeholder="Enter places to be visited"
                                  required={true}
                                />
                              </div>
                            </div>

                            {/* hotel resorts */}
                            <div className="flex items-start py-2 space-x-2">
                              <label className="font-semibold">
                                Have you booked any Room in Hotel/Resorts Etc.
                                Through any Tour Operator?
                              </label>
                              <div className="flex space-x-4">
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="bookedHotelYes"
                                    name="bookedHotel"
                                    value="yes"
                                  />
                                  <label
                                    htmlFor="bookedHotelYes"
                                    className="font-semibold"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="bookedHotelNo"
                                    name="bookedHotel"
                                    value="no"
                                  />
                                  <label
                                    htmlFor="bookedHotelNo"
                                    className="font-semibold"
                                  >
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>

                            {values.bookedHotel === 'yes' && (
                              <>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Name of the tour operator"
                                      name="bookedHotelTourOperatorName"
                                      placeholder="Enter name of the tour operator"
                                      required={true}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Address of the tour operator"
                                      name="bookedHotelTourOperatorAddress"
                                      placeholder="Enter address of the tour operator"
                                      required={true}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Name of the hotel/resort"
                                      name="bookedHotelName"
                                      placeholder="Enter name of the hotel/resort"
                                      required={true}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Place of stay"
                                      name="bookedHotelPlace"
                                      placeholder="Enter place of stay"
                                      required={true}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            {/* hotel resorts code end here */}

                            <div className="form-input-main-div">
                              <TextInputField
                                label="Duration of Visa"
                                name="durationOfVisa"
                                placeholder="Enter duration of visa"
                                disabled={true}
                                required={true}
                              />
                            </div>
                            <div className="form-input-main-div">
                              <TextInputField
                                label="Number of Entries"
                                name="numberOfEntries"
                                placeholder="Enter number of entries"
                                disabled={true}
                                required={true}
                              />
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Port of Arrival in India"
                                  name="portOfArrival"
                                  placeholder="Enter port of arrival"
                                  disabled={true}
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <SelectField
                                  label="Expected Port of Exit"
                                  name="expectedPortOfExit"
                                  placeholder="Select Expected Port of Exit"
                                  required={true}
                                  options={airportsSeaports?.map(
                                    airportSeaport => ({
                                      value: airportSeaport,
                                      label: airportSeaport,
                                    })
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-col justify-center hidden col-span-4 px-4 pt-10 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                        <h2 className="py-5 sidetext ">
                          If you intend to visit Protected/Restricted/
                          Cantonment areas, you would require prior permission
                          from the Civil Authority.
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h2 className="text-3xl font-semibold">
                        Previous Visa/Currently valid Visa Details
                      </h2>
                      <hr className="h-1 text-primary bg-primary w-36" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-12 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="flex items-start py-2 space-x-2">
                              <label className="font-semibold">
                                Have you ever visited India before?*
                              </label>
                              <div className="flex space-x-4">
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="yes"
                                    name="visitedIndiaBefore"
                                    value="yes"
                                    checked={
                                      values.visitedIndiaBefore === 'yes'
                                    }
                                  />
                                  <label
                                    htmlFor="yes"
                                    className="font-semibold"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="no"
                                    name="visitedIndiaBefore"
                                    value="no"
                                    checked={values.visitedIndiaBefore === 'no'}
                                  />
                                  <label htmlFor="no" className="font-semibold">
                                    No
                                  </label>
                                </div>
                                <ErrorMessage
                                  name="visitedIndiaBefore"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            {values.visitedIndiaBefore === 'yes' && (
                              <div className="space-y-4">
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Address of stay during your last visit"
                                      name="visitedIndiaBeforeVisaAddress"
                                      placeholder="Enter address of stay during your last visit"
                                      required={true}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Cities previously visited in India"
                                      name="visitedIndiaBeforeCitiesVisitedInIndia"
                                      placeholder="Enter cities previously visited in India"
                                      required={true}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Last Indian Visa no./Currently valid Indian Visa no."
                                      name="visitedIndiaBeforeLastIndianVisaNo"
                                      placeholder="Enter last Indian Visa no./Currently valid Indian Visa no."
                                      required={true}
                                    />
                                  </div>
                                </div>

                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <SelectField
                                      label="Type of Visa"
                                      name="visitedIndiaBeforeTypeOfVisa"
                                      placeholder="Select Type of Visa"
                                      required={true}
                                      options={visaTypesList?.map(
                                        visaTypeL => ({
                                          value: visaTypeL,
                                          label: visaTypeL,
                                        })
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Place of Issue"
                                      name="visitedIndiaBeforePlaceOfIssue"
                                      placeholder="Enter place of issue"
                                      required={true}
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <ReactDatePickerInput
                                      className="new-form-input"
                                      name="visitedIndiaBeforeDateOfIssue"
                                      selected={
                                        values.visitedIndiaBeforeDateOfIssue
                                      }
                                      setFieldValue={setFieldValue}
                                      maxDate={new Date()}
                                      variant="dob"
                                      label="Date Of Issue"
                                      required={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex items-start py-2 space-x-2">
                              <label className="font-semibold">
                                Has permission to visit or to extend stay in
                                India previously been refused?
                              </label>
                              <div className="flex space-x-4">
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="yes"
                                    name="permissionRefused"
                                    value="yes"
                                  />
                                  <label
                                    htmlFor="yes"
                                    className="font-semibold"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="no"
                                    name="permissionRefused"
                                    value="no"
                                  />
                                  <label htmlFor="no" className="font-semibold">
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>

                            {values.permissionRefused === 'yes' && (
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="If so, when and by whom (Mention Control No. and
                                date also)"
                                    name="refusalDetails"
                                    placeholder="Enter if so, when and by whom (Mention Control No. and
                                date also)"
                                    required={true}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {values.visitedIndiaBefore === 'yes' && (
                        <div className="flex flex-col justify-between col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl md:block">
                          <div>
                            <h2 className="py-5 sidetext ">
                              If yes please give details
                            </h2>
                            <h2 className="py-3 sidetext ">
                              Enter the address of stay during your last visit
                            </h2>
                          </div>

                          <div>
                            <h2 className="pt-8 sidetext ">
                              Cities in India visited (comma seperated)
                            </h2>
                          </div>

                          <div className="pt-32">
                            <h2 className="py-5 sidetext">
                              Last Indian visa no. / Currently valid Visa no.
                            </h2>
                            <h2 className="py-6 sidetext ">Type of Visa</h2>
                            <h2 className="py-3 sidetext ">Place of Issue</h2>
                            <h2 className="py-6 sidetext ">
                              Date of issue in (dd/mm/yyyy) format
                            </h2>
                            <h2 className="py-2 sidetext ">
                              Refuse details Yes/No
                            </h2>
                          </div>

                          <div>
                            <h2 className="py-8 sidetext ">
                              If so, when and by whom (mentioned control no and
                              date)
                            </h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* feilds for visa type--- e-medical start */}
                  {visaServiceSelected === 'eMedicalVisa' &&
                  visaServiceSelectedValue ===
                    'SHORT TERM MEDICAL TREATMENT OF SELF' ? (
                    <div>
                      <div>
                        <h2 className="text-3xl font-semibold">
                          Details of Purpose{' '}
                          <span className="text-lg">
                            ({visaServiceSelectedValue})
                          </span>
                        </h2>
                        <hr className="h-1 text-primary bg-primary w-36" />
                      </div>

                      <div className="grid gap-8 md:grid-cols-12 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name of the Hospital where Medical treatment is
                                to be carried out"
                                    name="eMedicalNameOfHospital"
                                    placeholder="Enter Name of the Hospital where Medical treatment is
                                to be carried out"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Address of the Hospital where Medical treatment is
                                to be carried out"
                                    name="eMedicalAddressOfHospital"
                                    placeholder="Enter Address of the Hospital where Medical treatment is
                                to be carried out"
                                    required={true}
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <Field name="eMedicalPhoneOfHospital">
                                    {({ field, form }) => (
                                      <PhoneInputField
                                        label="Phone No."
                                        name="eMedicalPhoneOfHospital"
                                        placeholder="Enter phone number"
                                        value={field.value}
                                        onChange={value => {
                                          form.setFieldValue(field.name, value);
                                        }}
                                        onBlur={field.onBlur}
                                        error={
                                          form.errors.eMedicalPhoneOfHospital
                                        }
                                        touched={
                                          form.touched.eMedicalPhoneOfHospital
                                        }
                                        required={true}
                                        form={form}
                                      />
                                    )}
                                  </Field>
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <SelectField
                                    label="State"
                                    name="eMedicalStateOfHospital"
                                    placeholder="Select State"
                                    required={true}
                                    options={State?.getStatesOfCountry(
                                      'IN'
                                    )?.map((ele, index) => ({
                                      value: ele?.name,
                                      label: ele?.name,
                                    }))}
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <SelectField
                                    label="District"
                                    name="eMedicalDistrictOfHospital"
                                    placeholder="Select District"
                                    required={true}
                                    options={City?.getCitiesOfState(
                                      'IN',
                                      State?.getStatesOfCountry('IN')
                                        .filter(
                                          state =>
                                            state?.name ===
                                            values?.eMedicalStateOfHospital
                                        )
                                        .map(state => state.isoCode)[0] ?? ''
                                    )?.map((elecity, indexcity) => ({
                                      value: elecity?.name,
                                      label: elecity?.name,
                                    }))}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Type of Medical Treatment required"
                                    name="eMedicalTypeOfMedicalTreatment"
                                    placeholder="Enter Type of Medical Treatment required"
                                    required={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-col justify-end hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                          <h2 className="py-6 sidetext ">No. of entries</h2>
                          <h2 className="py-4 sidetext ">
                            Port of arrival in India
                          </h2>
                          <h2 className="py-4 sidetext ">
                            Expected port of exit from India
                          </h2>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* feilds for visa type--- e-medical end  */}

                  {/* feilds for visa type--- e-bussiness start */}
                  {visaServiceSelected === 'eBusinessVisa' &&
                  visaServiceSelectedValue !== 'CONDUCTING TOURS' &&
                  visaServiceSelectedValue !==
                    'TO DELIVER LECTURE/S UNDER GLOBAL INITIATIVE FOR ACADEMIC NETWORKS (GIAN)' ? (
                    <div>
                      <div>
                        <h2 className="text-3xl font-semibold">
                          Details of Purpose{' '}
                          <span className="text-lg">
                            ({visaServiceSelectedValue} )
                          </span>
                        </h2>
                        <hr className="h-1 text-primary bg-primary w-36" />
                      </div>

                      <div className="grid gap-8 md:grid-cols-12 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <b>Details of the Applicants Company</b>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name"
                                    name="eBusinessCompanyName"
                                    placeholder="Enter Name"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Address"
                                    name="eBusinessCompanyAddress"
                                    placeholder="Enter Address"
                                    required={true}
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <Field name="eBusinessCompanyPhone">
                                    {({ field, form }) => (
                                      <PhoneInputField
                                        label="Phone No."
                                        name="eBusinessCompanyPhone"
                                        placeholder="Enter phone number"
                                        value={field.value}
                                        onChange={value => {
                                          form.setFieldValue(field.name, value);
                                        }}
                                        onBlur={field.onBlur}
                                        error={
                                          form.errors.eBusinessCompanyPhone
                                        }
                                        touched={
                                          form.touched.eBusinessCompanyPhone
                                        }
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
                                    label="Website"
                                    name="eBusinessCompanyWebsite"
                                    placeholder="Enter Website"
                                    required={true}
                                  />
                                </div>
                              </div>

                              {visaServiceSelectedValue ===
                                'TO SET UP INDUSTRIAL/BUSINESS VENTURE' ||
                              visaServiceSelectedValue ===
                                'SALE/PURCHASE/TRADE' ? (
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Nature of Business"
                                      name="eBusinessCompanyNatures"
                                      placeholder="Enter Nature of Business"
                                      required={true}
                                    />
                                  </div>
                                </div>
                              ) : null}
                              {visaServiceSelectedValue ===
                                'ATTEND TECHNICAL/BUSINESS MEETINGS' ||
                              visaServiceSelectedValue ===
                                'EXPERT/SPECIALIST IN CONNECTION WITH AN ONGOING PROJECT' ? (
                                <>
                                  {' '}
                                  <b>Details of Indian Firm</b>
                                  <div className="form-input-main-div">
                                    <div className="input-error-wrapper">
                                      <TextInputField
                                        label="Name"
                                        name="eBusinessAttendTechMeetingName"
                                        placeholder="Enter Name"
                                        required={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <div className="input-error-wrapper">
                                      <TextInputField
                                        label="Address"
                                        name="eBusinessAttendTechMeetingAddress"
                                        placeholder="Enter Address"
                                        required={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <div className="input-error-wrapper">
                                      <Field name="eBusinessAttendTechMeetingPhone">
                                        {({ field, form }) => (
                                          <PhoneInputField
                                            label="Phone No."
                                            name="eBusinessAttendTechMeetingPhone"
                                            placeholder="Enter phone number"
                                            value={field.value}
                                            onChange={value => {
                                              form.setFieldValue(
                                                field.name,
                                                value
                                              );
                                            }}
                                            onBlur={field.onBlur}
                                            error={
                                              form.errors
                                                .eBusinessAttendTechMeetingPhone
                                            }
                                            touched={
                                              form.touched
                                                .eBusinessAttendTechMeetingPhone
                                            }
                                            required={true}
                                            form={form}
                                          />
                                        )}
                                      </Field>
                                    </div>
                                  </div>
                                </>
                              ) : null}

                              {visaServiceSelectedValue ===
                              'TO RECRUIT MANPOWER' ? (
                                <>
                                  <div className="form-input-main-div">
                                    <label className="form-label">
                                      Name and contact number of the company
                                      representative in India
                                    </label>
                                    <div className="input-error-wrapper">
                                      <TextInputField
                                        label="Name"
                                        name="eBusinessRecruitManpowerNamecontactCompanyRepresentative"
                                        placeholder="Enter Name"
                                        required={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <div className="input-error-wrapper">
                                      <TextInputField
                                        label="Nature of Job"
                                        name="eBusinessRecruitManpowerNatureOfJob"
                                        placeholder="Enter Nature of Job"
                                        required={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <div className="input-error-wrapper">
                                      <TextInputField
                                        label="Places of Recruitment Conducted"
                                        name="eBusinessRecruitManpowerPlacesRecruitmentConducted"
                                        placeholder="Enter Places of Recruitment Conducted"
                                        required={true}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : null}

                              {visaServiceSelectedValue ===
                              'PARTICIPATION IN EXHIBITIONS,BUSINESS/TRADE FAIRS' ? (
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Name and Address"
                                      name="eBusinessParticipationInExhibitionsNameAndAddress"
                                      placeholder="Enter Name and Address"
                                      required={true}
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="flex-col justify-end hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl"></div>
                      </div>
                    </div>
                  ) : null}

                  {/* feild for  */}
                  {visaServiceSelected === 'eBusinessVisa' &&
                  visaServiceSelectedValue === 'CONDUCTING TOURS' ? (
                    <div>
                      <div>
                        <h2 className="text-3xl font-semibold">
                          Details of Purpose ({visaServiceSelectedValue})
                        </h2>
                        <hr className="h-1 text-primary bg-primary w-36" />
                      </div>

                      <div className="grid gap-8 md:grid-cols-12 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Name and address of the Travel Agency in
                                  native country
                                </label>
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name and Address"
                                    name="eBusinessConductingToursNameAndAddress"
                                    placeholder="Enter Name and Address"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Cities"
                                    name="eBusinessConductingToursCities"
                                    placeholder="Enter Cities"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <b>
                                Details of the Travel agent/associate in India
                              </b>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name"
                                    name="eBusinessConductingToursTravelAgencyName"
                                    placeholder="Enter Name"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <Field name="eBusinessConductingToursTravelAgencyPhone">
                                    {({ field, form }) => (
                                      <PhoneInputField
                                        label="Phone No."
                                        name="eBusinessConductingToursTravelAgencyPhone"
                                        placeholder="Enter phone number"
                                        value={field.value}
                                        onChange={value => {
                                          form.setFieldValue(field.name, value);
                                        }}
                                        onBlur={field.onBlur}
                                        error={
                                          form.errors
                                            .eBusinessConductingToursTravelAgencyPhone
                                        }
                                        touched={
                                          form.touched
                                            .eBusinessConductingToursTravelAgencyPhone
                                        }
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
                                    label="Address"
                                    name="eBusinessConductingToursTravelAgencyAddress"
                                    placeholder="Enter Address"
                                    required={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-col justify-end hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                          <h2 className="py-6 sidetext ">No. of entries</h2>
                          <h2 className="py-4 sidetext ">
                            Port of arrival in India
                          </h2>
                          <h2 className="py-4 sidetext ">
                            Expected port of exit from India
                          </h2>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* feilds for visa type--- e-bussiness end  */}

                  {/* feilds for visa type--- eMEDICAL ATTENDANT VISA start */}
                  {visaServiceSelected === 'eMedicalAttendantVisa' ? (
                    <div>
                      <div>
                        <h2 className="text-3xl font-semibold">
                          Details of Purpose{' '}
                          <span className="text-lg">
                            ({visaServiceSelectedValue})
                          </span>
                        </h2>
                        <hr className="h-1 text-primary bg-primary w-36" />
                      </div>

                      <div className="grid gap-8 md:grid-cols-12 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name"
                                    name="eMedicalAttendantNameVisaHolder"
                                    placeholder="Enter Name"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="flex items-start py-2 space-x-2">
                                <div className="flex space-x-4">
                                  <div className="px-2 space-x-2">
                                    <Field
                                      type="radio"
                                      id="eMEDICALATTENDANTVisaNo"
                                      name="eMedicalAttendantAppOrVisa"
                                      value="visaNo"
                                    />
                                    <label htmlFor="eMEDICALATTENDANTVisaNo">
                                      Visa No.
                                    </label>
                                  </div>
                                  <div className="px-2 space-x-2">
                                    <Field
                                      type="radio"
                                      id="eMEDICALATTENDANTAppId"
                                      name="eMedicalAttendantAppOrVisa"
                                      value="applicationId"
                                    />
                                    <label htmlFor="eMEDICALATTENDANTAppId">
                                      Application id
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {values.eMedicalAttendantAppOrVisa ===
                              'visaNo' ? (
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Visa Number"
                                      name="eMedicalAttendantVisaNumberOfVisaHolder"
                                      placeholder="Enter Visa Number"
                                      required={true}
                                    />
                                  </div>
                                </div>
                              ) : null}

                              {values.eMedicalAttendantAppOrVisa ===
                              'applicationId' ? (
                                <div className="form-input-main-div">
                                  <div className="input-error-wrapper">
                                    <TextInputField
                                      label="Application Id"
                                      name="eMedicalAttendantApplicationIdOfVisaHolder"
                                      placeholder=" Application id of principal e-Medical Visa
                                  holder (only on select Application id)"
                                      required={true}
                                    />
                                  </div>
                                </div>
                              ) : null}

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Passport Number"
                                    name="eMedicalAttendantPassportNumberOfVisaHolder"
                                    placeholder=" Passport number of principal e-Medical Visa
                                holder"
                                    required={true}
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Date of birth"
                                    name="eMedicalAttendantDobOfVisaHolder"
                                    placeholder="Date of birth of principal e-Medical Visa holder"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Nationality"
                                    name="eMedicalAttendantNationalityOfVisaHolder"
                                    placeholder="Nationality of principal e-Medical Visa Select
                                nationality v holder"
                                    required={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-col justify-between hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                          <div>
                            <h2 className="py-2 sidetext ">
                              Name of the principal e-Medical Visa holder (i.e.
                              the patient)
                            </h2>
                          </div>
                          <div>
                            <h2 className="py-4 sidetext ">
                              Passport number of principal e-Medical Visa holder
                            </h2>
                            <h2 className="py-6 sidetext ">
                              Date of birth of principal e-Medical Visa holder
                            </h2>
                            <h2 className="py-4 sidetext ">
                              Nationality of principal e-Medical Visa Select
                              nationality v holder
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* feilds for visa type--- eMEDICAL ATTENDANT VISA end  */}
                  {/* feilds for visa type ---conference visa start  */}
                  {visaServiceSelected === 'eConferenceVisa' ? (
                    <div>
                      <div>
                        <h2 className="text-3xl font-semibold">
                          Details of Purpose
                          <span className="text-lg">
                            ({visaServiceSelectedValue})
                          </span>
                        </h2>
                        <hr className="h-1 text-primary bg-primary w-36" />
                      </div>

                      <div className="grid gap-8 md:grid-cols-12 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name of conference"
                                    name="eConferenceNameOfConference"
                                    placeholder="Enter Name of conference"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <b>Duration of conference</b>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <ReactDatePickerInput
                                    className="new-form-input"
                                    name="eConferenceStartDate"
                                    selected={values.eConferenceStartDate}
                                    setFieldValue={setFieldValue}
                                    label="Start Date"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <ReactDatePickerInput
                                    className="new-form-input"
                                    name="eConferenceEndDate"
                                    selected={values.eConferenceEndDate}
                                    setFieldValue={setFieldValue}
                                    label="End Date"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <b>Venue of conference</b>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Address"
                                    name="eConferenceAddress"
                                    placeholder="Enter Address"
                                    required={true}
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <SelectField
                                    name="eConferenceState"
                                    label="State"
                                    required={true}
                                    placeholder="Select"
                                    options={State?.getStatesOfCountry(
                                      'IN'
                                    )?.map((ele, index) => ({
                                      value: ele?.name,
                                      label: ele?.name,
                                    }))}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <SelectField
                                    disabled={!values?.eConferenceState}
                                    disabledReason={'Please select state first'}
                                    name="eConferenceDistrict"
                                    label="District"
                                    required={true}
                                    placeholder="Select"
                                    options={City?.getCitiesOfState(
                                      'IN',
                                      State?.getStatesOfCountry('IN')
                                        .filter(
                                          state =>
                                            state?.name ===
                                            values?.eConferenceState
                                        )
                                        .map(state => state.isoCode)[0] ?? ''
                                    )?.map((elecity, indexcity) => ({
                                      value: elecity?.name,
                                      label: elecity?.name,
                                    }))}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Pincode"
                                    name="eConferencePincode"
                                    placeholder="Enter Pincode"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <b>Details of organizer of conference</b>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Name of organizer"
                                    name="eConferenceNameOfOrganizer"
                                    placeholder="Enter Name of organizer"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <TextInputField
                                    label="Address"
                                    name="eConferenceAddressOfOrganizer"
                                    placeholder="Enter Address"
                                    required={true}
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <div className="input-error-wrapper">
                                  <Field name="eConferencePhoneOfOrganizer">
                                    {({ field, form }) => (
                                      <PhoneInputField
                                        label="Phone no"
                                        name="eConferencePhoneOfOrganizer"
                                        placeholder="Enter phone number"
                                        value={field.value}
                                        onChange={value => {
                                          form.setFieldValue(field.name, value);
                                        }}
                                        onBlur={field.onBlur}
                                        error={
                                          form.errors
                                            .eConferencePhoneOfOrganizer
                                        }
                                        touched={
                                          form.touched
                                            .eConferencePhoneOfOrganizer
                                        }
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
                                    label="Email"
                                    name="eConferenceEmailOfOrganizer"
                                    placeholder="Enter Email"
                                    required={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-col justify-end hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl"></div>
                      </div>
                    </div>
                  ) : null}

                  {/* feilds for visa type ---conference visa end  */}

                  <div>
                    <div>
                      <h2 className="text-3xl font-semibold">
                        Other Information
                      </h2>
                      <hr className="h-1 text-primary bg-primary w-36" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-12 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Countries Visited in last 10 years
                                <div className="relative group">
                                  <BsQuestionCircleFill
                                    className="text-primary info-icon"
                                    size={20}
                                  />
                                  <div className="absolute p-2 text-xs text-white transition-all scale-0 bg-gray-800 rounded -top-12 -right-32 group-hover:scale-100 ">
                                    Please select countries visited in last 10
                                    years
                                  </div>
                                </div>
                              </label>

                              <div className="input-error-wrapper">
                                <MultiSelectField
                                  defaultValue={values.countryVisitedInLast10Years?.map(
                                    value => ({
                                      label: value,
                                      value: value,
                                    })
                                  )}
                                  name="countryVisitedInLast10Years"
                                  placeholder="Select countries"
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
                        </div>
                      </div>
                      <div className="flex-col justify-center hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                        <h2 className="sidetext">
                          If information furnished is found to be incorrect at
                          the time of entry or anything during stay in India,
                          you will be refused entry.
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h2 className="text-3xl font-semibold">
                        SAARC Country Visit Details{' '}
                      </h2>
                      <hr className="h-1 text-primary bg-primary w-36" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-12 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="flex items-start py-2 space-x-2">
                              <label className="font-semibold">
                                Have you visited SAARC countries (except your
                                country) during last 3 years?
                              </label>
                              <div className="flex space-x-4">
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="yes"
                                    name="visitedSAARCCountries"
                                    value="yes"
                                  />
                                  <label
                                    htmlFor="yes"
                                    className="font-semibold"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="px-2 space-x-2">
                                  <Field
                                    type="radio"
                                    id="no"
                                    name="visitedSAARCCountries"
                                    value="no"
                                  />
                                  <label htmlFor="no" className="font-semibold">
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>
                            {values.visitedSAARCCountries === 'yes' && (
                              <div>
                                <FieldArray name="visitedSAARCCountriesLists">
                                  {({ insert, remove, push }) => (
                                    <div>
                                      {values.visitedSAARCCountriesLists
                                        .length > 0 &&
                                        values.visitedSAARCCountriesLists.map(
                                          (visited, index) => (
                                            <div
                                              className="space-y-4"
                                              key={index}
                                            >
                                              <div className="mt-10 form-input-main-div">
                                                <label
                                                  className="form-label"
                                                  htmlFor={`visitedSAARCCountriesLists.${index}.saarcCountryName`}
                                                >
                                                  Name of SAARC Country*
                                                </label>
                                                <div className="input-error-wrapper">
                                                  <Field
                                                    className="p-2 border rounded select-input"
                                                    component="select"
                                                    name={`visitedSAARCCountriesLists.${index}.saarcCountryName`}
                                                    placeholder="saarc country"
                                                    type="text"
                                                  >
                                                    <option
                                                      value=""
                                                      disabled
                                                      selected
                                                    >
                                                      Select Country*
                                                    </option>
                                                    {Country?.getAllCountries()?.map(
                                                      (country, index) => (
                                                        <option
                                                          key={index}
                                                          value={country?.name}
                                                        >
                                                          {country?.name}
                                                        </option>
                                                      )
                                                    )}
                                                  </Field>
                                                  <ErrorMessage
                                                    name={`visitedSAARCCountriesLists.${index}.saarcCountryName`}
                                                    component="div"
                                                    className="text-red-600"
                                                  />
                                                </div>
                                              </div>
                                              <div className="form-input-main-div">
                                                <label
                                                  className="form-label"
                                                  htmlFor={`visitedSAARCCountriesLists.${index}.selectYear`}
                                                >
                                                  Select Year*
                                                </label>
                                                <div className="input-error-wrapper">
                                                  <Field
                                                    name={`visitedSAARCCountriesLists.${index}.selectYear`}
                                                    placeholder="year"
                                                    className="p-2 border rounded select-input"
                                                    component="select"
                                                  >
                                                    <option
                                                      value=""
                                                      disabled
                                                      selected
                                                    >
                                                      Select Year*
                                                    </option>
                                                    {years.map(year => (
                                                      <option
                                                        key={year}
                                                        value={year}
                                                      >
                                                        {year}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                  <ErrorMessage
                                                    name={`visitedSAARCCountriesLists.${index}.selectYear`}
                                                    component="div"
                                                    className="text-red-600"
                                                  />
                                                </div>
                                              </div>
                                              <div className="form-input-main-div">
                                                <label
                                                  className="form-label"
                                                  htmlFor={`visitedSAARCCountriesLists.${index}.numberOfVisits`}
                                                >
                                                  No. of Visits
                                                </label>
                                                <div className="input-error-wrapper">
                                                  <Field
                                                    className="form-input"
                                                    name={`visitedSAARCCountriesLists.${index}.numberOfVisits`}
                                                    placeholder="visits"
                                                  />
                                                  <ErrorMessage
                                                    name={`visitedSAARCCountriesLists.${index}.numberOfVisits`}
                                                    component="div"
                                                    className="text-red-600"
                                                  />
                                                </div>
                                              </div>

                                              {values.visitedSAARCCountriesLists
                                                .length > 1 ? (
                                                <button
                                                  type="button"
                                                  className="formbtn"
                                                  onClick={() => remove(index)}
                                                >
                                                  Remove
                                                </button>
                                              ) : null}
                                            </div>
                                          )
                                        )}
                                      <button
                                        type="button"
                                        className="mt-5 formbtn"
                                        onClick={() =>
                                          push({
                                            saarcCountryName: '',
                                            selectYear: '',
                                            numberOfVisits: '',
                                          })
                                        }
                                      >
                                        Add More
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="hidden col-span-4 px-4 py-3 border-2 bg-primary/10 border-primary/60 rounded-xl md:block">
                        <h2 className="sidetext py- ">
                          Have you visited "South Asian Association for Regional
                          Cooperation" (SAARC) countries (expect your own
                          country) during last 3 years? Yes/No
                        </h2>

                        <h2 className="py-6 sidetext ">Please provide data</h2>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h2 className="text-3xl font-semibold">Reference</h2>
                      <hr className="h-1 text-primary bg-primary w-36" />
                    </div>

                    <div className="grid gap-8 md:grid-cols-12 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Reference Name in India"
                                  name="referenceNameInIndia"
                                  placeholder="Enter Reference Name in India"
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  label="Reference Address"
                                  name="referenceAddress"
                                  placeholder="Enter Reference Address"
                                  required={true}
                                />
                              </div>
                            </div>

                            {/* state and district */}
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <SelectField
                                  label="State"
                                  name="referenceState"
                                  placeholder="Select State"
                                  required={true}
                                  options={State?.getStatesOfCountry('IN')?.map(
                                    (ele, index) => ({
                                      value: ele?.name,
                                      label: ele?.name,
                                    })
                                  )}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <SelectField
                                  disabledReason={'Please select state first'}
                                  disabled={!values?.referenceState}
                                  label="District"
                                  name="referenceDistrict"
                                  placeholder="Select District"
                                  required={true}
                                  options={City?.getCitiesOfState(
                                    'IN',
                                    State?.getStatesOfCountry('IN')
                                      .filter(
                                        state =>
                                          state?.name === values?.referenceState
                                      )
                                      .map(state => state.isoCode)[0] ?? ''
                                  )?.map((elecity, indexcity) => ({
                                    value: elecity?.name,
                                    label: elecity?.name,
                                  }))}
                                />
                              </div>
                            </div>
                            {/* state and district code end here */}

                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <Field name="referencePhone">
                                  {({ field, form }) => (
                                    <PhoneInputField
                                      label="Contact No."
                                      name="referencePhone"
                                      placeholder="Enter contact number"
                                      value={field.value}
                                      onChange={value => {
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={field.onBlur}
                                      error={form.errors.referencePhone}
                                      touched={form.touched.referencePhone}
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
                                  label="Reference Name in Home Country"
                                  name="referenceNameInHomeCountry"
                                  placeholder="Enter Reference Name in Home Country"
                                  required={true}
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <TextInputField
                                  name="referenceAddressInHomeCountry"
                                  placeholder="Enter Reference Address in Home Country"
                                  required={true}
                                  label="Reference Address in Home Country"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <div className="input-error-wrapper">
                                <Field name="referencePhoneInHomeCountry">
                                  {({ field, form }) => (
                                    <PhoneInputField
                                      label="Contact No."
                                      name="referencePhoneInHomeCountry"
                                      placeholder="Enter contact number"
                                      value={field.value}
                                      onChange={value => {
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={field.onBlur}
                                      error={
                                        form.errors.referencePhoneInHomeCountry
                                      }
                                      touched={
                                        form.touched.referencePhoneInHomeCountry
                                      }
                                      required={true}
                                      form={form}
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-col justify-between hidden col-span-4 px-4 py-6 border-2 md:flex bg-primary/10 border-primary/60 rounded-xl">
                        <div>
                          <h2 className="py-4 sidetext">
                            Reference Name in India
                          </h2>
                          <h2 className="py-6 sidetext">
                            Reference Address in India
                          </h2>
                          <h2 className="py-4 sidetext">
                            Reference number of contact purpose
                          </h2>
                          <h2 className="py-6 sidetext">
                            Reference home country name
                          </h2>
                          <h2 className="py-4 sidetext">
                            Reference home country adress
                          </h2>
                          <h2 className="py-6 sidetext">
                            Reference home country contact number
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-semibold">Mandatory Fields*</p>

                  <div className="space-x-4 text-center">
                    {updateMutation.isError ? (
                      <div className="text-red-500">
                        An error occurred: {updateMutation.error.message}
                      </div>
                    ) : null}
                    <Link href="/visa/step-three/update">
                      <button className="formbtnBorder">Back</button>
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
              </>
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
};

export default StepFour;
