import { Suspense, lazy } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from 'utils/RouteHandler/PrivateRoute';
import PublicRoute from 'utils/RouteHandler/PublicRoute';
import StoreProvider from 'store/StoreProvider';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import AuthView from 'views/Auth/AuthView';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
// import 'assets/css/index.css';

const { RV_RTL, GlobalUtilities } = window;

const MainLayout = lazy(() =>
  import(/* webpackChunkName: "layout-main"*/ 'layouts/MainLayout')
);
window._alert = window.alert;
window.alert = function (txt, type = '') {
  console.log('alert called', GlobalUtilities.zindex.alert());
  toast(txt, {
    type,
    position: RV_RTL ? 'bottom-left' : 'bottom-right',
    style: { zIndex: GlobalUtilities.zindex.alert() },
  });
};

const App = () => {
  return (
    <ErrorBoundry>
      <ToastContainer bodyClassName="rv-font-default" />

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
    </ErrorBoundry>
  );
};

export default App;
