import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import * as Styled from './TemplateFormSettingsStyles';
import { useTemplateContext } from '../../TemplateProvider';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import SaveIcon from 'components/Icons/SaveIcon/Save';
import TrashIcon from 'components/Icons/TrashIcon';
import PreviewIcon from 'components/Icons/PreviewIcon/PreviewIcon';
import {
  TemplateFormProvider,
  useTemplateFormContext,
} from './TemplateFormContext';
import DndHandler from './items/DndHandler';
import { getFormElements } from 'apiHelper/ApiHandlers/FGAPI';

const TemplateFormSettings = () => {
  const { toggleSidebar } = themeSlice.actions;
  const { RV_RTL: rtl } = window;
  const dispatch = useDispatch();
  const { Title } = useTemplateContext();

  useEffect(() => {
    dispatch(toggleSidebar());
    (async () => await initForm())();
  }, []);

  const initForm = async () => {
    const data = await getFormElements({
      FormID: '84B18DE6-E3CC-4245-86A7-11AD7D48AE8E',
    });
    console.log(data);
  };

  return (
    <TemplateFormProvider>
      <Styled.Container rtl={rtl}>
        <Styled.ActionHeader rtl={rtl}>
          <Styled.HeaderTitle>{decodeBase64(`${Title}`)}</Styled.HeaderTitle>
          <Styled.Spacer />

          <Button type="secondary-o">
            <PreviewIcon size={17} />
            <Styled.ButtonTitle>{'پیش‌نمایش'}</Styled.ButtonTitle>
          </Button>

          <Button type="negative-o">
            <TrashIcon size={17} />
            <Styled.ButtonTitle>{'حذف فرم'}</Styled.ButtonTitle>
          </Button>

          <Button type="primary">
            <SaveIcon size={17} />
            <Styled.ButtonTitle>{'انتشار فرم'}</Styled.ButtonTitle>
          </Button>
        </Styled.ActionHeader>

        <Styled.MainContent>
          <DndHandler />
        </Styled.MainContent>
      </Styled.Container>
    </TemplateFormProvider>
  );
};
export default TemplateFormSettings;
