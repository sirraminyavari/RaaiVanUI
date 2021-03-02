/**
 * Renders a popup menu for user avatar.
 */
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import logoutAction from 'store/actions/auth/logoutAction';
import * as Styled from '../Navbar.styles';

const { RVDic } = window;

const AvatarMenu = () => {
  const dispatch = useDispatch();

  //! Logs user out from application.
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <Styled.AvatarMenuContainer>
      <Styled.AvatarMenuItem as={Link} to={getURL('User')}>
        <ProfileIcon size={20} />
        <Styled.AvatarMenuTitle>{RVDic.Profile}</Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
      <Styled.AvatarMenuItem onClick={handleLogout}>
        <LogoutIcon size={20} />
        <Styled.AvatarMenuTitle>{RVDic.Logout}</Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
    </Styled.AvatarMenuContainer>
  );
};

export default AvatarMenu;
