import { lazy } from 'react';
import {
  DASHBOARD_NAME,
  DASHBOARD_PATH,
  DO_SEARCH_NAME,
  DO_SEARCH_PATH,
  HELP_NAME,
  HELP_PATH,
  HOME_NAME,
  HOME_PATH,
  MESSAGES_NAME,
  MESSAGES_PATH,
  TEAMS_NAME,
  TEAMS_PATH,
} from 'constant/constants';

const Teams = lazy(() =>
  import(/* webpackChunkName: "teams-view"*/ 'views/Teams/Teams')
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
const SearchOld = lazy(() =>
  import(/* webpackChunkName: "search-view"*/ 'views/Search/SearchOld')
);
const SearchView = lazy(() =>
  import(/* webpackChunkName: "search-view"*/ 'views/Search/SearchView')
);
const HelpMe = lazy(() =>
  import(/* webpackChunkName: "helpme-view"*/ 'views/HelpMe/HelpMe')
);

const NavbarRoutes = [
  {
    path: TEAMS_PATH,
    name: TEAMS_NAME,
    exact: true,
    hasNavSide: true,
    component: Teams,
  },
  {
    path: HOME_PATH,
    name: HOME_NAME,
    exact: true,
    hasNavSide: true,
    component: Home,
  },
  {
    path: MESSAGES_PATH,
    name: MESSAGES_NAME,
    exact: true,
    hasNavSide: true,
    component: Messages,
  },
  {
    path: DASHBOARD_PATH,
    name: DASHBOARD_NAME,
    exact: true,
    hasNavSide: true,
    component: Dashboard,
  },
  // {
  //   path: DO_SEARCH_PATH,
  //   name: DO_SEARCH_NAME,
  //   exact: true,
  //   hasNavSide: true,
  //   component: Search,
  // },
  {
    path: DO_SEARCH_PATH,
    name: DO_SEARCH_NAME,
    exact: true,
    hasNavSide: true,
    component: SearchView,
  },
  {
    path: HELP_PATH,
    name: HELP_NAME,
    exact: true,
    hasNavSide: true,
    component: HelpMe,
  },
];

export default NavbarRoutes;
