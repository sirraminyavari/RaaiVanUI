import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
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
import { API_Provider, validateFileUpload } from 'helpers/helpers';
import { DOCS_API, UPLOAD_ICON } from 'constant/apiConstants';
import defaultProfileImage from 'assets/images/default-profile-photo.png';

const MAX_IMAGE_SIZE = 5000000;
const UNKNOWN_IMAGE = '../../Images/unknown.jpg';

const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_ICON);

const ProfileMain = (props) => {
  const { User, IsOwnPage } = props?.route;
  const {
    // FirstName,
    // LastName,
    // UserName,
    UserID,
    CoverPhotoURL,
    HighQualityCoverPhotoURL,
    ProfileImageURL,
    HighQualityImageURL,
  } = User || {};
  // console.log(User, IsOwnPage);

  const coverImage = !!HighQualityCoverPhotoURL
    ? HighQualityCoverPhotoURL + `?timestamp=${new Date().getTime()}`
    : CoverPhotoURL;

  const profileImage =
    ProfileImageURL === UNKNOWN_IMAGE ? defaultProfileImage : ProfileImageURL;

  const uploadFileRef = useRef();
  const [coverPhoto, setCoverPhoto] = useState(coverImage);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [croppedImage, setCroppedImage] = useState(profileImage);
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

  //! Read image file, Set preview image, And upload it to the server.
  const uploadImage = (event) => {
    const file = event.target.files[0];
    //! If file size doesn't exceed maximum size, then proceed.
    if (file.size <= MAX_IMAGE_SIZE) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (e) => {
        //! Load on server.
        let formData = new FormData();
        formData.append('file', file);

        //! Get upload url.
        getUploadUrlAPI.url(
          { IconID: UserID, Type: 'CoverPhoto' },
          (response) => {
            let uploadURL = response.slice(5);
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            };
            setIsUploadingCover(true);
            //! Post file to the server.
            axios
              .post(uploadURL, formData, config)
              .then((response) => {
                setCoverPhoto(e.target.result);
                setIsUploadingCover(false);
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
                setIsUploadingCover(false);
              });
          },
          (err) => {
            console.log(err);
          }
        );
      };
    } else {
      event.target.value = '';
      console.log('Upload less than 5MB please.');
    }
  };

  //! Fires whenever user chooses an image for profile cover photo.
  const handleCoverSelect = (event) => {
    const files = event.target.files;
    const allowedTypes = ['image/png', 'image/jpeg'];

    if (files.length === 1 && validateFileUpload(files, allowedTypes)) {
      uploadImage(event);
    } else {
      event.target.value = '';
      console.log('Add one image only');
    }
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
      <Styled.ProfileHeader coverImage={coverPhoto}>
        <Styled.ProfileAvatarWrapper>
          <Avatar
            userImage={croppedImage + `?timestamp=${new Date().getTime()}`}
            radius={95}
            className="profile-avatar"
          />
          {!!HighQualityImageURL && IsOwnPage && (
            <Styled.AvatarPencilWrapper onClick={handleAvatarEdit}>
              <PencilIcon color="#fff" size={18} />
            </Styled.AvatarPencilWrapper>
          )}
        </Styled.ProfileAvatarWrapper>
        {isUploadingCover ? (
          <Styled.HeaderCoverLoader>
            <LogoLoader lottieWidth="3rem" />
          </Styled.HeaderCoverLoader>
        ) : (
          <Styled.HeaderPencilWrapper onClick={handleHeaderEdit}>
            <AddImageIcon color="#fff" size={18} />
            <HiddenUploadFile
              ref={uploadFileRef}
              onFileChange={handleCoverSelect}
            />
          </Styled.HeaderPencilWrapper>
        )}
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
