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
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import DnDProvider from 'components/DnDProvider/DnDProvider';
import InlineEdit from 'components/InlineEdit/InlineEdit';

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
    const { source, destination } = result;

    console.log({ source, destination });

    if (!destination) return;

    const newTree = tree.map((item) => {
      if (item.NodeTypeID === parentID) {
        let cloneItem = Object.assign({}, item);
        cloneItem.defaultForm = true;
        cloneItem.Sub = reorder(item.Sub, source.index, destination.index);
        return cloneItem;
      }
      return item;
    });

    dispatch(setReorderedTree(newTree));
  };

  const handleOnTrashClick = (e) => {
    console.log('delete item');
  };

  const handleChangeTitle = (title) => {};

  return (
    <DnDProvider
      droppableClass="subMenuContainer"
      droppableStyle={{ height: isOpen ? `${menuList.length * 2.35}rem` : 0 }}
      list={listWithId}
      droppableId={parentID}
      onDragEnd={handleOnDragEnd}>
      {({ isDragging, dragHandleProps, item }) => {
        return (
          <Styled.SubMenu isDragging={isDragging}>
            <div style={{ display: 'flex' }}>
              {item.IconName && SidebarIcons[item.IconName]({ size: 20 })}
              {item.IconURL && (
                <Styled.MenuItemImage
                  src={item.IconURL}
                  style={{ maxWidth: '1.3rem' }}
                  alt="sub-menu-icon"
                />
              )}
              <Styled.SubMenuTitleWrapper>
                <InlineEdit
                  text={decodeBase64(item.TypeName)}
                  onSetText={handleChangeTitle}
                />
              </Styled.SubMenuTitleWrapper>
            </div>
            <Styled.ActionsWrapper>
              <Styled.TrashIconWrapper onClick={handleOnTrashClick}>
                <TrashIcon />
              </Styled.TrashIconWrapper>
              <Styled.DragIconWrapper {...dragHandleProps}>
                <DragIcon />
              </Styled.DragIconWrapper>
            </Styled.ActionsWrapper>
          </Styled.SubMenu>
        );
      }}
    </DnDProvider>
  );
};

export default EditableSubBranch;