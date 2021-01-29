import UserIcon from 'assets/icons/user.svg';
import { AvatarWrapper, AvatarImage } from 'assets/jss/Navbar.styles';

const Avatar = ({ radius, userImage }) => {
  return (
    <AvatarWrapper>
      <AvatarImage
        src={userImage ? userImage : UserIcon}
        radius={radius}
        alt="user-avatar"
      />
    </AvatarWrapper>
  );
};

export default Avatar;
