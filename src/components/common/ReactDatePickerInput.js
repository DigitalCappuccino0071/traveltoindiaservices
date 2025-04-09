import React, { useState, useEffect } from 'react';
import { ErrorMessage, useField } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CiCalendarDate } from 'react-icons/ci';
import { parseISO, format } from 'date-fns';

// Create a custom input component for the date picker
const CustomInput = React.forwardRef(
  ({ value, onClick, onChange, disabled, placeholder, className }, ref) => {
    // Format the date for display (DD-MM-YYYY)
    let displayValue = '';
    if (value) {
      try {
        // Parse the date value and format it
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          displayValue = format(date, 'dd-MM-yyyy');
        }
      } catch (e) {
        console.error('Error formatting date for display:', e);
      }
    }

    return (
      <input
        type="text"
        ref={ref}
        value={displayValue}
        onClick={disabled ? undefined : onClick}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={className}
        readOnly
      />
    );
  }
);

// Add display name to avoid linter error
CustomInput.displayName = 'CustomDateInput';

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
  // Use Formik's useField hook to get field props
  const [field, meta, helpers] = useField(name);

  // Manual validation control states
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Improve date parsing logic
  let selectedDate = null;
  try {
    // Handle different types of date inputs
    if (selected instanceof Date && !isNaN(selected.getTime())) {
      selectedDate = selected;
    } else if (typeof selected === 'string' && selected) {
      try {
        selectedDate = parseISO(selected);
        // Check if the parsed date is valid
        if (isNaN(selectedDate.getTime())) {
          selectedDate = new Date(selected);
        }
      } catch (err) {
        // Fallback to standard Date constructor
        selectedDate = new Date(selected);
      }
    }

    // Final validity check
    if (selectedDate && isNaN(selectedDate.getTime())) {
      selectedDate = null;
    }
  } catch (e) {
    console.error('Error parsing date:', e);
    selectedDate = null;
  }

  // Get today's date for reference
  const today = new Date();

  // Set up date constraints based on variant
  let minDateValue = null;
  let maxDateValue = null;
  let placeholderText = 'Select a date';
  let dateFormat = 'dd/MM/yyyy';
  let calendarStartDate = null;

  // Configure variant-specific settings
  switch (variant) {
    case 'dob':
      maxDateValue = maxDate || today;
      placeholderText = 'Select your date of birth';
      calendarStartDate = new Date(today.getFullYear() - 30, 0, 1);
      break;

    case 'doa':
      const arrivalMinDate = new Date();
      arrivalMinDate.setDate(today.getDate() + 4);
      minDateValue = minDate || arrivalMinDate;
      placeholderText = 'Select arrival date';
      calendarStartDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7
      );
      break;

    case 'passport-expiry':
      const expiryMinDate = new Date();
      expiryMinDate.setMonth(today.getMonth() + 6);
      minDateValue = expiryMinDate;
      placeholderText = 'Select passport expiry date';
      calendarStartDate = new Date(
        today.getFullYear(),
        today.getMonth() + 6,
        today.getDate()
      );
      break;

    default:
      if (minDate)
        minDateValue =
          typeof minDate === 'string' ? parseISO(minDate) : minDate;
      if (maxDate)
        maxDateValue =
          typeof maxDate === 'string' ? parseISO(maxDate) : maxDate;
      break;
  }

  // Validate date directly
  const validateDate = date => {
    if (!date) {
      setIsValid(false);
      setErrorMessage('Please select a date');
      return false;
    }

    if (minDateValue && date < minDateValue) {
      setIsValid(false);
      if (variant === 'passport-expiry') {
        setErrorMessage('Passport must be valid for at least 6 months');
      } else if (variant === 'doa') {
        setErrorMessage('Arrival date must be at least 4 days from today');
      } else {
        setErrorMessage(
          `Date must be after ${minDateValue.toLocaleDateString()}`
        );
      }
      return false;
    }

    if (maxDateValue && date > maxDateValue) {
      setIsValid(false);
      if (variant === 'dob') {
        setErrorMessage('Birth date cannot be in the future');
      } else {
        setErrorMessage(
          `Date must be before ${maxDateValue.toLocaleDateString()}`
        );
      }
      return false;
    }

    setIsValid(true);
    setErrorMessage('');
    return true;
  };

  // Initialize validation state if we already have a value
  useEffect(() => {
    if (selectedDate) {
      validateDate(selectedDate);
      setIsTouched(true);
    }
  }, []);

  // Handle date change with guaranteed immediate feedback
  const handleDateChange = date => {
    // First validate
    const valid = validateDate(date);

    // Always set as touched
    setIsTouched(true);

    // Update Formik
    setFieldValue(name, date);
    helpers.setTouched(true, true);
  };

  // Determine validation state directly
  const hasError = isTouched && !isValid;
  const showSuccess = isTouched && isValid;

  // Input style based on validation state
  const inputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    hasError
      ? 'border-red-500 bg-red-50'
      : showSuccess
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
          {...field}
          selected={selectedDate}
          onChange={handleDateChange}
          onBlur={() => setIsTouched(true)}
          disabled={disabled}
          className={inputClass}
          dateFormat="dd-MM-yyyy"
          placeholderText={placeholderText}
          showIcon
          icon={
            <CiCalendarDate
              className={
                hasError
                  ? 'text-red-500'
                  : showSuccess
                  ? 'text-green-500'
                  : 'text-gray-500'
              }
            />
          }
          minDate={minDateValue}
          maxDate={maxDateValue}
          openToDate={calendarStartDate}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          shouldCloseOnSelect={true}
          isClearable={false}
          customInput={<CustomInput className={inputClass} />}
          popperModifiers={[
            {
              name: 'preventOverflow',
              options: {
                rootBoundary: 'viewport',
                padding: 8,
              },
            },
          ]}
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

        {showSuccess && (
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

      {hasError && (
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
}
