import Teams from 'views/Teams/Teams';
import Home from 'views/Home/Home';
import Messages from 'views/Messages';
import Dashboard from 'views/Dashboard';
import AdvancedSearch from 'views/AdvancedSearch';
import Search from 'views/Search';
import { getURL } from 'helpers';

const NavbarRoutes = [
  {
    path: getURL('Applications'),
    name: 'teams',
    exact: true,
    hasNavSide: true,
    component: Teams,
  },
  {
    path: getURL('Home'),
    name: 'home',
    exact: true,
    hasNavSide: true,
    component: Home,
  },
  {
    path: getURL('Messages'),
    name: 'messages',
    exact: true,
    hasNavSide: true,
    component: Messages,
  },
  {
    path: getURL('Dashboard'),
    name: 'dashboard',
    exact: true,
    hasNavSide: true,
    component: Dashboard,
  },
  {
    path: getURL('Classes'),
    name: 'advanced_search',
    exact: true,
    hasNavSide: true,
    component: AdvancedSearch,
  },
  {
    path: '/dosearch/:searchtext',
    name: 'search',
    exact: true,
    hasNavSide: true,
    component: Search,
  },
];

export default NavbarRoutes;
