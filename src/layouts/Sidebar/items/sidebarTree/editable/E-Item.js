/**
 * Renders menu item that may or may not have sub-menus(branches).
 */
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from '../../../Sidebar.styles';
import { createSelector } from 'reselect';
import DragIcon from 'components/Icons/DragIcon/Drag';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import { C_DISTANT } from 'constant/Colors';
import { MANAGE_CONTENT } from 'constant/constants';
import { mutateTree } from '@atlaskit/tree';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import {
  renameSidebarNode,
  deleteSidebarNode,
  recoverSidebarNode,
} from 'store/actions/sidebar/sidebarMenuAction';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import getIcon from '../getItemIcon';

const INDENT_PER_LEVEL = 27;

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

  const isManageContent = sidebarContent.current === MANAGE_CONTENT;

  const undoDelete = (nodeId) => {
    console.log('undo delete');
    dispatch(recoverSidebarNode(nodeId));
  };

  const undoEdit = () => {
    console.log('undo edit');
    dispatch(renameSidebarNode(item.id, item.data.title));
  };

  const onItemDelete = (e) => {
    e.stopPropagation();

    const deleteMSG = `دسته "${item.data.title}" حذف خواهد شد`;
    const deleteToast = UndoToast({
      type: 'error',
      autoClose: 5000,
      message: deleteMSG,
      onUndo: () => undoDelete(item.id),
      toastId: `delete-${item.id}`,
    });

    const itemParent = Object.values(tree.items).find(
      (x) => x.id === item.parent
    );

    const deleteOnItem = mutateTree(tree, item.id, { isDeleted: true });
    const removeOnParent = mutateTree(deleteOnItem, item.parent, {
      children: itemParent.children.filter((child) => child !== item.id),
    });
    dispatch(setSidebarDnDTree(removeOnParent));
    dispatch(deleteSidebarNode(item.id));
  };

  const onEditTitle = (title) => {
    const trimedTitle = title.trim();
    if (trimedTitle === item.data.title) return;

    const editMSG = `نام "${item.data.title}" به "${trimedTitle}" تغییر خواهد کرد`;

    const editToast = UndoToast({
      type: 'info',
      autoClose: 5000,
      message: editMSG,
      onUndo: undoEdit,
      toastId: `edit-${item.id}`,
    });
    dispatch(renameSidebarNode(item.id, trimedTitle));
  };

  return (
    <>
      <Styled.MenuContainer
        indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
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
              onSetText={onEditTitle}
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
            <Styled.TrashIconWrapper onClick={onItemDelete}>
              <TrashIcon />
            </Styled.TrashIconWrapper>
          )}
          <Styled.DragIconWrapper {...provided.dragHandleProps}>
            <DragIcon className={C_DISTANT} />
          </Styled.DragIconWrapper>
        </Styled.ActionsWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default memo(EditableBranch);
