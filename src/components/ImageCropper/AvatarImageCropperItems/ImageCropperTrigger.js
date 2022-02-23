import * as Styles from './AvatarImageCropper.styles';
import AddImageIcon from 'components/Icons/AddImageIcon/AddImageIcon';
import Avatar from 'components/Avatar/Avatar';
import useWindow from 'hooks/useWindowContext';

/**
 * @component
 * @param {React.BaseHTMLAttributes} props
 * @param {string} [props.imageSrc] - Default image to show (defaults to undefined)
 * @return {JSX.Element}
 */
function ImageCropperTrigger({ imageSrc, ...restProps }) {
  const { GlobalUtilities } = useWindow();

  return (
    <Styles.ImageCropperTriggerAvatar {...restProps}>
      {imageSrc ? (
        <Avatar
          userImage={GlobalUtilities.add_timestamp(imageSrc)}
          className="cropper-avatar"
          imageStyles={{ width: '100%', height: '100%' }}
        />
      ) : (
        <AddImageIcon />
      )}
    </Styles.ImageCropperTriggerAvatar>
  );
}

ImageCropperTrigger.displayName = 'ImageCropperTrigger';

export default ImageCropperTrigger;
