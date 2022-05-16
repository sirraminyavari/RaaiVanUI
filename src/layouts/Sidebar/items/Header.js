/**
 * Renders header component for sidebar.
 */
import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import Logo_Fa from 'assets/images/cliqmind_logo_white.svg';
import Logo_En from 'assets/images/cliqmind_logo_white_en.svg';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import ToggleIcon from 'components/Icons/SidebarToggleIcons/Toggle';
import { HOME_PATH, INTRO_ONBOARD, MOBILE_BOUNDRY } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';

const selectTeam = createSelector(
  (state) => state.applications,
  (theme) => theme.currentApp
);

const selectOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

const SidebarHeader = () => {
  const dispatch = useDispatch();
  const { RV_RevFloat, RV_Float, RVGlobal, RV_RTL } = useWindow();

  const {
    actions: { toggleSidebar },
  } = useThemeSlice();
  const themeState = useSelector(selectTheme);

  const isSidebarOpen = themeState.isSidebarOpen;
  const selectedTeam = useSelector(selectTeam);
  const hasPattern = themeState.hasSidebarPattern;
  const onboardingName = useSelector(selectOnboardingName);

  const isSaas = RVGlobal.SAASBasedMultiTenancy;
  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  const isTeamSelected =
    !!selectedTeam?.ApplicationID || !!RVGlobal?.ApplicationID;

  //! Toggle sidebar drawer on click.
  const toggleDrawer = () => {
    if (isIntroOnboarding) return;
    isTeamSelected && dispatch(toggleSidebar(!isSidebarOpen));
  };

  useEffect(() => {
    if (!isTeamSelected) {
      dispatch(toggleSidebar(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Styled.SidebarHeader isMobile={isMobileScreen} hasPattern={hasPattern}>
      {isSidebarOpen && (
        <Link
          to={HOME_PATH}
          style={{ pointerEvents: isIntroOnboarding ? 'none' : 'revert' }}
        >
          <img
            src={isSaas ? (RV_RTL ? Logo_Fa : Logo_En) : RVGlobal.LogoURL}
            width={isSaas ? '120' : '60'}
            alt="logo-icon"
          />
        </Link>
      )}
      <Styled.ToggleArrow onClick={toggleDrawer}>
        <ToggleIcon dir={isSidebarOpen ? RV_Float : RV_RevFloat} size={25} />
      </Styled.ToggleArrow>
    </Styled.SidebarHeader>
  );
};

export default memo(SidebarHeader);
