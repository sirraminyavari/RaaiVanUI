import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DnDItem from './DnDItem';
import hash from 'object-hash';

const DragAndDropWrapper = ({ onDragEnd, chunks, direction, render }) => {
  const horizontalStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  };
  return (
    <DragDropContext onDragEnd={mapAndInvoke(onDragEnd)}>
      {chunks.map(({ id: droppableId, items }) => (
        <Droppable
          key={droppableId}
          droppableId={droppableId}
          direction={direction}
        >
          {(provided, _) => (
            <div
              ref={provided.innerRef}
              style={direction === 'horizontal' ? horizontalStyle : undefined}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <DnDItem
                  key={hash(item)}
                  item={item}
                  index={index}
                  render={render}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default DragAndDropWrapper;

function mapAndInvoke(onDragEnd) {
  return ({ source, destination }) => {
    if (destination !== undefined && destination !== null) {
      const result = {
        source: {
          id: source.droppableId,
          index: source.index,
        },
        destination: {
          id: destination.droppableId,
          index: destination.index,
        },
      };
      onDragEnd(result);
    }
  };
}
