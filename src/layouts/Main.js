import { Switch, Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Routes from 'routes';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import * as Styled from './Main.styles';

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
    <Redirect from="/" to="/teams" />
  </Switch>
);

const Main = () => {
  const { isSidebarOpen, hasNavSide } = useSelector((state) => state.theme);

  return (
    <>
      {hasNavSide ? (
        <Styled.MainContainer>
          <Sidebar />
          <Styled.ContentWrapper isSidebarOpen={isSidebarOpen}>
            <Navbar isSidebarOpen={isSidebarOpen} />
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
