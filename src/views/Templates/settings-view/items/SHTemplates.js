import useRVTree from 'components/Tree/RVTree/useRVTree';
import { useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const SHTemplates = ({ nodes, ...rest }) => {
  const { tree, setRootNodes } = useRVTree();

  useEffect(() => {
    setRootNodes(
      nodes.map((x) => ({
        ...x,
        title: x?.TypeName,
        draggable: true,
        hasChildren: x?.HasChild,
      }))
    );
  }, [nodes]);

  const handleDragEnd = (e) => {
    console.log(e);
  };

  return (
    <div>
      <DragDropContext onDragEnd={(e) => handleDragEnd(e)}>
        <RootTree>
          <Droppable draggableId={tree?.id}>
            {(provided, snapshot) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                />
              );
            }}
          </Droppable>
        </RootTree>
      </DragDropContext>
    </div>
  );
};
const RootTree = styled.ul`
  list-style: none;
  padding: 0 1.5rem;
`;
export default SHTemplates;
