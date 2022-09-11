import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import { TemplateFormProvider } from './TemplateFormContext';
import API from 'apiHelper';
import TemplateFormWrapper from './TemplateFormWrapper';
import { useTemplateContext } from '../../TemplateProvider';

const TemplateFormSettings = () => {
  const {
    actions: { toggleSidebar },
  } = useThemeSlice();

  const { NodeTypeID } = useTemplateContext();

  const dispatch = useDispatch();
  const [formInitialState, setFormInitialState] = useState([]);

  useEffect(() => {
    dispatch(toggleSidebar());
    initForm();
  }, []);

  const initForm = async () => {
    const { FormID } =
      (await API.FG.initializeTemplateForm({ NodeTypeID }))?.Form || '';
    const data = await API.FG.getFormElements({
      FormID,
    });
    setFormInitialState({ ...data, FormID });
  };

  return (
    <TemplateFormProvider initialState={formInitialState}>
      <TemplateFormWrapper />
    </TemplateFormProvider>
  );
};
export default TemplateFormSettings;
