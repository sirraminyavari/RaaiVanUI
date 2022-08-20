/**
 * Renders a popup menu for user avatar.
 */
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import AvatarMenuItem from './AvatarMenuItem';
import menuLinkItems from './MenuLinkItems';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import { C_RED, TC_VERYWARM, C_GRAY } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';
import { CV_RED } from 'constant/CssVariables';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { HOME_PATH } from 'constant/constants';
import usePreventScroll from 'hooks/usePreventScroll';
import useRouteListener from 'hooks/useRouteListener';
import { useApplicationSlice } from 'store/slice/applications';
import { selectApplication } from 'store/slice/applications/selectors';
import { useAuthSlice } from 'store/slice/auth';
import LanguageSwitch from './LanguageSwitch';

const AvatarMenuList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const avatarMenuRef = useRef();
  const containerRef = useRef();
  const { RVDic, RVGlobal } = useWindow();

  const { userApps: teams, currentApp: selectedTeam } =
    useSelector(selectApplication);
  const { actions: applicationActions } = useApplicationSlice();

  const { actions: authActions } = useAuthSlice();

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
    dispatch(authActions.logout({}));
  };

  const onSelectDone = () => {
    history.push(HOME_PATH);
  };

  //TODO: error handling
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (appId) => {
    dispatch(
      applicationActions.selectApplication({
        ApplicationID: appId,
        done: onSelectDone,
        error: onSelectError,
      })
    );
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
      <ScrollBarProvider style={{ maxHeight: '10rem' }}>
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
                  selectedTeam?.ApplicationID === ApplicationID
                    ? TC_VERYWARM
                    : C_GRAY
                }
              />
            );
          })}
        </div>
      </ScrollBarProvider>
      {RVGlobal?.IsDev && <LanguageSwitch />}
      <Styled.Divider />
      <AvatarMenuItem
        title={RVDic.Logout}
        onClickHandler={handleLogout}
        icon={LogoutIcon}
        iconColor={CV_RED}
        textClass={C_RED}
      />
    </Styled.AvatarMenuContainer>
  );
};

export default AvatarMenuList;
