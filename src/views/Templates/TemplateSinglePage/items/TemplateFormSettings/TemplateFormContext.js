import { createContext, useContext, useState } from 'react';
import { getUUID } from 'helpers/helpers';

const TemplateFormContext = createContext({});

export const useTemplateFormContext = () => {
  const context = useContext(TemplateFormContext);
  return context;
};

export const TemplateFormProvider = ({ children, initialState }) => {
  const [formObjects, setFormObjects] = useState(
    initialState || [{ id: getUUID() }, { id: getUUID() }]
  );

  const copyItem = (e) => {
    console.log(e);
    const { destination } = e;
    formObjects.splice(destination?.index, 0, { id: getUUID() });
  };

  const moveItem = () => {};

  const duplicateItem = () => {};

  const removeItem = () => {};

  return (
    <TemplateFormContext.Provider
      value={{
        formObjects,
        copyItem,
        moveItem,
        duplicateItem,
        removeItem,
      }}
    >
      {children}
    </TemplateFormContext.Provider>
  );
};
