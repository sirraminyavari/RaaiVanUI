import React from "react";

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const {
      CurrentUser: currentUser,
      IsAuthenticated: isAuthenticated,
      ApplicationID: appId
    } = window.RVGlobal; 

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, appId }}>
      {children}
    </AuthContext.Provider>
  );
};
