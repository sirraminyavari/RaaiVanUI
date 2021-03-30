import { Suspense, memo } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Routes from 'routes/MainRoutes/Main.routes';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import * as Styled from './Main.styles';
import { useMediaQuery } from 'react-responsive';
import SidebarHeader from './Sidebar/components/Header';
import { MOBILE_BOUNDRY } from 'constant/constants';
import TestView from 'views/TestView/TestView';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { createSelector } from 'reselect';

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
    <Route exact path="/test" component={TestView} />
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
          {!isMobileScreen ? <Sidebar /> : <SidebarHeader />}
          <Styled.ContentWrapper
            isSidebarOpen={isSidebarOpen}
            isMobile={isMobileScreen}>
            <Navbar />
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
