/**
 * Renders a popup menu for user avatar.
 */
import { Link } from 'react-router-dom';
import { getURL } from 'helpers/helpers';
import ProfileIcon from 'components/Icons/ProfileIcon/ProfileIcon';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../Navbar.styles';

const { RVDic } = window;

const AvatarMenu = () => {
  //! Logs user out from application.
  const handleLogout = () => {
    let logoutHandler = new APIHandler('RVAPI', 'Logout');
    try {
      logoutHandler.fetch(
        {},
        //TODO: Dispatch an action on logout success
        (response) => console.log(response),
        (error) => console.log({ error })
      );
    } catch (err) {
      console.log({ err });
    }
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
