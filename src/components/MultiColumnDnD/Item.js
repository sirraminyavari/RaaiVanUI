import { Draggable } from 'react-beautiful-dnd';
import * as Styled from './MultiColumnDnD.styles';

const Item = ({ text, index }) => {
  return (
    <Draggable draggableId={text} index={index}>
      {(provided) => (
        <Styled.Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {text}
        </Styled.Item>
      )}
    </Draggable>
  );
};

export default Item;
