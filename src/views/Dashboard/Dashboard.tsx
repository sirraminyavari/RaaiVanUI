import { FunctionComponent, lazy } from 'react';
import WithSuspense from 'components/WithSuspense/WithSuspense';
import { Redirect, Route } from 'react-router-dom';
import TransitionSwitchWrapper from 'utils/RouteHandler/TransitionSwitchWrapper';
import {
  DASHBOARD_OLD_PATH,
  DASHBOARD_PATH,
  DASHBOARD_DONE_PATH,
  DASHBOARD_TO_BE_DONE_PATH,
  DASHBOARD_REQUEST_PATH,
} from './items/others/constants';

//TODO a permanent fix is needed for the  () => JSX.Element type accepted by <Route/> component ...

const DashboardView: FunctionComponent = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "dashboard-view"*/ 'views/Dashboard/DashboardView'
      )
  )
);
const DashboardOldView: FunctionComponent = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "dashboard-old-view"*/ 'views/Dashboard/Dashboard-old'
      )
  )
);
const DashboardDoneView: FunctionComponent = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "dashboard-done-view"*/ 'views/Dashboard/DashboardDoneView'
      )
  )
);
const DashboardToBeDoneView: FunctionComponent = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "dashboard-done-view"*/ 'views/Dashboard/DashboardToBeDoneView'
      )
  )
);
const DashboardRequestView: FunctionComponent = WithSuspense(
  lazy(
    () =>
      import(
        /* webpackChunkName: "dashboard-request-view"*/ 'views/Dashboard/DashboardRequestView'
      )
  )
);

const OnboardingView = () => {
  return (
    <>
      <TransitionSwitchWrapper>
        <Route exact path={DASHBOARD_OLD_PATH} component={DashboardOldView} />
        <Route exact path={DASHBOARD_PATH} component={DashboardView} />
        <Route exact path={DASHBOARD_DONE_PATH} component={DashboardDoneView} />
        <Route
          exact
          path={DASHBOARD_REQUEST_PATH}
          component={DashboardRequestView}
        />
        <Route
          exact
          path={DASHBOARD_TO_BE_DONE_PATH}
          component={DashboardToBeDoneView}
        />
        <Redirect to={DASHBOARD_PATH} />
      </TransitionSwitchWrapper>
    </>
  );
};

export default OnboardingView;
