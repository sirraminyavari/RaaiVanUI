import { lazy } from 'react';
import { getURL } from 'helpers/helpers';
import ConfigRoutes from './Config.routes';
const Profile = lazy(() =>
  import(
    /* webpackChunkName: "profile-view"*/ 'views/Profile/items/customization/Profile-Customization'
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
    path: getURL('Reports'),
    name: 'reports',
    exact: true,
    hasNavSide: true,
    component: Reports,
  },
  {
    path: getURL('User'),
    name: 'profile',
    exact: true,
    hasNavSide: true,
    component: Profile,
  },
  {
    path: getURL('User') + '/:uid',
    name: 'profile',
    exact: true,
    hasNavSide: true,
    component: Profile,
  },
  {
    path: getURL('Classes') + '/:id',
    name: 'advanced_search',
    exact: true,
    hasNavSide: true,
    component: Classes,
  },
  {
    path: getURL('Classes'),
    name: 'advanced_search',
    exact: true,
    hasNavSide: true,
    component: Classes,
  },
];

export default SidebarRoutes;
