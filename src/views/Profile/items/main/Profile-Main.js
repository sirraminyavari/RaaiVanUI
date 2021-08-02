import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'views/Profile/Profile.styles';
import Avatar from 'components/Avatar/Avatar';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import AddImageIcon from 'components/Icons/AddImageIcon/AddImageIcon';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import ImageCropper from './items/ImageCropper';
import Clouds from 'assets/images/clouds.png';
import UserInfos from './items/UserInfos';
import HeaderStatus from './items/HeaderStatus';
import LastTopics from './items/LastTopics';
import useWindow from 'hooks/useWindowContext';
import { getCroppedImg } from './items/utils';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';
// import LastPosts from './items/LastPosts';

const selectAuthUser = createSelector(
  (state) => state.auth,
  (auth) => auth.authUser
);

const ButtonsCommonStyles = { width: '6rem', height: '2rem' };

const ProfileMain = () => {
  const uploadFileRef = useRef();
  const { RVDic } = useWindow();
  const authUser = useSelector(selectAuthUser);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(authUser?.ProfileImageURL);
  const [cropModal, setCropModal] = useState({
    isShown: false,
    title: '',
    aspect: 1 / 1,
    imgSrc: null,
  });

  const handleAvatarEdit = () => {
    setCropModal((m) => ({
      ...m,
      isShown: true,
      title: 'برش تصویر پروفایل',
      aspect: 1 / 1,
      imgSrc: Clouds,
    }));
  };

  const handleHeaderEdit = () => {
    uploadFileRef.current.click();
  };

  const handleCloseModal = () => {
    setCropModal((m) => ({ ...m, isShown: false }));
  };

  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  };

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

  const handleSaveCroppedImage = async () => {
    const croppedImg = await getCroppedImage();
    setCroppedImage(croppedImg);
    handleCloseModal();
    //! Api call to save cropped image.
  };

  //! Fires whenever user chooses an image.
  const handleFileSelect = (event) => {
    const files = event.target.files;
    console.log(files);

    // if (files.length === 1 && validateImageUpload(files)) {
    //   uploadImage(event);
    // } else {
    //   event.target.value = '';
    //   console.log('Add one image only');
    // }
  };

  return (
    <Styled.ProfileViewContainer style={{ padding: 0 }}>
      <Modal
        show={cropModal?.isShown}
        onClose={handleCloseModal}
        contentWidth="50%"
        titleClass="profile-image-crop-modal"
        title={cropModal?.title}>
        <Styled.ImageCropperWrapper>
          <ImageCropper
            imageSrc={cropModal?.imgSrc}
            aspectRatio={cropModal?.aspect}
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
        </Styled.ImageCropperWrapper>
      </Modal>
      <Styled.ProfileHeader>
        <Styled.ProfileAvatarWrapper>
          <Avatar
            userImage={croppedImage}
            radius={95}
            className="profile-avatar"
          />
          <Styled.AvatarPencilWrapper onClick={handleAvatarEdit}>
            <PencilIcon color="#fff" size={18} />
          </Styled.AvatarPencilWrapper>
        </Styled.ProfileAvatarWrapper>
        <Styled.HeaderPencilWrapper onClick={handleHeaderEdit}>
          <AddImageIcon color="#fff" size={18} />
          <HiddenUploadFile
            ref={uploadFileRef}
            onFileChange={handleFileSelect}
          />
        </Styled.HeaderPencilWrapper>
      </Styled.ProfileHeader>
      <Styled.MainWrapper>
        <UserInfos />
        <div>
          <HeaderStatus />
          <LastTopics />
          {/* <LastPosts /> */}
        </div>
      </Styled.MainWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileMain;
