'use client';
import Image from 'next/image';
import React from 'react';

const FileUploadMain = ({
  name,
  setFieldValue,
  values,
  errorMessage,
  accept,
  multiple,
  onFileSelect,
}) => {
  const handleFileChange = event => {
    const files = event.target.files;
    if (files.length > 0) {
      setFieldValue(name, [...values[name], ...files]);

      // Call onFileSelect for each file if provided
      if (onFileSelect) {
        for (let i = 0; i < files.length; i++) {
          onFileSelect(files[i]);
        }
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        name={name}
        onChange={handleFileChange}
      />
      {errorMessage}
      <div className="flex flex-wrap gap-2 mt-2">
        {values[name].length > 0 && (
          <div>
            {values[name].map((file, index) => (
              <div key={index} className="relative overflow-hidden">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded Image ${index + 1}`}
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadMain;
