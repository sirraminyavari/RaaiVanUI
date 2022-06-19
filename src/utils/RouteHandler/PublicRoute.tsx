/**
 * Renders a component according to current route if not authenticated
 * ... Otherwise, redirects user to '/workspaces' route.
 */
import { Route, Redirect } from 'react-router-dom';
import { TEAMS_PATH } from 'constant/constants';
import { selectAuth } from 'store/slice/auth/selectors';
import { useSelector } from 'react-redux';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(selectAuth);

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
