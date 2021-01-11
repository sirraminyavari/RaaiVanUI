import { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Loading from "views/Loading/Loading";
import Unauthorized from "views/Unauthorized/Unauthorized";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [loading, setLoading] = useState(true);
  const [userHasPermission, setUserHasPermission] = useState(false);
  useEffect(() => {
    // Call api here
    setTimeout(() => {
      setUserHasPermission(true);
      setLoading(false);
    }, 1000);
    return () => {
        setUserHasPermission(false);
        setLoading(true);
    }
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Route
      {...rest}
      render={(props) => {
        if (userHasPermission) {
          return <Component {...props} />;
        } else {
          return <Unauthorized />
        }
      }}
    />
  );
};

export default ProtectedRoute;