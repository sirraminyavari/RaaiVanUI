import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import { decode } from 'js-base64';
import { reorder } from 'helpers';

const SubMenus = ({ isOpen, subList }) => {
  const [items, setItems] = useState(subList);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="sub-menu-container" type="subMenu">
        {(provided, snapshot) => (
          <Styled.SubMenuContainer
            isOpen={isOpen}
            isDraggingOver={snapshot.isDraggingOver}
            itemsCount={subList.length}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {items.map((sub, index) => {
              return (
                <Draggable
                  key={sub.NodeTypeID}
                  draggableId={sub.NodeTypeID}
                  index={index}>
                  {(provided, snapshot) => (
                    <Styled.SubMenu
                      as={Link}
                      to={`/classes/${sub.NodeTypeID}`}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      isDragging={snapshot.isDragging}>
                      {sub.IconName && SidebarIcons[sub.IconName]({ size: 20 })}
                      {sub.IconURL && (
                        <img src={sub.IconURL} alt="sub-menu-icon" />
                      )}
                      <span style={{ margin: '0 10px' }}>
                        {decode(sub.TypeName)}
                      </span>
                    </Styled.SubMenu>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Styled.SubMenuContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SubMenus;
