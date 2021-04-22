/**
 * Renders sub-menus(branches) for each main(root) menu item.
 */
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../../../Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';
import { reorder } from 'helpers/helpers';
import DragIcon from 'components/Icons/DragIcon/Drag';
import DnDProvider from '../../../../../components/DnDProvider/DnDProvider';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.tree
);

const EditableSubBranch = ({ isOpen, menuList, parentID }) => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const { setReorderedTree } = sidebarMenuSlice.actions;

  const listWithId = menuList.map((t) => {
    const withId = Object.assign({}, t, { id: t.NodeTypeID });
    return withId;
  });

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
    <DnDProvider
      droppableClass="subMenuContainer"
      droppableStyle={{ height: isOpen ? `${menuList.length * 2.8}rem` : 0 }}
      list={listWithId}
      droppableId={parentID}
      onDragEnd={handleOnDragEnd}>
      {({ isDragging, dragHandleProps, item }) => {
        return (
          <Styled.SubMenu className="BorderRadius4" isDragging={isDragging}>
            <div>
              {item.IconName && SidebarIcons[item.IconName]({ size: 20 })}
              {item.IconURL && (
                <Styled.MenuItemImage
                  src={item.IconURL}
                  style={{ maxWidth: '1.3rem' }}
                  alt="sub-menu-icon"
                />
              )}
              <Styled.SubMenuTitleWrapper>
                {decodeBase64(item.TypeName)}
              </Styled.SubMenuTitleWrapper>
            </div>
            <Styled.DragIconWrapper
              {...dragHandleProps}
              style={{ cursor: 'row-resize' }}>
              <DragIcon />
            </Styled.DragIconWrapper>
          </Styled.SubMenu>
        );
      }}
    </DnDProvider>
  );
};

export default EditableSubBranch;
