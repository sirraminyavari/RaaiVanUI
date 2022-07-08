import * as Styles from '../TemplateFormSettingsStyles';
import { decodeBase64, getUUID } from 'helpers/helpers';
import { useTemplateContext } from '../../../TemplateProvider';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
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
import { TEMPLATES_SETTING_PATH } from 'constant/constants';
import { ReturnButton } from '../../../TemplateSinglePageStyles';
import { useHistory } from 'react-router-dom';
import 'components/ScrollBarProvider/scrollbar.css';
import { useEffect, useState, useMemo } from 'react';
import { FORM_BUILDER_ID } from '../TemplateFormContext';

const FormBuilder = ({ placeholderProps }) => {
  const { RV_RTL: rtl, RVDic } = window;
  const { Title } = useTemplateContext();
  const {
    formObjects,
    focusedObject,
    setFocusedObject,
    setFormObjects,
    removeItem,
  } = useTemplateFormContext();
  const history = useHistory();

  const returnToTemplates = () => history.push(TEMPLATES_SETTING_PATH);

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: TEMPLATES_SETTING_PATH,
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

  const placeholder = useMemo(() => {
    const { icon } = placeholderProps || {};
    console.log(icon);
    return (
      placeholderProps && (
        <Styles.DragPlaceholder {...placeholderProps}>
          {icon}
        </Styles.DragPlaceholder>
      )
    );
  }, [placeholderProps]);

  return (
    <>
      <Styles.FormBuilderLayout $rtl={rtl}>
        <Breadcrumb items={breadItems} />

        <ReturnButton onClick={returnToTemplates} $rtl={rtl}>
          {RVDic?.Return}
        </ReturnButton>

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
                  <Draggable
                    key={x?.id}
                    draggableId={`${x?.id}-${x?.type}`}
                    index={index}
                  >
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
              {placeholder}
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
