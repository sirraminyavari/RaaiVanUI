import { createContext } from 'react';

export const WindowContext = createContext({});

export const WindowProvider = ({ children }) => {
  const {
    RVGlobal,
    GlobalUtilities,
    RV_RTL,
    RV_Float,
    RV_RevFloat,
    RVDic,
  } = window;

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
