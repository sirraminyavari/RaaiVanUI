import React from 'react';

export const RVGlobalContext = React.createContext({});

export const RVGlobalProvider = ({ children }) => {
  return (
    <RVGlobalContext.Provider value={window.RVGlobal}>
      {children}
    </RVGlobalContext.Provider>
  );
};
