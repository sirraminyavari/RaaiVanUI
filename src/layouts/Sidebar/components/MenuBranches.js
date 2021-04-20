/**
 * Renders sub-menus(branches) for each main(root) menu item.
 */
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import { decode } from 'js-base64';
import { reorder } from 'helpers/helpers';
import DragIcon from 'components/Icons/DragIcon/Drag';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.tree
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarMenuBranches = ({ isOpen, menuList, parentID }) => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const sidebarContent = useSelector(selectSidebarContent);
  const { setReorderedTree } = sidebarMenuSlice.actions;

  //! Calls whenever item dragging ended and reorders menu list.
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newTree = tree.map((item) => {
      if (item.NodeTypeID === parentID) {
        let cloneItem = Object.assign({}, item);
        cloneItem.defaultForm = true;
        cloneItem.Sub = reorder(
          item.Sub,
          result.source.index,
          result.destination.index
        );
        return cloneItem;
      }
      return item;
    });

    dispatch(setReorderedTree(newTree));
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={parentID} type="subMenu">
        {(provided, snapshot) => (
          <Styled.SubMenuContainer
            isOpen={isOpen}
            itemsCount={menuList.length}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {menuList.map((menu, index) => {
              return (
                <Draggable
                  key={menu.NodeTypeID}
                  draggableId={menu.NodeTypeID}
                  index={index}>
                  {(provided, snapshot) => (
                    <Styled.SubMenu
                      className="BorderRadius4"
                      forwardedAs={Link}
                      to={`/classes/${menu.NodeTypeID}`}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      isDragging={snapshot.isDragging}>
                      <div>
                        {menu.IconName &&
                          SidebarIcons[menu.IconName]({ size: 20 })}
                        {menu.IconURL && (
                          <Styled.MenuItemImage
                            src={menu.IconURL}
                            style={{ maxWidth: '1.3rem' }}
                            alt="sub-menu-icon"
                          />
                        )}
                        <Styled.SubMenuTitleWrapper>
                          {decode(menu.TypeName)}
                        </Styled.SubMenuTitleWrapper>
                      </div>
                      {sidebarContent === 'manage' && (
                        <Styled.DragIconWrapper
                          {...provided.dragHandleProps}
                          style={{ cursor: 'row-resize' }}>
                          <DragIcon />
                        </Styled.DragIconWrapper>
                      )}
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

export default SidebarMenuBranches;
