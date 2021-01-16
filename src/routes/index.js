import Profile from "views/Profile/Profile";
import Teams from "views/Teams/Teams";
import Home from "views/Home/Home";
import Messages from "views/Messages/Messages";
import Dashboard from "views/Dashboard/Dashboard";
import { getURL } from "helpers";

const routes = [
  {
    path: getURL("User"),
    name: "ProfilePage",
    exact: true,
    component: Profile,
  },
  {
    path: getURL("Applications"),
    name: "TeamsPage",
    exact: true,
    component: Teams,
  },
  {
    path: getURL("Home"),
    name: "HomePage",
    exact: true,
    component: Home,
  },
  {
    path: getURL("Messages"),
    name: "Messages",
    exact: true,
    component: Messages,
  },
  {
      path: getURL("Dashboard"),
      name: "Dashboard",
      exact: true,
      component: Dashboard
  }
];

export default routes;