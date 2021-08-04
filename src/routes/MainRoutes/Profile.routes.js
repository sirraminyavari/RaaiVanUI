import { lazy } from 'react';
import {
  USER_CUSTOMIZATION_PATH,
  USER_NAME,
  USER_SECURITY_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';

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

const profileRoutes = [
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
    path: USER_WITHID_PATH,
    name: USER_NAME,
    exact: true,
    hasNavSide: true,
    component: ProfileMainNew,
  },
];

export default profileRoutes;
