import 'react-phone-number-input/style.css';

import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import { useState } from 'react';

export default function CustomReactPhoneNumberInput({
  setFieldValue,
  setFieldTouched,
  errors,
  touched,
  name,
  defaultValue,
  ...props
}) {
  const [value, setValue] = useState(defaultValue || '');

  const handleChange = value => {
    if (value && isValidPhoneNumber(value)) {
      setFieldValue(name, formatPhoneNumberIntl(value));
      setFieldTouched(name, true);
    } else {
      setValue(value);
      setFieldTouched(name, false);
    }
  };

  return (
    <>
      <PhoneInput
        {...props}
        placeholder="Enter phone number"
        value={value}
        onChange={handleChange}
        error={touched[name] && errors[name] ? errors[name] : undefined}
      />
      {/* Is possible: {value && isPossiblePhoneNumber(value) ? 'true' : 'false'}
      Is valid: {value && isValidPhoneNumber(value) ? 'true' : 'false'}
      National: {value && formatPhoneNumber(value)}
      International: {value && formatPhoneNumberIntl(value)} */}
    </>
  );
}
