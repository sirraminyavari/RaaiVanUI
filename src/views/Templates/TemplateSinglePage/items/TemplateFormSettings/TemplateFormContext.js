import { createContext, useContext, useEffect, useState } from 'react';
import { getUUID } from 'helpers/helpers';
import formElementList from './items/FormElements';
import produce from 'immer';

const TemplateFormContext = createContext({});

export const useTemplateFormContext = () => {
  const context = useContext(TemplateFormContext);
  return context;
};

export const TemplateFormProvider = ({ children, initialState }) => {
  const elementList = formElementList();
  const [formObjects, setFormObjects] = useState(initialState || []);
  const [focusedObject, setFocusedObject] = useState(null);

  // create new element on drag over
  const copyItem = (e) => {
    const id = getUUID();
    setFocusedObject(id);
    const subcategory = elementList?.find(
      (x) => x.id === Number(e?.source?.droppableId)
    );
    setFormObjects(
      produce((d) => {
        const el = subcategory?.items[e?.source?.index];
        d.splice(e?.destination?.index, 0, { ...el, id });
      })
    );
  };

  // sort draggable form element
  const moveItem = (e) => {
    setFormObjects(
      produce((d) => {
        const el = Object.assign(d[e?.source?.index]);
        d.splice(e?.source?.index, 1);
        d.splice(e?.destination?.index, 0, { ...el, id: getUUID() });
      })
    );
  };

  const duplicateItem = (id) => {
    const element = formObjects.find((x) => x?.id === id);
    const elementIndex = formObjects.findIndex((x) => x?.id === id);
    formObjects.splice(elementIndex, 0, { ...element, id: getUUID() });
  };

  const removeItem = (id) => {
    if (id === focusedObject) {
      setFocusedObject(null);
    }
    const newObjects = formObjects.filter((x) => x?.id !== id);
    setFormObjects(newObjects);
  };

  return (
    <TemplateFormContext.Provider
      value={{
        formObjects,
        setFormObjects,
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
