import { Suspense, lazy } from 'react';
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
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';

const { GlobalUtilities, RV_RTL, RV_Float, RV_RevFloat } = window;

const MainLayout = lazy(() =>
  import(/* webpackChunkName: "layout-main"*/ 'layouts/Main')
);
window._alert = window.alert;
window.alert = function (txt, type = '') {
  toast(txt, {
    type,
    position: RV_RTL ? 'bottom-left' : 'bottom-right',
    className: 'rv-font-default',
  });
};

const App = () => {
  return (
    <>
      <ToastContainer />

      <StoreProvider>
        <ErrorBoundry>
          <Suspense fallback={<LogoLoader size={10} />}>
            <Router>
              <ScrollToTop />
              <Switch>
                <PublicRoute path="/auth" component={AuthView} />
                <PrivateRoute path="/" component={MainLayout} />
              </Switch>
            </Router>
          </Suspense>
        </ErrorBoundry>
      </StoreProvider>
    </>
  );
};

export default App;
