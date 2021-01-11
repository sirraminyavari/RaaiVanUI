import Profile from "views/Profile/Profile";
import Teams from "views/Teams/Teams";
import Home from "views/Home/Home";
import {getURL} from "helpers";

const routes = [
  {
    path: getURL('User'),
    name: "ProfilePage",
    exact: true,
    component: Profile,
  },
  {
    path: getURL('Applications'),
    name: "TeamsPage",
    exact: true,
    component: Teams,
  },
  {
    path: getURL('Home'),
    name: "HomePage",
    exact: true,
    component: Home,
  },
];

export default routes;