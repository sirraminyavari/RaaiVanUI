import { lazy, Suspense } from 'react';
import * as Styles from './AvatarImageCropper.styles';
// import useWindow from 'hooks/useWindowContext';
import ImageIcon from 'components/Icons/ImageIcon/ImageIcon';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import TrashIcon from 'components/Icons/TrashIcon/Trash';

const ImageCropperEditor = lazy(() =>
  import(
    /* webpackChunkName: "image-cropper-editor"*/ 'components/ImageCropper/ImageCropperEditor'
  )
);

/**
 * @component - A wrapper for Image Cropper Editor
 * @param {string} props.imageSrc - Image url/uri
 * @param {Function} props.onImageEditorDelete - A function to run after the delete button pressed
 * @param {Function} props.onImageEditChange - A function to run when user make changes in editor
 * @param {React.MutableRefObject} props.fileInputRef - File input's Ref
 * @return {JSX.Element}
 */
function ImageCropperSelection({
  imageSrc,
  onImageEditorDelete,
  fileInputRef,
  onImageEditChange,
}) {
  // const { RVDic } = useWindow();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicProfilePicture = 'تصویر پروفایل';
  const RVDicProfilePictureUpload = 'آپلود تصویر';
  const RVDicProfilePictureDescription =
    'تصویر پروفایل در آیتم‌ها و صفحات انتخاب کاربر نمایش داده میشود.';

  const handleAvatarEdit = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Styles.ImageCropperSelectionTitle>
        {RVDicProfilePicture}
      </Styles.ImageCropperSelectionTitle>
      <Styles.ImageCropperSelectionDescription>
        {RVDicProfilePictureDescription}
      </Styles.ImageCropperSelectionDescription>
      <Styles.ImageCropperSelectionContainer noBorders={Boolean(imageSrc)}>
        {imageSrc ? (
          <>
            <Suspense fallback={<LogoLoader />}>
              <ImageCropperEditor
                imageSrc={imageSrc}
                aspectRatio={1}
                onImageCropComplete={onImageEditChange}
                cropShape={'round'}
                showGrid={false}
              />
            </Suspense>
            <Styles.ImageCropperSelectionDeleteButton
              onClick={() => onImageEditorDelete()}
            >
              <TrashIcon />
            </Styles.ImageCropperSelectionDeleteButton>
          </>
        ) : (
          <Styles.ImageCropperSelectionUploadButton
            $circleEdges
            onClick={handleAvatarEdit}
          >
            <ImageIcon />
            {RVDicProfilePictureUpload}
          </Styles.ImageCropperSelectionUploadButton>
        )}
      </Styles.ImageCropperSelectionContainer>
    </>
  );
}

ImageCropperSelection.displayName = 'ImageCropperSelection';

export default ImageCropperSelection;
