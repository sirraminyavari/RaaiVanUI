/**
 * Renders a popup menu for user avatar.
 */
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import AccountsIcon from 'components/Icons/AccountsIcon/AccountsIcon';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import ServerIcon from 'components/Icons/ServerIcon/ServerIcon';
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
        <ProfileIcon size={25} color="#2B7BE4" />
        <Styled.AvatarMenuTitle>{RVDic.Profile}</Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
      <Styled.AvatarMenuItem as={Link} to="#">
        <AccountsIcon size={25} color="#2B7BE4" />
        <Styled.AvatarMenuTitle>مدیریت حساب ها</Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
      <Styled.AvatarMenuItem as={Link} to="#">
        <QuestionIcon size={25} color="#2B7BE4" />
        <Styled.AvatarMenuTitle>راهنما</Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
      <Styled.Divider />
      <Styled.AvatarMenuItem as={Link} to="#">
        <ServerIcon size={25} color="#002479" />
        <Styled.AvatarMenuTitle>ورک اسپیس شماره ۱</Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
      <Styled.AvatarMenuItem as={Link} to="#">
        <ServerIcon size={25} color="#707070" />
        <Styled.AvatarMenuTitle color="#707070">
          ورک اسپیس کلیک مایند
        </Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
      <Styled.Divider />
      <Styled.AvatarMenuItem onClick={handleLogout}>
        <LogoutIcon size={25} color="#E2234F" />
        <Styled.AvatarMenuTitle color="#E2234F">
          {RVDic.Logout}
        </Styled.AvatarMenuTitle>
      </Styled.AvatarMenuItem>
    </Styled.AvatarMenuContainer>
  );
};

export default AvatarMenu;
