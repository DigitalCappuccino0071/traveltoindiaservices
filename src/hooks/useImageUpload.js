import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/services/api';
import apiEndpoint from '@/services/apiEndpoint';
import { toast } from 'react-toastify';

export const useImageUpload = () => {
  const uploadSingleImage = useMutation({
    mutationFn: async file => {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(
          apiEndpoint.UPLOAD_SINGLE_IMAGE,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to upload image');
        }

        console.log('Upload successful: ', response.data);
        return response.data.data;
      } catch (error) {
        console.error('Error uploading image: ', error);
        throw error;
      }
    },
    onSuccess: data => {
      toast.success('Image uploaded successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    },
    onError: error => {
      toast.error(error.message || 'Error uploading image', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    },
  });

  const uploadMultipleImages = useMutation({
    mutationFn: async files => {
      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('images', file);
        });

        const response = await axiosInstance.post(
          apiEndpoint.UPLOAD_MULTIPLE_IMAGES,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to upload images');
        }

        console.log('Multiple upload successful: ', response.data);
        return response.data.data;
      } catch (error) {
        console.error('Error uploading images: ', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Images uploaded successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    },
    onError: error => {
      toast.error(error.message || 'Error uploading images', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    },
  });

  const deleteImage = useMutation({
    mutationFn: async publicId => {
      try {
        const response = await axiosInstance.delete(
          `${apiEndpoint.DELETE_IMAGE}/${publicId}`
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to delete image');
        }

        return response.data;
      } catch (error) {
        console.error('Error deleting image: ', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Image deleted successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    },
    onError: error => {
      toast.error(error.message || 'Error deleting image', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
    },
  });

  return {
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage,
  };
};
