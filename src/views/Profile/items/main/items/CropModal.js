import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from 'views/Profile/Profile.styles';
import Modal from 'components/Modal/Modal';
import ImageCropper from './ImageCropper';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import { getCroppedImg, createImage } from './cropUtils';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { decodeBase64 } from 'helpers/helpers';
import { cropIcon, getVariable, setVariable } from 'apiHelper/apiFunctions';
import { loginSlice } from 'store/reducers/loginReducer';

const { setAuthUser } = loginSlice.actions;

//! Common styles for crop image modal buttons.
const ButtonsCommonStyles = { width: '6rem', height: '2rem' };

const CropModal = (props) => {
  const { cropModal, handleCloseModal, setCroppedImage, id } = props;
  const { RVDic } = useWindow();
  const dispatch = useDispatch();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [initCropDimensions, setInitCropDimensions] = useState(null);
  const [isSavingImage, setIsSavingImage] = useState(false);

  //! The variable name for user's profile image  .
  const dimensionsVariableName = `ImageDimensions_${id}`;

  //! Get image dimension for previous crop.
  useEffect(() => {
    getVariable(dimensionsVariableName)
      .then((res) => {
        let imageDimensions = res.Value
          ? JSON.parse(decodeBase64(res.Value))
          : null;
        // console.log('get variable', imageDimensions);

        const { X: x, Y: y, Width: width, Height: height } = imageDimensions;
        setInitCropDimensions({ x, y, width, height });
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropModal]);

  //! Get high quality image source.
  useEffect(() => {
    createImage(cropModal?.imgSrc).then((img) => {
      // console.log(img.width, img.height);
    });
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

    //! Save cropped image on server.
    const { x, y, width, height } = croppedAreaPixels;
    // console.log(id, 'ProfileImage', x, y, width, height);
    cropIcon(id, 'ProfileImage', x, y, width, height)
      .then((res) => {
        // console.log('crop response: ', res);
        //! Update profile avatar.
        const newImageURL = res.ImageURL + `?timestamp: ${new Date()}`;
        setCroppedImage(newImageURL);
        dispatch(
          setAuthUser({
            ...window.RVGlobal?.CurrentUser,
            ProfileImageURL: newImageURL,
          })
        );
        let newDimensions = {
          X: x,
          Y: y,
          Width: width,
          Height: height,
        };
        setVariable(dimensionsVariableName, newDimensions).then((response) => {
          // console.log('set variable response: ', response);
          setIsSavingImage(false);
        });
      })
      .catch((err) => console.log(err));
  };

  //! Fires when user changes the image crop area.
  const handleImageCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log({ croppedArea });
    // console.log({ croppedAreaPixels });
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
        {!initCropDimensions ? (
          <LogoLoader />
        ) : (
          <>
            <ImageCropper
              imageSrc={cropModal?.imgSrc}
              aspectRatio={cropModal?.aspect}
              initialCroppedAreaPixels={initCropDimensions}
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
          </>
        )}
      </Styled.ImageCropperWrapper>
    </Modal>
  );
};

export default CropModal;
