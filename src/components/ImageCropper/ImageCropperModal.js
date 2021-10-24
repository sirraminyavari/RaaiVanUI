import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Styled from './ImageCropper.styles';
import Modal from 'components/Modal/Modal';
import ImageCropper from './ImageCropper';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import { DOCS_API, UPLOAD_AND_CROP_ICON } from 'constant/apiConstants';
import { API_Provider } from 'helpers/helpers';

const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_AND_CROP_ICON);

//! Common styles for crop image modal buttons.
const ButtonsCommonStyles = { width: '6rem', height: '2rem' };

/**
 * @typedef ModalPropsType
 * @type {Object}
 * @property {Boolean} isShown - Show modal or not?.
 * @property {String} imgSrc - The image source.
 * @property {Number} aspect - Image aspect ratio.
 * @property {String} title - Modal title.
 * @property {*} file - Modal title.
 */

/**
 * @typedef PropType
 * @type {Object}
 * @property {ModalPropsType} modalProps - The modal properties.
 * @property {Function} onCloseModal - A callback function that fires on modal close event.
 * @property {('round' | 'rect')} cropShape - Crop shape.
 * @property {Boolean} showGrid - Show grid or not?.
 * @property {String} uploadId - Upload subject id.
 * @property {String} uploadType - Upload subject type.
 */

/**
 *  @description Renders an image crop component.
 * @component
 * @param {PropType} props -Props that pass to image crop modal.
 */
const ImageCropModal = (props) => {
  const {
    modalProps,
    onCloseModal,
    uploadId,
    uploadType,
    onUploadDone,
    cropShape,
    showGrid,
  } = props;

  const { RVDic, GlobalUtilities } = useWindow();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [profileURL, setProfileURL] = useState(null);

  //! Get upload URL.
  useEffect(() => {
    getUploadUrlAPI.url(
      { IconID: uploadId, Type: uploadType },
      (response) => {
        let uploadURL = response.slice(5);
        setProfileURL(uploadURL);
        // console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );

    //! Clean up.
    return () => {
      setProfileURL(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Fires on save button click.
  const handleSaveCroppedImage = () => {
    setIsSavingImage(true);

    let formData = new FormData();
    formData.append('file', modalProps.file);

    formData.append('IconID', uploadId);
    formData.append('Type', uploadType);

    formData.append('x', croppedAreaPixels?.x || croppedAreaPixels?.X);
    formData.append('y', croppedAreaPixels?.y || croppedAreaPixels?.Y);
    formData.append('w', croppedAreaPixels?.width || croppedAreaPixels?.Width);
    formData.append('h', croppedAreaPixels?.width || croppedAreaPixels?.Width);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    //! Update profile avatar.
    axios
      .post(profileURL, formData, config)
      .then((response) => {
        setIsSavingImage(false);

        let res = response?.data || {};

        if (res.ImageURL) {
          const newImageURL = GlobalUtilities.add_timestamp(res.ImageURL);
          onUploadDone && onUploadDone(newImageURL);
        } else alert(RVDic?.MSG?.OperationFailed || 'operation failed');
      })
      .catch((error) => {
        setIsSavingImage(false);
        console.log(error);
      });
  };

  //! Fires when user changes the image crop area.
  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Modal
      show={modalProps?.isShown}
      onClose={onCloseModal}
      contentWidth="50%"
      titleClass="profile-image-crop-modal"
      title={modalProps?.title}>
      <Styled.ImageCropperWrapper>
        <ImageCropper
          imageSrc={modalProps?.imgSrc}
          aspectRatio={modalProps?.aspect}
          onImageCropComplete={handleImageCropComplete}
          cropShape={cropShape}
          showGrid={showGrid}
        />
        <Styled.CropperButtonsWrapper>
          <Button
            loading={isSavingImage}
            onClick={handleSaveCroppedImage}
            type="primary"
            style={ButtonsCommonStyles}>
            {RVDic.Save}
          </Button>
          <Button
            onClick={onCloseModal}
            type="negative-o"
            style={ButtonsCommonStyles}>
            {RVDic.Return}
          </Button>
        </Styled.CropperButtonsWrapper>
      </Styled.ImageCropperWrapper>
    </Modal>
  );
};

export default ImageCropModal;
