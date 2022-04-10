import { Droppable, Draggable } from 'react-beautiful-dnd';
import * as Styled from './Tree.styles';
import TreeNode from './TreeNode';

const Tree = ({ data, droppableId }) => {
  return (
    <Droppable droppableId={`droppable-${droppableId || 'root'}`}>
      {(provided, snapshot) => {
        return (
          <Styled.TreeContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.map((tree, index) => (
              <Draggable key={tree.key} draggableId={tree.key} index={index}>
                {(provided, snapshot) => {
                  const { draggableProps, innerRef, dragHandleProps } =
                    provided;
                  return (
                    <TreeNode
                      node={tree}
                      key={tree.key}
                      draggableProps={draggableProps}
                      draggableRef={innerRef}
                      draggHandle={dragHandleProps}
                    />
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </Styled.TreeContainer>
        );
      }}
    </Droppable>
  );
};

export default Tree;
