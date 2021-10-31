import { lazy, Suspense, useRef, useState } from 'react';
import * as Styled from './ImageCropper.styles';
import Avatar from 'components/Avatar/Avatar';
import useWindow from 'hooks/useWindowContext';
import { CV_WHITE } from 'constant/CssVariables';
import { validateFileUpload } from 'helpers/helpers';
import { readFile, createImage } from './cropUtils';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import ModalFallbackLoader from 'components/Loaders/ModalFallbackLoader/ModalFallbackLoader';

const CropperModal = lazy(() =>
  import(
    /* webpackChunkName: "crop-image-modal"*/ 'components/ImageCropper/ImageCropperModal'
  )
);

const allowedTypes = ['image/png', 'image/jpeg'];

/**
 * @typedef PropType
 * @type {Object}
 * @property {String} image - The original image.
 * @property {Function} onImageUpload - A callback function that fires on image upload done.
 * @property {('round' | 'rect')} cropShape - Crop shape.
 * @property {Boolean} showGrid - Show grid or not?.
 * @property {Boolean} isEditable - Can edit image or not?.
 * @property {String} uploadId - Upload subject id.
 * @property {String} uploadType - Upload subject type.
 * @property {String} containerClass - The image cropper classes.
 */

/**
 *  @description Renders an image crop component.
 * @component
 * @param {PropType} props -Props that pass to image cropper.
 */
const ImageCropper = (props) => {
  const {
    isEditable,
    image,
    uploadId,
    uploadType,
    onImageUpload,
    cropShape,
    showGrid,
    containerClass,
  } = props;

  const { GlobalUtilities, RVDic } = useWindow();
  const avatarUploadRef = useRef();

  const defaultModalValues = {
    isShown: false,
    title: RVDic.CropImage,
    aspect: 1 / 1,
    imgSrc: null,
    file: null,
    imgOrig: null,
  };

  const [cropModalProps, setCropModalProps] = useState(defaultModalValues);

  const handleCloseModal = () => {
    setCropModalProps(defaultModalValues);

    avatarUploadRef.current.value = '';
  };

  const handleAvatarEdit = () => {
    avatarUploadRef.current.click();
  };

  //! Fires whenever user chooses an image.
  const handleImageSelect = async (event) => {
    const files = event.target.files;

    if (files.length === 1 && validateFileUpload(files, allowedTypes)) {
      let imageDataUrl = await readFile(files[0]);
      let image = await createImage(imageDataUrl);

      setCropModalProps((m) => ({
        ...m,
        isShown: true,
        imgSrc: imageDataUrl,
        file: files[0],
        imgOrig: image,
      }));
    } else {
      event.target.value = '';
      console.log('Add one image only');
    }
  };

  const handleOnUploadDone = (image) => {
    onImageUpload && onImageUpload(image);
    handleCloseModal();
  };

  return (
    <Styled.ImageCropper className={containerClass}>
      <Suspense fallback={<ModalFallbackLoader />}>
        {cropModalProps?.isShown && (
          <CropperModal
            modalProps={cropModalProps}
            onCloseModal={handleCloseModal}
            uploadId={uploadId}
            uploadType={uploadType}
            onUploadDone={handleOnUploadDone}
            cropShape={cropShape}
            showGrid={showGrid}
          />
        )}
      </Suspense>
      <div style={{ width: '100%' }}>
        <Avatar
          userImage={GlobalUtilities.add_timestamp(image)}
          className="cropper-avatar"
        />
        {isEditable && (
          <Styled.PencilWrapper onClick={handleAvatarEdit}>
            <PencilIcon color={CV_WHITE} size={18} />
            <HiddenUploadFile
              ref={avatarUploadRef}
              onFileChange={handleImageSelect}
            />
          </Styled.PencilWrapper>
        )}
      </div>
    </Styled.ImageCropper>
  );
};

export default ImageCropper;
