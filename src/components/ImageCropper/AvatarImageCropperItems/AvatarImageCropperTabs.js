import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import useWindow from 'hooks/useWindowContext';
import TabView from 'components/TabView/TabView';
import Button from 'components/Buttons/Button';
import CloseButton from 'components/Buttons/CloseButton';
import AvatarButtons from './AvatarButtons';
import ImageCropperUploadInput from '../ImageCropperUploadInput';
import ImageCropperSelection from './ImageCropperSelection';
import * as Styles from './AvatarImageCropper.styles';
import { API_Provider } from 'helpers/helpers';
import { DOCS_API, UPLOAD_AND_CROP_ICON } from 'constant/apiConstants';

//TODO create a API helper for 'DOCS_API'=>'UPLOAD_AND_CROP_ICON'
const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_AND_CROP_ICON);

/**
 * @component
 * @param {string} props.imageSrc - Default Image url/uri
 * @param {(imageURL:string)=>void} props.onImageChange - A function to run after image input change
 * @param {string} props.uploadId - An ID to set as the upload image's name
 * @param {string} props.uploadType - An string to set the correct api upload path e.g. "ProfileImage"
 * @param {()=>void} props.onImageUploadComplete - A function to run after image upload process completed
 * @param {()=>void} props.onCancel - A function to run after cancel button pressed
 * @return {JSX.Element}
 */
function AvatarImageCropperTabs({
  imageSrc,
  onImageChange,
  uploadId,
  uploadType,
  onImageUploadComplete,
  onCancel,
}) {
  const [internalImageSrc, setInternalImageSrc] = useState();
  const [targetFile, setTargetFile] = useState();
  const avatarUploadRef = useRef();
  const { RVDic, GlobalUtilities } = useWindow();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicSave = RVDic.Save;
  const RVDicReturn = RVDic.Return;
  const RVDicPicture = 'تصویر';
  const RVDicDefaultAvatar = 'آواتار پیشفرض';

  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [profileURL, setProfileURL] = useState(null);

  //! Get upload URL.
  useEffect(() => {
    getUploadUrlAPI.url(
      { IconID: uploadId, Type: uploadType },
      (uploadURL) => {
        setProfileURL(uploadURL);
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

  const onImageEditChangeHandler = (_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const onImageEditDeleteHandler = () => {
    setInternalImageSrc(undefined);
    setTargetFile(undefined);
    avatarUploadRef.current.value = '';
  };

  //! Fires on save button click.
  const handleSaveCroppedImage = useMemo(
    () => () => {
      setIsSavingImage(true);

      let formData = new FormData();
      formData.append('file', targetFile);

      formData.append('IconID', uploadId);
      formData.append('Type', uploadType);

      formData.append('x', croppedAreaPixels?.x);
      formData.append('y', croppedAreaPixels?.y);
      formData.append('w', croppedAreaPixels?.width);
      formData.append('h', croppedAreaPixels?.width);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      console.log(croppedAreaPixels);
      //! Update profile avatar.
      try {
        axios
          .post(profileURL, formData, config)
          .then((response) => {
            setIsSavingImage(false);

            let res = response?.data || {};

            if (res.ImageURL) {
              const newImageURL = GlobalUtilities.add_timestamp(res.ImageURL);
              onImageChange(newImageURL);
              onImageUploadComplete && onImageUploadComplete(newImageURL);
            } else alert(RVDic?.MSG?.OperationFailed || 'operation failed');
          })
          .catch((error) => {
            setIsSavingImage(false);
            console.log(error);
          });
      } catch (error) {
        setIsSavingImage(false);
        console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [croppedAreaPixels, targetFile]
  );

  return (
    <>
      <TabView key={internalImageSrc && targetFile}>
        <TabView.Item label={RVDicPicture}>
          <ImageCropperSelection
            imageSrc={internalImageSrc}
            fileInputRef={avatarUploadRef}
            onImageEditChange={onImageEditChangeHandler}
            onImageEditorDelete={onImageEditDeleteHandler}
          />
        </TabView.Item>

        <TabView.Item label={RVDicDefaultAvatar}>
          <AvatarButtons value={imageSrc} onChange={onImageChange} />
        </TabView.Item>
        <TabView.Action>
          <CloseButton onClick={onCancel} />
        </TabView.Action>
      </TabView>
      <ImageCropperUploadInput
        ref={avatarUploadRef}
        onImageChange={({ imageSrc, targetFile }) => {
          setInternalImageSrc(imageSrc);
          setTargetFile(targetFile);
        }}
      />
      <Styles.ImageCropperActionsContainer>
        <Button
          loading={isSavingImage}
          onClick={handleSaveCroppedImage}
          type="primary"
        >
          {RVDicSave}
        </Button>
        <Button onClick={onCancel} type="negative-o">
          {RVDicReturn}
        </Button>
      </Styles.ImageCropperActionsContainer>
    </>
  );
}

export default AvatarImageCropperTabs;
