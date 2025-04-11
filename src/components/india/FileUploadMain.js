'use client';
import Image from 'next/image';
import React from 'react';
import { LuImagePlus } from 'react-icons/lu';

const FileUploadMain = ({
  name,
  setFieldValue,
  values,
  errorMessage,
  accept,
  multiple,
  onFileSelect,
  id,
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
        id={id}
        className="hidden"
      />
      {errorMessage}
      <div className="flex flex-wrap gap-2 mt-2">
        {values[name].length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
            {values[name].map((file, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg border border-gray-200 p-2"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-contain w-full h-32"
                />
              </div>
            ))}
            <label
              htmlFor={id}
              className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary hover:bg-gray-100 transition-colors"
            >
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-primary">
                    <LuImagePlus size={24} />
                  </div>
                </div>
                <h4 className="text-sm font-medium text-gray-700">Add More</h4>
              </div>
            </label>
          </div>
        ) : (
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary hover:bg-gray-100 transition-colors w-full"
          >
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-primary">
                  <LuImagePlus size={24} />
                </div>
              </div>
              <h4 className="text-sm font-medium text-gray-700">
                Click to select files
              </h4>
              <p className="text-xs text-gray-500">
                Multiple files allowed • JPG, PNG
              </p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default FileUploadMain;
