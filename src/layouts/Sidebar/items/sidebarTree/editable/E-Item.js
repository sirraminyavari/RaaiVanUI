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
  deleteSidebarNode,
} from 'store/actions/sidebar/sidebarMenuAction';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const INDENT_PER_LEVEL = 27;
const { RV_RevFloat } = window;

const getIcon = (item, onExpand, onCollapse) => {
  if ((item.children && item.children.length > 0) || item.isCategory) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={() => onCollapse(item.id)} dir="down" />
    ) : (
      <CaretIcon
        size={20}
        onClick={() => onExpand(item.id)}
        dir={RV_RevFloat}
      />
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

  const isManageContent = sidebarContent.current === 'manage';

  const handleOnClose = (type, title = '') => {
    if (type === 'delete') {
      console.log('have no time, just delete it!');
      dispatch(deleteSidebarNode(item.id));
    }

    if (type === 'edit' && title) {
      console.log('have no time, just edit it!');
      dispatch(renameSidebarNode(item.id, title));
    }
  };

  const CloseButton = ({ closeToast, onClose }) => {
    const OnCloseClick = () => {
      onClose();
      closeToast();
    };
    return <CloseIcon size={18} color="#000" onClick={OnCloseClick} />;
  };

  const deleteTimeUpdate = (t) => {
    if (t !== 0) return;
    console.log('time is over and delete');
    dispatch(deleteSidebarNode(item.id));
  };

  const editTimerUpdate = (t, title) => {
    if (t !== 0) return;
    console.log('time is over and apply edit');
    dispatch(renameSidebarNode(item.id, title));
  };

  const undoDelete = () => {
    console.log('undo delete');
    const undoDeleteOnItem = mutateTree(tree, item.id, { isDeleted: false });
    dispatch(setSidebarDnDTree(undoDeleteOnItem));
  };

  const undoEdit = () => {
    console.log('undo edit');
    const undoEditOnItem = mutateTree(tree, item.id, {
      isEditing: false,
    });
    dispatch(setSidebarDnDTree(undoEditOnItem));
  };

  const onItemDelete = (e) => {
    e.stopPropagation();

    const deleteMSG = `دسته "${item.data.title}" حذف خواهد شد`;
    const deleteToast = UndoToast({
      type: 'error',
      autoClose: 5000,
      message: deleteMSG,
      onUndo: undoDelete,
      onTimeUpdate: deleteTimeUpdate,
      closeButton: ({ closeToast }) => (
        <CloseButton
          closeToast={closeToast}
          onClose={() => handleOnClose('delete')}
        />
      ),
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
      onTimeUpdate: (time) => editTimerUpdate(time, trimedTitle),
      closeButton: ({ closeToast }) => (
        <CloseButton
          closeToast={closeToast}
          onClose={() => handleOnClose('edit', trimedTitle)}
        />
      ),
      toastId: `edit-${item.id}`,
    });

    //TODO: shallow and deep state change.
    const treeEditedOnItem = mutateTree(tree, item.id, {
      isEditing: true,
    });
    dispatch(setSidebarDnDTree(treeEditedOnItem));
  };

  return (
    <>
      <Styled.MenuContainer
        margin={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
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
            <DragIcon className={TC_DISTANT} />
          </Styled.DragIconWrapper>
        </Styled.ActionsWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default memo(EditableBranch);
