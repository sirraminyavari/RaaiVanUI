import { lazy } from 'react';
import ConfigRoutes from './Config.routes';
import {
  CLASSES_NAME,
  CLASSES_PATH,
  CLASSES_WITHID_PATH,
  REPORTS_NAME,
  REPORTS_PATH,
  USER_NAME,
  USER_WITHID_PATH,
  TEAM_SETTINGS_PATH,
  TEAM_SETTINGS_NAME,
} from 'constant/constants';

const Profile = lazy(() =>
  import(/* webpackChunkName: "profile-main-view"*/ 'views/Profile/Profile')
);
// const ProfileOld = lazy(() =>
//   import(/* webpackChunkName: "profile-main-view"*/ 'views/Profile/Profile')
// );
const Reports = lazy(() =>
  import(/* webpackChunkName: "reports-view"*/ 'views/Reports/Reports')
);
const Classes = lazy(() =>
  import(/* webpackChunkName: "classes-view"*/ 'views/Classes/Classes')
);
const TeamSettings = lazy(() =>
  import(
    /* webpackChunkName: "team-settings-view"*/ 'views/TeamSettings/TeamSettings'
  )
);

const SidebarRoutes = [
  ...ConfigRoutes,
  {
    path: REPORTS_PATH,
    name: REPORTS_NAME,
    exact: true,
    hasNavSide: true,
    component: Reports,
  },
  {
    path: USER_WITHID_PATH,
    name: USER_NAME,
    exact: false,
    hasNavSide: true,
    component: Profile,
  },
  {
    path: CLASSES_WITHID_PATH,
    name: CLASSES_NAME,
    exact: true,
    hasNavSide: true,
    component: Classes,
  },
  {
    path: CLASSES_PATH,
    name: CLASSES_NAME,
    exact: true,
    hasNavSide: true,
    component: Classes,
  },
  {
    path: TEAM_SETTINGS_PATH,
    name: TEAM_SETTINGS_NAME,
    exact: true,
    hasNavSide: true,
    component: TeamSettings,
  },
];

export default SidebarRoutes;
