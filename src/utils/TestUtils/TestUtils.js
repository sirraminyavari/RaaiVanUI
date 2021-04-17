import { render } from '@testing-library/react';
import { WindowContext } from 'context/WindowProvider';
import React from 'react';
import { GlobalUtilities as Global } from './GlobalUtilities';
import { RVDic as dic } from './fa';

const AllTheProviders = ({ children }) => {
  global.GlobalUtilities = Global;
  global.RVDic = dic;

  const {
    RVGlobal,
    RV_RTL,
    RV_Float,
    RV_RevFloat,
    RVDic,
    GlobalUtilities,
  } = global;
  return (
    <WindowContext.Provider
      value={{
        RVGlobal,
        GlobalUtilities,
        RV_RTL,
        RV_Float,
        RV_RevFloat,
        RVDic,
      }}>
      {children}
    </WindowContext.Provider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
