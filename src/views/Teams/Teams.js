import { useEffect, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import { themeSlice } from 'store/reducers/themeReducer';
import { MAIN_CONTENT, SETT_WORKSPACE_CONTENT } from 'constant/constants';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
const { setSidebarContent } = themeSlice.actions;

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
      /* webpackChunkName: "teams-workspace-delete-view"*/ 'views/Teams/WorkspaceDeleteView'
    )
  )
);
const WorkspaceUserManagementView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-user-management-view"*/ 'views/Teams/WorkspaceUserManagementView'
    )
  )
);
const WorkspacePlansView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-plans-view"*/ 'views/Teams/WorkspacePlansView'
    )
  )
);
const WorkspaceAccountManagementView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-account-management-view"*/ 'views/Teams/WorkspaceAccountManagementView'
    )
  )
);
const WorkspaceInvoiceView = WithSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "teams-workspace-invoice-view"*/ 'views/Teams/WorkspaceInvoiceView'
    )
  )
);

const TeamsView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getApplications());

    //! Set sidebar content for all sub-routes
    dispatch(
      setSidebarContent({
        current: SETT_WORKSPACE_CONTENT,
        prev: MAIN_CONTENT,
      })
    );
    return () => {
      dispatch(
        setSidebarContent({
          prev: SETT_WORKSPACE_CONTENT,
          current: MAIN_CONTENT,
        })
      );
    };
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
        <Route
          exact
          path={'/workspaces/settings/plans/invoice/:id'}
          component={WorkspaceInvoiceView}
        />
        <Route
          exact
          path={'/workspaces/settings/account-management/:id'}
          component={WorkspaceAccountManagementView}
        />
        <Redirect to={'/workspaces'} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default TeamsView;
