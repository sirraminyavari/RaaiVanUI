import { createContext, useContext, useState } from 'react';
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

  const copyItem = (e) => {
    console.log(Number(e?.source?.droppableId));
    const { destination } = e;
    const subcategory = elementList?.find(
      (x) => x.id === Number(e?.source?.droppableId)
    );
    const element = subcategory?.items[e?.source?.index];
    formObjects.splice(destination?.index, 0, { ...element, id: getUUID() });
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
