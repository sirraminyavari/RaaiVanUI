import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AvatarIcon from 'components/Icons/UserIcon/User';
import * as Styled from './Avatar.styles';
import { getURL } from 'helpers/helpers';

/**
 * @typedef PropType
 * @type {Object}
 * @property {number} [radius] - The radius of the avatar's circule.
 * @property {string} userImage - User's image for avatar.
 * @property {string} [linkTo] - The path to the user's profile page.
 */

/**
 *  @description Renders an avatar component.
 * @component
 * @param {PropType} props -Props that pass to avatar.
 */
const Avatar = (props) => {
  const { radius, userImage, linkTo } = props;
  return (
    <Styled.AvatarContainer as={Link} to={linkTo}>
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
  linkTo: getURL('User'),
};

export default Avatar;
