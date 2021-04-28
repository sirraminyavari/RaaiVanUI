import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import StoreProvider from 'store/StoreProvider';

const AllTheProviders = ({ children }) => {
  require('./GlobalUtilities');
  require('../../../public/load/scripts/jQuery/jquery.js');
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
