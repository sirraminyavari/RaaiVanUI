import Modal from '../../../components/Modal/Modal';
import ImageCropper from '../../../components/ImageCropper/ImageCropper';
import * as Styled from './ImageCropperModalStyle';
import { useState } from 'react';
import Button from '../../../components/Buttons/Button';
import useWindow from '../../../hooks/useWindowContext';

const ImageCropperModal = ({
  aspectRatio,
  file,
  show,
  onModalClose,
  saveCropArea,
}) => {
  const { RVDic } = useWindow();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});

  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Modal show={show} contentWidth="40vw" onClose={onModalClose} middle={true}>
      <Styled.CropperContainer>
        <ImageCropper
          imageSrc={file}
          aspectRatio={aspectRatio}
          onImageCropComplete={handleImageCropComplete}
          cropShape="round"
        />

        <Styled.CropperActionBar>
          <Button type="primary" onClick={saveCropArea(croppedAreaPixels)}>
            {RVDic.Save}
          </Button>
          <Button type="negative-o" onClick={onModalClose}>
            {RVDic.Return}
          </Button>
        </Styled.CropperActionBar>
      </Styled.CropperContainer>
    </Modal>
  );
};
export default ImageCropperModal;
