import NavbarRoutes from './Navbar.routes';
import SidebarRoutes from './Sidebar.routes';
import ErrorView from 'views/Error';
import NewNode from 'views/NewNode';
import ChangePassword from 'views/ChangePassword';

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
