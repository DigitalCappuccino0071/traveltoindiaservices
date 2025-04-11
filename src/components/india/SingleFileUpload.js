import Image from 'next/image';
import React from 'react';
import { LuImagePlus } from 'react-icons/lu';

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
        className="hidden"
        id={id}
      />
      {errorMessage}
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-gray-200 p-2">
          <Image
            src={URL.createObjectURL(value)}
            alt="Uploaded Image"
            width={100}
            height={100}
            className="object-contain w-full h-32"
          />
          <label
            htmlFor={id}
            className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <LuImagePlus size={16} className="text-primary" />
          </label>
        </div>
      ) : (
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
            <h4 className="text-sm font-medium text-gray-700">
              Click to select photo
            </h4>
            <p className="text-xs text-gray-500">Accepted formats: JPG, PNG</p>
          </div>
        </label>
      )}
    </div>
  );
};

export default SingleFileUpload;
