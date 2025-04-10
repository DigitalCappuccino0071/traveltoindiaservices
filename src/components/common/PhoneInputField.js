'use client';

import React, { useState, useRef, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Image from 'next/image';
import 'react-phone-number-input/style.css';
import {
  FaChevronDown,
  FaCheck,
  FaSearch,
  FaExclamationCircle,
  FaGlobe,
} from 'react-icons/fa';

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
      // Set field value without running validations immediately
      form.setFieldValue(name, newValue, false); // false means don't validate on change
    }
  };

  // Handle blur event
  const handleBlur = e => {
    setIsFocused(false);
    setLocalTouched(true);

    if (onBlur) onBlur(e);

    if (form && name) {
      // Trigger validation just once on blur
      form.setFieldTouched(name, true, true);
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
        <label className="form-label mb-1 block">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`relative rounded border ${
          validationStatus === 'error'
            ? 'border-red-500'
            : validationStatus === 'success'
            ? 'border-green-500'
            : isFocused
            ? 'border-primary'
            : 'border-gray-300'
        } focus-within:border-primary`}
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
          countrySelectComponent={({ value, onChange, options }) => {
            // Filter options based on search query
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
                  type="button"
                  aria-label="Select country"
                  className="flex items-center h-full p-2 space-x-1 text-gray-700 border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-l"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(prev => !prev);
                  }}
                >
                  <span className="flex items-center">
                    {value ? (
                      <Image
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
                        alt={value}
                        width={20}
                        height={16}
                        style={{ height: 'auto' }}
                        className="mr-1 rounded-sm object-cover"
                      />
                    ) : (
                      <FaGlobe className="w-4 h-4 mr-1 text-gray-500" />
                    )}
                  </span>
                  <FaChevronDown className="w-3 h-3" />
                </button>

                {open && (
                  <div
                    ref={dropdownContentRef}
                    className="absolute z-10 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    role="listbox"
                  >
                    <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="text-gray-400 w-3 h-3" />
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
                            key={`${option.value || 'option'}-${index}`}
                            type="button"
                            role="option"
                            aria-selected={option.value === selectedCountry}
                            className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                              index === highlightedIndex
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              onChange(option.value);
                              setOpen(false);
                              setSearchQuery('');
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                          >
                            <div className="flex items-center">
                              {option.value && (
                                <Image
                                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${option.value}.svg`}
                                  alt={option.label}
                                  width={20}
                                  height={16}
                                  style={{ height: 'auto' }}
                                  className="mr-2 rounded-sm object-cover"
                                />
                              )}
                              <span>{option.label}</span>
                            </div>
                            {option.value === selectedCountry && (
                              <FaCheck className="w-3 h-3 text-primary" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No countries found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }}
          className="flex w-full p-2 outline-none focus:ring-0"
          // inputClassName="w-full p-2 outline-none focus:ring-0"
        />
        {validationStatus === 'error' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle className="w-4 h-4" />
          </div>
        )}
        {validationStatus === 'success' && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
            <FaCheck className="w-4 h-4" />
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-1 text-sm text-red-500 flex items-start">
          <FaExclamationCircle className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
