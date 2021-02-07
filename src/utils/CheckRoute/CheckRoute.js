import { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import useCheckRoute from 'hooks/useCheckRoute';
import Exception from 'components/Exception/Exception';
import Spinner from 'components/Spinner';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';

const CheckRoute = ({ component: Component, name, props, hasNavSide }) => {
  const location = useLocation();
  const route = useCheckRoute(name);
  const dispatch = useDispatch();
  const { toggleNavSide } = themeSlice.actions;

  useEffect(() => {
    dispatch(toggleNavSide(hasNavSide));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNavSide]);

  if (Object.keys(route).length === 0) {
    return <Spinner />;
  }
  if (route.ServiceUnavailable) {
    //Show Service Unavailable Component
    return <Exception message="Service Unavailable" />;
  } else if (route.NoApplicationFound) {
    //Show NoApplicationFound Component
    return <Exception message="No Application Found" />;
  } else if (route.AccessDenied) {
    //Show AccessDenied Component
    return <Exception message={window.RVDic.MSG.AccessDenied} />;
  } else if (route.NullProfileException) {
    //Show NullProfileException Component
    return <Exception message="Null Profile Exception" />;
  } else if (route.RedirectToLogin) {
    //Redirect to '/login'
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToHome && location.pathname !== '/home') {
    //Redirect to '/home'
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
    //Redirect to '/teams'
    return (
      <Redirect
        to={{
          pathname: '/teams',
          state: { from: props.location },
        }}
      />
    );
  } else if (route.RedirectToChangePassword) {
    //Redirect to '/changepassword'
    return (
      <Redirect
        to={{
          pathname: '/changepassword',
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
