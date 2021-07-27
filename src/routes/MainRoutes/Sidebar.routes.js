import { lazy } from 'react';
import ConfigRoutes from './Config.routes';
import {
  CLASSES_NAME,
  CLASSES_PATH,
  CLASSES_WITHID_PATH,
  REPORTS_NAME,
  REPORTS_PATH,
  USER_CUSTOMIZATION_PATH,
  USER_NAME,
  USER_PATH,
  USER_SECURITY_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';

const ProfileMain = lazy(() =>
  import(/* webpackChunkName: "profile-main-view"*/ 'views/Profile/Profile')
);
const ProfileMainNew = lazy(() =>
  import(
    /* webpackChunkName: "profile-main-view"*/ 'views/Profile/items/main/Profile-Main'
  )
);
const ProfileSecurity = lazy(() =>
  import(
    /* webpackChunkName: "profile-security-view"*/ 'views/Profile/items/security/Profile-Security'
  )
);
const ProfileCustomization = lazy(() =>
  import(
    /* webpackChunkName: "profile-customization-view"*/ 'views/Profile/items/customization/Profile-Customization'
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
    component: ProfileMain,
  },
  {
    path: '/user/new',
    name: USER_NAME,
    exact: true,
    hasNavSide: true,
    component: ProfileMainNew,
  },
  {
    path: USER_WITHID_PATH,
    name: USER_NAME,
    exact: true,
    hasNavSide: true,
    component: ProfileMain,
  },
  {
    path: USER_SECURITY_PATH,
    name: USER_NAME,
    exact: true,
    hasNavSide: true,
    component: ProfileSecurity,
  },
  {
    path: USER_CUSTOMIZATION_PATH,
    name: USER_NAME,
    exact: true,
    hasNavSide: true,
    component: ProfileCustomization,
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
