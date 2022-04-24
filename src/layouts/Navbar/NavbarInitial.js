import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import Logo_Fa from 'assets/images/cliqmind_logo_white.svg';
import Logo_En from 'assets/images/cliqmind_logo_white_en.svg';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import TeamIcon from 'components/Icons/TeamIcon/TeamIcon';
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import useWindow from 'hooks/useWindowContext';
import logoutAction from 'store/actions/auth/logoutAction';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import { HELP_PATH, TEAMS_PATH } from 'constant/constants';

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

const NavbarInitial = () => {
  const dispatch = useDispatch();
  const { RVGlobal, RV_RTL, RVDic } = useWindow();
  const isSaas = RVGlobal.SAASBasedMultiTenancy;
  const activePath = useSelector(selectActivePath);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogoutDone = () => {};

  const onLogoutError = (logoutError) => {
    console.log(logoutError);
    setIsLoggingOut(false);
  };

  //! Logs user out from application.
  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logoutAction(onLogoutDone, onLogoutError));
  };

  const isHelpPathActive = activePath === HELP_PATH;

  const linkTo = isHelpPathActive ? TEAMS_PATH : HELP_PATH;

  return (
    <Styled.InitialNavbarContainer>
      <img
        src={isSaas ? (RV_RTL ? Logo_Fa : Logo_En) : RVGlobal.LogoURL}
        width={isSaas ? '120' : '60'}
        alt="cliqmind-logo"
      />
      <Styled.ExitAndHelpWrapper>
        <Tooltip
          tipId="helpme"
          place="bottom"
          effect="solid"
          offset={{ top: -3 }}
          renderContent={() => (
            <span style={{ textTransform: 'capitalize' }}>
              {isHelpPathActive ? RVDic.Teams : RVDic.Help}
            </span>
          )}
        >
          <Styled.QuestionIconWrapper as={Link} to={linkTo}>
            {isHelpPathActive ? (
              <TeamIcon size={27} />
            ) : (
              <QuestionIcon size={22} />
            )}
          </Styled.QuestionIconWrapper>
        </Tooltip>
        <Tooltip
          tipId="exit-app"
          effect="solid"
          disable={isLoggingOut}
          offset={{ top: -3 }}
          renderContent={() => (
            <span style={{ textTransform: 'capitalize' }}>{RVDic.Logout}</span>
          )}
        >
          <Styled.ExitIconWrapper onClick={handleLogout}>
            {isLoggingOut ? (
              <LoadingIconFlat size={20} />
            ) : (
              <ExitIcon size={30} />
            )}
          </Styled.ExitIconWrapper>
        </Tooltip>
      </Styled.ExitAndHelpWrapper>
    </Styled.InitialNavbarContainer>
  );
};

export default NavbarInitial;
