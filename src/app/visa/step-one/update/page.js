'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import 'react-phone-number-input/style.css';
import useUpdate from '@/hooks/useUpdate';
import { ImSpinner2 } from 'react-icons/im';
import { ErrorMessage, Field, Form, Formik } from 'formik';
// import PhoneInput from 'react-phone-number-input';
import BannerPage from '@/components/india/common/BannerPage';
import {
  airportsSeaports,
  eligibleCountriesEvisaIndia,
  step1ValidationSchema,
} from '@/constant/indiaConstant';
import { useFormContext } from '@/context/formContext';
import ReactDatePickerInput from '@/components/common/ReactDatePickerInput';
import { minDate, minDateWithDate } from '@/lib/minDate';
import PhoneInputField from '@/components/common/PhoneInputField';
import SelectField from '@/components/common/SelectField';
import TextInputField from '@/components/common/TextInputField';

export default function StepOneUpdate() {
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
    apiEndpoint.UPDATE_VISA_ADD_STEP1,
    state.formId,
    1,
    '/visa/step-two',
    refetch
  );

  if (getAllStepsDataIsSuccess) {
    if (getAllStepsData.data.step1Data) {
      const { __v, _id, createdAt, updatedAt, ...cleanedStep1Data } =
        getAllStepsData?.data?.step1Data;

      return (
        <>
          <BannerPage heading="E-VISA APPLICATION FORM" />

          <p className="pt-8 font-semibold text-center">
            Note: For e-visa services to Afghan Nationals, they must select
            <span className="pl-2 pr-1 text-primary">AFGHANISTAN</span>{' '}
            nationality
          </p>
          <div className="max-w-4xl px-12 py-4 mx-auto">
            {getAllStepsDataIsSuccess && getAllStepsData ? (
              <Formik
                initialValues={cleanedStep1Data}
                validationSchema={step1ValidationSchema.yupSchema}
                validateOnChange={true}
                validateOnMount={true}
                onSubmit={(values, { setSubmitting }) => {
                  updateMutation.mutate(values);
                  setSubmitting(false);
                }}
              >
                {({ values, isValid, setFieldValue, handleChange }) => (
                  <Form className="formMain">
                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <SelectField
                          name="applicationType"
                          label="Application Type"
                          required={true}
                          placeholder="Select"
                          options={[
                            {
                              value: 'Normal',
                              label: 'Normal Processing (4 to 7 Business Days)',
                            },
                            {
                              value: 'Urgent',
                              label:
                                'Urgent Processing (24 to 72 Business Hours)',
                            },
                            { value: 'Rush', label: 'Rush' },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <SelectField
                          name="nationalityRegion"
                          label="Select Country"
                          required={true}
                          placeholder="Country"
                          options={eligibleCountriesEvisaIndia?.map(
                            country => ({
                              value: country,
                              label: country,
                            })
                          )}
                          onChange={e => {
                            handleChange(e);
                            setFieldValue('visaService', '');
                            setFieldValue('eTouristVisa', '');
                            setFieldValue('eTouristVisa30Days', '');
                            setFieldValue('eTouristVisa1Year', '');
                            setFieldValue('eTouristVisa5Years', '');
                            setFieldValue('eConferenceVisa', '');
                            setFieldValue('eMedicalAttendantVisa', '');
                            setFieldValue('eBusinessVisa', '');
                            setFieldValue('eMedicalVisa', '');
                            setFieldValue('eEmergencyXMisc', '');
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <SelectField
                          name="passportType"
                          label="Passport Type"
                          required={true}
                          placeholder="Select"
                          options={[
                            {
                              value: 'ordinary passport',
                              label: 'ORDINARY PASSPORT',
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <SelectField
                          name="portOfArrival"
                          label="Port Of Arrival"
                          required={true}
                          placeholder="Select"
                          options={airportsSeaports.map(airportSeaport => ({
                            value: airportSeaport,
                            label: airportSeaport,
                          }))}
                        />
                      </div>
                    </div>

                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <ReactDatePickerInput
                          className="new-form-input"
                          name="dateOfBirth"
                          selected={values.dateOfBirth}
                          setFieldValue={setFieldValue}
                          maxDate={new Date()}
                          variant="dob"
                          label="Date Of Birth"
                          required={true}
                        />
                      </div>
                    </div>

                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <TextInputField
                          name="emailId"
                          label="Email ID"
                          type="email"
                          placeholder="Enter Email Id"
                          required={true}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <TextInputField
                          name="reEmailId"
                          label="Re-Enter Email ID"
                          type="email"
                          placeholder="Re-Enter Email Id"
                          required={true}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    {/* <div className="form-input-main-div">
                      <label className="form-label">Contact no*</label>
                      <div className="input-error-wrapper form-input">
                        <Field name="contactNo">
                          {({ field, form }) => (
                            <PhoneInput
                              placeholder="Enter phone number"
                              value={field.value}
                              inputclassName="phone-input-class"
                              onChange={value => {
                                form.setFieldValue(field.name, value);

                                if (field.value) {
                                  form.setFieldValue({
                                    ...form.values,
                                    contactNo: value,
                                  });
                                }
                              }}
                            />
                          )}
                        </Field>

                        <ErrorMessage
                          name="contactNo"
                          component="div"
                          className="text-red-600"
                        />
                      </div>
                    </div> */}
                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <Field name="contactNo">
                          {({ field, form }) => (
                            <PhoneInputField
                              label="Contact no"
                              name="contactNo"
                              placeholder="Enter phone number"
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
                      <label className="self-start form-label">
                        Visa Service*
                      </label>

                      {/* multi step radio button start  */}
                      <div className="space-y-4 text-sm input-error-wrapper">
                        <div>
                          {values?.nationalityRegion?.toLocaleLowerCase() ===
                          'afghanistan' ? (
                            <div>
                              <div className="flex items-start space-x-2">
                                <Field
                                  type="radio"
                                  id="visaServiceEmergencyXMisc"
                                  name="visaService"
                                  className="mt-1"
                                  value="eEmergencyXMisc"
                                  onChange={e => {
                                    handleChange(e);
                                    setFieldValue('eTouristVisa', '');
                                    setFieldValue('eTouristVisa30Days', '');
                                    setFieldValue('eTouristVisa1Year', '');
                                    setFieldValue('eTouristVisa5Years', '');
                                    setFieldValue('eConferenceVisa', '');
                                    setFieldValue('eMedicalAttendantVisa', '');
                                    setFieldValue('eBusinessVisa', '');
                                    setFieldValue('eMedicalVisa', '');
                                  }}
                                />
                                <label htmlFor="visaServiceEmergencyXMisc">
                                  E Emergency X Misc
                                </label>
                              </div>
                              {values.visaService === 'eEmergencyXMisc' && (
                                <div className="px-8">
                                  <div>
                                    {/* level1-inner1 start  */}
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="visaServiceEmergencyXMiscVisaValue"
                                        name="eEmergencyXMisc"
                                        className="mt-1"
                                        value="EMERGENCY TRAVEL TO INDIA"
                                      />
                                      <label htmlFor="visaServiceEmergencyXMiscVisaValue">
                                        EMERGENCY TRAVEL TO INDIA
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null}

                          {values?.nationalityRegion?.toLocaleLowerCase() !==
                            'afghanistan' && (
                            <div className="flex items-start space-x-2">
                              <Field
                                type="radio"
                                id="visaServiceEtourist"
                                name="visaService"
                                className="mt-1"
                                value="eTOURIST VISA"
                                onChange={e => {
                                  handleChange(e);
                                  setFieldValue('eConferenceVisa', '');
                                  setFieldValue('eMedicalAttendantVisa', '');
                                  setFieldValue('eBusinessVisa', '');
                                  setFieldValue('eEmergencyXMisc', '');
                                  setFieldValue('eMedicalVisa', '');
                                }}
                              />
                              <label htmlFor="visaServiceEtourist">
                                eTOURIST VISA
                              </label>
                            </div>
                          )}

                          {values.visaService === 'eTOURIST VISA' && (
                            <div className="px-8">
                              <div>
                                {/* level1-inner1 start  */}
                                <div className="flex items-start space-x-2">
                                  <Field
                                    type="radio"
                                    id="eTouristVisa30Days"
                                    name="eTouristVisa"
                                    className="mt-1"
                                    value={`${
                                      values.visaService === 'eTOURIST VISA'
                                        ? 'visa30days'
                                        : ''
                                    }`}
                                  />
                                  <label htmlFor="eTouristVisa30Days">
                                    eTourist Visa(for 30 Days)
                                  </label>
                                </div>
                                {values.eTouristVisa === 'visa30days' && (
                                  <div className="px-4 py-2 space-y-2">
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa30DaysValue1"
                                        name="eTouristVisa30Days"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa30days'
                                            ? 'RECREATION/SIGHT-SEEING'
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa30DaysValue1">
                                        RECREATION/SIGHT-SEEING
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa30DaysValue2"
                                        name="eTouristVisa30Days"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa30days'
                                            ? 'MEETING FRIENDS/RELATIVES'
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa30DaysValue2">
                                        MEETING FRIENDS/RELATIVES
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa30DaysValue3"
                                        name="eTouristVisa30Days"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa30days'
                                            ? 'SHORT TERM YOGA PROGRAMME'
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa30DaysValue3">
                                        SHORT TERM YOGA PROGRAMME
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa30DaysValue4"
                                        name="eTouristVisa30Days"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa30days'
                                            ? `SHORT TERM COURSES ON LOCAL LANGUAGES, MUSIC,
                                  DANCE, ARTS & CRAFTS, COOKING, MEDICINE ETC.
                                  WHICH SHOULD NOT BE A FORMAL OR STRUCTURED
                                  COURSE/PROGRAMME (COURSES NOT EXCEEDING 6
                                  MONTHS DURATION AND NOT ISSUED WITH A
                                  QUALIFYING CERTIFICATE/ DIPLOMA ETC)`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa30DaysValue4">
                                        SHORT TERM COURSES ON LOCAL LANGUAGES,
                                        MUSIC, DANCE, ARTS & CRAFTS, COOKING,
                                        MEDICINE ETC. WHICH SHOULD NOT BE A
                                        FORMAL OR STRUCTURED COURSE/PROGRAMME
                                        (COURSES NOT EXCEEDING 6 MONTHS DURATION
                                        AND NOT ISSUED WITH A QUALIFYING
                                        CERTIFICATE/ DIPLOMA ETC)
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa30DaysValue5"
                                        name="eTouristVisa30Days"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa30days'
                                            ? `VOLUNTARY WORK OF SHORT DURATION (FOR A
                                  MAXIMUM PERIOD OF ONE MONTH, WHICH DO NOT
                                  INVOLVE ANY MONETARY PAYMENT OR CONSIDERATION
                                  OF ANY KIND IN RETURN)`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa30DaysValue5">
                                        VOLUNTARY WORK OF SHORT DURATION (FOR A
                                        MAXIMUM PERIOD OF ONE MONTH, WHICH DO
                                        NOT INVOLVE ANY MONETARY PAYMENT OR
                                        CONSIDERATION OF ANY KIND IN RETURN)
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div>
                                {/* level1-inner1 start  */}
                                <div className="flex items-start space-x-2">
                                  <Field
                                    type="radio"
                                    id="eTouristVisa1Year"
                                    name="eTouristVisa"
                                    className="mt-1"
                                    value="visa1Year"
                                  />
                                  <label htmlFor="eTouristVisa1Year">
                                    eTourist Visa(for 1 Year)
                                  </label>
                                </div>
                                {values.eTouristVisa === 'visa1Year' && (
                                  <div className="px-4 py-2 space-y-2">
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa1YearValue1"
                                        name="eTouristVisa1Year"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa1Year'
                                            ? `RECREATION/SIGHT-SEEING`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa1YearValue1">
                                        RECREATION/SIGHT-SEEING
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa1YearValue2"
                                        name="eTouristVisa1Year"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa1Year'
                                            ? `MEETING FRIENDS/RELATIVES`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa1YearValue2">
                                        MEETING FRIENDS/RELATIVES
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa1YearValue3"
                                        name="eTouristVisa1Year"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa1Year'
                                            ? `SHORT TERM YOGA PROGRAMME`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa1YearValue3">
                                        SHORT TERM YOGA PROGRAMME
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa1YearValue4"
                                        name="eTouristVisa1Year"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa1Year'
                                            ? `SHORT TERM COURSES ON LOCAL LANGUAGES, MUSIC,
                                  DANCE, ARTS & CRAFTS, COOKING, MEDICINE ETC.
                                  WHICH SHOULD NOT BE A FORMAL OR STRUCTURED
                                  COURSE/PROGRAMME (COURSES NOT EXCEEDING 6
                                  MONTHS DURATION AND NOT ISSUED WITH A
                                  QUALIFYING CERTIFICATE/ DIPLOMA ETC)`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa1YearValue4">
                                        SHORT TERM COURSES ON LOCAL LANGUAGES,
                                        MUSIC, DANCE, ARTS & CRAFTS, COOKING,
                                        MEDICINE ETC. WHICH SHOULD NOT BE A
                                        FORMAL OR STRUCTURED COURSE/PROGRAMME
                                        (COURSES NOT EXCEEDING 6 MONTHS DURATION
                                        AND NOT ISSUED WITH A QUALIFYING
                                        CERTIFICATE/ DIPLOMA ETC)
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa1YearValue5"
                                        name="eTouristVisa1Year"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa1Year'
                                            ? `VOLUNTARY WORK OF SHORT DURATION (FOR A
                                  MAXIMUM PERIOD OF ONE MONTH, WHICH DO NOT
                                  INVOLVE ANY MONETARY PAYMENT OR CONSIDERATION
                                  OF ANY KIND IN RETURN)`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa1YearValue5">
                                        VOLUNTARY WORK OF SHORT DURATION (FOR A
                                        MAXIMUM PERIOD OF ONE MONTH, WHICH DO
                                        NOT INVOLVE ANY MONETARY PAYMENT OR
                                        CONSIDERATION OF ANY KIND IN RETURN)
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div>
                                {/* level1-inner1 start  */}
                                <div className="flex items-start space-x-2">
                                  <Field
                                    type="radio"
                                    id="eTouristVisa5Years"
                                    name="eTouristVisa"
                                    className="mt-1"
                                    value="visa5Years"
                                  />
                                  <label htmlFor="eTouristVisa5Years">
                                    eTourist Visa(for 5 Years)
                                  </label>
                                </div>
                                {values.eTouristVisa === 'visa5Years' && (
                                  <div className="px-4 py-2 space-y-2">
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa5YearsValue1"
                                        name="eTouristVisa5Years"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa5Years'
                                            ? `RECREATION/SIGHT-SEEING`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa5YearsValue1">
                                        RECREATION/SIGHT-SEEING
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa5YearsValue2"
                                        name="eTouristVisa5Years"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa5Years'
                                            ? `MEETING FRIENDS/RELATIVES`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa5YearsValue2">
                                        MEETING FRIENDS/RELATIVES
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa5YearsValue3"
                                        name="eTouristVisa5Years"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa5Years'
                                            ? `SHORT TERM YOGA PROGRAMME`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa5YearsValue3">
                                        SHORT TERM YOGA PROGRAMME
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa5YearsValue4"
                                        name="eTouristVisa5Years"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa5Years'
                                            ? `SHORT TERM COURSES ON LOCAL LANGUAGES, MUSIC,
                                  DANCE, ARTS & CRAFTS, COOKING, MEDICINE ETC.
                                  WHICH SHOULD NOT BE A FORMAL OR STRUCTURED
                                  COURSE/PROGRAMME (COURSES NOT EXCEEDING 6
                                  MONTHS DURATION AND NOT ISSUED WITH A
                                  QUALIFYING CERTIFICATE/ DIPLOMA ETC)`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa5YearsValue4">
                                        SHORT TERM COURSES ON LOCAL LANGUAGES,
                                        MUSIC, DANCE, ARTS & CRAFTS, COOKING,
                                        MEDICINE ETC. WHICH SHOULD NOT BE A
                                        FORMAL OR STRUCTURED COURSE/PROGRAMME
                                        (COURSES NOT EXCEEDING 6 MONTHS DURATION
                                        AND NOT ISSUED WITH A QUALIFYING
                                        CERTIFICATE/ DIPLOMA ETC)
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eTouristVisa5YearsValue5"
                                        name="eTouristVisa5Years"
                                        className="mt-1"
                                        value={`${
                                          values.eTouristVisa === 'visa5Years'
                                            ? `VOLUNTARY WORK OF SHORT DURATION (FOR A
                                  MAXIMUM PERIOD OF ONE MONTH, WHICH DO NOT
                                  INVOLVE ANY MONETARY PAYMENT OR CONSIDERATION
                                  OF ANY KIND IN RETURN)`
                                            : ''
                                        }`}
                                      />
                                      <label htmlFor="eTouristVisa5YearsValue5">
                                        VOLUNTARY WORK OF SHORT DURATION (FOR A
                                        MAXIMUM PERIOD OF ONE MONTH, WHICH DO
                                        NOT INVOLVE ANY MONETARY PAYMENT OR
                                        CONSIDERATION OF ANY KIND IN RETURN)
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* eMEDICAL VISA  */}
                        {values?.nationalityRegion?.toLocaleLowerCase() !==
                          'afghanistan' && (
                          <>
                            {' '}
                            <div>
                              <div className="flex items-start space-x-2">
                                <Field
                                  type="radio"
                                  id="visaServiceEmedical"
                                  name="visaService"
                                  className="mt-1"
                                  value="eMEDICAL VISA"
                                  onChange={e => {
                                    handleChange(e);
                                    setFieldValue('eTouristVisa', '');
                                    setFieldValue('eTouristVisa30Days', '');
                                    setFieldValue('eTouristVisa1Year', '');
                                    setFieldValue('eTouristVisa5Years', '');
                                    setFieldValue('eConferenceVisa', '');
                                    setFieldValue('eMedicalAttendantVisa', '');
                                    setFieldValue('eBusinessVisa', '');
                                    setFieldValue('eEmergencyXMisc', '');
                                  }}
                                />
                                <label htmlFor="visaServiceEmedical">
                                  eMEDICAL VISA
                                </label>
                              </div>
                              {values.visaService === 'eMEDICAL VISA' && (
                                <div className="px-8">
                                  <div>
                                    {/* level1-inner1 start  */}
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eMedicalVisaValue"
                                        name="eMedicalVisa"
                                        className="mt-1"
                                        value={`SHORT TERM MEDICAL TREATMENT OF SELF`}
                                      />
                                      <label htmlFor="eMedicalVisaValue">
                                        SHORT TERM MEDICAL TREATMENT OF SELF
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div>
                              {/* eBUSINESS VISA */}
                              <div className="flex items-start space-x-2">
                                <Field
                                  type="radio"
                                  id="visaServiceEbusiness"
                                  name="visaService"
                                  className="mt-1"
                                  value="eBUSINESS VISA"
                                  onChange={e => {
                                    handleChange(e);
                                    setFieldValue('eTouristVisa', '');
                                    setFieldValue('eTouristVisa30Days', '');
                                    setFieldValue('eTouristVisa1Year', '');
                                    setFieldValue('eTouristVisa5Years', '');
                                    setFieldValue('eMedicalVisa', '');
                                    setFieldValue('eConferenceVisa', '');
                                    setFieldValue('eMedicalAttendantVisa', '');
                                    setFieldValue('eEmergencyXMisc', '');
                                  }}
                                />
                                <label htmlFor="visaServiceEbusiness">
                                  eBUSINESS VISA
                                </label>
                              </div>
                              {values.visaService === 'eBUSINESS VISA' && (
                                <div className="px-8 ">
                                  <div className="py-2 space-y-2">
                                    {/* level1-inner1 start  */}
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value={`TO SET UP INDUSTRIAL/BUSINESS VENTURE`}
                                      />
                                      <label htmlFor="eBusinessVisaValue">
                                        TO SET UP INDUSTRIAL/BUSINESS VENTURE
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue2"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value={`SALE/PURCHASE/TRADE`}
                                      />
                                      <label htmlFor="eBusinessVisaValue2">
                                        SALE/PURCHASE/TRADE
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue3"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value={`ATTEND TECHNICAL/BUSINESS MEETINGS`}
                                      />
                                      <label htmlFor="eBusinessVisaValue3">
                                        ATTEND TECHNICAL/BUSINESS MEETINGS
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue4"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value={`TO RECRUIT MANPOWER`}
                                      />
                                      <label htmlFor="eBusinessVisaValue4">
                                        TO RECRUIT MANPOWER
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue5"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value={`PARTICIPATION IN EXHIBITIONS,BUSINESS/TRADE FAIRS`}
                                      />
                                      <label htmlFor="eBusinessVisaValue5">
                                        PARTICIPATION IN
                                        EXHIBITIONS,BUSINESS/TRADE FAIRS
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue6"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value="EXPERT/SPECIALIST IN CONNECTION WITH AN ONGOING PROJECT"
                                      />
                                      <label htmlFor="eBusinessVisaValue6">
                                        EXPERT/SPECIALIST IN CONNECTION WITH AN
                                        ONGOING PROJECT
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue7"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value={`CONDUCTING TOURS`}
                                      />
                                      <label htmlFor="eBusinessVisaValue7">
                                        CONDUCTING TOURS
                                      </label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eBusinessVisaValue8"
                                        name="eBusinessVisa"
                                        className="mt-1"
                                        value="TO DELIVER LECTURE/S UNDER GLOBAL INITIATIVE FOR ACADEMIC NETWORKS (GIAN)"
                                      />
                                      <label htmlFor="eBusinessVisaValue8">
                                        TO DELIVER LECTURE/S UNDER GLOBAL
                                        INITIATIVE FOR ACADEMIC NETWORKS (GIAN)
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div>
                              {/* eCONFERENCE VISA */}
                              <div className="flex items-start space-x-2">
                                <Field
                                  type="radio"
                                  id="visaServiceEconference"
                                  name="visaService"
                                  className="mt-1"
                                  value="eCONFERENCE VISA"
                                  onChange={e => {
                                    handleChange(e);
                                    setFieldValue('eTouristVisa', '');
                                    setFieldValue('eTouristVisa30Days', '');
                                    setFieldValue('eTouristVisa1Year', '');
                                    setFieldValue('eTouristVisa5Years', '');
                                    setFieldValue('eMedicalVisa', '');
                                    setFieldValue('eMedicalAttendantVisa', '');
                                    setFieldValue('eBusinessVisa', '');
                                    setFieldValue('eEmergencyXMisc', '');
                                  }}
                                />
                                <label htmlFor="visaServiceEconference">
                                  eCONFERENCE VISA
                                </label>
                              </div>
                              {values.visaService === 'eCONFERENCE VISA' && (
                                <div className="px-8">
                                  <div>
                                    {/* level1-inner1 start  */}
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eConferenceVisaValue"
                                        name="eConferenceVisa"
                                        className="mt-1"
                                        value="TO ATTEND A CONFERENCE/SEMINAR/WORKSHOP ORGANIZED BY A MINISTRY OR DEPARTMENT OF THE GOVERNMENT OF INDIA,STATE GOVERNMENTS OR UT ADMINISTRATIONS AND THEIR SUBORDINATE/ ATTACHED ORGANIZATIONS AND PSUS"
                                      />
                                      <label htmlFor="eConferenceVisaValue">
                                        TO ATTEND A CONFERENCE/SEMINAR/WORKSHOP
                                        ORGANIZED BY A MINISTRY OR DEPARTMENT OF
                                        THE GOVERNMENT OF INDIA,STATE
                                        GOVERNMENTS OR UT ADMINISTRATIONS AND
                                        THEIR SUBORDINATE/ ATTACHED
                                        ORGANIZATIONS AND PSUS
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div>
                              {/* eMEDICAL ATTENDANT VISA */}
                              <div className="flex items-start space-x-2">
                                <Field
                                  type="radio"
                                  id="visaServiceEmedicalAttendant"
                                  name="visaService"
                                  className="mt-1"
                                  value="eMEDICAL ATTENDANT VISA"
                                />
                                <label htmlFor="visaServiceEmedicalAttendant">
                                  eMEDICAL ATTENDANT VISA
                                </label>
                              </div>
                              {values.visaService ===
                                'eMEDICAL ATTENDANT VISA' && (
                                <div className="px-8">
                                  <div>
                                    {/* level1-inner1 start  */}
                                    <div className="flex items-start space-x-2">
                                      <Field
                                        type="radio"
                                        id="eMedicalAttendantVisaValue"
                                        name="eMedicalAttendantVisa"
                                        className="mt-1"
                                        value={`TO ACCOMPANY PATIENT TRAVELLING TO INDIA ON
                              EMEDICAL VISA`}
                                      />
                                      <label htmlFor="eMedicalAttendantVisaValue">
                                        TO ACCOMPANY PATIENT TRAVELLING TO INDIA
                                        ON EMEDICAL VISA
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {/* multi step radio button end  */}
                    </div>

                    <div className="form-input-main-div">
                      <div className="input-error-wrapper">
                        <ReactDatePickerInput
                          className="new-form-input"
                          name="expectedDateOfArrival"
                          selected={new Date(values.expectedDateOfArrival)}
                          setFieldValue={setFieldValue}
                          minDate={minDateWithDate(
                            3,
                            values.expectedDateOfArrival
                          )}
                          label="Expected Date of Arrival"
                          required={true}
                          variant="doa"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      {updateMutation.isError ? (
                        <div className="text-red-500">
                          An error occurred: {updateMutation.error.message}
                        </div>
                      ) : null}

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
            ) : null}
          </div>
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
