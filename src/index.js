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

const SignIn = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/items/SignIn')
);
const SignUp = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/items/SignUp')
);
const VerifyingCode = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/items/VerifyingCode')
);
const ForgotPassword = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/items/ForgotPassword')
);
const ResetPasswordVerifying = lazy(() =>
  import(
    /* webpackChunkName: "login"*/ 'views/Auth/items/ResetPasswordVerifying'
  )
);
const ResetPassword = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/items/ResetPassword')
);

render(
  <StrictMode>
    <StoreProvider>
      <ErrorBoundry>
        <Suspense fallback={<LogoLoader size={10} />}>
          <Router>
            <Switch>
              <PublicRoute exact path="/login" component={SignIn} />
              <PublicRoute exact path="/register" component={SignUp} />
              <PublicRoute
                exact
                path="/verificationCode"
                component={VerifyingCode}
              />
              <PublicRoute
                exact
                path="/forgotPassword"
                component={ForgotPassword}
              />
              <PublicRoute
                exact
                path="/resetPasswordVerifying"
                component={ResetPasswordVerifying}
              />
              <PublicRoute
                exact
                path="/resetPassword"
                component={ResetPassword}
              />
              <PrivateRoute path="/" component={MainLayout} />
            </Switch>
          </Router>
        </Suspense>
      </ErrorBoundry>
    </StoreProvider>
  </StrictMode>,
  document.getElementById('root')
);
