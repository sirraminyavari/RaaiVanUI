/**
 * Renders all menu items at once.
 */
import { useSelector, useDispatch } from 'react-redux';
import SidebarMenuRoot from './MenuRoot';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../Sidebar.styles';
import { reorder } from 'helpers/helpers';

const SidebarTrees = () => {
  const { tree } = useSelector((state) => state.sidebarItems);
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
                        dragProps={provided.dragHandleProps}
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

export default SidebarTrees;
