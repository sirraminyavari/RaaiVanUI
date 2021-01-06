import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { RVGlobalContext } from "context/RVGlobalProvider";

const PublicRoute = ({ component: Component, ...rest }) => {
  const {
    IsAuthenticated: isAuthenticated,
    CurrentUser: currentUser,
    ApplicationID: appId,
  } = useContext(RVGlobalContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        //! If user is not authenticated, Go on and show login page.
        if (!isAuthenticated) {
          return <Component {...props} />;
        } else if (currentUser.IncompleteProfile) {
          //! Otherwise choose which page should be the landing page
          return (
            <Redirect
              to={{
                pathname: "/profile",
                state: { from: props.location },
              }}
            />
          );
        } else if (!appId) {
          return (
            <Redirect
              to={{
                pathname: "/teams",
                state: { from: props.location },
              }}
            />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: "/home",
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
