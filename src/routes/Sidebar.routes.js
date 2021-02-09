import { getURL } from 'helpers';
import ConfigRoutes from './Config.routes';
import Profile from 'views/Profile';
import Reports from 'views/Reports';
import Classes from 'views/Classes';

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
