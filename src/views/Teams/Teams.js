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
const WorkspaceSettingsView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-view"*/ 'views/Teams/WorkspaceSettingsView'
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
          path={'/teams/workspace/remove/:id'}
          component={WorkspaceDeleteView}
        />
        <Route
          exact
          path={'/teams/workspace/settings/:id'}
          component={WorkspaceSettingsView}
        />
        <Redirect to={'/teams'} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default TeamsView;
