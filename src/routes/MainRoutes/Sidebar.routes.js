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
} from 'constant/constants';

const ProfileNew = lazy(() =>
  import(/* webpackChunkName: "profile-main-view"*/ 'views/Profile/ProfileNew')
);
const Reports = lazy(() =>
  import(/* webpackChunkName: "reports-view"*/ 'views/Reports/Reports')
);
const Classes = lazy(() =>
  import(/* webpackChunkName: "classes-view"*/ 'views/Classes/Classes')
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
    exact: true,
    hasNavSide: true,
    component: ProfileNew,
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
];

export default SidebarRoutes;
