import React from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import Routes from "routes";

const switchRoutes = (
  <Switch>
    {Routes.map((route, key) => {
      return (
        <Route
          exact={route.exact}
          path={route.path}
          component={route.component}
          key={key}
        />
      );
    })}
  </Switch>
);

const Main = () => {
  return (
    <>
      <div>
        <ul>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/teams">Teams</NavLink>
          </li>
        </ul>
      </div>
      {switchRoutes}
    </>
  );
};

export default Main;
