import { createContext, useContext } from 'react';

const PrivacyObjectContext = createContext({});

export const usePrivacyContext = () => {
  const context = useContext(PrivacyObjectContext);
  return context;
};
