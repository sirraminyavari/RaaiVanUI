/**
 * Renders a Drag and Drop provider component.
 */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

/**
 * @typedef PropType
 * @property {Object[]} list - Dnd list.
 * @property {string} droppableId -The id of droppable area.
 * @property {string} droppableType -The type of droppable area.
 * @property {string} droppableClass -Classes that apply to droppable area.
 * @property {Object} droppableStyle -Styles that apply to droppable area.
 * @property {function} onDragEnd -A callback function that will fire on drag end event.
 */

/**
 *  @description Renders an auto suggestion input.
 * @component
 * @param {PropType} props
 */
const DnDProvider = (props) => {
  const {
    list,
    onDragEnd,
    droppableId,
    droppableType,
    droppableClass,
    droppableStyle,
    children,
  } = props;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId} type={droppableType}>
        {(provided, snapshot) => (
          <div
            style={{ ...droppableStyle }}
            className={droppableClass}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {list?.map((item, index) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => {
                    let isDragging = snapshot.isDragging;
                    let dragHandleProps = provided.dragHandleProps;

                    return (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={{ ...provided.draggableProps.style }}>
                        {children({ isDragging, dragHandleProps, item })}
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

DnDProvider.propTypes = {
  list: PropTypes.array,
  droppableId: PropTypes.string,
  droppableType: PropTypes.string,
  droppableClass: PropTypes.string,
  droppableStyle: PropTypes.object,
  onDragEnd: PropTypes.func,
};

DnDProvider.displayName = 'DnDProviderComponent';

export default DnDProvider;
