import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { useDispatch } from 'react-redux';
import * as Styled from 'views/Profile/Profile.styles';
import AddImageIcon from 'components/Icons/AddImageIcon/AddImageIcon';
import UserInfos from './items/UserInfos';
import HeaderStatus from './items/HeaderStatus';
import LastTopics from './items/LastTopics';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';
// import LastPosts from './items/LastPosts';
import { getRelatedNodesAbstract } from 'apiHelper/apiFunctions';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { API_Provider, validateFileUpload } from 'helpers/helpers';
import { DOCS_API, UPLOAD_ICON } from 'constant/apiConstants';
import defaultProfileImage from 'assets/images/default-profile-photo.png';
import { MOBILE_BOUNDRY } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import { CV_WHITE } from 'constant/CssVariables';
import { loginSlice } from 'store/reducers/loginReducer';
import ImageCropperComponent from 'components/ImageCropper/ImageCropper';
import WithAvatar from 'components/Avatar/WithAvatar';

const ImageCropper = WithAvatar({
  Component: ImageCropperComponent,
  componentURLProp: 'image',
});

const { setAuthUser } = loginSlice.actions;

const MAX_IMAGE_SIZE = 5000000;
const UNKNOWN_IMAGE = '../../Images/unknown.jpg';
const allowedTypes = ['image/png', 'image/jpeg'];

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
    // HighQualityImageURL,
  } = User || {};
  // console.log({ User });

  const isMobileView = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });
  const { GlobalUtilities, RVGlobal } = useWindow();
  const dispatch = useDispatch();

  const coverImage = !!HighQualityCoverPhotoURL
    ? GlobalUtilities.add_timestamp(HighQualityCoverPhotoURL)
    : CoverPhotoURL;

  const profileImage =
    ProfileImageURL === UNKNOWN_IMAGE ? defaultProfileImage : ProfileImageURL;

  const coverUploadRef = useRef();
  const [coverPhoto, setCoverPhoto] = useState(coverImage);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profileImage);
  // const [avatarCropSrc, setAvatarCropSrc] = useState(null);

  const [relatedNodes, setRelatedNodes] = useState({});
  const [isFetchingRelatedNodes, setIsFetchingRelatedNodes] = useState(true);

  const handleHeaderEdit = () => {
    coverUploadRef.current.click();
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
            let uploadURL = response;
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

    if (files.length === 1 && validateFileUpload(files, allowedTypes)) {
      uploadImage(event);
    } else {
      event.target.value = '';
      console.log('Add one image only');
    }
  };

  const handleOnUploadDone = (newImageURL) => {
    setProfilePhoto(newImageURL);
    dispatch(
      setAuthUser({
        ...RVGlobal?.CurrentUser,
        ProfileImageURL: newImageURL,
      })
    );
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
      <Styled.ProfileHeader coverImage={coverPhoto}>
        <ImageCropper
          isEditable={IsOwnPage}
          image={profilePhoto}
          uploadId={UserID}
          uploadType="ProfileImage"
          showGrid={false}
          onImageUpload={handleOnUploadDone}
          containerClass="profile-image-cropper"
          userObject={User}
        />
        {isUploadingCover ? (
          <Styled.HeaderCoverLoader>
            <LogoLoader lottieWidth="3rem" />
          </Styled.HeaderCoverLoader>
        ) : (
          <Styled.HeaderPencilWrapper onClick={handleHeaderEdit}>
            <AddImageIcon color={CV_WHITE} size={18} />
            <HiddenUploadFile
              ref={coverUploadRef}
              onFileChange={handleCoverSelect}
            />
          </Styled.HeaderPencilWrapper>
        )}
      </Styled.ProfileHeader>
      <Styled.MainWrapper isMobileView={isMobileView}>
        <UserInfos user={User} isAuthUser={IsOwnPage} />
        <main>
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
        </main>
      </Styled.MainWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileMain;
