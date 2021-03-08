import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from 'views/Auth/Login';
const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return (
            <Login>
              <Component {...props} />
            </Login>
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: '/teams',
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default PublicRoute;
