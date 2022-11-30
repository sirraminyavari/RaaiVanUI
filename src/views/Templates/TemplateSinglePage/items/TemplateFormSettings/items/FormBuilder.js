import * as Styles from '../TemplateFormSettingsStyles';
import { decodeBase64 } from 'helpers/helpers';
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
import {
  TEMPLATES_SETTING_PATH,
  TEMPLATES_SETTING_SINGLE_PATH,
} from 'constant/constants';
import { useHistory, useParams } from 'react-router-dom';
import 'components/ScrollBarProvider/scrollbar.css';
import { useMemo } from 'react';
import { FORM_BUILDER_ID } from '../TemplateFormContext';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import HandIcon from 'components/Icons/HandIcon/HandIcon';
import ReturnButton from 'components/Buttons/ReturnButton';

const FormBuilder = ({ placeholderProps }) => {
  const { RV_RTL: rtl, RVDic } = window;
  const { id } = useParams();
  const { Title } = useTemplateContext();
  const {
    formObjects,
    focusedObject,
    setFocusedObject,
    setFormObjects,
    removeItem,
    loadMultiLevelChildNodes,
    getMultiLevelNodeDepth,
    loadTableForms,
  } = useTemplateFormContext();
  const history = useHistory();

  const returnToTemplates = () =>
    history.push(TEMPLATES_SETTING_SINGLE_PATH.replace(':id', id));

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      // linkTo: TEAM_SETTINGS_PATH,
    },
    {
      id: 2,
      title: RVDic?.TemplateManagement,
      linkTo: TEMPLATES_SETTING_PATH,
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(Title)}`,
      linkTo: TEMPLATES_SETTING_SINGLE_PATH.replace(':id', id),
    },
    {
      id: 4,
      title: 'مدیریت فرم',
    },
  ];

  const placeholder = useMemo(() => {
    const { icon } = placeholderProps || {};
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
        <Styles.HeaderContainer>
          <Breadcrumb items={breadItems} />

          <ReturnButton onClick={returnToTemplates} />
        </Styles.HeaderContainer>

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
                  loadMultiLevelChildNodes,
                });
                return (
                  <OnClickAway
                    onAway={() => {
                      // setFocusedObject();
                    }}
                  >
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
                              {...{
                                current: x,
                                setFormObjects,
                                removeItem,
                                loadMultiLevelChildNodes,
                                getMultiLevelNodeDepth,
                                loadTableForms,
                              }}
                            >
                              {formSettingComponent}
                            </DraggableSharedSetting>
                          </DraggableFormObjectMainContent>
                        </DraggableFormObject>
                      )}
                    </Draggable>
                  </OnClickAway>
                );
              })}
              {[...formObjects].length === 0 && (
                <Styles.DroppablePlaceholderContainer>
                  <HandIcon />
                  <span>برای ایجاد فرم، فیلد مورد نظر را اینجا رها کنید</span>
                </Styles.DroppablePlaceholderContainer>
              )}
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
            loadMultiLevelChildNodes,
            getMultiLevelNodeDepth,
            loadTableForms,
          }}
        />
      </Styles.FormSetting>
    </>
  );
};
export default FormBuilder;
