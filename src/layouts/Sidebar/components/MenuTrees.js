/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SidebarMenuRoot from './MenuRoot';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../Sidebar.styles';
import { reorder } from 'helpers/helpers';
import { createSelector } from 'reselect';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.tree
);

const SidebarTrees = () => {
  const tree = useSelector(selectTree);
  const { setReorderedTree } = sidebarMenuSlice.actions;

  const dispatch = useDispatch();

  //! Calls whenever item dragging is ended and reorders the tree list.
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newTree = reorder(
      tree,
      result.source.index,
      result.destination.index
    );

    dispatch(setReorderedTree(newTree));
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="sidebar-menu-container" type="parentMenu">
        {(provided, snapshot) => (
          <Styled.MenuTreeContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}>
            {tree.map((item, index) => {
              return (
                <Draggable
                  key={item.NodeTypeID}
                  draggableId={item.TypeName}
                  index={index}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}>
                      <SidebarMenuRoot
                        item={item}
                        isDragging={snapshot.isDragging}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Styled.MenuTreeContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default memo(SidebarTrees);
