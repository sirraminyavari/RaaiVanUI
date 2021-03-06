/**
 * Renders a popup menu for user avatar.
 */
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import logoutAction from 'store/actions/auth/logoutAction';
import AvatarMenuItem from './AvatarMenuItem';
import MenuLinkItems from './MenuLinkItems';
import Checkbox from 'components/Checkbox/Checkbox';
import Cookie from 'js-cookie';
import * as Styled from '../../Navbar.styles';

const { RVDic, location } = window;

const AvatarMenuList = () => {
  const dispatch = useDispatch();

  //! Logs user out from application.
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleCheckbox = (e) => {
    e.target.checked
      ? Cookie.set('rv_lang', 'eng')
      : Cookie.set('rv_lang', 'fa');
    location.reload();
  };

  return (
    <Styled.AvatarMenuContainer>
      {MenuLinkItems.map((item, index) => {
        const { id, title, linkTo, icon, iconColor, textColor } = item;
        return (
          <Fragment key={id}>
            <AvatarMenuItem
              title={title}
              linkTo={linkTo}
              icon={icon}
              iconColor={iconColor}
              textColor={textColor}
            />
            {(index === 2 || index === 4) && <Styled.Divider />}
          </Fragment>
        );
      })}
      <AvatarMenuItem
        title={RVDic.Logout}
        onClickHandler={handleLogout}
        icon={LogoutIcon}
        iconColor="#E2234F"
        textColor="#E2234F"
      />
      {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && (
        <Checkbox
          changeHandler={handleCheckbox}
          isChecked={Cookie.get('rv_lang') === 'eng'}
        />
      )}
    </Styled.AvatarMenuContainer>
  );
};

export default AvatarMenuList;
