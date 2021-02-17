import { Link } from 'react-router-dom';
import UserIcon from 'components/Icons/UserIcon/User';
import { AvatarWrapper, AvatarImage } from './Avatar.styles';

const Avatar = ({ radius, userImage }) => {
  return (
    <AvatarWrapper as={Link} to="/user">
      {userImage ? (
        <AvatarImage radius={radius} src={userImage} alt="user-avatar" />
      ) : (
        <UserIcon size={radius} color="#fff" />
      )}
    </AvatarWrapper>
  );
};

export default Avatar;
