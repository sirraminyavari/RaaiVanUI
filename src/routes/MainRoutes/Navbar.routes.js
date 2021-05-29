import { getURL } from 'helpers/helpers';
import { lazy } from 'react';
const Teams = lazy(() =>
  import(/* webpackChunkName: "teams-view"*/ 'views/Teams/Teams-new')
);
const Home = lazy(() =>
  import(/* webpackChunkName: "home-view"*/ 'views/Home/Home')
);
const Messages = lazy(() =>
  import(/* webpackChunkName: "messages-view"*/ 'views/Messages/Messages')
);
const Dashboard = lazy(() =>
  import(/* webpackChunkName: "dashboard-view"*/ 'views/Dashboard/Dashboard')
);
const Search = lazy(() =>
  import(/* webpackChunkName: "search-view"*/ 'views/Search/Search')
);

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
    path: '/dosearch/:searchtext',
    name: 'search',
    exact: true,
    hasNavSide: true,
    component: Search,
  },
];

export default NavbarRoutes;
