import { DragDropContext } from 'react-beautiful-dnd';
import Tree from './Tree';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DnDTree = ({ data = [] }) => {
  const handleOnDragEnd = (result) => {
    const { destination, source, type } = result;
    console.log({ destination, source, type });
    if (!destination) {
      return;
    }

    const sourceIndex = source.index;
    const destIndex = destination.index;
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Tree data={data} droppableId="root" />
    </DragDropContext>
  );
};

export default DnDTree;
