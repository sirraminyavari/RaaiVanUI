/**
 * An Avatar for showing user image and access to lts profile
 */
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import AvatarIcon from 'components/Icons/UserIcon/User';
import * as Styled from './Avatar.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {number} [radius] - The radius of the avatar's circle.
 * @property {string} userImage - User's image for avatar.
 * @property {string} color - The color of Avatar.
 * @property {object} imageStyles - Styles for image.
 * @property {string} imageClasses - Classes for image.
 */

/**
 *  @description Renders an avatar component.
 * @component
 * @param {PropType} props -Props that pass to avatar.
 */
const Avatar = forwardRef((props, ref) => {
  const {
    radius,
    userImage,
    color,
    imageStyles,
    imageClasses,
    ...rest
  } = props;
  return (
    <>
      {userImage ? (
        <Styled.AvatarContainer ref={ref} color={color} {...rest}>
          <Styled.AvatarImage
            data-testid="avatar-image"
            radius={!!radius}
            src={userImage}
            alt="user-avatar"
            style={imageStyles}
            className={imageClasses}
          />
        </Styled.AvatarContainer>
      ) : (
        <Styled.AvatarIconWrapper ref={ref} {...rest}>
          <AvatarIcon size={radius} color={color} data-testid="avatar-icon" />
        </Styled.AvatarIconWrapper>
      )}
    </>
  );
});

Avatar.propTypes = {
  radius: PropTypes.number,
  userImage: PropTypes.string,
  color: PropTypes.string,
  imageClasses: PropTypes.string,
  imageStyles: PropTypes.object,
};

Avatar.defaultProps = {
  radius: 40,
};

export default Avatar;
