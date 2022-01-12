import { useEffect, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';

const TeamsWorkspaceView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-view"*/ 'views/Teams/WorkspaceView'
    )
  )
);
const WorkspaceDeleteView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-view"*/ 'views/Teams/WorkspaceDeleteView'
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
      <TransitionSwitchWrapper>
        <Route exact path={'/teams'} component={TeamsWorkspaceView} />
        <Route
          exact
          path={'/teams/remove-workspace/:id'}
          component={WorkspaceDeleteView}
        />
        <Redirect to={'/teams'} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default TeamsView;
