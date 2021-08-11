import { useRef, useState, useEffect } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import Avatar from 'components/Avatar/Avatar';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import AddImageIcon from 'components/Icons/AddImageIcon/AddImageIcon';
import UserInfos from './items/UserInfos';
import HeaderStatus from './items/HeaderStatus';
import LastTopics from './items/LastTopics';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';
import CropModal from './items/CropModal';
// import LastPosts from './items/LastPosts';
import { getRelatedNodesAbstract } from 'apiHelper/apiFunctions';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const ProfileMain = (props) => {
  const { User, IsOwnPage } = props?.route;
  const {
    // FirstName,
    // LastName,
    // UserName,
    UserID,
    CoverPhotoURL,
    ProfileImageURL,
    HighQualityImageURL,
  } = User || {};
  // console.log(User, IsOwnPage);

  const uploadFileRef = useRef();
  const [croppedImage, setCroppedImage] = useState(ProfileImageURL);
  const [cropModal, setCropModal] = useState({
    isShown: false,
    title: 'برش تصویر پروفایل',
    aspect: 1 / 1,
    imgSrc: HighQualityImageURL,
  });

  const [relatedNodes, setRelatedNodes] = useState({});
  const [isFetchingRelatedNodes, setIsFetchingRelatedNodes] = useState(true);

  const handleAvatarEdit = () => {
    setCropModal((m) => ({ ...m, isShown: true }));
  };

  const handleHeaderEdit = () => {
    uploadFileRef.current.click();
  };

  const handleCloseModal = () => {
    setCropModal((m) => ({ ...m, isShown: false }));
    // console.log(ProfileImageURL);
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

  useEffect(() => {
    getRelatedNodesAbstract(UserID)
      .then((res) => {
        setIsFetchingRelatedNodes(false);
        // console.log(res);
        setRelatedNodes(res);
      })
      .catch((err) => {
        setIsFetchingRelatedNodes(false);
        console.log(err);
      });

    //? Due to memory leak error in component.
    //! Clean up.
    return () => {
      setRelatedNodes({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.ProfileViewContainer style={{ padding: 0 }}>
      {!!HighQualityImageURL && (
        <CropModal
          cropModal={cropModal}
          handleCloseModal={handleCloseModal}
          setCroppedImage={setCroppedImage}
          id={UserID}
        />
      )}
      <Styled.ProfileHeader coverImage={CoverPhotoURL}>
        <Styled.ProfileAvatarWrapper>
          <Avatar
            userImage={croppedImage + `?timestamp: ${new Date()}`}
            radius={95}
            className="profile-avatar"
          />
          {!!HighQualityImageURL && IsOwnPage && (
            <Styled.AvatarPencilWrapper onClick={handleAvatarEdit}>
              <PencilIcon color="#fff" size={18} />
            </Styled.AvatarPencilWrapper>
          )}
        </Styled.ProfileAvatarWrapper>
        {/* <Styled.HeaderPencilWrapper onClick={handleHeaderEdit}>
          <AddImageIcon color="#fff" size={18} />
          <HiddenUploadFile
            ref={uploadFileRef}
            onFileChange={handleFileSelect}
          />
        </Styled.HeaderPencilWrapper> */}
      </Styled.ProfileHeader>
      <Styled.MainWrapper>
        <UserInfos user={User} isAuthUser={IsOwnPage} />
        <div>
          <HeaderStatus
            user={User}
            relatedNodesCount={relatedNodes?.TotalRelationsCount}
          />
          {isFetchingRelatedNodes ? (
            <LogoLoader />
          ) : (
            <LastTopics
              user={User}
              isAuthUser={IsOwnPage}
              relatedNodes={relatedNodes}
            />
          )}
          {/* <LastPosts /> */}
        </div>
      </Styled.MainWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileMain;
