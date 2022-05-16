import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TemplateFormProvider } from './TemplateFormContext';
import TemplateFormWrapper from './TemplateFormWrapper';
import { decodeBase64 } from 'helpers/helpers';
import { useThemeSlice } from 'store/slice/theme';

const TemplateFormSettings = () => {
  const {
    actions: { toggleSidebar },
  } = useThemeSlice();
  const dispatch = useDispatch();
  const [formInitialState, setFormInitialState] = useState([]);

  useEffect(() => {
    dispatch(toggleSidebar());
    (async () => await initForm())();
  }, []);

  const initForm = async () => {
    // const data = await getFormElements({
    //   FormID: '84B18DE6-E3CC-4245-86A7-11AD7D48AE8E',
    // });
    // setFormInitialState(data);
    console.log(decodeBase64('eyJtaW4iOjEwLCJtYXgiOjIwfQ=='));
  };

  return (
    <TemplateFormProvider initialState={formInitialState}>
      <TemplateFormWrapper />
    </TemplateFormProvider>
  );
};
export default TemplateFormSettings;
