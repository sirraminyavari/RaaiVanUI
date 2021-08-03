import { useState, useEffect } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import Modal from 'components/Modal/Modal';
import ImageCropper from './ImageCropper';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import { getCroppedImg } from './cropUtils';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import {
  cropIcon,
  decodeBase64,
  getVariable,
  setVariable,
} from 'helpers/helpers';

const ButtonsCommonStyles = { width: '6rem', height: '2rem' };

const CropModal = (props) => {
  const { cropModal, handleCloseModal, setCroppedImage, id } = props;
  const { RVDic } = useWindow();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDimensions, setCropDimensions] = useState(null);

  const dimensionsVariableName = `ImageDimensions_${id}`;

  useEffect(() => {
    getVariable(dimensionsVariableName)
      .then((res) => {
        let imageDimensions = res.Value
          ? JSON.parse(decodeBase64(res.Value))
          : null;
        const { X, Y } = imageDimensions;
        setCropDimensions({ x: X, y: Y });
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        cropModal?.imgSrc,
        croppedAreaPixels
      );
      return croppedImage;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCroppedImage = () => {
    getCroppedImage()
      .then((croppedImg) => {
        // console.log(croppedImg);
        setCroppedImage(croppedImg);
        // setCropDimensions(null);
        // handleCloseModal();
      })
      .catch((cropError) => console.log(cropError));
    //! Api call to save cropped image.
    const { x, y, width, height } = croppedAreaPixels;
    // console.log(id, 'User', x, y, width, height);
    cropIcon(id, 'User', x, y, width, height)
      .then((res) => {
        console.log(res);
        let newDimensions = {
          X: x,
          Y: y,
          Width: width,
          Height: height,
        };
        setVariable(dimensionsVariableName, newDimensions);
      })
      .catch((err) => console.log(err));
  };

  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log({ croppedArea });
    console.log({ croppedAreaPixels });
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Modal
      show={cropModal?.isShown}
      onClose={handleCloseModal}
      contentWidth="50%"
      titleClass="profile-image-crop-modal"
      title={cropModal?.title}>
      <Styled.ImageCropperWrapper>
        {!cropDimensions ? (
          <LogoLoader />
        ) : (
          <>
            <ImageCropper
              imageSrc={cropModal?.imgSrc}
              aspectRatio={cropModal?.aspect}
              initialCrop={cropDimensions}
              onImgaeCropComplete={handleImageCropComplete}
            />
            <Styled.CropperButtonsWrapper>
              <Button
                onClick={handleSaveCroppedImage}
                type="primary"
                style={ButtonsCommonStyles}>
                {RVDic.Save}
              </Button>
              <Button
                onClick={handleCloseModal}
                type="negative-o"
                style={ButtonsCommonStyles}>
                {RVDic.Return}
              </Button>
            </Styled.CropperButtonsWrapper>
          </>
        )}
      </Styled.ImageCropperWrapper>
    </Modal>
  );
};

export default CropModal;
