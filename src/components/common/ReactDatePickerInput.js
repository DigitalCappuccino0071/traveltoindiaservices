import React, { useState, useEffect } from 'react';
import { ErrorMessage, useField } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CiCalendarDate } from 'react-icons/ci';

export default function ReactDatePickerInput({
  setFieldValue,
  name,
  selected,
  minDate = '',
  maxDate = '',
  disabled = false,
  variant = '',
  label = '',
  required = false,
}) {
  const [field, meta, helpers] = useField(name);
  const [isTouched, setIsTouched] = useState(false);
  const today = new Date();

  // Validate immediately when selected value changes
  useEffect(() => {
    if (selected) {
      // Mark as touched to trigger validation
      setIsTouched(true);
      helpers.setTouched(true);
    }
  }, [selected, helpers]);

  // Handle blur event to set field as touched
  const handleBlur = () => {
    setIsTouched(true);
    field.onBlur({ target: { name } });
  };

  // Handle date change
  const handleDateChange = date => {
    setFieldValue(name, date);
    setIsTouched(true);
    helpers.setTouched(true);

    // Force validation immediately
    setTimeout(() => {
      helpers.setTouched(true);
    }, 10);
  };

  // Determine appearance and behavior based on variant
  const getVariantProps = () => {
    switch (variant) {
      case 'dob':
        return {
          maxDate: maxDate || today,
          showYearDropdown: true,
          showMonthDropdown: true,
          dropdownMode: 'select',
          yearDropdownItemNumber: 100,
          scrollableYearDropdown: true,
          placeholderText: 'Select your date of birth',
          dateFormat: 'dd/MM/yyyy',
          calendarClassName: 'dob-calendar',
          openToDate: new Date(today.getFullYear() - 30, 0, 1),
        };
      default:
        return {
          showMonthDropdown: true,
          showYearDropdown: true,
          dropdownMode: 'select',
          placeholderText: 'Select a date',
          dateFormat: 'dd/MM/yyyy',
        };
    }
  };

  const variantProps = getVariantProps();

  // Determine if field has error - only if field is touched AND has an error AND no valid date is selected
  const hasError = (meta.touched || isTouched) && meta.error;

  // Success state - field is touched AND has no error AND a date is selected
  const isSuccess = (meta.touched || isTouched) && !meta.error && selected;

  // Set input class based on validation state
  const inputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    hasError
      ? 'border-red-500 bg-red-50'
      : isSuccess
      ? 'border-green-500 bg-green-50'
      : 'border-gray-300'
  }`;

  return (
    <div className="date-picker-wrapper">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <ReactDatePicker
          id={name}
          disabled={disabled}
          name={name}
          selected={selected}
          onChange={handleDateChange}
          className={inputClass}
          showIcon
          icon={
            <CiCalendarDate
              className={
                hasError
                  ? 'text-red-500'
                  : isSuccess
                  ? 'text-green-500'
                  : 'text-gray-500'
              }
            />
          }
          toggleCalendarOnIconClick
          minDate={minDate}
          maxDate={variantProps.maxDate || maxDate}
          {...variantProps}
          required={required}
          onBlur={handleBlur}
          onCalendarClose={handleBlur}
        />
        {hasError && (
          <div className="absolute right-10 top-2.5 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {isSuccess && (
          <div className="absolute right-10 top-2.5 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {hasError ? (
        <div className="mt-1 text-sm text-red-500">{meta.error}</div>
      ) : (
        <ErrorMessage name={name}>
          {errorMsg => (
            <div className="mt-1 text-sm text-red-500">{errorMsg}</div>
          )}
        </ErrorMessage>
      )}
    </div>
  );
}
