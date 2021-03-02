import { Suspense, lazy, StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from 'utils/RouteHandler/PrivateRoute';
import PublicRoute from 'utils/RouteHandler/PublicRoute';
import StoreProvider from 'store/StoreProvider';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import 'assets/css/index.css';

const MainLayout = lazy(() =>
  import(/* webpackChunkName: "layout-main"*/ 'layouts/Main')
);
const Login = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/Login')
);

render(
  <StrictMode>
    <StoreProvider>
      <ErrorBoundry>
        <Suspense fallback={<LogoLoader size={10} />}>
          <Router>
            <Switch>
              <PublicRoute exact path="/login" component={Login} />
              <PrivateRoute path="/" component={MainLayout} />
            </Switch>
          </Router>
        </Suspense>
      </ErrorBoundry>
    </StoreProvider>
  </StrictMode>,
  document.getElementById('root')
);
