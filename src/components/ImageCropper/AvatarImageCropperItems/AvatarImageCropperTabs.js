import { useEffect, useMemo, useRef, useState } from 'react';
import useWindow from 'hooks/useWindowContext';
import TabView from 'components/TabView/TabView';
import Button from 'components/Buttons/Button';
import AvatarPanel from './AvatarPanel';
import ImageCropperUploadInput from '../ImageCropperUploadInput';
import ImageCropperSelection from './ImageCropperSelection';
import * as Styles from './AvatarImageCropper.styles';
import { getUploadUrl, setUploadImage } from 'apiHelper/ApiHandlers/docsApi';

/**
 * @component
 * @param {string} props.imageSrc - Default Image url/uri
 * @param {Function} props.onImageChange - A function to run after image input change (passes imageURL as parameter to the supplied function)
 * @param {string} props.uploadId - An ID to set as the upload image's name
 * @param {Record<string,string>} props.avatarObject - An ID to set as the upload image's name
 * @param {string} props.uploadType - An string to set the correct api upload path e.g. "ProfileImage"
 * @param {string} props.setAvatarApi - An string to set the correct api upload path e.g. "ProfileImage"
 * @param {Function} props.onComplete - A function to run after image upload process completed
 * @param {Function} props.onCancel - A function to run after cancel button pressed
 * @param {JSX.Element} props.children - (Only TabView.Item is acceptable as component's direct child/children)
 * @param {JSX.Element} props.CustomTabAction - If provided, will be passed to TabView.Action component
 * @param {boolean} props.isModal - Controls the rendering of the return button with OnClick event set to OnCancel method
 * @param {boolean} props.noAvatarTab - Disable the Avatar selection tab view
 * @param {Function} props.OnSaveFunction - A function for Save Button(Comes handy if customizing tabs and custom OnSave functionality is mandatory)
 * @return {JSX.Element}
 * @example
 * ```jsx
 * <AvatarImageCropperTabs [...acceptableProps]>
 *    <TabView.Item label="some label"> some content </TabView.Item>
 * </AvatarImageCropperTabs>
 * ```
 */
function AvatarImageCropperTabs({
  avatarName,
  onImageChange,
  uploadId,
  avatarTabLabel,
  avatarObject,
  uploadType,
  onComplete,
  setAvatarApi,
  onCancel,
  children,
  CustomTabAction,
  isModal,
  noAvatarTab,
  OnSaveFunction,
}) {
  const [internalImageSrc, setInternalImageSrc] = useState();
  const [internalAvatar, setInternalAvatar] = useState({ avatarName });
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
  const [uploadMode, setUploadMode] = useState('image');

  //! Get upload URL.
  useEffect(() => {
    getUploadUrl({ IconID: uploadId, Type: uploadType }).then((uploadURL) =>
      setProfileURL(uploadURL)
    );

    //! Clean up.
    return () => {
      setProfileURL(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImageEditChangeHandler = (_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setUploadMode('image');
  };
  const onImageEditDeleteHandler = () => {
    setInternalImageSrc(undefined);
    setTargetFile(undefined);
    avatarUploadRef.current.value = '';
  };

  const onAvatarSelection = async (avatar) => {
    setInternalAvatar(avatar);
    setUploadMode('avatar');
  };

  //! Fires on save button click.
  const handleSaveCroppedImage = useMemo(
    () => async () => {
      setIsSavingImage(true);

      //! Update profile avatar.
      try {
        if (uploadMode === 'image' && targetFile) {
          const response = await setUploadImage({
            SaveURL: profileURL,
            file: targetFile,
            IconID: uploadId,
            Type: uploadType,
            x: croppedAreaPixels?.x,
            y: croppedAreaPixels?.x,
            width: croppedAreaPixels?.width,
            height: croppedAreaPixels?.height,
          });
          setIsSavingImage(false);
          const newImageURL = GlobalUtilities.add_timestamp(response?.ImageURL);
          onImageChange(newImageURL);
          onComplete && onComplete(newImageURL);
        } else if (uploadMode === 'avatar') {
          await setAvatarApi(internalAvatar);

          onImageChange(internalAvatar.avatarSrc);
          onComplete && onComplete(internalAvatar.avatarSrc);
        } else {
          OnSaveFunction && OnSaveFunction();
        }
        setIsSavingImage(false);
      } catch (error) {
        setIsSavingImage(false);
        console.log({ error });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [croppedAreaPixels, targetFile, internalAvatar, uploadMode]
  );

  return (
    <>
      <TabView key={targetFile}>
        <TabView.Item label={RVDicPicture}>
          <ImageCropperSelection
            imageSrc={internalImageSrc}
            fileInputRef={avatarUploadRef}
            onImageEditChange={onImageEditChangeHandler}
            onImageEditorDelete={onImageEditDeleteHandler}
          />
        </TabView.Item>
        {!noAvatarTab && (
          <TabView.Item label={avatarTabLabel || RVDicDefaultAvatar}>
            <AvatarPanel
              avatarObject={avatarObject}
              value={internalAvatar}
              onChange={onAvatarSelection}
            />
          </TabView.Item>
        )}
        {children}
        {CustomTabAction && (
          <TabView.Action>
            <CustomTabAction />
          </TabView.Action>
        )}
      </TabView>
      <ImageCropperUploadInput
        ref={avatarUploadRef}
        onImageChange={({ imageSrc, targetFile }) => {
          setInternalImageSrc(imageSrc);
          setTargetFile(targetFile);
          setInternalAvatar(undefined);
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
        {isModal && (
          <Button onClick={onCancel} type="negative-o">
            {RVDicReturn}
          </Button>
        )}
      </Styles.ImageCropperActionsContainer>
    </>
  );
}

export default AvatarImageCropperTabs;
