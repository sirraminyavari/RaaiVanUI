import { Suspense, lazy, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from 'utils/RouteHandler/PrivateRoute';
// import PublicRoute from 'utils/RouteHandler/PublicRoute';
import StoreProvider from 'store/StoreProvider';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import AuthView from 'views/Auth/AuthView';
// import LoginView from 'views/Auth/LoginView';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import CheckRoute from 'utils/CheckRoute/CheckRoute';

import { AUTH_PATH, LOGIN_NAME, ROOT_PATH } from 'constant/constants';
import { CV_WHITE } from 'constant/CssVariables';
import { avatarIconURL } from 'helpers/helpers';
import consoleLogger from 'utils/console/consoleLogger';

const { RV_RTL, GlobalUtilities } = window;

new consoleLogger();
const MainLayout = lazy(() =>
  import(/* webpackChunkName: "layout-main"*/ 'layouts/MainLayout')
);
window._alert = window.alert;
window.avatarIconURL = avatarIconURL;

window.alert = function (txt, props) {
  toast(txt, {
    position: RV_RTL ? 'bottom-left' : 'bottom-right',
    style: { backgroundColor: CV_WHITE },

    ...props,
  });
};

const App = () => {
  return (
    <ErrorBoundry>
      <ToastContainer
        style={{ zIndex: GlobalUtilities.zindex.alert() }}
        bodyClassName="rv-font-default"
      />

      <StoreProvider>
        <ErrorBoundry>
          <Suspense fallback={<LogoLoader />}>
            <Router>
              <ScrollToTop />
              <Switch>
                <Route
                  path={AUTH_PATH}
                  render={(props) => (
                    <CheckRoute
                      props={props}
                      name={LOGIN_NAME}
                      component={AuthView}
                    />
                  )}
                />
                <PrivateRoute path={ROOT_PATH} component={MainLayout} />
              </Switch>
            </Router>
          </Suspense>
        </ErrorBoundry>
      </StoreProvider>
    </ErrorBoundry>
  );
};

export default App;
