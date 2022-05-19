import { getFormElements } from 'apiHelper/apiFunctions';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import { TemplateFormProvider } from './TemplateFormContext';
import TemplateFormWrapper from './TemplateFormWrapper';

const TemplateFormSettings = () => {
  const {
    actions: { toggleSidebar },
  } = useThemeSlice();
  const dispatch = useDispatch();
  const [formInitialState, setFormInitialState] = useState([]);

  useEffect(() => {
    dispatch(toggleSidebar());
    initForm();
  }, []);

  const initForm = async () => {
    const data = await getFormElements({
      FormID: '84B18DE6-E3CC-4245-86A7-11AD7D48AE8E',
    });
    console.log(data);
    setFormInitialState(data);
  };

  return (
    <TemplateFormProvider initialState={formInitialState}>
      <TemplateFormWrapper />
    </TemplateFormProvider>
  );
};
export default TemplateFormSettings;
