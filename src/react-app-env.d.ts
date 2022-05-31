/// <reference types="react-scripts" />

declare module '*.svg?file' {
  const content: string;
  export default content;
}

interface Window {
  IsAuthenticated?: boolean;
  RVDic: { [key: string]: any };
  RVGlobal: { [key: string]: any };
  RVAPI: { [key: string]: any };
  GlobalUtilities: { [key: string]: any };
  DynamicFileUtilities: unknown;
  RV_RTL: boolean;
  RV_Float: 'right' | 'left';
  RV_RevFloat: 'right' | 'left';
  RV_Direction: 'rtl' | 'ltr';
  Base64: {
    decode: (Base64URI: string) => string;
    encode: (Base64URI: string) => string;
  };
}
