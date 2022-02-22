import { useState } from 'react';
import AvatarImageCropperTabs from './AvatarImageCropperItems/AvatarImageCropperTabs';
import ImageCropperTrigger from './AvatarImageCropperItems/ImageCropperTrigger';
import Modal from 'components/Modal/Modal';

/**
 * @component
 * @param {string} [props.currentImageURL] - If supplied, will be the trigger button's initial image
 * @param {string} props.uploadId
 * @param {string} props.uploadType - An string to set the correct api upload path e.g. "ProfileImage"
 * @param {(imageURL:string)=>void} [props.onImageUploadComplete]
 * @return {JSX.Element}
 */
function AvatarImageCropper({
  currentImageURL,
  uploadId,
  uploadType,
  onImageUploadComplete,
}) {
  const [imageSrc, setImageSrc] = useState(currentImageURL);
  const [modalStatus, setModalStatus] = useState(false);

  const handleModalClose = () => {
    setModalStatus(false);
  };

  const handleModalCancel = () => {
    setImageSrc(currentImageURL);
    handleModalClose();
  };
  const handleModalOpen = () => setModalStatus(true);

  return (
    <>
      <Modal
        show={modalStatus}
        stick
        onClose={handleModalClose}
        contentWidth={'clamp(10rem,95%,50rem)'}
      >
        <AvatarImageCropperTabs
          imageSrc={imageSrc}
          onImageChange={setImageSrc}
          uploadId={uploadId}
          uploadType={uploadType}
          onImageUploadComplete={onImageUploadComplete}
          onSubmitComplete={handleModalClose}
          onCancel={handleModalCancel}
        />
      </Modal>
      <ImageCropperTrigger imageSrc={imageSrc} onClick={handleModalOpen} />
    </>
  );
}

AvatarImageCropper.displayName = 'AvatarImageCropper';

export default AvatarImageCropper;
