import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import { decode } from 'js-base64';
import { reorder } from 'helpers';

const SidebarChildMenus = ({ isOpen, subList: menuList }) => {
  const [menus, setMenus] = useState(menuList);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newMenus = reorder(
      menus,
      result.source.index,
      result.destination.index
    );
    setMenus(newMenus);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="sub-menu-container" type="subMenu">
        {(provided, snapshot) => (
          <Styled.SubMenuContainer
            isOpen={isOpen}
            isDraggingOver={snapshot.isDraggingOver}
            itemsCount={menuList.length}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {menus.map((menu, index) => {
              return (
                <Draggable
                  key={menu.NodeTypeID}
                  draggableId={menu.NodeTypeID}
                  index={index}>
                  {(provided, snapshot) => (
                    <Styled.SubMenu
                      as={Link}
                      to={`/classes/${menu.NodeTypeID}`}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      isDragging={snapshot.isDragging}>
                      {menu.IconName &&
                        SidebarIcons[menu.IconName]({ size: 20 })}
                      {menu.IconURL && (
                        <img src={menu.IconURL} alt="sub-menu-icon" />
                      )}
                      <span style={{ margin: '0 10px' }}>
                        {decode(menu.TypeName)}
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

export default SidebarChildMenus;
