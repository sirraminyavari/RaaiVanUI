import { Route, Redirect } from "react-router-dom";
import useRoute from "hooks/useRoute";
import ServiceUnavailable from "views/Redirect/ServiceUnavailable";
import NoApplicationFound from "views/Redirect/NoApplicationFound";
import Spinner from "components/Spinner";

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const route = useRoute({ name: path.slice(1) });
  console.log(route);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (route.ServiceUnavailable) {
          //Show Service Unavailable Component
          return <ServiceUnavailable />;
        } else if (route.NoApplicationFound) {
          //Show NoApplicationFound Component
          return <NoApplicationFound />;
        } else if (!route.IsAuthenticated) {
          //Show Spinner while checking for permissions
          return <Spinner />;
        } else {
          //Show Route Component if permission is granted
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
