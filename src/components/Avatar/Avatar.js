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
 */

/**
 *  @description Renders an avatar component.
 * @component
 * @param {PropType} props -Props that pass to avatar.
 */
const Avatar = (props) => {
  const { radius, userImage } = props;
  return (
    <Styled.AvatarContainer>
      {userImage ? (
        <Styled.AvatarImage radius={radius} src={userImage} alt="user-avatar" />
      ) : (
        <AvatarIcon size={radius} />
      )}
    </Styled.AvatarContainer>
  );
};

Avatar.propTypes = {
  radius: PropTypes.number,
  userImage: PropTypes.string,
  linkTo: PropTypes.string,
};

Avatar.defaultProps = {
  radius: 40,
};

export default Avatar;
