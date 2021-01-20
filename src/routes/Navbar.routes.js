import Teams from "views/Teams/Teams";
import Home from "views/Home/Home";
import Messages from "views/Messages";
import Dashboard from "views/Dashboard";
import AdvancedSearch from "views/AdvancedSearch";
import { getURL } from "helpers";

const NavbarRoutes = [
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
    path: getURL("Classes"),
    name: "advanced_search",
    exact: true,
    component: AdvancedSearch,
  },
];

export default NavbarRoutes;