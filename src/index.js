import { Suspense, lazy, StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from 'utils/RouteHandler/PrivateRoute';
import PublicRoute from 'utils/RouteHandler/PublicRoute';
import StoreProvider from 'store/StoreProvider';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import AuthView from 'views/Auth/AuthView';
import 'assets/css/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainLayout = lazy(() =>
  import(/* webpackChunkName: "layout-main"*/ 'layouts/Main')
);
window._alert = window.alert;
window.alert = function (txt, type = '') {
  toast(txt, {
    type,
  });
};

render(
  <StrictMode>
    <ToastContainer />

    <StoreProvider>
      <ErrorBoundry>
        <Suspense fallback={<LogoLoader size={10} />}>
          <Router>
            <Switch>
              <PublicRoute path="/auth" component={AuthView} />
              <PrivateRoute path="/" component={MainLayout} />
            </Switch>
          </Router>
        </Suspense>
      </ErrorBoundry>
    </StoreProvider>
  </StrictMode>,
  document.getElementById('root')
);
