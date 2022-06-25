import { createContext } from 'react';

interface WindowContextType {
  RVDic: { [key: string]: any };
  RVGlobal: { [key: string]: any };
  RVAPI: { [key: string]: any };
  GlobalUtilities: { [key: string]: any };
  DynamicFileUtilities: unknown;
  RV_RTL: boolean;
  RV_Float: 'right' | 'left';
  RV_RevFloat: 'right' | 'left';
  RV_Direction: 'rtl' | 'ltr';
  IsAuthenticated?: boolean;
}

export const WindowContext = createContext<WindowContextType>({
  RVGlobal: {},
  GlobalUtilities: {},
  DynamicFileUtilities: {},
  RVAPI: {},
  RV_RTL: true,
  RV_Float: 'right',
  RV_RevFloat: 'right',
  RVDic: {},
  RV_Direction: 'rtl',
  IsAuthenticated: false,
});

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
    IsAuthenticated,
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
        IsAuthenticated,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};
