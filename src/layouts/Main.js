import { Switch, Redirect, Route } from 'react-router-dom';
import Routes from 'routes';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CheckRoute from 'utils/CheckRoute/CheckRoute';
import { MainContainer, ContentWrapper, Content } from './Main.styles';
import { useContext } from 'react';
import { ThemeContext } from 'context/ThemeProvider';

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
      const { exact, path, component, name } = route;
      return (
        <Route
          key={key}
          exact={exact}
          path={path}
          render={(props) => (
            <CheckRoute component={component} name={name} props={props} />
          )}
        />
      );
    })}
    <Redirect from="/" to="/teams" />
  </Switch>
);

const Main = () => {
  const { isOpen } = useContext(ThemeContext);

  return (
    <MainContainer>
      <Sidebar />
      <ContentWrapper isOpen={isOpen}>
        <Navbar />
        <Content>{switchRoutes}</Content>
      </ContentWrapper>
    </MainContainer>
  );
};

export default Main;
