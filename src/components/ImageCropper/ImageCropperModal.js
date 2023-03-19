import { useState, useEffect } from 'react';
import * as Styled from './ImageCropper.styles';
import Modal from 'components/Modal/Modal';
import ImageCropperEditor from './ImageCropperEditor';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import { getUploadUrl, setUploadImage } from 'apiHelper/ApiHandlers/docsApi';

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
    // getUploadUrlAPI.url(
    //   { IconID: uploadId, Type: uploadType },
    //   (uploadURL) => {
    //     console.log({ uploadURL });
    //     setProfileURL(uploadURL);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    getUploadUrl({ IconID: uploadId, Type: uploadType }).then((uploadURL) =>
      setProfileURL(uploadURL)
    );
    //! Clean up.
    return () => {
      setProfileURL(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Fires on save button click.
  const handleSaveCroppedImage = async () => {
    setIsSavingImage(true);

    //! Update profile avatar.
    try {
      const response = await setUploadImage({
        SaveURL: profileURL,
        file: modalProps.file,
        IconID: uploadId,
        Type: uploadType,
        x: croppedAreaPixels?.x || croppedAreaPixels?.X,
        y: croppedAreaPixels?.x || croppedAreaPixels?.Y,
        width: croppedAreaPixels?.width || croppedAreaPixels?.Width,
        height: croppedAreaPixels?.height || croppedAreaPixels?.Height,
      });
      setIsSavingImage(false);
      const newImageURL = GlobalUtilities.add_timestamp(response.ImageURL);
      onUploadDone(newImageURL);
    } catch (err) {
      setIsSavingImage(false);
      console.log({ err });
      alert(RVDic?.MSG[err] || 'operation failed');
    }
  };

  //! Fires when user changes the image crop area.
  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  useEffect(() => {
    console.log(modalProps);
  }, [modalProps]);

  return (
    <Modal
      show={modalProps?.isShown}
      onClose={onCloseModal}
      contentWidth="50%"
      titleClass="profile-image-crop-modal"
      title={modalProps?.title}
    >
      <Styled.ImageCropperWrapper>
        <ImageCropperEditor
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
            style={ButtonsCommonStyles}
          >
            {RVDic.Save}
          </Button>
          <Button
            onClick={onCloseModal}
            type="negative-o"
            style={ButtonsCommonStyles}
          >
            {RVDic.Return}
          </Button>
        </Styled.CropperButtonsWrapper>
      </Styled.ImageCropperWrapper>
    </Modal>
  );
};

export default ImageCropModal;
