import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "utils/RouteHandler";
import { Provider } from "react-redux";
import store from "store";
import Spinner from "components/Spinner";
import ErrorBoundry from "components/ErrorBoundry/ErrorBoundry";

//TODO: Move to redux Provider
import { RVGlobalProvider } from "context/RVGlobalProvider";
import { ThemeProvider } from "context/ThemeProvider";

const MainLayout = lazy(() => import("layouts/Main"));
const Login = lazy(() => import("views/Auth/Login"));

render(
  <React.StrictMode>
    <Provider store={store}>
      <RVGlobalProvider>
        <ThemeProvider>
          <ErrorBoundry>
            <Suspense fallback={<Spinner />}>
              <Router>
                <Switch>
                  <PublicRoute exact path="/login" component={Login} />
                  <PrivateRoute path="/" component={MainLayout} />
                </Switch>
              </Router>
            </Suspense>
          </ErrorBoundry>
        </ThemeProvider>
      </RVGlobalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
