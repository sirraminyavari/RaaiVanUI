import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as Styled from 'views/Profile/Profile.styles';
import Modal from 'components/Modal/Modal';
import ImageCropper from './ImageCropper';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { decodeBase64 } from 'helpers/helpers';
import {
  cropProfileImage,
  getVariable,
  setVariable,
} from 'apiHelper/apiFunctions';
import { loginSlice } from 'store/reducers/loginReducer';
import { DOCS_API, UPLOAD_ICON } from 'constant/apiConstants';
import { API_Provider } from 'helpers/helpers';

const { setAuthUser } = loginSlice.actions;

const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_ICON);

//! Common styles for crop image modal buttons.
const ButtonsCommonStyles = { width: '6rem', height: '2rem' };

const EditModal = (props) => {
  const { modalProps, handleCloseModal, setCroppedImage, id } = props;
  const { RVDic } = useWindow();
  const dispatch = useDispatch();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  // const [initCropDimensions, setInitCropDimensions] = useState(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [profileURL, setProfileURL] = useState(null);

  //! The variable name for user's profile image  .
  const dimensionsVariableName = `ImageDimensions_${id}`;

  //! Get image dimension for previous crop.
  // useEffect(() => {
  //   getVariable(dimensionsVariableName)
  //     .then((res) => {
  //       let imageDimensions = res.Value
  //         ? JSON.parse(decodeBase64(res.Value))
  //         : null;
  //       // console.log('get variable', imageDimensions);

  //       const { X: x, Y: y, Width: width, Height: height } = imageDimensions;
  //       setInitCropDimensions({ x, y, width, height });
  //     })
  //     .catch((error) => console.log(error));

  //   //? Due to memory leak error in crop modal.
  //   //! Clean up.
  //   return () => {
  //     setInitCropDimensions(null);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [modalProps]);

  //! Get upload URL.
  useEffect(() => {
    getUploadUrlAPI.url(
      { IconID: id, Type: 'ProfileImage' },
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

  //! Get cropped image to show the updated(cropped) image to user instantly.
  // const getCroppedImage = async () => {
  //   try {
  //     const croppedImage = await getCroppedImg(
  //       cropModal?.imgSrc,
  //       croppedAreaPixels
  //     );
  //     return croppedImage;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  //! Fires on save button click.
  const handleSaveCroppedImage = () => {
    setIsSavingImage(true);
    // getCroppedImage()
    //   .then((croppedImg) => {
    // console.log(croppedImg);
    //     setCroppedImage(croppedImg);
    // setCropDimensions(null);
    // handleCloseModal();
    //   })
    //   .catch((cropError) => console.log(cropError));
    let formData = new FormData();

    formData.append('file', modalProps.file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    //! Update profile avatar.
    axios
      .post(profileURL, formData, config)
      .then((response) => {
        console.log(response);
        setIsSavingImage(false);
        //! Save cropped profile dimensions on the server.
        cropProfileImage(id, croppedAreaPixels)
          .then((res) => {
            console.log('crop response: ', res);
            const newImageURL =
              res.ImageURL + `?timeStamp=${new Date().getTime()}`;
            setCroppedImage(newImageURL);
            dispatch(
              setAuthUser({
                ...window.RVGlobal?.CurrentUser,
                ProfileImageURL: newImageURL,
              })
            );
            // let newDimensions = {
            //   X: x,
            //   Y: y,
            //   Width: width,
            //   Height: height,
            // };
            setIsSavingImage(false);
            // setVariable(dimensionsVariableName, newDimensions).then((response) => {
            //   // console.log('set variable response: ', response);
            //   setIsSavingImage(false);
            // });
          })
          .catch((err) => {
            dispatch(
              setAuthUser({
                ...window.RVGlobal?.CurrentUser,
                ProfileImageURL: response.data.Message.ImageURL,
              })
            );
            console.log(err);
          });
      })
      .catch((error) => {
        setIsSavingImage(false);
        console.log(error);
      });
  };

  //! Fires when user changes the image crop area.
  const handleImageCropComplete = (croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Modal
      show={modalProps?.isShown}
      onClose={handleCloseModal}
      contentWidth="50%"
      titleClass="profile-image-crop-modal"
      title={modalProps?.title}>
      <Styled.ImageCropperWrapper>
        {/* {!initCropDimensions ? (
          <LogoLoader />
        ) : (
          <> */}
        <ImageCropper
          imageSrc={modalProps?.imgSrc}
          aspectRatio={modalProps?.aspect}
          // initialCroppedAreaPixels={initCropDimensions}
          onImgaeCropComplete={handleImageCropComplete}
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
            onClick={handleCloseModal}
            type="negative-o"
            style={ButtonsCommonStyles}>
            {RVDic.Return}
          </Button>
        </Styled.CropperButtonsWrapper>
        {/* </>
        )} */}
      </Styled.ImageCropperWrapper>
    </Modal>
  );
};

export default EditModal;
