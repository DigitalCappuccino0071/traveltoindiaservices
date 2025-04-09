'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {
  FaChevronDown,
  FaCheck,
  FaSearch,
  FaExclamationCircle,
  FaGlobe,
} from 'react-icons/fa';

// Create a forwarded ref component for the input
const CustomInput = forwardRef(
  ({ className, validationStatus, ...rest }, ref) => (
    <input
      ref={ref}
      className={`w-full p-2 outline-none focus:ring-0 ${
        validationStatus === 'error'
          ? 'bg-red-50 text-red-700'
          : validationStatus === 'success'
          ? 'bg-green-50 text-green-700'
          : 'bg-white'
      } ${className}`}
      {...rest}
    />
  )
);

CustomInput.displayName = 'CustomInput';

export default function PhoneInputField({
  name,
  value,
  onChange,
  onBlur,
  placeholder = 'Enter phone number',
  error,
  touched,
  label = 'Phone Number',
  required = false,
  className = '',
  form = null, // Pass the Formik form instance for better integration
}) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [localTouched, setLocalTouched] = useState(false);
  const listRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownContentRef.current?.contains(event.target)
      ) {
        setOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);
    }
  }, [open]);

  // Update selectedCountry when value changes
  useEffect(() => {
    // Extract country code from phone number
    if (value && typeof value === 'string' && value.startsWith('+')) {
      const countryCode = value.split(' ')[0];
      // Just store the country code part, don't set anything during render
      if (countryCode) {
        setSelectedCountry(countryCode);
      }
    }
  }, [value]);

  // Validate immediately when value changes
  useEffect(() => {
    if (value && form && name) {
      setLocalTouched(true);
      form.setFieldTouched(name, true, false);

      // Validate the phone number
      const validationError = validatePhoneNumber(value);
      if (validationError) {
        form.setFieldError(name, validationError);
      } else {
        form.setFieldError(name, undefined);
      }
    }
  }, [value, form, name]);

  // Validate phone number using isValidPhoneNumber like in the Zod validation
  const validatePhoneNumber = phoneNumber => {
    if (!phoneNumber) return required ? 'Phone number is required' : null;
    if (!isValidPhoneNumber(phoneNumber)) return 'Invalid phone number format';
    return null;
  };

  // Get validation status - use both formik's error and our local validation
  const getValidationStatus = () => {
    // Use either passed touched state or local touched state
    const isTouched = touched || localTouched;

    if (isTouched && error) return 'error';
    if (value && isValidPhoneNumber(value)) return 'success';
    return null;
  };

  const validationStatus = getValidationStatus();

  // Handle phone input change with validation
  const handlePhoneChange = newValue => {
    setLocalTouched(true);
    onChange(newValue);

    if (form && name) {
      // Set field touched to trigger immediate validation
      form.setFieldValue(name, newValue);
      form.setFieldTouched(name, true, false);

      // Custom validation - useful if Formik's validation isn't running immediately
      const validationError = validatePhoneNumber(newValue);
      if (validationError) {
        form.setFieldError(name, validationError);
      } else {
        // Clear error if validation passes
        form.setFieldError(name, undefined);
      }
    }
  };

  // Handle blur event
  const handleBlur = e => {
    setIsFocused(false);
    setLocalTouched(true);

    if (onBlur) onBlur(e);

    if (form && name) {
      form.setFieldTouched(name, true, true);

      // Validate on blur
      const validationError = validatePhoneNumber(value);
      if (validationError) {
        form.setFieldError(name, validationError);
      }
    }
  };

  // Handle keyboard navigation in the dropdown
  const handleKeyDown = e => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => prev + 1);
      const items = listRef.current?.querySelectorAll('button');
      if (items && highlightedIndex + 1 < items.length) {
        items[highlightedIndex + 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(0, prev - 1));
      const items = listRef.current?.querySelectorAll('button');
      if (items && highlightedIndex > 0) {
        items[highlightedIndex - 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const items = listRef.current?.querySelectorAll('button');
      if (items && items[highlightedIndex]) {
        items[highlightedIndex].click();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setSearchQuery('');
    }
  };

  // Display error message
  const errorMessage = touched || localTouched ? error : null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-1 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`relative rounded-md ${
          validationStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : validationStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : isFocused
            ? 'border-primary'
            : 'border-gray-300'
        } border focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50`}
      >
        <PhoneInput
          name={name}
          value={value}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          international
          defaultCountry="US"
          countrySelectComponent={({
            value: countryValue,
            onChange: onCountryChange,
            options,
          }) => {
            // Don't set state during render - moved to useEffect above
            // Only filter options here, don't set state
            const filteredOptions = searchQuery
              ? options.filter(option =>
                  option.label
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              : options;

            return (
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  key="country-selector-button"
                  type="button"
                  aria-label="Select country"
                  className={`flex items-center h-full p-2 space-x-1 text-gray-700 border-r ${
                    validationStatus === 'error'
                      ? 'border-red-300'
                      : validationStatus === 'success'
                      ? 'border-green-300'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-l`}
                  onClick={() => setOpen(!open)}
                >
                  <span className="flex items-center">
                    {countryValue ? (
                      <img
                        key="country-flag"
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryValue}.svg`}
                        alt={countryValue}
                        className="w-5 h-4 mr-1 rounded-sm object-cover"
                      />
                    ) : (
                      <FaGlobe
                        key="globe-icon"
                        className="w-4 h-4 mr-1 text-gray-500"
                      />
                    )}
                  </span>
                  <FaChevronDown key="chevron-icon" className="w-3 h-3" />
                </button>

                {open && (
                  <div
                    key="country-dropdown"
                    ref={dropdownContentRef}
                    className="absolute z-10 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    role="listbox"
                  >
                    <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch
                            key="search-icon"
                            className="text-gray-400 w-3 h-3"
                          />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={e => {
                            e.stopPropagation();
                            setSearchQuery(e.target.value);
                            setHighlightedIndex(0);
                            // Ensure input maintains focus after state update
                            setTimeout(
                              () => searchInputRef.current?.focus(),
                              0
                            );
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Search countries..."
                          className="w-full p-2 pl-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          onClick={e => e.stopPropagation()}
                          onMouseDown={e => e.stopPropagation()}
                          aria-label="Search countries"
                        />
                      </div>
                    </div>
                    <div className="py-1" ref={listRef}>
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={option.value === selectedCountry}
                            className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                              index === highlightedIndex
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              onCountryChange(option.value);
                              setOpen(false);
                              setSearchQuery('');
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                          >
                            <div className="flex items-center">
                              {option.value && (
                                <img
                                  key={`flag-${option.value}`}
                                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${option.value}.svg`}
                                  alt={option.label}
                                  className="w-5 h-4 mr-2 rounded-sm object-cover"
                                />
                              )}
                              <span>{option.label}</span>
                            </div>
                            {option.value === selectedCountry && (
                              <FaCheck
                                key="check-icon"
                                className="w-3 h-3 text-primary"
                              />
                            )}
                          </button>
                        ))
                      ) : (
                        <div
                          key="no-countries-found"
                          className="px-4 py-3 text-sm text-gray-500 text-center"
                        >
                          No countries found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }}
          className="w-full flex"
          inputComponent={CustomInput}
        />
        {validationStatus === 'error' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle key="error-icon" className="w-4 h-4" />
          </div>
        )}
        {validationStatus === 'success' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
            <FaCheck key="success-icon" className="w-4 h-4" />
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
}
