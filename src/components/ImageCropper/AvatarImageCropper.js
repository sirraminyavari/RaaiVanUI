import { useState } from 'react';
import AvatarImageCropperTabs from './AvatarImageCropperItems/AvatarImageCropperTabs';
import ImageCropperTrigger from './AvatarImageCropperItems/ImageCropperTrigger';
import Modal from 'components/Modal/Modal';
import CloseButton from 'components/Buttons/CloseButton';

/**
 * 
 * @component - Avatar Selector/Image Cropper Modal
 * @param {string} [props.currentImageURL] - If supplied, will be the trigger button's initial image
 * @param {string} [props.currentAvatarID] - If supplied, will be the trigger button's initial avatar
 * @param {string} props.uploadId - An ID for image upload API's uploadId
 * @param {string} props.avatarTabLabel - A string for Avatar Tab Label
 * @param {Record<string,string>} props.avatarObject - An object of avatars for using in avatar selection tab content
 * @param {Record<string,string>} props.setAvatarApi - An async function for processing avatar saving API call
 * @param {string} props.uploadType - An string to set the correct api upload path e.g. "ProfileImage"
 * @param {Function} [props.onComplete] - A function to run after image input change (passes newImageURL as parameter to the supplied function)
 * @param {Function} [props.noModal] - Disable Modal view
 * @param {JSX.Element} [props.children] - (Only TabView.Item is acceptable as component's direct child/children)
 * @param {Function} [props.noAvatarTab] - Disable Avatar Selection tab view
 * @param {Function} [props.OnSaveFunction] - A function for Save Button(Comes handy if customizing tabs and custom OnSave functionality is mandatory)
 * @return {JSX.Element}
 * 
 * @example
 * ```jsx
 * // importing avatars object records e.g. 
 * {
 *  mehdi:"/images/mehdi.asda34345.svg",
 *  ramin:"/images/ramin.asda34345.svg",
 * 
 * ...
 * }
 * import * as AvatarSVGS from 'assets/images/avatars/AvatarProfileAssets';
 * 
 * 
 * const setAvatarApi = ({ avatarName, avatarSrc }) => {
 *  alert(avatarName);
 * };
 * 
 * const onCompleteFunc = (newImageURL) => {
 *    alert(newImageURL);
 * }
 * 
 * ... 
 * 
 * <AvatarImageCropper
    avatarObject={AvatarSVGS}
    avatarTabLabel={"avatar selection"}
    uploadType="ProfileImage"
    uploadId={RVGlobal.CurrentUser.UserID}
    currentImageURL={RVGlobal.CurrentUser.ProfileImageURL}
    currentAvatarID={RVGlobal.CurrentUser.AvatarName}
    setAvatarApi={setAvatarApi}
    onComplete={onCompleteFunc}
   />
 * ```
 */
function AvatarImageCropper({
  currentImageURL,
  currentAvatarID,
  uploadId,
  uploadType,
  avatarTabLabel,
  avatarObject,
  setAvatarApi,
  onComplete,
  noModal,
  children,
  noAvatarTab,
  OnSaveFunction,
}) {
  const [imageSrc, setImageSrc] = useState(
    currentImageURL || avatarObject[currentAvatarID]
  );
  const [modalStatus, setModalStatus] = useState(false);

  const handleModalClose = () => {
    setModalStatus(false);
  };

  const handleModalCancel = () => {
    setImageSrc(currentImageURL);
    handleModalClose();
  };

  const onCompleteFunction = (newImageURL) => {
    onComplete(newImageURL);
    handleModalClose();
  };

  const handleModalOpen = () => setModalStatus(true);

  const ModalCloseButton = () => <CloseButton onClick={handleModalCancel} />;

  return (
    <>
      <ModalWrapper
        noModal={noModal}
        modalStatus={modalStatus}
        handleModalClose={handleModalClose}
      >
        <AvatarImageCropperTabs
          avatarObject={avatarObject}
          avatarTabLabel={avatarTabLabel}
          imageSrc={imageSrc}
          onImageChange={setImageSrc}
          uploadId={uploadId}
          uploadType={uploadType}
          setAvatarApi={setAvatarApi}
          onComplete={onCompleteFunction}
          onSubmitComplete={handleModalClose}
          onCancel={handleModalCancel}
          isModal={!noModal}
          OnSaveFunction={OnSaveFunction}
          noAvatarTab={noAvatarTab}
          CustomTabAction={!noModal && ModalCloseButton}
        >
          {children}
        </AvatarImageCropperTabs>
      </ModalWrapper>
      {!noModal && (
        <ImageCropperTrigger imageSrc={imageSrc} onClick={handleModalOpen} />
      )}
    </>
  );
}

AvatarImageCropper.displayName = 'AvatarImageCropper';

export default AvatarImageCropper;

const ModalWrapper = ({ noModal, children, modalStatus, handleModalClose }) => {
  if (noModal) return children;
  else
    return (
      <Modal
        show={modalStatus}
        stick
        onClose={handleModalClose}
        contentWidth={'clamp(10rem,95%,50rem)'}
      >
        {children}
      </Modal>
    );
};
