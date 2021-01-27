import ErrorView from 'views/Error';
import ChangePassword from 'views/ChangePassword';
import NewNode from 'views/NewNode';
import NavbarRoutes from './Navbar.routes';
import SidebarRoutes from './Sidebar.routes';

const routes = [
  ...NavbarRoutes,
  ...SidebarRoutes,
  {
    path: '/error/:code',
    name: 'error',
    exact: true,
    component: ErrorView,
  },
  {
    path: '/changepassword',
    name: 'changepassword',
    exact: true,
    component: ChangePassword,
  },
  {
    path: '/newnode/:id',
    name: 'newnode',
    exact: true,
    component: NewNode,
  },
];

export default routes;
