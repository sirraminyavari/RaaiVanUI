import { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import WithSuspense from 'components/WithSuspense/WithSuspense';

const TeamsWorkspaceView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-view"*/ 'views/Teams/WorkspaceView'
    )
  )
);

const TeamsView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApplications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TeamsWorkspaceView />
    </>
  );
};

export default TeamsView;
