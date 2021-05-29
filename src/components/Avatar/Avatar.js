/**
 * An Avatar for showing user image and access to lts profile
 */
import PropTypes from 'prop-types';
import AvatarIcon from 'components/Icons/UserIcon/User';
import * as Styled from './Avatar.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {number} [radius] - The radius of the avatar's circule.
 * @property {string} userImage - User's image for avatar.
 * @property {string} color - The color of Avatar.
 */

/**
 *  @description Renders an avatar component.
 * @component
 * @param {PropType} props -Props that pass to avatar.
 */
const Avatar = (props) => {
  const { radius, userImage, color, ...rest } = props;
  return (
    <>
      {userImage ? (
        <Styled.AvatarContainer color={color} {...rest}>
          <Styled.AvatarImage
            data-testid="avatar-image"
            radius={radius}
            src={userImage}
            alt="user-avatar"
          />
        </Styled.AvatarContainer>
      ) : (
        <Styled.AvatarIconWrapper {...rest}>
          <AvatarIcon size={radius} color={color} data-testid="avatar-icon" />
        </Styled.AvatarIconWrapper>
      )}
    </>
  );
};

Avatar.propTypes = {
  radius: PropTypes.number,
  userImage: PropTypes.string,
  linkTo: PropTypes.string,
  color: PropTypes.string,
};

Avatar.defaultProps = {
  radius: 40,
};

export default Avatar;
