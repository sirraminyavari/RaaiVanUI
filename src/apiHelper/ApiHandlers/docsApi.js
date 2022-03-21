import { DOCS_API, UPLOAD_AND_CROP_ICON } from 'constant/apiConstants';
import { API_Provider } from 'helpers/helpers';
import axios from 'axios';

/**
 * @description Returns the upload URL for the passed `Type`
 * @param prop.IconID - An ID to use for the image name
 * @param {string|"ProfileImage"} prop.Type - Usage type of the uploadable file
 * @return {Promise<unknown>}
 */
export const getUploadUrl = async ({ IconID, Type } = {}) => {
  return new Promise((resolve) =>
    API_Provider(DOCS_API, UPLOAD_AND_CROP_ICON).url(
      {
        IconID,
        Type,
      },
      (uploadURL) => {
        resolve(uploadURL);
      },
      (error) => {
        console.log(error);
      }
    )
  );
};

/**
 * @description Upload and save image file to the passed `SaveURL`
 * @param prop.SaveURL - An URL string returned from `getUploadUrl`
 * @param prop.file - A binary/blob image file
 * @param prop.IconID - An ID to use for the image name
 * @param {string|"ProfileImage"} prop.Type - Usage type of the image
 * @param prop.x - Image cropper's "x" parameter from croppedAreaPixels
 * @param prop.y - Image cropper's "y" parameter from croppedAreaPixels
 * @param prop.w - Image cropper's "width" parameter from croppedAreaPixels
 * @param prop.h - Image cropper's "height" parameter from croppedAreaPixels
 * @return {Promise<unknown>}
 */
export const setUploadImage = async ({
  file,
  IconID,
  Type,
  SaveURL,
  x,
  y,
  width,
  height,
} = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('IconID', IconID);
  formData.append('Type', Type);
  formData.append('x', x);
  formData.append('y', y);
  formData.append('w', width);
  formData.append('h', height);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const response = await axios.post(SaveURL, formData, config);
    const res = response?.data || {};

    if (res.ImageURL) {
      return res;
    } else throw new Error(res || 'OperationFailed');
  } catch (error) {
    throw new Error(error);
  }
};
