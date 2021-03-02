import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Routes from 'routes/routes';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import * as Styled from './Main.styles';
import { useMediaQuery } from 'react-responsive';
import SidebarHeader from './Sidebar/components/Header';
import { MOBILE_BOUNDRY } from 'constant/constants';
import TestView from 'views/TestView/TestView';

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

const Main = () => {
  const { isSidebarOpen, hasNavSide } = useSelector((state) => state.theme);
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
            <Styled.Content>{switchRoutes}</Styled.Content>
          </Styled.ContentWrapper>
        </Styled.MainContainer>
      ) : (
        <>{switchRoutes}</>
      )}
    </>
  );
};

export default Main;
