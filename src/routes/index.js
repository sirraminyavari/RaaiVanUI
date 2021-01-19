import Profile from "views/Profile/Profile";
import Teams from "views/Teams/Teams";
import Home from "views/Home/Home";
import Messages from "views/Messages/Messages";
import Dashboard from "views/Dashboard/Dashboard";
import ErrorView from "views/Error/Error";
import ChangePassword from "views/ChangePassword/ChangePassword";
import NewNode from "views/NewNode/NewNode";
import Configuration from "views/Settings/Configuration";
import SystemSettings from "views/Settings/SystemSettings";
import Users from "views/Settings/Users";
import { getURL } from "helpers";

const routes = [
  {
    path: getURL("User"),
    name: "profile",
    exact: true,
    component: Profile,
  },
  {
    path: getURL("User") + "/:uid",
    name: "profile",
    exact: true,
    component: Profile,
  },
  {
    path: getURL("Applications"),
    name: "teams",
    exact: true,
    component: Teams,
  },
  {
    path: getURL("Home"),
    name: "home",
    exact: true,
    component: Home,
  },
  {
    path: getURL("Messages"),
    name: "messages",
    exact: true,
    component: Messages,
  },
  {
    path: getURL("Dashboard"),
    name: "dashboard",
    exact: true,
    component: Dashboard,
  },
  {
    path: "/error/:code",
    name: "error",
    exact: true,
    component: ErrorView,
  },
  {
    path: "/changepassword",
    name: "changepassword",
    exact: true,
    component: ChangePassword,
  },
  {
    path: "/newnode/:id",
    name: "newnode",
    exact: true,
    component: NewNode,
  },
  {
    path: "/configuration",
    name: "admin_configuration",
    exact: true,
    component: Configuration,
  },
  {
    path: "/configuration/systemsettings",
    name: "admin_systemsettings",
    exact: true,
    component: SystemSettings,
  },
  {
    path: "/configuration/users",
    name: "admin_users",
    exact: true,
    component: Users,
  }
];

export default routes;
