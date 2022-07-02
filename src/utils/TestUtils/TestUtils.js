import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import StoreProvider from 'store/StoreProvider';

const AllTheProviders = ({ children }) => {
  // const bh = require('../../../public/load/scripts/jQuery/jquery');
  // const gb = require('../../../public/load/scripts/GlobalUtilities');
  const prefix = '../../../public/load/scripts/';

  require(prefix + 'jQuery/jquery');
  require(prefix + 'GlobalUtilities');

  // require('http://185.239.107.180/api/rv/language_dictionary');
  return (
    <StoreProvider>
      <Router>{children}</Router>
    </StoreProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
