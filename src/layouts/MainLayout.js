import { Suspense, memo, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import Routes from 'routes/MainRoutes/Main.routes';
import OpenSidebar from './Sidebar/SidebarOpen';
import OpenSidebarMobile from './Sidebar/SidebarOpenMobile';
import CloseSidebar from './Sidebar/SidebarClose';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import * as Styled from './MainLayout.styles';
import SidebarHeader from './Sidebar/items/Header';
import {
  MOBILE_BOUNDRY,
  FORBIDDEN_ROUTES_IN_SAAS,
  INTRO_ONBOARD,
  TEAMS_PATH,
} from 'constant/constants';
// import TestView from 'views/TestView/TestView';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import RasoulView from 'views/DevsView/Rasoul/Rasoul';
import AliView from 'views/DevsView/Ali/Ali';
import RaminView from 'views/DevsView/Ramin/Ramin';
import useWindow from 'hooks/useWindowContext';
import { NavbarContainer } from './Navbar/Navbar.styles';
import { themeSlice } from 'store/reducers/themeReducer';
import TestView from 'views/TestView/TestView';
// import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';

const { toggleSidebar } = themeSlice.actions;

const Navbar = lazy(() =>
  import(/* webpackChunkName: "nav-selected-team-component"*/ './Navbar/Navbar')
);

const NavbarInitial = lazy(() =>
  import(
    /* webpackChunkName: "nav-not-selected-team-component"*/ './Navbar/NavbarInitial'
  )
);

const { RVGlobal } = window;
const isDev = (RVGlobal || {}).IsDev;
const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

const switchRoutes = (
  <Switch>
    {Routes.filter((route) => {
      //! Filter out some routes in Saas mode.
      if (isSaas && FORBIDDEN_ROUTES_IN_SAAS.includes(route.name)) {
        return false;
      }
      return true;
    }).map((route, key) => {
      const { exact, path, component, name, hasNavSide } = route;
      return (
        <Route
          key={key}
          exact={exact}
          path={path}
          render={(props) => (
            <CheckRoute
              component={component}
              hasNavSide={hasNavSide}
              name={name}
              props={props}
            />
          )}
        />
      );
    })}

    {isDev && <Route exact path="/test" component={TestView} />}
    {isDev && <Route exact path="/rasoul" component={RasoulView} />}
    {isDev && <Route exact path="/ali" component={AliView} />}
    {isDev && <Route exact path="/ramin" component={RaminView} />}

    <Redirect from="/*" to={TEAMS_PATH} />
  </Switch>
);

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectHasNavSide = createSelector(
  (state) => state.theme,
  (theme) => theme.hasNavSide
);

const selectedApp = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const selectedActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

const selectOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

const Main = () => {
  const dispatch = useDispatch();
  const { RVGlobal } = useWindow();

  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const hasNavSide = useSelector(selectHasNavSide);
  const selectedTeam = useSelector(selectedApp);
  const onboardingName = useSelector(selectOnboardingName);
  const activePath = useSelector(selectedActivePath);

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  const isTeamSelected = !!RVGlobal.ApplicationID && !!selectedTeam?.id;

  const getSidebar = () => {
    if (isTeamSelected) {
      //! Disable sidebar on teams view.
      if (activePath === TEAMS_PATH) {
        return null;
      }
      //! When 'intro' onboarding mode is active.
      if (isIntroOnboarding) {
        //! Open the sidebar and return 'OpenSidebar'.
        dispatch(toggleSidebar(true));
        return <OpenSidebar />;
      }
      if (!isMobileScreen) {
        if (isSidebarOpen) {
          return <OpenSidebar />;
        } else {
          return <CloseSidebar />;
        }
      } else {
        return isSidebarOpen ? <OpenSidebarMobile /> : <SidebarHeader />;
      }
    }
    return null;
  };

  return (
    <>
      {hasNavSide ? (
        <Styled.MainContainer>
          {getSidebar()}
          <Styled.ContentWrapper
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobileScreen}>
            <Suspense fallback={<NavbarContainer isMobile={isMobileScreen} />}>
              {isTeamSelected ? <Navbar /> : <NavbarInitial />}
            </Suspense>
            <Suspense fallback={<LogoLoader />}>
              <Styled.Content>{switchRoutes}</Styled.Content>
            </Suspense>
          </Styled.ContentWrapper>
        </Styled.MainContainer>
      ) : (
        <>{switchRoutes}</>
      )}
    </>
  );
};

export default memo(Main);
