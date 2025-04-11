'use client';
import React, { useState, useEffect } from 'react';
import { ErrorMessage, useField } from 'formik';
import Select from 'react-select';
import { FaLock } from 'react-icons/fa';

export default function MultiSelectField({
  label,
  name,
  options = [],
  required = false,
  placeholder = 'Select',
  disabled = false,
  className = '',
  disabledReason = '',
}) {
  const [field, meta, helpers] = useField(name);
  const [isTouched, setIsTouched] = useState(false);

  // Validate when value changes
  useEffect(() => {
    if (field.value && field.value.length > 0) {
      setIsTouched(true);
      helpers.setTouched(true);
    }
  }, [field.value, helpers]);

  // Handle change with validation
  const handleChange = selectedOptions => {
    helpers.setValue(selectedOptions);
    setIsTouched(true);
    helpers.setTouched(true);
  };

  // Handle blur event
  const handleBlur = () => {
    helpers.setTouched(true);
    setIsTouched(true);
  };

  // Determine if field has error
  const hasError = (meta.touched || isTouched) && meta.error;

  // Success state - field is touched AND has no error AND a value is selected
  const isSuccess =
    (meta.touched || isTouched) &&
    !meta.error &&
    field.value &&
    field.value.length > 0;

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: hasError
        ? '#ef4444'
        : isSuccess
        ? '#22c55e'
        : disabled
        ? '#e5e7eb'
        : state.isFocused
        ? 'var(--color-primary)'
        : '#d1d5db',
      borderRadius: '0.375rem',
      minHeight: '42px',
      boxShadow: state.isFocused
        ? '0 0 0 2px var(--color-primary-light)'
        : 'none',
      backgroundColor: hasError
        ? '#fee2e2'
        : isSuccess
        ? '#dcfce7'
        : disabled
        ? '#f3f4f6'
        : 'white',
      opacity: disabled ? 0.75 : 1,
      '&:hover': {
        borderColor: state.isFocused
          ? 'var(--color-primary)'
          : hasError
          ? '#ef4444'
          : isSuccess
          ? '#22c55e'
          : '#9ca3af',
      },
      cursor: disabled ? 'not-allowed' : 'default',
    }),
    menu: provided => ({
      ...provided,
      zIndex: 2,
      borderRadius: '0.375rem',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--color-primary)'
        : state.isFocused
        ? 'var(--color-primary-light)'
        : 'white',
      color: state.isSelected
        ? 'white'
        : state.isFocused
        ? '#111827'
        : '#4b5563',
      fontSize: '0.875rem',
      cursor: 'pointer',
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: 'var(--color-primary-light)',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: '#111827',
      fontWeight: 500,
      fontSize: '0.75rem',
      padding: '2px 6px',
    }),
    multiValueRemove: provided => ({
      ...provided,
      color: '#4b5563',
      ':hover': {
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }),
    placeholder: provided => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    noOptionsMessage: provided => ({
      ...provided,
      color: '#6b7280',
      fontSize: '0.875rem',
    }),
  };

  return (
    <div className="multi-select-wrapper w-full">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {disabled && (
            <span className="ml-2 text-gray-500 text-xs italic">(Locked)</span>
          )}
        </label>
      )}
      <div className="relative">
        <Select
          id={name}
          name={name}
          options={options}
          isMulti
          value={field.value}
          onChange={handleChange}
          onBlur={handleBlur}
          isDisabled={disabled}
          placeholder={placeholder}
          className={className}
          classNamePrefix="react-select"
          styles={customStyles}
          noOptionsMessage={() => 'No options found'}
          aria-disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
        />

        {hasError && !disabled && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500">
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

        {isSuccess && !disabled && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500">
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

        {disabled && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaLock className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Display the disabled reason directly below the field */}
      {disabled && disabledReason && (
        <div className="mt-1 text-sm text-amber-600 flex items-start">
          <FaLock className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0" />
          <span>{disabledReason}</span>
        </div>
      )}

      {hasError && !disabled ? (
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
