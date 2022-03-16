import * as Styles from '../TemplateFormSettingsStyles';
import { decodeBase64 } from 'helpers/helpers';
import { useTemplateContext } from '../../../TemplateProvider';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { useState } from 'react';
import AnimatedTextArea from 'components/Inputs/AnimatedTextArea/AnimatedTextArea';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import {
  DraggableFormObject,
  DraggableFormObjectHandle,
  DraggableFormObjectMainContent,
  DroppableContainer,
} from './FormBuilderStyles';
import { useTemplateFormContext } from '../TemplateFormContext';
import DragIcon from 'components/Icons/DragIcon/Drag';
import FormFieldProps from './FormFieldProps';

export const FORM_BUILDER_ID = 'FORM_BUILDER_ID';

const FormBuilder = () => {
  const { RV_RTL: rtl, RVDic } = window;
  const [description, setDescription] = useState('');
  const { Title } = useTemplateContext();
  const { formObjects } = useTemplateFormContext();
  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت قالب ها',
      linkTo: '',
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(Title)}`,
      linkTo: '',
    },
    {
      id: 4,
      title: 'مدیریت فرم',
      linkTo: '',
    },
  ];
  return (
    <>
      <Styles.FormBuilderLayout rtl={rtl}>
        <Breadcrumb items={breadItems} />

        <AnimatedTextArea
          autoresize={true}
          placeholder={'توضیحات'}
          value={description}
          onChange={(e) => setDescription(e?.target?.value)}
        />
        <Droppable droppableId={FORM_BUILDER_ID}>
          {(provided) => (
            <DroppableContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {[...formObjects].map((x, index) => {
                console.log(x);
                return (
                  <Draggable key={x.id} draggableId={`${x.id}`} index={index}>
                    {(provided) => (
                      <DraggableFormObject
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <DraggableFormObjectHandle
                          {...provided.dragHandleProps}
                        >
                          <DragIcon size={28} />
                        </DraggableFormObjectHandle>
                        <DraggableFormObjectMainContent>
                          {/*<FormFieldProps />*/}
                          {x?.draggable}
                        </DraggableFormObjectMainContent>
                      </DraggableFormObject>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </DroppableContainer>
          )}
        </Droppable>
      </Styles.FormBuilderLayout>
      <Styles.FormSetting>
        <Styles.FormSettingTitle>{'تنظیمات فیلد'}</Styles.FormSettingTitle>
      </Styles.FormSetting>
    </>
  );
};
export default FormBuilder;
