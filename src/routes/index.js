import Profile from "views/Profile/Profile";
import Teams from "views/Teams/Teams";
import Home from "views/Home/Home";

const routes = [
  {
    path: "/profile",
    name: "ProfilePage",
    exact: true,
    component: Profile,
  },
  {
    path: "/teams",
    name: "TeamsPage",
    exact: true,
    component: Teams,
  },
  {
    path: "/home",
    name: "HomePage",
    exact: true,
    component: Home,
  },
];

export default routes;