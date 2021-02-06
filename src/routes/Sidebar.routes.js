import { getURL } from 'helpers';
import ConfigRoutes from './Config.routes';
import Profile from 'views/Profile';
import Reports from 'views/Reports';

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
];

export default SidebarRoutes;
