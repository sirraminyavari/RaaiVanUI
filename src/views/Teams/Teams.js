import { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import { MOBILE_BOUNDRY } from 'constant/constants';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const TeamsDesktopView = lazy(() =>
  import(/* webpackChunkName: "teams-desktop-view"*/ 'views/Teams/DesktopView')
);

const TeamsMobileView = lazy(() =>
  import(/* webpackChunkName: "teams-desktop-view"*/ 'views/Teams/MobileView')
);

const TeamsView = () => {
  const dispatch = useDispatch();

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  useEffect(() => {
    dispatch(getApplications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<LogoLoader />}>
      {isMobileScreen ? <TeamsMobileView /> : <TeamsDesktopView />}
    </Suspense>
  );
};

export default TeamsView;
