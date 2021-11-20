/**
 * Renders all menu items at once.
 */
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import EditableItem from './EditableItem';
import useWindow from 'hooks/useWindowContext';
import {
  moveSidebarNode,
  reorderSidebarNode,
} from 'store/actions/sidebar/sidebarMenuAction';

const selectSidebarDnDTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

/**
 * Renders nodes tree in editable format.
 * @returns {React.Component}
 */
const EditableTree = () => {
  const dispatch = useDispatch();
  const dndTree = useSelector(selectSidebarDnDTree);

  const { setSidebarDnDTree } = sidebarMenuSlice.actions;
  const { RVGlobal } = useWindow();

  const isSaaS = RVGlobal.SAASBasedMultiTenancy;

  //! Mutate tree.
  const handleOnMutateTree = (newTree) => {
    dispatch(setSidebarDnDTree(newTree));
  };

  //! Fires when user drags and drops a node.
  const handleOnMoveItem = (newTree, source, destination) => {
    if (source?.parentId === destination?.parentId) {
      dispatch(reorderSidebarNode(newTree, source, destination));
    } else {
      dispatch(moveSidebarNode(newTree, source, destination));
    }
    dispatch(setSidebarDnDTree(newTree));
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
