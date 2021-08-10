import { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  MAIN_CONTENT,
  PROFILE_CONTENT,
  USER_CUSTOMIZATION_PATH,
  USER_MORE_RELATED_TOPICS_PATH,
  USER_PATH,
  USER_SECURITY_PATH,
} from 'constant/constants';
import { themeSlice } from 'store/reducers/themeReducer';
import profileRoutes from 'routes/MainRoutes/Profile.routes';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const { setSidebarContent } = themeSlice.actions;

const ProfileNew = (props) => {
  const { route } = props;
  const dispatch = useDispatch();

  const userId = props?.match?.params?.uid;
  const pathName = props?.location?.pathname;

  const isProfileOwner = route?.IsOwnPage;
  const isValidProfilePath = [
    USER_SECURITY_PATH,
    USER_CUSTOMIZATION_PATH,
  ].includes(pathName);

  const isRelatedMeTopicsPath = pathName.includes(
    USER_MORE_RELATED_TOPICS_PATH
  );

  const switchProfileRoutes = (
    <Switch>
      {profileRoutes.map((PR, key) => {
        const { exact, path, component: Component } = PR;

        if (
          !!userId &&
          !isValidProfilePath &&
          !isRelatedMeTopicsPath &&
          isProfileOwner
        ) {
          return <Redirect key={key} to={USER_PATH} />;
        }

        return (
          <Route
            key={key}
            exact={exact}
            path={path}
            render={(props) => <Component {...props} route={route} />}
          />
        );
      })}
      <Redirect to={USER_PATH} />
    </Switch>
  );

  const showProfileMenu = [
    USER_PATH,
    USER_CUSTOMIZATION_PATH,
    USER_SECURITY_PATH,
  ].includes(window?.location?.pathname);

  useEffect(() => {
    if (
      window?.location?.pathname.includes(USER_MORE_RELATED_TOPICS_PATH) &&
      userId
    )
      return;

    if (isProfileOwner) {
      dispatch(
        setSidebarContent({
          current: PROFILE_CONTENT,
          prev: MAIN_CONTENT,
        })
      );
    } else {
      dispatch(
        setSidebarContent({
          current: MAIN_CONTENT,
          prev: PROFILE_CONTENT,
        })
      );
    }

    return () => {
      //! If user still is on auth profile section, Don't change the sidebar content.
      if (showProfileMenu) return;

      dispatch(
        setSidebarContent({
          current: MAIN_CONTENT,
          prev: PROFILE_CONTENT,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Suspense fallback={<LogoLoader />}>{switchProfileRoutes}</Suspense>;
};

export default ProfileNew;
