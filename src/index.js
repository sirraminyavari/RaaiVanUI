import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "utils/RouteHandler";
import { RVGlobalProvider } from "context/RVGlobalProvider";
import { ThemeProvider } from "context/ThemeProvider";
import MainLayout from "layouts/Main";
import Login from "views/Auth/Login";

render(
  <React.StrictMode>
    <RVGlobalProvider>
      <ThemeProvider>
        <Router>
          <Switch>
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute path="/" component={MainLayout} />
          </Switch>
        </Router>
      </ThemeProvider>
    </RVGlobalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
