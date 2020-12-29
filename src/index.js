import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "components/RouteHandler";
import { AuthProvider } from "context/AuthProvider";
import MainLayout from "layouts/Main";
import Login from "views/Auth/Login";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Switch>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute path="/" component={MainLayout} />
        </Switch>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
