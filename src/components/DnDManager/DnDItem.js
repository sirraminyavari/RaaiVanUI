import { Draggable } from 'react-beautiful-dnd';
import hash from 'object-hash';

const DnDItem = ({ item, index, render }) => (
  <Draggable draggableId={hash(item)} index={index}>
    {(provided, _) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
        {render(item)}
      </div>
    )}
  </Draggable>
);

export default DnDItem;
