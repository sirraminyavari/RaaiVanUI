import { Suspense, memo, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import Routes from 'routes/MainRoutes/Main.routes';
import OpenSidebar from './Sidebar/SidebarOpen';
import OpenSidebarMobile from './Sidebar/SidebarOpenMobile';
import CloseSidebar from './Sidebar/SidebarClose';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import * as Styled from './MainLayout.styles';
import SidebarHeader from './Sidebar/items/Header';
import { MOBILE_BOUNDRY, FORBIDDEN_ROUTES_IN_SAAS } from 'constant/constants';
// import TestView from 'views/TestView/TestView';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import RasoulView from 'views/DevsView/Rasoul/Rasoul';
import AliView from 'views/DevsView/Ali/Ali';
import RaminView from 'views/DevsView/Ramin/Ramin';
import useWindow from 'hooks/useWindowContext';
import { NavbarContainer } from './Navbar/Navbar.styles';
// import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';

const Navbar = lazy(() =>
  import(/* webpackChunkName: "nav-selected-team-component"*/ './Navbar/Navbar')
);

const NavbarInitial = lazy(() =>
  import(
    /* webpackChunkName: "nav-not-selected-team-component"*/ './Navbar/NavbarInitial'
  )
);

const { RVGlobal } = window;

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
      const { exact, path, component, name, hasNavSide } = route;
      const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

      if (isSaas && FORBIDDEN_ROUTES_IN_SAAS.includes(name)) {
        return <Redirect key={key} to="/teams" />;
      }
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
    {/* Just in dev mode and won't render in production  */}
    {/* <Route exact path="/test" component={TestView} /> */}
    {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && (
      <>
        <Route exact path="/rasoul" component={RasoulView} />
        <Route exact path="/ali" component={AliView} />
        <Route exact path="/ramin" component={RaminView} />
      </>
    )}

    <Redirect from="/" to="/teams" />
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

const Main = () => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const hasNavSide = useSelector(selectHasNavSide);
  const selectedTeam = useSelector(selectedApp);
  const { RVGlobal } = useWindow();

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  const isTeamSelected = !!RVGlobal.ApplicationID && !!selectedTeam?.id;

  const getSidebar = () => {
    if (isTeamSelected) {
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
