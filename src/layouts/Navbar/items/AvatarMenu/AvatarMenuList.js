/**
 * Renders a popup menu for user avatar.
 */
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Cookie from 'js-cookie';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import logoutAction from 'store/actions/auth/logoutAction';
import AvatarMenuItem from './AvatarMenuItem';
import menuLinkItems from './MenuLinkItems';
import Checkbox from 'components/Checkbox/Checkbox';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import { C_RED, TC_VERYWARM, C_GRAY } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';
import { CV_RED } from 'constant/CssVariables';
import { selectApplication } from 'store/actions/applications/ApplicationsAction';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { HOME_PATH } from 'constant/constants';
import usePreventScroll from 'hooks/usePreventScroll';
import useRouteListener from 'hooks/useRouteListener';

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.userApps
);

const selectedApplication = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const AvatarMenuList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const avatarMenuRef = useRef();
  const containerRef = useRef();
  const { RVDic, RV_RTL, RVGlobal } = useWindow();
  const teams = useSelector(selectApplications);
  const selectedTeam = useSelector(selectedApplication);
  const isDev = (RVGlobal || {}).IsDev;

  useRouteListener(ReactTooltip.hide);
  usePreventScroll(containerRef);

  const handleOnClickOutside = (e) => {
    if (e.target.dataset.testid !== 'avatar-image') {
      ReactTooltip.hide();
    }
  };

  useOnClickOutside(avatarMenuRef, handleOnClickOutside);

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

  const onSelectDone = () => {
    history.push(HOME_PATH);
  };

  //TODO: error handling
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (appId) => {
    dispatch(selectApplication(appId, onSelectDone, onSelectError));
  };

  return (
    <Styled.AvatarMenuContainer ref={avatarMenuRef}>
      {menuLinkItems?.map((item) => {
        const { id, title, linkTo, icon, iconColor, textClass } = item;
        return (
          <AvatarMenuItem
            key={id}
            title={title}
            linkTo={linkTo}
            icon={icon}
            iconColor={iconColor}
            textClass={textClass}
          />
        );
      })}
      <Styled.Divider />
      <PerfectScrollbar style={{ maxHeight: 'calc(100vh - 26rem)' }}>
        <div ref={containerRef}>
          {teams?.map((team) => {
            const { ApplicationID, Title, IconURL } = team;
            return (
              <AvatarMenuItem
                onClickHandler={() => handleTeamSelect(ApplicationID)}
                key={ApplicationID}
                title={decodeBase64(Title)}
                iconURL={IconURL}
                textClass={
                  selectedTeam.id === ApplicationID ? TC_VERYWARM : C_GRAY
                }
              />
            );
          })}
        </div>
      </PerfectScrollbar>
      <Styled.Divider />
      <AvatarMenuItem
        title={RVDic.Logout}
        onClickHandler={handleLogout}
        icon={LogoutIcon}
        iconColor={CV_RED}
        textClass={C_RED}
      />
      {isDev && (
        <Checkbox
          title={RV_RTL ? 'انگلیسی' : 'english'}
          changeHandler={handleCheckbox}
          isChecked={Cookie.get('rv_lang') === 'en'}
        />
      )}
    </Styled.AvatarMenuContainer>
  );
};

export default AvatarMenuList;
