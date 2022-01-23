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
const WorkspaceUserManagementView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-view"*/ 'views/Teams/WorkspaceUserManagementView'
    )
  )
);
const WorkspacePlansView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-view"*/ 'views/Teams/WorkspacePlansView'
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
        <Route exact path={'/workspaces'} component={TeamsWorkspaceView} />
        <Route
          exact
          path={'/workspaces/remove/:id'}
          component={WorkspaceDeleteView}
        />
        <Route
          exact
          path={'/workspaces/settings/user-management/:id'}
          component={WorkspaceUserManagementView}
        />
        <Route
          exact
          path={'/workspaces/settings/plans/:id'}
          component={WorkspacePlansView}
        />
        <Redirect to={'/workspaces'} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default TeamsView;
