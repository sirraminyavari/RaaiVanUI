/**
 * Renders a popup menu for user avatar.
 */
import { Fragment, useContext } from 'react';
import { useDispatch } from 'react-redux';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import logoutAction from 'store/actions/auth/logoutAction';
import AvatarMenuItem from './AvatarMenuItem';
import MenuLinkItems from './MenuLinkItems';
import Checkbox from 'components/Checkbox/Checkbox';
import Cookie from 'js-cookie';
import * as Styled from '../../Navbar.styles';
import { C_RED } from 'constant/Colors';
import { WindowContext } from 'context/WindowProvider';

const AvatarMenuList = () => {
  const dispatch = useDispatch();
  const { RVDic } = useContext(WindowContext);

  //! Logs user out from application.
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleCheckbox = (e) => {
    e.target.checked
      ? Cookie.set('rv_lang', 'en')
      : Cookie.set('rv_lang', 'fa');
    window.location.reload();
  };

  return (
    <Styled.AvatarMenuContainer>
      {MenuLinkItems.map((item, index) => {
        const { id, title, linkTo, icon, iconClass, textClass } = item;
        return (
          <Fragment key={id}>
            <AvatarMenuItem
              title={title}
              linkTo={linkTo}
              icon={icon}
              iconClass={iconClass}
              textClass={textClass}
            />
            {index === 2 && <Styled.Divider />}
          </Fragment>
        );
      })}
      <Styled.Divider />
      <AvatarMenuItem
        title={RVDic.Logout}
        onClickHandler={handleLogout}
        icon={LogoutIcon}
        iconClass={C_RED}
        textClass={C_RED}
      />
      {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && (
        <Checkbox
          changeHandler={handleCheckbox}
          isChecked={Cookie.get('rv_lang') === 'en'}
        />
      )}
    </Styled.AvatarMenuContainer>
  );
};

export default AvatarMenuList;
