import { Link } from 'react-router-dom';
import { GoPerson as AvatarIcon } from 'react-icons/go';
import { AvatarWrapper, AvatarImage } from './Avatar.styles';

const Avatar = ({ radius, userImage }) => {
  return (
    <AvatarWrapper as={Link} to="/user">
      {userImage ? (
        <AvatarImage radius={radius} src={userImage} alt="user-avatar" />
      ) : (
        <AvatarIcon size={radius} color="#fff" />
      )}
    </AvatarWrapper>
  );
};

export default Avatar;
