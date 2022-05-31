/**
 * Renders menu item that may or may not have sub-menus(branches).
 */
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import DragIcon from 'components/Icons/DragIcon/Drag';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import { C_DISTANT } from 'constant/Colors';
import { MANAGE_CONTENT } from 'constant/constants';
import { mutateTree } from '@atlaskit/tree';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import getIcon from 'utils/treeUtils/getItemIcon';
import useWindow from 'hooks/useWindowContext';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import { selectTheme } from 'store/slice/theme/selectors';

const INDENT_PER_LEVEL = 27;

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
  const { GlobalUtilities } = useWindow();

  const {
    item,
    onExpand,
    onCollapse,
    provided,
    depth,
    // snapshot
  } = itemProps;

  const { dndTree: tree } = useSelector(selectSidebar);
  const { sidebarContent } = useSelector(selectTheme);
  const dispatch = useDispatch();
  const { actions: sidebarActions } = useSidebarSlice();

  const isManageContent = sidebarContent.current === MANAGE_CONTENT;

  //! Undo node deletion.
  const undoDelete = (node) => {
    dispatch(
      sidebarActions.recoverSidebarNodeType({
        NodeTypeID: node.id,
        ChildrenIDs: node.children || [],
      })
    );
  };

  //! Undo node edition.
  const undoEdit = () => {
    dispatch(
      sidebarActions.renameSidebarNodeType({
        NodeTypeID: item?.id,
        Name: item?.data?.title,
      })
    );
  };

  //! Fires when the node is removed.
  const onDeleteDone = (node) => {
    const deleteMSG = `دسته "${node?.data?.title}" حذف خواهد شد`;
    UndoToast({
      type: 'error',
      autoClose: 10000,
      message: deleteMSG,
      onUndo: () => undoDelete(node),
      toastId: `delete-${node?.id}`,
    });
  };

  //! Fires delete item click.
  const onItemDelete = (e) => {
    e.stopPropagation();
    const itemParent = Object.values(tree?.items).find(
      (x) => x.id === item?.parent
    );

    const deleteOnItem = mutateTree(tree, item?.id, { isDeleted: true });
    const removeOnParent = mutateTree(deleteOnItem, item?.parent, {
      children: itemParent.children.filter((child) => child !== item?.id),
    });
    dispatch(sidebarActions.setSidebarDnDTree(removeOnParent));
    dispatch(
      sidebarActions.removeSidebarNodeType({
        NodeType: item,
        RemoveHierarchy: false,
        done: onDeleteDone,
      })
    );
  };

  //! Fires on rename item.
  const onEditTitle = (title) => {
    const trimmedTitle = title.trim();
    if (trimmedTitle === item?.data?.title) return;

    const editMSG = `نام "${item?.data?.title}" به "${trimmedTitle}" تغییر خواهد کرد`;

    UndoToast({
      type: 'info',
      autoClose: 5000,
      message: editMSG,
      onUndo: undoEdit,
      toastId: `edit-${item?.id}`,
    });
    dispatch(
      sidebarActions.renameSidebarNodeType({
        NodeTypeID: item?.id,
        Name: trimmedTitle,
      })
    );
  };

  return (
    <>
      <Styled.MenuContainer
        indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
        isExpanded={item?.isExpanded}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <Styled.MenuTitleWrapper isManageContent={isManageContent}>
          {item?.isCategory ? (
            <Styled.CaretIconWrapper>
              {getIcon(item, onExpand, onCollapse)}
            </Styled.CaretIconWrapper>
          ) : (
            <Styled.MenuItemImage
              src={GlobalUtilities.add_timestamp(item?.data?.iconURL)}
              alt="menu-icon"
            />
          )}
          <Styled.MenuTitle>
            <InlineEdit
              text={item?.data ? item?.data?.title : ''}
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
          {item?.isCategory && (
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

export default EditableBranch;
