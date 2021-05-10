/**
 * Renders menu item that may or may not have sub-menus(branches).
 */
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from '../../../Sidebar.styles';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { createSelector } from 'reselect';
import DragIcon from 'components/Icons/DragIcon/Drag';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import { TC_DISTANT } from 'constant/Colors';
import { mutateTree } from '@atlaskit/tree';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import {
  renameSidebarNode,
  removeSidebarNode,
} from 'store/actions/sidebar/sidebarMenuAction';

const PADDING_PER_LEVEL = 27;

const getIcon = (item, onExpand, onCollapse) => {
  if ((item.children && item.children.length > 0) || item.isCategory) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={() => onCollapse(item.id)} dir="down" />
    ) : (
      <CaretIcon size={20} onClick={() => onExpand(item.id)} dir="left" />
    );
  }
  return null;
};

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

/**
 * @typedef ItemType
 * @property {Object} item -The item.
 * @property {function} onExpand -The callback function that calls on item expand.
 * @property {function} onCollapse -The callback function that calls on item collapse.
 * @property {*} provided -Provided by dnd.
 * @property {*} snapshot -Provided by dnd.
 * @property {number} depth -Depth of item on tree.
 */

/**
 * @typedef PropType
 * @property {ItemType} itemProps - The item props.
 */

/**
 *  @description Renders a menu item for sidebar.
 * @component
 * @param {PropType} props
 */
const EditableBranch = (props) => {
  const { itemProps } = props;

  const { item, onExpand, onCollapse, provided, depth, snapshot } = itemProps;

  const sidebarContent = useSelector(selectSidebarContent);
  const tree = useSelector(selectTree);
  const dispatch = useDispatch();
  const { setSidebarDnDTree } = sidebarMenuSlice.actions;

  const isManageContent = sidebarContent === 'manage';

  const handleOnTrashClick = (e) => {
    e.stopPropagation();
    const itemParent = Object.values(tree.items).find(
      (x) => x.id === item.parent
    );
    const treeDeletedOnItem = mutateTree(tree, item.id, { isDeleted: true });
    const treeRemovedOnParent = mutateTree(treeDeletedOnItem, item.parent, {
      children: itemParent.children.filter((child) => child !== item.id),
    });
    dispatch(setSidebarDnDTree(treeRemovedOnParent));
    dispatch(removeSidebarNode(item.id));
  };

  const handleChangeTitle = (title) => {
    const treeEditedOnItem = mutateTree(tree, item.id, {
      data: { ...item.data, title },
    });
    dispatch(setSidebarDnDTree(treeEditedOnItem));
    dispatch(renameSidebarNode(item.id, title));
  };

  return (
    <>
      <Styled.MenuContainer
        margin={depth === 0 ? 0 : `${PADDING_PER_LEVEL * depth}`}
        isExpanded={item.isExpanded}
        ref={provided.innerRef}
        {...provided.draggableProps}>
        <Styled.MenuTitleWrapper isManageContent={isManageContent}>
          {item.isCategory || item.hasChildren ? (
            <Styled.CaretIconWrapper>
              {getIcon(item, onExpand, onCollapse)}
            </Styled.CaretIconWrapper>
          ) : (
            <Styled.MenuItemImage src={item.data.iconURL} alt="menu-icon" />
          )}
          <Styled.MenuTitle>
            <InlineEdit
              text={item.data ? item.data.title : ''}
              onSetText={handleChangeTitle}
              styles={{
                textStyle: {
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '0.5rem',
                },
              }}
            />
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
        <Styled.ActionsWrapper>
          {item.isCategory && (
            <Styled.TrashIconWrapper onClick={handleOnTrashClick}>
              <TrashIcon />
            </Styled.TrashIconWrapper>
          )}
          <Styled.DragIconWrapper {...provided.dragHandleProps}>
            <DragIcon className={TC_DISTANT} />
          </Styled.DragIconWrapper>
        </Styled.ActionsWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default memo(EditableBranch);
