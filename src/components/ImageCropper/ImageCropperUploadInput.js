import { forwardRef } from 'react';
import { validateFileUpload } from 'helpers/helpers';
import { readFile, createImage } from './cropUtils';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';

/**
 * @component - Image Cropper's hidden file input
 * @param {({imageSrc,targetFile,originalImage})=>void} [props.onImageChange]
 */
const ImageCropperUploadInput = forwardRef(
  ({ onImageChange, ...restProps }, ref) => {
    const allowedTypes = ['image/png', 'image/jpeg'];

    const handleImageSelect = async (event) => {
      const files = event.target.files;

      if (files.length === 1 && validateFileUpload(files, allowedTypes)) {
        const imageDataUrl = await readFile(files[0]);
        const image = await createImage(imageDataUrl);
        onImageChange(
          {
            imageSrc: imageDataUrl,
            targetFile: files[0],
            originalImage: image,
          },
          event
        );
      } else {
        event.target.value = '';
        console.log('Add one image only');
      }
    };

    return (
      <>
        <HiddenUploadFile
          {...restProps}
          ref={ref}
          onFileChange={handleImageSelect}
        />
      </>
    );
  }
);

export default ImageCropperUploadInput;
