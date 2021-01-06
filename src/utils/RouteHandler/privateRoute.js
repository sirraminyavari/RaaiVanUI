import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { RVGlobalContext } from "context/RVGlobalProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { IsAuthenticated: isAuthenticated } = useContext(RVGlobalContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        //! Check if user is authenticated and if so ...
        //! let it proceed and render component.
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          //! And if user is not authenticated ...
          //! redirect it to login page.
          return (
            <Redirect
              to={{
                pathname: "/login",
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
