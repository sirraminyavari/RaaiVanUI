import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "components/RouteHandler";
import MasterLayout from "layouts/Master";
import Login from "views/Auth/Login";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <PublicRoute exact path="/login" component={Login} />
        <PrivateRoute path="/" component={MasterLayout} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
