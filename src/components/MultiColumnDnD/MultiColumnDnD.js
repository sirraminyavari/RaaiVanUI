import React, { useState } from 'react';
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';
import * as Styled from './MultiColumnDnD.styles';
import data from './data';

const MultiColumnDnD = () => {
  const [columns, setColumns] = useState(data);

  const onDragEnd = ({ source, destination }) => {
    //! Make sure we have a valid destination
    if (!destination) return;

    //! Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    //! Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    //! If start is the same as end, we're in the same column
    if (start === end) {
      //! Move the item within the list
      //! Start by making a new list without the dragged item
      const newList = start.list.filter((_, index) => index !== source.index);

      //! Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      //! Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      //! Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      //! If start is different from end, we need to update multiple columns
      //! Filter the start list like before
      const newStartList = start.list.filter(
        (_, index) => index !== source.index
      );

      //! Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      //! Make a new end list array
      const newEndList = end.list;

      //! Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      //! Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      //! Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Styled.ColumnsContainer>
        {Object.values(columns).map((col) => (
          <Column col={col} key={col.id} />
        ))}
      </Styled.ColumnsContainer>
    </DragDropContext>
  );
};

export default MultiColumnDnD;
