import { lazy } from "react";
import { Redirect, useLocation } from "react-router-dom";
import useCheckRoute from "hooks/useCheckRoute";
import WithSuspense from "components/WithSuspense/WithSuspense";

const ServiceUnavailable = lazy(() =>
  import("views/Exceptions/ServiceUnavailable")
);
const NoApplicationFound = lazy(() =>
  import("views/Exceptions/NoApplicationFound")
);
const AccessDenied = lazy(() => import("views/Exceptions/AccessDenied"));
const NullProfileException = lazy(() =>
  import("views/Exceptions/NullProfileException")
);

const CheckRoute = ({ component: Component, name, props }) => {
  const location = useLocation();
  const route = useCheckRoute({ name });
  console.log(props);

  if (route.ServiceUnavailable) {
    //Show Service Unavailable Component
    return <WithSuspense component={ServiceUnavailable} />;
  } else if (route.NoApplicationFound) {
    //Show NoApplicationFound Component
    return <WithSuspense component={NoApplicationFound} />;
  } else if (route.AccessDenied) {
    //Show AccessDenied Component
    return <WithSuspense component={AccessDenied} />;
  } else if (route.NullProfileException) {
    //Show NullProfileException Component
    return <WithSuspense component={NullProfileException} />;
  } else if (route.RedirectToLogin) {
    //Redirect to '/login'
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToHome && location.pathname !== "/home") {
    //Redirect to '/home'
    return (
      <Redirect
        to={{
          pathname: "/home",
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToProfile && location.pathname !== "/user") {
    const path = route.RedirectToProfile;
    const isString = typeof result === "string";
    return isString ? (
      //Redirect to '/user/[result.RedirectToProfile]'
      <Redirect
        to={{
          pathname: `/user/${path}`,
          state: { from: props.location },
        }}
      />
    ) : (
      //Redirect to '/user'
      <Redirect
        to={{
          pathname: "/user",
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToTeams && location.pathname !== "/teams") {
    //Redirect to '/teams'
    return (
      <Redirect
        to={{
          pathname: "/teams",
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToChangePassword) {
    //Redirect to '/changepassword'
    return (
      <Redirect
        to={{
          pathname: "/changepassword",
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToURL) {
    //Redirect to '[result.RedirectToURL]'
    const url = route.RedirectToURL;
    window.location.href = url;
  } else {
    //Show Route Component if permission is granted
    return <Component {...props} route={route} />;
  }
};

export default CheckRoute;