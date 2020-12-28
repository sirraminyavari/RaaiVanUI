import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
} from "react-router-dom";
import Routes from "./routes";

const getRoutes = () => {
  return Routes.map((route) => {
    return (
      <Route
        key={route.name}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    );
  });
};

const App = () => {
  return (
    <div>
      <Router basename="/ui">
        <div>
          <NavLink to="/">Home</NavLink>
        </div>
        <div>
          <NavLink to="/test">Test</NavLink>
        </div>
        <Switch>{getRoutes()}</Switch>
      </Router>
    </div>
  );
};

export default App;
