import { Suspense, memo } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import Routes from 'routes/MainRoutes/Main.routes';
import Navbar from './Navbar/Navbar';
import OpenSidebar from './Sidebar/SidebarOpen';
import CloseSidebar from './Sidebar/SidebarClose';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import * as Styled from './MainLayout.styles';
import SidebarHeader from './Sidebar/items/Header';
import { MOBILE_BOUNDRY } from 'constant/constants';
import TestView from 'views/TestView/TestView';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import RasoulView from 'views/DevsView/Rasoul/Rasoul';
import AliView from 'views/DevsView/Ali/Ali';
import RaminView from 'views/DevsView/Ramin/Ramin';
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
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
    {/* Just in dev mode and won't render in production  */}
    <Route exact path="/test" component={TestView} />
    <Route exact path="/rasoul" component={RasoulView} />
    <Route exact path="/ali" component={AliView} />
    <Route exact path="/ramin" component={RaminView} />
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

const Main = () => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const hasNavSide = useSelector(selectHasNavSide);

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  return (
    <>
      {hasNavSide ? (
        <Styled.MainContainer>
          {!isMobileScreen ? (
            isSidebarOpen ? (
              <OpenSidebar />
            ) : (
              <CloseSidebar />
            )
          ) : (
            <SidebarHeader />
          )}
          <PerfectScrollBar>
            <Styled.ContentWrapper
              isSidebarOpen={isSidebarOpen}
              isMobile={isMobileScreen}>
              <Navbar />
              <Suspense fallback={<LogoLoader />}>
                <Styled.Content>{switchRoutes}</Styled.Content>
              </Suspense>
            </Styled.ContentWrapper>
          </PerfectScrollBar>
        </Styled.MainContainer>
      ) : (
        <>{switchRoutes}</>
      )}
    </>
  );
};

export default memo(Main);
