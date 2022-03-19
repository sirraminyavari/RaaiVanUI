import { createContext, useContext, useEffect, useState } from 'react';
import { getUUID } from 'helpers/helpers';
import formElementList from './items/FormElements';

const TemplateFormContext = createContext({});

export const useTemplateFormContext = () => {
  const context = useContext(TemplateFormContext);
  return context;
};

export const TemplateFormProvider = ({ children, initialState }) => {
  const elementList = formElementList();
  const [formObjects, setFormObjects] = useState(initialState || []);
  const [focusedObject, setFocusedObject] = useState(null);

  const copyItem = (e) => {
    const { destination } = e;
    const subcategory = elementList?.find(
      (x) => x.id === Number(e?.source?.droppableId)
    );
    const element = subcategory?.items[e?.source?.index];
    formObjects.splice(destination?.index, 0, { ...element, id: getUUID() });
    setFocusedObject(formObjects[destination?.index]?.id || null);
    setFormObjects(formObjects);
  };

  const moveItem = () => {};

  const duplicateItem = () => {};

  const removeItem = () => {};

  return (
    <TemplateFormContext.Provider
      value={{
        formObjects,
        focusedObject,
        setFocusedObject,
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
