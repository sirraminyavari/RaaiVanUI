import React from "react";
import { Route, Switch} from "react-router-dom";
import Routes from "routes";

const getRoutes = () => {
  return (
    <Switch>
      {Routes.map((route) => {
        return (
          <Route
            key={route.name}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        );
      })}
    </Switch>
  );
};

const App = () => {
  return (
    <>
      {getRoutes()}
    </>
  );
};

export default App;
