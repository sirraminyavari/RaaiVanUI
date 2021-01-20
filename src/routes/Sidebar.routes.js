import { getURL } from "helpers";
import ConfigRoutes from "./Config.routes";
import Profile from "views/Profile";

const SidebarRoutes = [
  ...ConfigRoutes,
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
];

export default SidebarRoutes;
