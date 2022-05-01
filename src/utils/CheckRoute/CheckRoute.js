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
  CLASSES_PATH,
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
// import { getUnderMenuPermissions } from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
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

const setLastLocation = (data, routeName, pathMatch) =>
  (window.__LastLocation = {
    location: window.location.pathname,
    search: window.location.search,
    data: data,
    routeName: routeName,
    pathMatch: pathMatch,
  });

const getLastLocation = () => window.__LastLocation || {};

const checkRouteAPI = API_Provider(RV_API, CHECK_ROUTE);

const CheckRoute = ({ component: Component, name, props, hasNavSide }) => {
  //! Get route permission object based on route name.
  const location = useLocation();
  const dispatch = useDispatch();
  const [route, setRoute] = useState({});
  const [isChecking, setIsChecking] = useState(true);
  const urlRef = useRef(window.location.href);
  const routeParams = useParams();
  const lastLocation = getLastLocation();

  const authPathList = [
    FORGOT_PASS_PATH,
    LOGIN_PATH,
    REGISTER_PATH,
    RESET_PASS_ADDRESS_PATH,
    RESET_PASS_PATH,
    VERIFICATION_PATH,
    VERIFY_RESET_PATH,
  ];

  //! A flag that indicates if the view is authentication page or not.
  const isAuthView = authPathList.includes(location.pathname);

  const isHomeView = location.pathname === HOME_PATH;
  const isUserView = location.pathname === USER_PATH;
  const isTeamsView = location.pathname === TEAMS_PATH;
  const isClassesView = location.pathname.toLowerCase().startsWith(CLASSES_PATH.toLowerCase());

  //check if free switching between previous and current routes is allowed
  const curPathMatch = props?.match?.path;
  const hasDynamicParam = (curPathMatch || '_').indexOf('/:') >= 0;

  const notSwitchableView = isClassesView;

  const isSwitchAllowed = !notSwitchableView &&
    (!hasDynamicParam ||
      curPathMatch !== lastLocation.pathMatch ||
      location.pathname === lastLocation.location) &&
    name === lastLocation?.routeName &&
    window.location.search === lastLocation.search;
  //end of: check if free switching between ...

  //! Provides query parameters for a given location.
  const getQueryParams = () => {
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
    if (isSwitchAllowed) return;

    const params = { ...routeParams, ...getQueryParams() };
    //! The location before check route api resolves.
    const prevURL = window.location.href;
    //! Set check route flag to true.
    setIsChecking(true);

    checkRouteAPI.fetch(
      { RouteName: name, Parameters: params },
      (response) => {
        //! The location after check route api resolves.
        const currentURL = window.location.href;
        //! Store current url in urlRef.
        urlRef.current = currentURL;
        //! If the location before and after check route api are same,
        //! then set check route flag to false and set route object.
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

  //! Do some changes when route object is set.
  useEffect(() => {
    //! If route object has application property, then set current application.
    if (route?.Application) {
      const application = {
        name: decodeBase64(route.Application.Title),
        id: route.Application.ApplicationID,
      };
      //! Set selected app.
      dispatch(setSelectedTeam(application));
      dispatch(setCurrentApp(route?.Application));
      //! Get configs based on current application.
      dispatch(getConfigPanels());
      // dispatch(getUnderMenuPermissions(['Reports']));
    }

    //! Reset team to null if user is authenticated but has not selected a team yet.
    if (route.IsAuthenticated && !route.AppID) {
      //! Close sidebar.
      dispatch(toggleSidebar(false));
      //! Clear selected team.
      dispatch(setSelectedTeam({ name: null, id: null }));
      dispatch(setCurrentApp(null));
      //! Reset sidebar content to default.
      dispatch(setSidebarContent({ current: MAIN_CONTENT, prev: '' }));
      //! Clear sidebar tree items.
      dispatch(setSidebarDnDTree({}));
    }

    //! Set active path on every route change.
    dispatch(setActivePath(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  useEffect(() => {
    //! The 'hasNavSide' is used to toggle navbar and sidebar.
    //! And user can change it for any route in the app(src/routes folder).
    dispatch(toggleNavSide(hasNavSide));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNavSide]);

  const showComponent = () => {
    let rut = isSwitchAllowed ? lastLocation.data : route;
    setLastLocation(rut, name, props?.match?.path);
    return <Component {...props} route={rut} />;
  };

  if (isSwitchAllowed) return showComponent();

  if (isChecking) {
    //! If check route api is still running, then show loader.
    return <LogoLoader />;
  } else if (route?.ServiceUnavailable) {
    //! If check route api is resolved and some exotic exception happens.
    return <Exception message="Service Unavailable" />;
  } else if (route?.NoApplicationFound) {
    return <Exception message="No Application Found" />;
  } else if (route?.AccessDenied) {
    return <Exception message={window.RVDic.MSG.AccessDenied} />;
  } else if (route?.NullProfileException) {
    return <Exception message="Null Profile Exception" />;
  } else if (route?.RedirectToLogin && !isAuthView) {
    //! If check route api is resolved and user is not authenticated, then redirect to login page.
    //! Also update redux state and RVGlobal object in window.
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
    //! If check route api is resolved and user is authenticated, then redirect to home page.
    return (
      <Redirect
        to={{
          pathname: HOME_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToProfile && !isUserView) {
    //! If check route api is resolved and user is authenticated, then redirect to profile page.
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
    //! If check route api is resolved and user is authenticated, then redirect to teams page.
    return (
      <Redirect
        to={{
          pathname: TEAMS_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToChangePassword) {
    //! If check route api is resolved and route object force user to change password page.
    return (
      <Redirect
        to={{
          pathname: CHANGE_PASS_PATH,
          state: { from: props.location },
        }}
      />
    );
  } else if (route?.RedirectToURL) {
    //! If check route api is resolved and route object force user to redirect to some url.
    const url = route?.RedirectToURL;
    window.location.href = url;
  } else {
    const isSameUrl = urlRef.current === window.location.href;
    if (!isSameUrl) {
      //! If url changed then show loader to get new route object.
      return <LogoLoader />;
    } else {
      //! At the end of all above checks, then render the component.
      return showComponent();
    }
  }
};

export default CheckRoute;
