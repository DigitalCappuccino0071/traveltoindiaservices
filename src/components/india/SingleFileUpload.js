import Image from 'next/image';
import React from 'react';

const SingleFileUpload = ({
  name,
  setFieldValue,
  value,
  accept,
  errorMessage,
  id,
  onFileSelect,
}) => {
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue(name, file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        name={name}
        onChange={handleFileChange}
        // className="hidden"
        id={id}
      />
      {errorMessage}
    </div>
  );
};

export default SingleFileUpload;
