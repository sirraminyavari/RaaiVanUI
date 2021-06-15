/**
 * Renders a popup menu for user avatar.
 */
import { useDispatch, useSelector } from 'react-redux';
import Cookie from 'js-cookie';
import { createSelector } from 'reselect';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import logoutAction from 'store/actions/auth/logoutAction';
import AvatarMenuItem from './AvatarMenuItem';
import MenuLinkItems from './MenuLinkItems';
import Checkbox from 'components/Checkbox/Checkbox';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import { C_RED, TC_VERYWARM, C_GRAY } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const selectedApplication = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const AvatarMenuList = () => {
  const dispatch = useDispatch();
  const { RVDic } = useWindow();
  const teams = useSelector(selectApplications);
  const selectedTeam = useSelector(selectedApplication);

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
      {MenuLinkItems.map((item) => {
        const { id, title, linkTo, icon, iconClass, textClass } = item;
        return (
          <AvatarMenuItem
            key={id}
            title={title}
            linkTo={linkTo}
            icon={icon}
            iconClass={iconClass}
            textClass={textClass}
          />
        );
      })}
      <Styled.Divider />
      {teams?.map((team) => {
        const { ApplicationID, Title, IconURL } = team;
        if (['archived-apps', 'add-app'].includes(ApplicationID)) return null;
        return (
          <AvatarMenuItem
            key={ApplicationID}
            title={decodeBase64(Title)}
            iconURL={IconURL}
            textClass={selectedTeam.id === ApplicationID ? TC_VERYWARM : C_GRAY}
          />
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
