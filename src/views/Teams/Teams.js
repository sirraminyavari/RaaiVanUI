import { useEffect, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import { MAIN_CONTENT, SETT_WORKSPACE_CONTENT } from 'constant/constants';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import {
  WORKSPACES_PATH,
  WORKSPACE_ACCOUNT_MANAGEMENT_PATH,
  WORKSPACE_INVOICE_PATH,
  WORKSPACE_PLANS_PATH,
  WORKSPACE_REMOVE_PATH,
  WORKSPACE_USER_MANAGEMENT_PATH,
} from './items/others/constants';
import { useThemeSlice } from 'store/slice/theme';

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

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

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

  /**
   * ! paths defined for routes [WorkspaceUserManagementView, WorkspacePlansView, WorkspaceAccountManagementView] should be consistent with paths defined in src/layouts/Sidebar/items/openSubContents/setting/items/workspace/WorkspaceContent
   */
  return (
    <>
      <TransitionSwitchWrapper>
        <Route exact path={WORKSPACES_PATH} component={TeamsWorkspaceView} />
        <Route
          exact
          path={`${WORKSPACE_REMOVE_PATH}/:id`}
          component={WorkspaceDeleteView}
        />
        <Route
          exact
          path={`${WORKSPACE_USER_MANAGEMENT_PATH}/:id`}
          component={WorkspaceUserManagementView}
        />
        <Route
          exact
          path={`${WORKSPACE_INVOICE_PATH}/:id`}
          component={WorkspaceInvoiceView}
        />
        <Route
          exact
          path={`${WORKSPACE_PLANS_PATH}/:id`}
          component={WorkspacePlansView}
        />
        <Route
          exact
          path={`${WORKSPACE_ACCOUNT_MANAGEMENT_PATH}/:id`}
          component={WorkspaceAccountManagementView}
        />
        <Redirect to={WORKSPACES_PATH} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default TeamsView;
