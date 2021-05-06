/**
 * Renders sub-menus(branches) for each main(root) menu item.
 */
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../../../Sidebar.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { reorder } from 'helpers/helpers';
import DragIcon from 'components/Icons/DragIcon/Drag';
import DnDProvider from 'components/DnDProvider/DnDProvider';
import InlineEdit from 'components/InlineEdit/InlineEdit';

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.tree
);

const EditableSubBranch = ({ isOpen, menuList, parentID }) => {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const { setSidebarTree } = sidebarMenuSlice.actions;

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

    dispatch(setSidebarTree(newTree));
  };

  const handleChangeTitle = (title, item) => {
    const isParent = (node) => node.NodeTypeID === item.ParentID;
    let parentNode = tree.find(isParent);

    let editedTree = tree.map((node) => {
      if (isParent(node)) {
        let cloneItem = Object.assign({}, parentNode);
        cloneItem.defaultForm = true;
        cloneItem.Sub = cloneItem.Sub.map((child) => {
          if (child.NodeTypeID === item.NodeTypeID) {
            let cloneChild = Object.assign({}, child);
            cloneChild.TypeName = encodeBase64(title);
            return cloneChild;
          }
          return child;
        });
        return cloneItem;
      }
      return node;
    });

    dispatch(setSidebarTree(editedTree));
  };

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
