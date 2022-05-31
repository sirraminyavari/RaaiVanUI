/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import EditableItem from './EditableItem';
import useWindow from 'hooks/useWindowContext';
import { useSidebarSlice } from 'store/slice/sidebar';
import { selectSidebar } from 'store/slice/sidebar/selectors';

/**
 * Renders nodes tree in editable format.
 * @returns {React.Component}
 */
const EditableTree = () => {
  const dispatch = useDispatch();
  const { dndTree } = useSelector(selectSidebar);

  const { actions: sidebarActions } = useSidebarSlice();

  const { RVGlobal } = useWindow();

  const isSaaS = RVGlobal.SAASBasedMultiTenancy;

  //! Mutate tree.
  const handleOnMutateTree = (newTree) => {
    dispatch(sidebarActions.setSidebarDnDTree(newTree));
  };

  //! Fires when user drags and drops a node.
  const handleOnMoveItem = (newTree, source, destination) => {
    if (source?.parentId === destination?.parentId) {
      dispatch(
        sidebarActions.reorderSidebarNodeTypes({
          NodeTypeIDs: newTree.items[source.parentId].children || [],
        })
      );
    } else {
      dispatch(
        sidebarActions.moveSidebarNodeType({
          NodeTypeID: source.id,
          ParentID: destination.parentId,
        })
      );
    }
    dispatch(sidebarActions.setSidebarDnDTree(newTree));
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <EditableItem itemProps={itemProps} />;
  };

  //! Exclude ids that are not droppable.
  const excludeDroppableIds =
    Object.values(dndTree?.items || {})
      .filter((item) => !item?.isCategory)
      .map((item) => item?.id) || [];

  //! get items that are category.
  const categories =
    Object.values(dndTree?.items || {})
      .filter((item) => item?.isCategory && item?.parent !== 'root')
      .map((item) => item?.id) || [];

  return (
    <DragAndDropTree
      indentPerLevel={0}
      tree={dndTree}
      onMutateTree={handleOnMutateTree}
      onMoveItem={handleOnMoveItem}
      renderItem={handleRenderItem}
      excludeDrop={isSaaS ? excludeDroppableIds : []}
      excludeDragDrop={isSaaS && { from: categories, to: categories }}
      draggable
      nestable
    />
  );
};

export default memo(EditableTree);
