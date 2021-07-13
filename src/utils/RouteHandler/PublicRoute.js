/**
 * Renders a component according to current route if not authenticated
 * ... Otherwise, redirects user to '/teams' route.
 */
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TEAMS_PATH } from 'constant/constants';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: TEAMS_PATH,
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
