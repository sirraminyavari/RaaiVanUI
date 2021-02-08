import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from 'utils/RouteHandler';
import StoreProvider from 'store/StoreProvider';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';
import LogoLoader from 'components/LogoLoader/LogoLoader';

//TODO: Move to redux Provider
import { RVGlobalProvider } from 'context/RVGlobalProvider';

const MainLayout = lazy(() => import('layouts/Main'));
const Login = lazy(() => import('views/Auth/Login'));

render(
  <React.StrictMode>
    <StoreProvider>
      <RVGlobalProvider>
        <ErrorBoundry>
          <Router>
            <Switch>
              <Suspense fallback={<LogoLoader size={10} />}>
                <PublicRoute exact path="/login" component={Login} />
                <PrivateRoute path="/" component={MainLayout} />
              </Suspense>
            </Switch>
          </Router>
        </ErrorBoundry>
      </RVGlobalProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
