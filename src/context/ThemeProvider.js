import React, { useState } from 'react';

export const ThemeContext = React.createContext({});

export const ThemeProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  return (
    <ThemeContext.Provider
      value={{ isOpen, setIsOpen, showSetting, setShowSetting }}>
      {children}
    </ThemeContext.Provider>
  );
};
