import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from 'utils/RouteHandler';
import StoreProvider from 'store/StoreProvider';
import Spinner from 'components/Spinner';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';

//TODO: Move to redux Provider
import { RVGlobalProvider } from 'context/RVGlobalProvider';

const MainLayout = lazy(() => import('layouts/Main'));
const Login = lazy(() => import('views/Auth/Login'));

render(
  <React.StrictMode>
    <StoreProvider>
      <RVGlobalProvider>
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
      </RVGlobalProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
