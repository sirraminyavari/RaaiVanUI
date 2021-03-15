/**
 * Check permissions for given route.
 * ... Show a component or redirect to a route based on authorization.
 */
import { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import useCheckRoute from 'hooks/useCheckRoute';
import Exception from 'components/Exception/Exception';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';

const CheckRoute = ({ component: Component, name, props, hasNavSide }) => {
  const location = useLocation();
  //! Get route permission object based on route name.
  const route = useCheckRoute(name);
  const dispatch = useDispatch();
  const { toggleNavSide } = themeSlice.actions;

  useEffect(() => {
    dispatch(toggleNavSide(hasNavSide));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNavSide]);

  if (route.ServiceUnavailable) {
    return <Exception message="Service Unavailable" />;
  } else if (route.NoApplicationFound) {
    return <Exception message="No Application Found" />;
  } else if (route.AccessDenied) {
    return <Exception message={window.RVDic.MSG.AccessDenied} />;
  } else if (route.NullProfileException) {
    return <Exception message="Null Profile Exception" />;
  } else if (route.RedirectToLogin) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToHome && location.pathname !== '/home') {
    return (
      <Redirect
        to={{
          pathname: '/home',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToProfile && location.pathname !== '/user') {
    const path = route.RedirectToProfile;
    const isString = typeof path === 'string';
    return (
      <Redirect
        to={{
          pathname: isString ? `/user/${path}` : '/user',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToTeams && location.pathname !== '/teams') {
    return (
      <Redirect
        to={{
          pathname: '/teams',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToChangePassword) {
    return (
      <Redirect
        to={{
          pathname: '/changepassword',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToURL) {
    const url = route.RedirectToURL;
    window.location.href = url;
  } else {
    return <Component {...props} route={route} />;
  }
};

export default CheckRoute;
