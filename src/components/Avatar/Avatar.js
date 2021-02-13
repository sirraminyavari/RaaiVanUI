import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AvatarIcon from 'components/Icons/UserIcon/User';
import * as Styled from './Avatar.styles';

const Avatar = ({ radius, userImage, linkTo = '/user' }) => {
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
  radius: PropTypes.number.isRequired,
  userImage: PropTypes.string,
  linkTo: PropTypes.string,
};

export default Avatar;
