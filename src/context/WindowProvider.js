import { createContext } from 'react';

export const WindowContext = createContext({});

export const WindowProvider = ({ children }) => {
  const {
    RVGlobal,
    GlobalUtilities,
    DynamicFileUtilities,
    RVAPI,
    RV_RTL,
    RV_Float,
    RV_RevFloat,
    RVDic,
    RV_Direction,
  } = window;

  return (
    <WindowContext.Provider
      value={{
        RVGlobal,
        GlobalUtilities,
        DynamicFileUtilities,
        RVAPI,
        RV_RTL,
        RV_Float,
        RV_RevFloat,
        RVDic,
        RV_Direction,
      }}>
      {children}
    </WindowContext.Provider>
  );
};
