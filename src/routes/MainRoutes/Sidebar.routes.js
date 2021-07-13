import { lazy } from 'react';
import ConfigRoutes from './Config.routes';
import {
  CLASSES_NAME,
  CLASSES_PATH,
  CLASSES_WITHID_PATH,
  REPORTS_NAME,
  REPORTS_PATH,
  USER_NAME,
  USER_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';

const Profile = lazy(() =>
  import(
    /* webpackChunkName: "profile-view"*/ 'views/Profile/items/main/Profile-Main'
  )
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
    path: USER_PATH,
    name: USER_NAME,
    exact: true,
    hasNavSide: true,
    component: Profile,
  },
  {
    path: USER_WITHID_PATH,
    name: USER_NAME,
    exact: true,
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
];

export default SidebarRoutes;
