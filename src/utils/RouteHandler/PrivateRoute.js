/**
 * Renders a component according to current route if authenticated
 * ... Otherwise, redirects user to '/auth/login' route.
 */
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGIN_PATH } from 'constant/constants';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: LOGIN_PATH,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
