import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import StoreProvider from 'store/StoreProvider';
import Spinner from 'components/Spinner';
import ErrorBoundry from 'components/ErrorBoundry/ErrorBoundry';

//TODO: Move to redux Provider
import { RVGlobalProvider } from 'context/RVGlobalProvider';

import MainLayout from 'layouts/Main';

render(
  <React.StrictMode>
    <StoreProvider>
      <RVGlobalProvider>
        <ErrorBoundry>
          <Suspense fallback={<Spinner />}>
            <Router>
              <Switch>
                <Route path="/" component={MainLayout} />
              </Switch>
            </Router>
          </Suspense>
        </ErrorBoundry>
      </RVGlobalProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
