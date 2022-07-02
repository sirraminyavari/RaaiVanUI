import * as Styles from '../TemplateFormSettingsStyles';
import { decodeBase64 } from 'helpers/helpers';
import { useTemplateContext } from '../../../TemplateProvider';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import {
  DraggableFormObject,
  DraggableFormObjectHandle,
  DraggableFormObjectMainContent,
  DroppableContainer,
} from './FormBuilderStyles';
import { useTemplateFormContext } from '../TemplateFormContext';
import DragIcon from 'components/Icons/DragIcon/Drag';
import { getDraggableElementSetting } from '../elementSettingComponents/ComponentsLookupTable';
import SideFormElementSetting from './SideFormElementSetting';
import DraggableSharedSetting from '../elementSettingComponents/sharedItems/DraggableSharedSetting';

export const FORM_BUILDER_ID = 'FORM_BUILDER_ID';

const FormBuilder = () => {
  const { RV_RTL: rtl, RVDic } = window;
  const [description, setDescription] = useState('');
  const { Title } = useTemplateContext();
  const {
    formObjects,
    focusedObject,
    setFocusedObject,
    setFormObjects,
    removeItem,
  } = useTemplateFormContext();
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
        <Droppable droppableId={FORM_BUILDER_ID}>
          {(provided, snapshot) => (
            <DroppableContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {[...formObjects].map((x, index) => {
                const formSettingComponent = getDraggableElementSetting({
                  current: x,
                  setFormObjects,
                });
                return (
                  <Draggable key={x?.id} draggableId={`${x?.id}`} index={index}>
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
                        <DraggableFormObjectMainContent
                          focused={focusedObject === x?.id}
                          onClick={() => setFocusedObject(x?.id)}
                        >
                          <DraggableSharedSetting
                            {...{ current: x, setFormObjects, removeItem }}
                          >
                            {formSettingComponent}
                          </DraggableSharedSetting>
                        </DraggableFormObjectMainContent>
                      </DraggableFormObject>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              {/* {true && <Styles.DragPlaceholder></Styles.DragPlaceholder>} */}
            </DroppableContainer>
          )}
        </Droppable>
      </Styles.FormBuilderLayout>
      <Styles.FormSetting>
        <Styles.FormSettingTitle>{'تنظیمات فیلد'}</Styles.FormSettingTitle>
        <SideFormElementSetting
          {...{
            formObjects,
            setFormObjects,
            focusedObject,
          }}
        />
      </Styles.FormSetting>
    </>
  );
};
export default FormBuilder;
