import { lazy } from 'react';
import NavbarRoutes from './Navbar.routes';
import SidebarRoutes from './Sidebar.routes';
const ErrorView = lazy(() =>
  import(/* webpackChunkName: "error-view"*/ 'views/Error/ErrorView')
);
const NewNode = lazy(() =>
  import(/* webpackChunkName: "new-node-view"*/ 'views/NewNode/NewNode')
);
const ChangePassword = lazy(() =>
  import(
    /* webpackChunkName: "change-password-view"*/ 'views/ChangePassword/ChangePassword'
  )
);

const routes = [
  ...NavbarRoutes,
  ...SidebarRoutes,
  {
    path: '/error/:code',
    name: 'error',
    exact: true,
    hasNavSide: false,
    component: ErrorView,
  },
  {
    path: '/changepassword',
    name: 'changepassword',
    exact: true,
    hasNavSide: true,
    component: ChangePassword,
  },
  {
    path: '/newnode/:id',
    name: 'newnode',
    exact: true,
    hasNavSide: true,
    component: NewNode,
  },
];

export default routes;
