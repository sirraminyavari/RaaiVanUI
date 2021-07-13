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
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { loginSlice } from 'store/reducers/loginReducer';
import { decodeBase64, isEmpty, setRVGlobal } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import {
  AUTH_PATH,
  CHANGE_PASS_PATH,
  HOME_PATH,
  MAIN_CONTENT,
  TEAMS_PATH,
  USER_PATH,
} from 'constant/constants';
import {
  getSidebarNodes,
  getUnderMenuPermissions,
} from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';

const CheckRoute = ({ component: Component, name, props, hasNavSide }) => {
  //! Get route permission object based on route name.
  const route = useCheckRoute(name);
  const location = useLocation();
  const dispatch = useDispatch();

  const { setIsAthunticated } = loginSlice.actions;
  const { setSidebarDnDTree } = sidebarMenuSlice.actions;
  const {
    toggleNavSide,
    setSelectedTeam,
    setActivePath,
    setSidebarContent,
    toggleSidebar,
  } = themeSlice.actions;

  useEffect(() => {
    //! Set selected team.
    if (route.Application) {
      const application = {
        name: decodeBase64(route.Application.Title),
        id: route.Application.ApplicationID,
      };
      dispatch(setSelectedTeam(application));
      dispatch(getSidebarNodes());
      dispatch(getConfigPanels());
      dispatch(getUnderMenuPermissions(['Reports']));
      // if (!!response.Onboarding) {
      //   dispatch(onboardingName(response.Onboarding?.name || ''));
      //   dispatch(onboardingStep(response.Onboarding?.fromStep || 0));
      // }
    }

    //! Reset team to null if user is authenticated but has not selected a team yet.
    if (route.IsAuthenticated && !route.AppID) {
      dispatch(toggleSidebar(false)); //! Close sidebar.
      dispatch(setSelectedTeam({ name: null, id: null })); //! Clear selected team.
      dispatch(setSidebarContent({ current: MAIN_CONTENT, prev: '' })); //! Reset sidebar content to default.
      dispatch(setSidebarDnDTree({})); //! Clear sidebar tree items.
    }

    //! Set active path.
    dispatch(setActivePath(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  useEffect(() => {
    dispatch(toggleNavSide(hasNavSide));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNavSide]);

  if (isEmpty(route)) {
    return <LogoLoader />;
  } else if (route?.ServiceUnavailable) {
    return <Exception message="Service Unavailable" />;
  } else if (route?.NoApplicationFound) {
    return <Exception message="No Application Found" />;
  } else if (route?.AccessDenied) {
    return <Exception message={window.RVDic.MSG.AccessDenied} />;
  } else if (route?.NullProfileException) {
    return <Exception message="Null Profile Exception" />;
  } else if (route?.RedirectToLogin) {
    dispatch(setIsAthunticated(false));
    setRVGlobal({ IsAuthenticated: false });
    return (
      <Redirect
        to={{
          pathname: AUTH_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToHome && location.pathname !== HOME_PATH) {
    return (
      <Redirect
        to={{
          pathname: HOME_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToProfile && location.pathname !== USER_PATH) {
    const path = route.RedirectToProfile;
    const isString = typeof path === 'string';
    return (
      <Redirect
        to={{
          pathname: isString ? `${USER_PATH}/${path}` : USER_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToTeams && location.pathname !== TEAMS_PATH) {
    return (
      <Redirect
        to={{
          pathname: TEAMS_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToChangePassword) {
    return (
      <Redirect
        to={{
          pathname: CHANGE_PASS_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToURL) {
    const url = route?.RedirectToURL;
    window.location.href = url;
  } else {
    return <Component {...props} route={route} />;
  }
};

export default CheckRoute;
