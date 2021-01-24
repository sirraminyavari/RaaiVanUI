import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "utils/RouteHandler";
import { Provider } from "react-redux";
import { RVGlobalProvider } from "context/RVGlobalProvider";
import { ThemeProvider } from "context/ThemeProvider";
import store from "store";
import MainLayout from "layouts/Main";
import Login from "views/Auth/Login";

render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
