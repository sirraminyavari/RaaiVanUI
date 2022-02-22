import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const RVTree = ({ id, components, ...rest }) => {
  const { itemWrapper, arrowIcon, addButton } = components;

  const handleDragEnd = (e) => {};

  return (
    <DragDropContext onDragEnd={(e) => handleDragEnd(e)}>
      <Droppable draggableId={id}>
        {(provided, snapshot) => {
          return (
            <NodeTitleContainer
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            />
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
const NodeTitleContainer = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0.7rem 0;
`;
export default RVTree;
