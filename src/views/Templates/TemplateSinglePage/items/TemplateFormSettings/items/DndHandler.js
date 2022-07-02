import * as Styled from '../TemplateFormSettingsStyles';
import FormElementList from './FromElementList';
import FormBuilder, { FORM_BUILDER_ID } from './FormBuilder';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTemplateFormContext } from '../TemplateFormContext';

const DndHandler = () => {
  const { copyItem, moveItem } = useTemplateFormContext();

  const handleDrag = (e) => {
    const { destination, source } = e;
    if (destination?.droppableId !== FORM_BUILDER_ID || !destination) return;

    if (destination?.droppableId !== source?.droppableId) {
      // copy item
      copyItem(e);
    }

    if (destination?.droppableId === source?.droppableId) {
      moveItem(e);
    }
  };

  const handleDragStart = (e) => {
    console.log('drag start', e);
  };

  const handleDragUpdate = (e) => {
    console.log('drag update', e);
  };

  return (
    <DragDropContext
      onDragEnd={handleDrag}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
    >
      <Styled.FormElementListPanel>
        <FormElementList />
      </Styled.FormElementListPanel>
      <Styled.FormPanel>
        <FormBuilder />
      </Styled.FormPanel>
    </DragDropContext>
  );
};
export default DndHandler;
