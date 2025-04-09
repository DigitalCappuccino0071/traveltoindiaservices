import React, { useState, useEffect } from 'react';
import { ErrorMessage, useField } from 'formik';

export default function SelectField({
  label,
  name,
  options = [],
  required = false,
  placeholder = 'Select',
  disabled = false,
  className = '',
  onChange,
}) {
  const [field, meta, helpers] = useField(name);
  const [isTouched, setIsTouched] = useState(false);

  // Validate when value changes
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

    // Call custom onChange if provided
    if (onChange) {
      onChange(e);
    }
  };

  // Handle blur event
  const handleBlur = e => {
    field.onBlur(e);
    setIsTouched(true);
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
      : 'border-gray-300'
  } ${className}`;

  return (
    <div className="select-field-wrapper">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          {...field}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClass}
          required={required}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
