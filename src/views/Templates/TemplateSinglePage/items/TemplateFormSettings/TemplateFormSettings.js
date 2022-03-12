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
import FormElementList from './items/FromElementList';
import FormBuilder, { FORM_BUILDER_ID } from './items/FormBuilder';
import { DragDropContext } from 'react-beautiful-dnd';

const TemplateFormSettings = () => {
  const { toggleSidebar } = themeSlice.actions;
  const { RV_RTL: rtl } = window;
  const dispatch = useDispatch();
  const { Title } = useTemplateContext();

  useEffect(() => {
    dispatch(toggleSidebar());
  }, []);

  const handleDrag = (e) => {
    const { destination } = e;
    if (destination?.droppableId !== FORM_BUILDER_ID) return;
    console.log(e);
  };

  return (
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
        <DragDropContext onDragEnd={handleDrag}>
          <Styled.FormElementListPanel>
            <FormElementList />
          </Styled.FormElementListPanel>
          <Styled.FormPanel>
            <FormBuilder />
          </Styled.FormPanel>
        </DragDropContext>
      </Styled.MainContent>
    </Styled.Container>
  );
};
export default TemplateFormSettings;
