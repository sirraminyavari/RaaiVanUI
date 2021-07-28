import { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect, useParams } from 'react-router-dom';
import {
  MAIN_CONTENT,
  PROFILE_CONTENT,
  USER_CUSTOMIZATION_PATH,
  USER_MAIN_PATH,
  USER_SECURITY_PATH,
} from 'constant/constants';
import { themeSlice } from 'store/reducers/themeReducer';
import profileRoutes from 'routes/MainRoutes/Profile.routes';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const { setSidebarContent } = themeSlice.actions;

const ProfileNew = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const switchProfileRoutes = (
    <Switch>
      {profileRoutes.map((route, key) => {
        const { exact, path, component } = route;
        if (
          !['main', 'security', 'customization'].includes(params?.uid) &&
          !!params?.uid
        ) {
          return <Redirect to={`/user/${params?.uid}`} />;
        }
        return (
          <Route key={key} exact={exact} path={path} component={component} />
        );
      })}
      <Redirect to={USER_MAIN_PATH} />;
    </Switch>
  );

  useEffect(() => {
    dispatch(
      setSidebarContent({
        current: PROFILE_CONTENT,
        prev: MAIN_CONTENT,
      })
    );

    return () => {
      //! If user still is on profile section, Don't change the sidebar content.
      if (
        [USER_MAIN_PATH, USER_SECURITY_PATH, USER_CUSTOMIZATION_PATH].includes(
          window.location.pathname
        )
      )
        return;

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
