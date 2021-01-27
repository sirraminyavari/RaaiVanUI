import React, { useState } from 'react';

export const ThemeContext = React.createContext({});

export const ThemeProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ThemeContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ThemeContext.Provider>
  );
};
