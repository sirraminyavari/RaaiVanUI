import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "utils/RouteHandler";
import { RVGlobalProvider } from "context/RVGlobalProvider";
import MainLayout from "layouts/Main";
import Login from "views/Auth/Login";

ReactDOM.render(
  <React.StrictMode>
    <RVGlobalProvider>
      <Router>
        <Switch>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute path="/" component={MainLayout} />
        </Switch>
      </Router>
    </RVGlobalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
