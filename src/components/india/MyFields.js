'use client';
import { useField, useFormikContext } from 'formik';
import { useState, useEffect } from 'react';

export default function MyDependentField({
  label,
  name,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  dependentFields = '',
  sameAddress = false,
}) {
  const { setFieldValue } = useFormikContext();
  const [field, meta, helpers] = useField(name);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Set field value based on dependentFields when sameAddress is true
  useEffect(() => {
    if (dependentFields.trim() !== '' && sameAddress) {
      setFieldValue(name, `${dependentFields}`);
    }
  }, [setFieldValue, name, sameAddress, dependentFields]);

  // Validate immediately when value changes
  useEffect(() => {
    if (field.value) {
      setIsTouched(true);
      helpers.setTouched(true);
    }
  }, [field.value, helpers]);

  // Handle change with validation
  const handleChange = e => {
    field.onChange(e);
    setIsTouched(true);
    helpers.setTouched(true);
  };

  // Handle blur event
  const handleBlur = e => {
    field.onBlur(e);
    setIsFocused(false);
    setIsTouched(true);
  };

  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Determine if field has error
  const hasError = (meta.touched || isTouched) && meta.error;

  // Success state - field is touched AND has no error AND a value is selected
  const isSuccess = (meta.touched || isTouched) && !meta.error && field.value;

  // Set input class based on validation state
  const inputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    hasError
      ? 'border-red-500 bg-red-50'
      : isSuccess
      ? 'border-green-500 bg-green-50'
      : isFocused
      ? 'border-primary'
      : 'border-gray-300'
  } ${className}`;

  return (
    <div className="text-input-wrapper w-full">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={type}
          {...field}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled || sameAddress}
          className={inputClass}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
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
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
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
        <div className="mt-1 text-sm text-red-500">{meta.error}</div>
      )}
    </div>
  );
}
