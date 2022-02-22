import * as Styles from './AvatarImageCropper.styles';
import AddImageIcon from 'components/Icons/AddImageIcon/AddImageIcon';
import Avatar from 'components/Avatar/Avatar';

/**
 * @component
 * @param {React.BaseHTMLAttributes} props
 * @param {string} [props.imageSrc] - Default image to show (defaults to undefined)
 * @return {JSX.Element}
 */
function ImageCropperTrigger({ imageSrc, ...restProps }) {
  return (
    <Styles.ImageCropperTriggerAvatar {...restProps}>
      {imageSrc ? (
        <Avatar
          userImage={imageSrc}
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
