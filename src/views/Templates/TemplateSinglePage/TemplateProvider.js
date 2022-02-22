import { createContext, useContext } from 'react';

const TemplateContext = createContext({});

export const useTemplateContext = () => {
  const context = useContext(TemplateContext);
  return context;
};

export const TemplateProvider = ({ service, extensions, children }) => {
  return (
    <TemplateContext.Provider value={{ ...extensions, ...service }}>
      {children}
    </TemplateContext.Provider>
  );
};
export default TemplateContext;
