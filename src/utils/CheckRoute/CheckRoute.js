/**
 * Check permissions for given route.
 * ... Show a component or redirect to a route based on authorization.
 */
import { useEffect, useState, useRef } from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Exception from 'components/Exception/Exception';
import { themeSlice } from 'store/reducers/themeReducer';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { loginSlice } from 'store/reducers/loginReducer';
import { decodeBase64, setRVGlobal } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import {
  CHANGE_PASS_PATH,
  FORGOT_PASS_PATH,
  HOME_PATH,
  LOGIN_PATH,
  MAIN_CONTENT,
  REGISTER_PATH,
  RESET_PASS_ADDRESS_PATH,
  RESET_PASS_PATH,
  TEAMS_PATH,
  USER_PATH,
  VERIFICATION_PATH,
  VERIFY_RESET_PATH,
} from 'constant/constants';
import {
  getSidebarNodes,
  getUnderMenuPermissions,
} from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
// import useQuery from 'hooks/useQuery';
import { API_Provider } from 'helpers/helpers';
import { CHECK_ROUTE, RV_API } from 'constant/apiConstants';

const { setIsAthunticated } = loginSlice.actions;
const { setCurrentApp } = ApplicationsSlice.actions;
const { setSidebarDnDTree } = sidebarMenuSlice.actions;
const {
  toggleNavSide,
  setSelectedTeam,
  setActivePath,
  setSidebarContent,
  toggleSidebar,
} = themeSlice.actions;

const checkRouteAPI = API_Provider(RV_API, CHECK_ROUTE);

const CheckRoute = ({ component: Component, name, props, hasNavSide }) => {
  //! Get route permission object based on route name.
  const location = useLocation();
  const dispatch = useDispatch();
  const [route, setRoute] = useState({});
  const [isChecking, setIsChecking] = useState(true);
  const urlRef = useRef(window.location.href);
  const routeParams = useParams();
  // const queryParams = useQuery();
  // console.count('Check-route: ');

  const getQuery = () => {
    const queryAll = new URLSearchParams(location.search).toString();
    const queryList = queryAll.split('&');
    const qr = queryList.reduce((prev, q) => {
      let arr = q.split('=');
      let key = arr[0];
      let value = arr[1];
      return { ...prev, [key]: value };
    }, {});

    return queryAll.length !== 0 ? qr : {};
  };

  useEffect(() => {
    // console.count('Check-route-API: ');
    const params = { ...routeParams, ...getQuery() };
    const prevURL = window.location.href;

    setIsChecking(true);

    checkRouteAPI.fetch(
      { RouteName: name, Parameters: params },
      (response) => {
        const currentURL = window.location.href;
        urlRef.current = currentURL;
        prevURL === currentURL && setRoute(response);
        setIsChecking(false);
      },
      (error) => {
        console.log(error);
        setIsChecking(false);
      }
    );

    //? Due to memory leak error in check route.
    //! Clean up.
    return () => {
      setRoute({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.href]);

  useEffect(() => {
    //! Set selected team.
    if (route?.Application) {
      const application = {
        name: decodeBase64(route.Application.Title),
        id: route.Application.ApplicationID,
      };
      dispatch(setSelectedTeam(application));
      dispatch(setCurrentApp(route?.Application));
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
      dispatch(setCurrentApp(null));
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

  const isAuthView = [
    FORGOT_PASS_PATH,
    LOGIN_PATH,
    REGISTER_PATH,
    RESET_PASS_ADDRESS_PATH,
    RESET_PASS_PATH,
    VERIFICATION_PATH,
    VERIFY_RESET_PATH,
  ].includes(location.pathname);

  const isHomeView = location.pathname === HOME_PATH;
  const isUserView = location.pathname === USER_PATH;
  const isTeamsView = location.pathname === TEAMS_PATH;

  if (isChecking) {
    return <LogoLoader />;
  } else if (route?.ServiceUnavailable) {
    return <Exception message="Service Unavailable" />;
  } else if (route?.NoApplicationFound) {
    return <Exception message="No Application Found" />;
  } else if (route?.AccessDenied) {
    return <Exception message={window.RVDic.MSG.AccessDenied} />;
  } else if (route?.NullProfileException) {
    return <Exception message="Null Profile Exception" />;
  } else if (route?.RedirectToLogin && !isAuthView) {
    dispatch(setIsAthunticated(false));
    setRVGlobal({ IsAuthenticated: false });
    return (
      <Redirect
        to={{
          pathname: LOGIN_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToHome && !isHomeView) {
    return (
      <Redirect
        to={{
          pathname: HOME_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToProfile && !isUserView) {
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
  } else if (route?.RedirectToTeams && !isTeamsView) {
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
    const isUrlChanged = urlRef.current === window.location.href;
    if (!isUrlChanged) {
      return <LogoLoader />;
    } else {
      // console.count('Page-mount-count: ');
      return <Component {...props} route={route} />;
    }
  }
};

export default CheckRoute;
