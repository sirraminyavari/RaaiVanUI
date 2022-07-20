import { createContext, useContext, useEffect, useState } from 'react';
import { getUUID } from 'helpers/helpers';
import formElementList from './items/FormElements';
import produce from 'immer';
import { getElementType } from './elementSettingComponents/ElementTypeFinder';
import { saveFormElements } from 'apiHelper/ApiHandlers/FGAPI/FGAPI';
import InfoToast from '../../../../../components/toasts/info-toast/InfoToast';

const TemplateFormContext = createContext({});

export const FORM_BUILDER_ID = 'FORM_BUILDER_ID';

export const useTemplateFormContext = () => {
  const context = useContext(TemplateFormContext);
  return context;
};

export const TemplateFormProvider = ({ children, initialState }) => {
  const { RVDic } = window;
  const elementList = formElementList();
  const [formObjects, setFormObjects] = useState([]);
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

  const formPreProcessDataModel = (data) => {
    const { Elements } = data || {};
    const modified = Elements?.map((x) => getElementType(x));
    if (modified) {
      setFormObjects(modified);
    }
  };

  useEffect(() => {
    formPreProcessDataModel(initialState);
  }, [initialState]);

  useEffect(() => console.log(formObjects), [formObjects]);

  const saveForm = async () => {
    const Elements = formObjects
      .map((x) => x?.data)
      .map((x) => ({
        ElementID: getUUID(),
        ...x,
      }));
    const { ErrorText, Succeed } = await saveFormElements({
      FormID: '84B18DE6-E3CC-4245-86A7-11AD7D48AE8E',
      Elements,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        message: RVDic.MSG[ErrorText] || ErrorText,
      });
    } else {
      InfoToast({
        type: 'success',
        message: RVDic.MSG[Succeed] || Succeed,
      });
    }
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
        saveForm,
      }}
    >
      {children}
    </TemplateFormContext.Provider>
  );
};
