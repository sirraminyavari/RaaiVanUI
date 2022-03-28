import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { TemplateFormProvider } from './TemplateFormContext';
import { getFormElements } from 'apiHelper/ApiHandlers/FGAPI';
import TemplateFormWrapper from './TemplateFormWrapper';
import { decodeBase64 } from 'helpers/helpers';

const TemplateFormSettings = () => {
  const { toggleSidebar } = themeSlice.actions;
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
