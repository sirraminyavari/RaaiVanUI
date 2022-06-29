import { Suspense, memo, lazy, useEffect } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
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
import TestView from 'views/TestView/TestView';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

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

//! Provides main routes of the app.
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

    {/* <Route path={`monitoring/:ApplicationID`} component={Teams} /> */}
  </Switch>
);

/**
 * Renders main layout of the app.
 */
const Main = () => {
  const dispatch = useDispatch();
  const { RVGlobal } = useWindow();

  const {
    actions: { toggleSidebar },
  } = useThemeSlice();

  const themeState = useSelector(selectTheme);
  //! Get onboarding stage name.
  const { name: onboardingName } = useSelector(selectOnboarding);

  const { actions: sidebarActions } = useSidebarSlice();

  //! Check if the sidebar is open.
  const isSidebarOpen = themeState.isSidebarOpen;
  //! Check if navbar or sidebar are enabled for current route.
  const hasNavSide = themeState.hasNavSide;
  const hideSidebar = themeState.hideSidebar;
  //! Get selected team.
  const selectedTeam = themeState.selectedTeam;
  const activePath = themeState.activePath;

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  //! Check if user has selected a team.
  const isTeamSelected = !!RVGlobal.ApplicationID || !!selectedTeam?.id;

  //! Provides the sidebar component.
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
        //! Window screen.
        return isSidebarOpen ? <OpenSidebar /> : <CloseSidebar />;
      } else {
        //! Mobile screen.
        return isSidebarOpen ? <OpenSidebarMobile /> : <SidebarHeader />;
      }
    }
    return null;
  };

  //update the list of templates in sidebar
  useEffect(() => dispatch(sidebarActions.getSidebarNodeTypes()), []);

  return (
    <>
      {hasNavSide ? (
        <Styled.MainContainer>
          {!hideSidebar && getSidebar()}
          <Styled.ContentWrapper
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobileScreen}
          >
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
