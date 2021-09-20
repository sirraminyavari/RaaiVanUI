import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import * as Styled from 'views/Profile/Profile.styles';
import Modal from 'components/Modal/Modal';
import ImageCropper from './ImageCropper';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import { cropIcon } from 'apiHelper/apiFunctions';
import { loginSlice } from 'store/reducers/loginReducer';
import { DOCS_API, UPLOAD_ICON } from 'constant/apiConstants';
import { API_Provider } from 'helpers/helpers';

const { setAuthUser } = loginSlice.actions;

const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_ICON);

//! Common styles for crop image modal buttons.
const ButtonsCommonStyles = { width: '6rem', height: '2rem' };

const EditModal = (props) => {
  const { modalProps, handleCloseModal, setCroppedImage, id } = props;
  const { RVDic, GlobalUtilities } = useWindow();
  const dispatch = useDispatch();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [profileURL, setProfileURL] = useState(null);

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

  //! Fires on save button click.
  const handleSaveCroppedImage = () => {
    setIsSavingImage(true);

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
        // console.log(response);
        setIsSavingImage(false);
        //! Save cropped profile dimensions on the server.
        if (response?.data?.success) {
          cropIcon(id, 'ProfileImage', croppedAreaPixels)
            .then((res) => {
              // console.log('crop response: ', res);
              const newImageURL = GlobalUtilities.add_timestamp(res.ImageURL);
              setCroppedImage(newImageURL);
              dispatch(
                setAuthUser({
                  ...window.RVGlobal?.CurrentUser,
                  ProfileImageURL: newImageURL,
                })
              );
              setIsSavingImage(false);
              handleCloseModal();
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
        }
      })
      .catch((error) => {
        setIsSavingImage(false);
        console.log(error);
      });
  };

  //! Fires when user changes the image crop area.
  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    const xRatio = modalProps.imgOrig.width / 595;
    const yRatio = modalProps.imgOrig.height / 335;

    const truncatedCropArea = {
      x: Math.ceil(croppedAreaPixels.x / xRatio),
      y: Math.trunc(croppedAreaPixels.y / yRatio),
      width: Math.trunc(croppedAreaPixels.width / yRatio),
      height: Math.trunc(croppedAreaPixels.height / yRatio),
    };

    setCroppedAreaPixels(truncatedCropArea);
  };

  return (
    <Modal
      show={modalProps?.isShown}
      onClose={handleCloseModal}
      contentWidth="50%"
      titleClass="profile-image-crop-modal"
      title={modalProps?.title}>
      <Styled.ImageCropperWrapper>
        <ImageCropper
          imageSrc={modalProps?.imgSrc}
          aspectRatio={modalProps?.aspect}
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
      </Styled.ImageCropperWrapper>
    </Modal>
  );
};

export default EditModal;
