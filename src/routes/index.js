import { lazy } from 'react';
import NavbarRoutes from './Navbar.routes';
import SidebarRoutes from './Sidebar.routes';
const ErrorView = lazy(() => import('views/Error'));
const Login = lazy(() => import('views/Auth/Login'));
const NewNode = lazy(() => import('views/NewNode'));
const ChangePassword = lazy(() => import('views/ChangePassword'));

const routes = [
  {
    path: '/login',
    name: 'login',
    exact: true,
    hasNavSide: false,
    component: Login,
  },
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
