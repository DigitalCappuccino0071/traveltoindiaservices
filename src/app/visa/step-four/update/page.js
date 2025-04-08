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
                    <div className="grid grid-cols-12 gap-8 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Type of Visa*
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="visaType"
                                  className="form-input input-disabled"
                                  disabled={true}
                                />
                                <ErrorMessage
                                  name="visaType"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Visa Service*
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="visaService"
                                  className="form-input input-disabled"
                                  disabled={true}
                                />
                                <ErrorMessage
                                  name="visaService"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label" htmlFor="mobileNo">
                                Contact No.
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  id="contactNo"
                                  name="contactNo"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="contactNo"
                                  component="div"
                                  className="text-red-500"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Places to be visited*
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="placesToVisit"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="placesToVisit"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Places to be visited 2
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="placesToVisit2"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="placesToVisit2"
                                  component="div"
                                  className="text-red-600"
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
                                  <label className="form-label">
                                    Name of the tour operator
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="bookedHotelTourOperatorName"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="bookedHotelTourOperatorName"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Address of the tour operator
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="bookedHotelTourOperatorAddress"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="bookedHotelTourOperatorAddress"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Name of Hotel/Resort etc.
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="bookedHotelName"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="bookedHotelName"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Place/City of Hotel/Resort etc.
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="bookedHotelPlace"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="bookedHotelPlace"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            {/* hotel resorts code end here */}

                            <div className="form-input-main-div">
                              <label className="form-label">
                                Duration of Visa
                              </label>
                              <Field
                                type="text"
                                name="durationOfVisa"
                                className="form-input input-disabled"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="durationOfVisa"
                                component="div"
                                className="text-red-600"
                              />
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                No. of Entries
                              </label>
                              <Field
                                type="text"
                                name="numberOfEntries"
                                className="form-input input-disabled"
                                disabled={true}
                              />
                              <ErrorMessage
                                name="numberOfEntries"
                                component="div"
                                className="text-red-600"
                              />
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Port of Arrival in India*
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="portOfArrival"
                                  className="form-input input-disabled"
                                  disabled={true}
                                />
                                <ErrorMessage
                                  name="portOfArrival"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Expected Port of Exit from India
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  name="expectedPortOfExit"
                                  component="select"
                                  className="p-2 border rounded select-input"
                                >
                                  <option value="">Select </option>

                                  {airportsSeaports.map(
                                    (airportSeaport, index) => (
                                      <option
                                        key={index}
                                        value={airportSeaport}
                                      >
                                        {airportSeaport}
                                      </option>
                                    )
                                  )}
                                </Field>
                                <ErrorMessage
                                  name="expectedPortOfExit"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center col-span-4 px-4 pt-10 border-2 bg-primary/10 border-primary/60 rounded-xl">
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
                    <div className="grid grid-cols-12 gap-8 ">
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
                                  <label className="form-label">Address*</label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="visitedIndiaBeforeVisaAddress"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="visitedIndiaBeforeVisaAddress"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Cities previously visited in India*
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      as="textarea"
                                      name="visitedIndiaBeforeCitiesVisitedInIndia"
                                      rows="4"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="visitedIndiaBeforeCitiesVisitedInIndia"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Last Indian Visa no./Currently valid Indian
                                    Visa no.*
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="visitedIndiaBeforeLastIndianVisaNo"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="visitedIndiaBeforeLastIndianVisaNo"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>

                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Type of Visa*
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      component="select"
                                      id="visitedIndiaBeforeTypeOfVisa"
                                      name="visitedIndiaBeforeTypeOfVisa"
                                      className="p-2 border rounded select-input"
                                    >
                                      <option disabled value="">
                                        Select*
                                      </option>
                                      {visaTypesList?.map(visaTypeL => (
                                        <option
                                          key={visaTypeL}
                                          value={visaTypeL}
                                        >
                                          {visaTypeL}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage name="visitedIndiaBeforeTypeOfVisa">
                                      {errorMsg => (
                                        <div style={{ color: 'red' }}>
                                          {errorMsg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Place of Issue*
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="visitedIndiaBeforePlaceOfIssue"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="visitedIndiaBeforePlaceOfIssue"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Date of Issue*
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="date"
                                      name="visitedIndiaBeforeDateOfIssue"
                                      id="visitedIndiaBeforeDateOfIssue"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="visitedIndiaBeforeDateOfIssue"
                                      component="div"
                                      className="text-red-600"
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
                                <label className="form-label">
                                  If so, when and by whom (Mention Control No.
                                  and date also)
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="refusalDetails"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="refusalDetails"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {values.visitedIndiaBefore === 'yes' && (
                        <div className="flex flex-col justify-between col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
                          <div>
                            <h2 className="py-5 sidetext ">
                              If yes please give details
                            </h2>
                            <h2 className="py-3 sidetext ">
                              Enter the address of stay during your last visit
                            </h2>
                          </div>

                          <div>
                            <h2 className="pt-20 sidetext ">
                              Cities in India visited (comma seperated)
                            </h2>
                          </div>

                          <div className="pt-36">
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

                      <div className="grid grid-cols-12 gap-8 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Name of the Hospital where Medical treatment
                                  is to be carried out
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eMedicalNameOfHospital"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalNameOfHospital"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Address of Hospital
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eMedicalAddressOfHospital"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalAddressOfHospital"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="eMEDICALPhoneOfHospital"
                                >
                                  Phone No.
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eMEDICALPhoneOfHospital"
                                    name="eMedicalPhoneOfHospital"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalPhoneOfHospital"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">State</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    name="eMedicalStateOfHospital"
                                    component="select"
                                    className="p-2 border rounded select-input"
                                  >
                                    <option value="">Select </option>
                                    {State?.getStatesOfCountry('IN')?.map(
                                      (ele, index) => (
                                        <option key={index} value={ele?.name}>
                                          {ele?.name}
                                        </option>
                                      )
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="eMedicalStateOfHospital"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">District</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    name="eMedicalDistrictOfHospital"
                                    component="select"
                                    className="p-2 border rounded select-input"
                                  >
                                    <option value="">Select </option>

                                    {City?.getCitiesOfState(
                                      'IN',
                                      State?.getStatesOfCountry('IN')
                                        .filter(
                                          state =>
                                            state?.name ===
                                            values?.eMedicalStateOfHospital
                                        )
                                        .map(state => state.isoCode)[0] ?? ''
                                    )?.map((elecity, indexcity) => (
                                      <option
                                        key={indexcity}
                                        value={elecity?.name}
                                      >
                                        {elecity?.name}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="eMedicalDistrictOfHospital"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Type of Medical Treatment required
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eMEDICALtypeOfMedicalTreatment"
                                    name="eMedicalTypeOfMedicalTreatment"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalTypeOfMedicalTreatment"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
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

                      <div className="grid grid-cols-12 gap-8 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <b>Details of the Applicants Company</b>
                              <div className="form-input-main-div">
                                <label className="form-label">Name</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eBusinessCompanyName"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessCompanyName"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">Address</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eBusinessCompanyAddress"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessCompanyAddress"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="eBUSINESSCompanyPhone"
                                >
                                  Phone No.
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eBUSINESSCompanyPhone"
                                    name="eBusinessCompanyPhone"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessCompanyPhone"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="eBUSINESSCompanyWebsite"
                                >
                                  Website
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eBUSINESSCompanyWebsite"
                                    name="eBusinessCompanyWebsite"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessCompanyWebsite"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>

                              {visaServiceSelectedValue ===
                                'TO SET UP INDUSTRIAL/BUSINESS VENTURE' ||
                              visaServiceSelectedValue ===
                                'SALE/PURCHASE/TRADE' ? (
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Natures of Business/ Product
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      id="eBUSINESSCompanyNatures"
                                      name="eBusinessCompanyNatures"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="eBusinessCompanyNatures"
                                      component="div"
                                      className="text-red-600"
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
                                    <label className="form-label">Name</label>
                                    <div className="input-error-wrapper">
                                      <Field
                                        type="text"
                                        id="eBusinessAttendTechMeetingName"
                                        name="eBusinessAttendTechMeetingName"
                                        className="form-input"
                                      />
                                      <ErrorMessage
                                        name="eBusinessAttendTechMeetingName"
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <label className="form-label">
                                      Address
                                    </label>
                                    <div className="input-error-wrapper">
                                      <Field
                                        type="text"
                                        id="eBusinessAttendTechMeetingAddress"
                                        name="eBusinessAttendTechMeetingAddress"
                                        className="form-input"
                                      />
                                      <ErrorMessage
                                        name="eBusinessAttendTechMeetingAddress"
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <label className="form-label">Phone</label>
                                    <div className="input-error-wrapper">
                                      <Field
                                        type="text"
                                        id="eBusinessAttendTechMeetingPhone"
                                        name="eBusinessAttendTechMeetingPhone"
                                        className="form-input"
                                      />
                                      <ErrorMessage
                                        name="eBusinessAttendTechMeetingPhone"
                                        component="div"
                                        className="text-red-600"
                                      />
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
                                      <Field
                                        type="text"
                                        id="eBusinessRecruitManpowerNamecontactCompanyRepresentative"
                                        name="eBusinessRecruitManpowerNamecontactCompanyRepresentative"
                                        className="form-input"
                                      />
                                      <ErrorMessage
                                        name="eBusinessRecruitManpowerNamecontactCompanyRepresentative"
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <label className="form-label">
                                      Nature of Job for which recruiting
                                    </label>
                                    <div className="input-error-wrapper">
                                      <Field
                                        type="text"
                                        id="eBusinessRecruitManpowerNatureOfJob"
                                        name="eBusinessRecruitManpowerNatureOfJob"
                                        className="form-input"
                                      />
                                      <ErrorMessage
                                        name="eBusinessRecruitManpowerNatureOfJob"
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="form-input-main-div">
                                    <label className="form-label">
                                      Places where recruitment is to be
                                      conducted
                                    </label>
                                    <div className="input-error-wrapper">
                                      <Field
                                        type="text"
                                        id="eBusinessRecruitManpowerPlacesRecruitmentConducted"
                                        name="eBusinessRecruitManpowerPlacesRecruitmentConducted"
                                        className="form-input"
                                      />
                                      <ErrorMessage
                                        name="eBusinessRecruitManpowerPlacesRecruitmentConducted"
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : null}

                              {visaServiceSelectedValue ===
                              'PARTICIPATION IN EXHIBITIONS,BUSINESS/TRADE FAIRS' ? (
                                <div className="form-input-main-div">
                                  <label className="form-label">
                                    Name and address of the exhibition/trade
                                    fair
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      id="eBusinessParticipationInExhibitionsNameAndAddress"
                                      name="eBusinessParticipationInExhibitionsNameAndAddress"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="eBusinessParticipationInExhibitionsNameAndAddress"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
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

                      <div className="grid grid-cols-12 gap-8 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Name and address of the Travel Agency in
                                  native country
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eBusinessConductingToursNameAndAddress"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessConductingToursNameAndAddress"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Cities to be visited during the tour
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eBusinessConductingToursCities"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessConductingToursCities"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <b>
                                Details of the Travel agent/associate in India
                              </b>
                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="purposecontactNo"
                                >
                                  Name
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eBusinessConductingToursTravelAgencyName"
                                    name="eBusinessConductingToursTravelAgencyName"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessConductingToursTravelAgencyName"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="purposecontactNo"
                                >
                                  Phone
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eBusinessConductingToursTravelAgencyPhone"
                                    name="eBusinessConductingToursTravelAgencyPhone"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessConductingToursTravelAgencyPhone"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="purposecontactNo"
                                >
                                  Address
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eBusinessConductingToursTravelAgencyAddress"
                                    name="eBusinessConductingToursTravelAgencyAddress"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eBusinessConductingToursTravelAgencyAddress"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
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

                      <div className="grid grid-cols-12 gap-8 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Name of the principal e-Medical Visa holder
                                  (i.e. the patient)
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eMedicalAttendantNameVisaHolder"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalAttendantNameVisaHolder"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="flex items-start py-2 space-x-2">
                                <label>
                                  Visa No. / Application id of principal
                                  e-Medical Visa holder
                                </label>
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
                                  <label className="form-label">
                                    Visa number of principal e-Medical Visa
                                    holder (only on select Visa No.)
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      name="eMedicalAttendantVisaNumberOfVisaHolder"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="eMedicalAttendantVisaNumberOfVisaHolder"
                                      component="div"
                                      className="text-red-600"
                                    />
                                  </div>
                                </div>
                              ) : null}

                              {values.eMedicalAttendantAppOrVisa ===
                              'applicationId' ? (
                                <div className="form-input-main-div">
                                  <label
                                    className="form-label"
                                    htmlFor="eMEDICALATTENDANTApplicationIdOfVisaHolder"
                                  >
                                    Application id of principal e-Medical Visa
                                    holder (only on select Application id)
                                  </label>
                                  <div className="input-error-wrapper">
                                    <Field
                                      type="text"
                                      id="eMEDICALATTENDANTApplicationIdOfVisaHolder"
                                      name="eMedicalAttendantApplicationIdOfVisaHolder"
                                      className="form-input"
                                    />
                                    <ErrorMessage
                                      name="eMedicalAttendantApplicationIdOfVisaHolder"
                                      component="div"
                                      className="text-red-500"
                                    />
                                  </div>
                                </div>
                              ) : null}

                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="eMEDICALATTENDANTPassportNumberOfVisaHolder"
                                >
                                  Passport number of principal e-Medical Visa
                                  holder
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eMEDICALATTENDANTPassportNumberOfVisaHolder"
                                    name="eMedicalAttendantPassportNumberOfVisaHolder"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalAttendantPassportNumberOfVisaHolder"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>

                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Date of birth of principal e-Medical Visa
                                  holder
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="date"
                                    id="eMEDICALATTENDANTDobOfVisaHolder"
                                    name="eMedicalAttendantDobOfVisaHolder"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalAttendantDobOfVisaHolder"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Nationality of principal e-Medical Visa Select
                                  nationality v holder
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eMEDICALATTENDANTNationalityOfVisaHolder"
                                    name="eMedicalAttendantNationalityOfVisaHolder"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eMedicalAttendantNationalityOfVisaHolder"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
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

                  {/* feilds for visa type--- eMEDICAL ATTENDANT VISA end  */}
                  {/* feilds for visa type ---confrence visa start  */}
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

                      <div className="grid grid-cols-12 gap-8 ">
                        <div className="col-span-8">
                          <div>
                            <div className="formMain">
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Name/subject of the conference
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    name="eConferenceNameOfConference"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceNameOfConference"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <b>Duration of conference</b>
                              <div className="form-input-main-div">
                                <label className="form-label">Start date</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="date"
                                    name="eConferenceStartDate"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceStartDate"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">End date</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="date"
                                    name="eConferenceEndDate"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceEndDate"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <b>Venue of conference</b>
                              <div className="form-input-main-div">
                                <label
                                  className="form-label"
                                  htmlFor="eCONFERENCEAddress"
                                >
                                  Address
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eCONFERENCEAddress"
                                    name="eConferenceAddress"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceAddress"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">State</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    name="eConferenceState"
                                    component="select"
                                    className="p-2 border rounded select-input"
                                  >
                                    <option value="">Select </option>
                                    <option value="option1">Option1</option>
                                  </Field>
                                  <ErrorMessage
                                    name="eConferenceState"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">District</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    name="eConferenceDistrict"
                                    component="select"
                                    className="p-2 border rounded select-input"
                                  >
                                    <option value="">Select </option>

                                    <option value="option1">Option1 </option>
                                  </Field>
                                  <ErrorMessage
                                    name="eConferenceDistrict"
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">Pincode</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eCONFERENCEPincode"
                                    name="eConferencePincode"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferencePincode"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <b>Details of organizer of conference</b>
                              <div className="form-input-main-div">
                                <label className="form-label">
                                  Name of organizer
                                </label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eCONFERENCENameOfOrganizer"
                                    name="eConferenceNameOfOrganizer"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceNameOfOrganizer"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">Address</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eCONFERENCEAddressOfOrganizer"
                                    name="eConferenceAddressOfOrganizer"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceAddressOfOrganizer"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">Phone no</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eCONFERENCEPhoneOfOrganizer"
                                    name="eConferencePhoneOfOrganizer"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferencePhoneOfOrganizer"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="form-input-main-div">
                                <label className="form-label">Email id</label>
                                <div className="input-error-wrapper">
                                  <Field
                                    type="text"
                                    id="eCONFERENCEEmailOfOrganizer"
                                    name="eConferenceEmailOfOrganizer"
                                    className="form-input"
                                  />
                                  <ErrorMessage
                                    name="eConferenceEmailOfOrganizer"
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
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

                  {/* feilds for visa type ---confrence visa end  */}

                  <div>
                    <div>
                      <h2 className="text-3xl font-semibold">
                        Other Information
                      </h2>
                      <hr className="h-1 text-primary bg-primary w-36" />
                    </div>
                    <div className="grid grid-cols-12 gap-8 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Countries Visited in last 10 years
                              </label>

                              <div className="input-error-wrapper">
                                <Select
                                  defaultValue={values.countryVisitedInLast10Years?.map(
                                    value => ({
                                      label: value,
                                      value: value,
                                    })
                                  )}
                                  isMulti
                                  name="countryVisitedInLast10Years"
                                  options={Country?.getAllCountries()?.map(
                                    country => ({
                                      value: country?.name,
                                      label: country?.name,
                                    })
                                  )}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={value => {
                                    setFieldValue(
                                      'countryVisitedInLast10Years',
                                      value
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
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
                    <div className="grid grid-cols-12 gap-8 ">
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
                      <div className="col-span-4 px-4 py-3 border-2 bg-primary/10 border-primary/60 rounded-xl">
                        <h2 className="sidetext py- ">
                          Have you visited “South Asian Association for Regional
                          Cooperation” (SAARC) countries (expect your own
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

                    <div className="grid grid-cols-12 gap-8 ">
                      <div className="col-span-8">
                        <div>
                          <div className="formMain">
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Reference Name in India
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="referenceNameInIndia"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="referenceNameInIndia"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">Address</label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="referenceAddress"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="referenceAddress"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>

                            <div className="form-input-main-div">
                              <label className="form-label">Phone*</label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="referencePhone"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="referencePhone"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">
                                Reference Name in Home Country*
                              </label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="referenceNameInHomeCountry"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="referenceNameInHomeCountry"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">Address*</label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="referenceAddressInHomeCountry"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="referenceAddressInHomeCountry"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                            <div className="form-input-main-div">
                              <label className="form-label">Phone*</label>
                              <div className="input-error-wrapper">
                                <Field
                                  type="text"
                                  name="referencePhoneInHomeCountry"
                                  className="form-input"
                                />
                                <ErrorMessage
                                  name="referencePhoneInHomeCountry"
                                  component="div"
                                  className="text-red-600"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between col-span-4 px-4 py-6 border-2 bg-primary/10 border-primary/60 rounded-xl">
                        <div>
                          <h2 className="py-4 sidetext">
                            Reference Name and Address in India
                          </h2>
                        </div>

                        <div className="pt-48">
                          <h2 className="py-4 sidetext">Phone no.</h2>
                          <h2 className="py-4 sidetext">
                            Please mention one contact details in Home Country
                            to be contracted in case of emergency
                          </h2>

                          <h2 className="py-6 sidetext">
                            Address of the Referred person
                          </h2>
                        </div>

                        <div>
                          <h2 className="py-4 sidetext">
                            Phone no. of the Referred Person
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
