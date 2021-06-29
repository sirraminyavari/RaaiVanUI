/**
 * Renders a popup menu for user avatar.
 */
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Cookie from 'js-cookie';
import { createSelector } from 'reselect';
import LogoutIcon from 'components/Icons/LogoutIcon/Logouticon';
import logoutAction from 'store/actions/auth/logoutAction';
import AvatarMenuItem from './AvatarMenuItem';
import menuLinkItems from './MenuLinkItems';
import Checkbox from 'components/Checkbox/Checkbox';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import { C_RED, TC_VERYWARM, C_GRAY } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64, getURL } from 'helpers/helpers';
import { CV_RED } from 'constant/CssVariables';
import { selectApplication } from 'store/actions/applications/ApplicationsAction';

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

  const onSelectDone = () => {
    const homeURL = getURL('Home');
    history.push(homeURL);
  };

  //TODO: error handling
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (appId) => {
    dispatch(selectApplication(appId, onSelectDone, onSelectError));
  };

  return (
    <Styled.AvatarMenuContainer>
      {menuLinkItems.map((item) => {
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
      <Styled.AvatarTeamsListWrapper>
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
      </Styled.AvatarTeamsListWrapper>
      <Styled.Divider />
      <AvatarMenuItem
        title={RVDic.Logout}
        onClickHandler={handleLogout}
        icon={LogoutIcon}
        iconColor={CV_RED}
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
